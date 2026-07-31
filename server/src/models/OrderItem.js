const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.UUID, allowNull: false, field: "order_id" },
  productId: { type: DataTypes.UUID, allowNull: false, field: "product_id" },
  productName: { type: DataTypes.STRING(255), allowNull: false, field: "product_name" },
  productImage: { type: DataTypes.STRING(500), allowNull: true, field: "product_image" },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { tableName: "order_items", underscored: true });

module.exports = OrderItem;
