const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  firstName: { type: DataTypes.STRING(100), allowNull: false, field: "first_name" },
  lastName: { type: DataTypes.STRING(100), allowNull: false, field: "last_name" },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(255), allowNull: true },
  phone: { type: DataTypes.STRING(20), allowNull: true },
  avatar: { type: DataTypes.STRING(500), allowNull: true },
  provider: { type: DataTypes.ENUM("local", "google", "facebook"), defaultValue: "local" },
  providerId: { type: DataTypes.STRING(255), allowNull: true, field: "provider_id" },
  role: { type: DataTypes.ENUM("customer", "admin"), defaultValue: "customer" },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: "is_active" },
}, {
  tableName: "users",
  underscored: true,
  hooks: {
    beforeCreate: async (user) => { if (user.password) user.password = await bcrypt.hash(user.password, 12); },
    beforeUpdate: async (user) => { if (user.changed("password") && user.password) user.password = await bcrypt.hash(user.password, 12); },
  },
});

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
