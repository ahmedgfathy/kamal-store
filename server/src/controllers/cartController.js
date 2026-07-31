const { CartItem, Product } = require("../models");

exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.findAll({ where: { userId: req.user.id }, include: [{ model: Product, as: "product", where: { isActive: true } }] });
    const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
    res.json({ items, total: parseFloat(total.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Insufficient stock" });
    const [item, created] = await CartItem.findOrCreate({ where: { userId: req.user.id, productId }, defaults: { quantity } });
    if (!created) { item.quantity += quantity; await item.save(); }
    const updatedItem = await CartItem.findByPk(item.id, { include: [{ model: Product, as: "product" }] });
    res.json({ item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id }, include: [{ model: Product, as: "product" }] });
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    if (item.product.stock < quantity) return res.status(400).json({ message: "Insufficient stock" });
    item.quantity = quantity;
    await item.save();
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart", error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    await item.destroy();
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from cart", error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await CartItem.destroy({ where: { userId: req.user.id } });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};
