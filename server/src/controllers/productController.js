const { Product, Category } = require("../models");
const { Op } = require("sequelize");

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort, minPrice, maxPrice, filter } = req.query;
    const offset = (page - 1) * limit;
    const where = { isActive: true };
    if (filter === "sale") where.comparePrice = { [Op.ne]: null };
    if (category) {
      const cat = await Category.findOne({ where: { [Op.or]: [{ id: category }, { slug: category }] }, attributes: ["id"] });
      if (!cat) return res.json({ products: [], pagination: { total: 0, page: parseInt(page), pages: 0 } });
      where.categoryId = cat.id;
    }
    if (search) where[Op.or] = [{ name: { [Op.iLike]: "%" + search + "%" } }, { nameAr: { [Op.iLike]: "%" + search + "%" } }];
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    let order = [["createdAt", "DESC"]];
    if (sort === "price_asc") order = [["price", "ASC"]];
    if (sort === "price_desc") order = [["price", "DESC"]];
    if (sort === "name") order = [["name", "ASC"]];
    if (filter === "best" && !sort) order = [["rating", "DESC"], ["reviewCount", "DESC"]];
    const { count, rows } = await Product.findAndCountAll({
      where, include: [{ model: Category, as: "category", attributes: ["id", "name", "nameAr", "slug"] }],
      order, limit: parseInt(limit), offset: parseInt(offset),
    });
    res.json({ products: rows, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) } });
  } catch (error) {
    res.status(500).json({ message: "Failed to get products", error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { slug: req.params.slug, isActive: true }, include: [{ model: Category, as: "category" }] });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to get product", error: error.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true, isFeatured: true },
      include: [{ model: Category, as: "category", attributes: ["id", "name", "nameAr", "slug"] }],
      order: [["createdAt", "DESC"]], limit: 8,
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to get featured products", error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true, parentId: null },
      include: [{ model: Category, as: "subcategories", where: { isActive: true }, required: false }],
      order: [["sortOrder", "ASC"]],
    });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to get categories", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.update(req.body);
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.update({ isActive: false });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    await category.update(req.body);
    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    await category.update({ isActive: false });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};
