const { Order, OrderItem, CartItem, Product, User, Address } = require("../models");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { addressId, paymentMethod, notes } = req.body;
    const cartItems = await CartItem.findAll({ where: { userId: req.user.id }, include: [{ model: Product, as: "product" }] });
    if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });
    let subtotal = 0;
    const orderItems = cartItems.map((item) => {
      const itemTotal = parseFloat(item.product.price) * item.quantity;
      subtotal += itemTotal;
      return { productId: item.productId, productName: item.product.name, productImage: item.product.images?.[0] || null, quantity: item.quantity, price: item.product.price, total: parseFloat(itemTotal.toFixed(2)) };
    });
    const shippingCost = subtotal >= 500 ? 0 : 50;
    const tax = parseFloat((subtotal * 0.14).toFixed(2));
    const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));
    const orderNumber = "AUR-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4).toUpperCase();
    const order = await Order.create({ orderNumber, userId: req.user.id, addressId, subtotal: parseFloat(subtotal.toFixed(2)), shippingCost, tax, total, paymentMethod, notes }, { transaction: t });
    for (const item of orderItems) {
      await OrderItem.create({ orderId: order.id, ...item }, { transaction: t });
      const product = await Product.findByPk(item.productId);
      await product.update({ stock: product.stock - item.quantity }, { transaction: t });
    }
    await CartItem.destroy({ where: { userId: req.user.id }, transaction: t });
    await t.commit();
    const fullOrder = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: "items" }, { model: Address, as: "address" }] });
    res.status(201).json({ order: fullOrder });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    const { count, rows } = await Order.findAndCountAll({ where, include: [{ model: OrderItem, as: "items" }, { model: Address, as: "address" }], order: [["createdAt", "DESC"]], limit: parseInt(limit), offset: parseInt(offset) });
    res.json({ orders: rows, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) } });
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id }, include: [{ model: OrderItem, as: "items" }, { model: Address, as: "address" }] });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Failed to get order", error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id }, include: [{ model: OrderItem, as: "items" }] });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!["pending", "confirmed"].includes(order.status)) return res.status(400).json({ message: "Order cannot be cancelled" });
    const t = await sequelize.transaction();
    try {
      await order.update({ status: "cancelled" }, { transaction: t });
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId);
        if (product) await product.update({ stock: product.stock + item.quantity }, { transaction: t });
      }
      await t.commit();
      res.json({ order });
    } catch (error) { await t.rollback(); throw error; }
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (search) where[Op.or] = [{ orderNumber: { [Op.iLike]: "%" + search + "%" } }];
    const { count, rows } = await Order.findAndCountAll({
      where, include: [
        { model: OrderItem, as: "items" },
        { model: Address, as: "address" },
        { model: User, as: "user", attributes: ["id", "firstName", "lastName", "email", "phone"] },
      ], order: [["createdAt", "DESC"]], limit: parseInt(limit), offset: parseInt(offset),
    });
    res.json({ orders: rows, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) } });
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders", error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (status === "shipped") updateData.shippedAt = new Date();
    if (status === "delivered") updateData.deliveredAt = new Date();
    await order.update(updateData);
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: "pending" } });
    const deliveredOrders = await Order.count({ where: { status: "delivered" } });
    const cancelledOrders = await Order.count({ where: { status: "cancelled" } });
    const totalRevenue = await Order.sum("total", { where: { status: { [Op.notIn]: ["cancelled", "returned"] } } });
    const totalCustomers = await User.count({ where: { role: "customer" } });
    const recentOrders = await Order.findAll({ include: [{ model: User, as: "user", attributes: ["id", "firstName", "lastName", "email"] }, { model: OrderItem, as: "items" }], order: [["createdAt", "DESC"]], limit: 5 });
    const revenueByDay = await sequelize.query(
      `SELECT TO_CHAR(d.day, 'MM-DD') AS label, COALESCE(SUM(o.total), 0)::float AS value
       FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') AS d(day)
       LEFT JOIN orders o ON o.created_at::date = d.day::date AND o.status NOT IN ('cancelled','returned')
       GROUP BY d.day ORDER BY d.day`, { type: require("sequelize").QueryTypes.SELECT });
    const ordersByDay = await sequelize.query(
      `SELECT TO_CHAR(d.day, 'MM-DD') AS label, COUNT(o.id)::int AS value
       FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') AS d(day)
       LEFT JOIN orders o ON o.created_at::date = d.day::date
       GROUP BY d.day ORDER BY d.day`, { type: require("sequelize").QueryTypes.SELECT });
    const statusCounts = await sequelize.query(
      `SELECT status::text AS label, COUNT(*)::int AS value FROM orders GROUP BY status ORDER BY 2 DESC`,
      { type: require("sequelize").QueryTypes.SELECT });
    const topProducts = await sequelize.query(
      `SELECT oi.product_name AS name, SUM(oi.quantity)::int AS sold, SUM(oi.total)::float AS revenue
       FROM order_items oi GROUP BY oi.product_name ORDER BY sold DESC LIMIT 5`,
      { type: require("sequelize").QueryTypes.SELECT });
    const salesByCategory = await sequelize.query(
      `SELECT c.name_ar, c.name, COALESCE(SUM(oi.total),0)::float AS revenue
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id
       LEFT JOIN order_items oi ON oi.product_id = p.id
       GROUP BY c.id, c.name_ar, c.name ORDER BY revenue DESC`,
      { type: require("sequelize").QueryTypes.SELECT });
    res.json({ stats: { totalOrders, pendingOrders, deliveredOrders, cancelledOrders, totalRevenue: totalRevenue || 0, totalCustomers }, recentOrders, revenueByDay, ordersByDay, statusCounts, topProducts, salesByCategory });
  } catch (error) {
    res.status(500).json({ message: "Failed to get stats", error: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    const where = { role: "customer" };
    if (search) where[Op.or] = [{ firstName: { [Op.iLike]: "%" + search + "%" } }, { lastName: { [Op.iLike]: "%" + search + "%" } }, { email: { [Op.iLike]: "%" + search + "%" } }];
    const { count, rows } = await User.findAndCountAll({ where, attributes: { exclude: ["password"] }, include: [{ model: Order, as: "orders", attributes: ["id", "total", "status", "createdAt"] }], order: [["createdAt", "DESC"]], limit: parseInt(limit), offset: parseInt(offset) });
    res.json({ customers: rows, pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) } });
  } catch (error) {
    res.status(500).json({ message: "Failed to get customers", error: error.message });
  }
};
