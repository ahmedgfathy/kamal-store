const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Address = sequelize.define("Address", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
  label: { type: DataTypes.STRING(50), defaultValue: "Home" },
  fullName: { type: DataTypes.STRING(200), allowNull: false, field: "full_name" },
  phone: { type: DataTypes.STRING(20), allowNull: false },
  street: { type: DataTypes.STRING(500), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100), allowNull: true },
  zipCode: { type: DataTypes.STRING(20), field: "zip_code", allowNull: true },
  country: { type: DataTypes.STRING(100), defaultValue: "Egypt" },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false, field: "is_default" },
}, { tableName: "addresses", underscored: true });

module.exports = Address;
