const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: "order_number" },
  userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
  addressId: { type: DataTypes.UUID, allowNull: true, field: "address_id" },
  status: { type: DataTypes.ENUM("pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"), defaultValue: "pending" },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  shippingCost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0, field: "shipping_cost" },
  tax: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentMethod: { type: DataTypes.ENUM("cod", "card", "wallet"), defaultValue: "cod", field: "payment_method" },
  paymentStatus: { type: DataTypes.ENUM("pending", "paid", "failed", "refunded"), defaultValue: "pending", field: "payment_status" },
  notes: { type: DataTypes.TEXT, allowNull: true },
  trackingNumber: { type: DataTypes.STRING(200), allowNull: true, field: "tracking_number" },
  shippedAt: { type: DataTypes.DATE, allowNull: true, field: "shipped_at" },
  deliveredAt: { type: DataTypes.DATE, allowNull: true, field: "delivered_at" },
}, { tableName: "orders", underscored: true });

module.exports = Order;
