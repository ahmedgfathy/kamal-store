const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  nameAr: { type: DataTypes.STRING(255), allowNull: true, field: "name_ar" },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  descriptionAr: { type: DataTypes.TEXT, allowNull: true, field: "description_ar" },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  comparePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: "compare_price" },
  sku: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  categoryId: { type: DataTypes.UUID, allowNull: true, field: "category_id" },
  images: { type: DataTypes.JSONB, defaultValue: [] },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: "is_active" },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false, field: "is_featured" },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0, field: "review_count" },
  weight: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
}, { tableName: "products", underscored: true });

module.exports = Product;
