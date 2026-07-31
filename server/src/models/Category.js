const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  nameAr: { type: DataTypes.STRING(100), allowNull: true, field: "name_ar" },
  slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  image: { type: DataTypes.STRING(500), allowNull: true },
  parentId: { type: DataTypes.UUID, allowNull: true, field: "parent_id" },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: "is_active" },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: "sort_order" },
}, { tableName: "categories", underscored: true });

module.exports = Category;
