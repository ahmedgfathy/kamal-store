const User = require("./User");
const Address = require("./Address");
const Category = require("./Category");
const Product = require("./Product");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

User.hasMany(Address, { foreignKey: "user_id", as: "addresses" });
Address.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasMany(CartItem, { foreignKey: "user_id", as: "cartItems" });
CartItem.belongsTo(User, { foreignKey: "user_id", as: "user" });

Product.hasMany(CartItem, { foreignKey: "product_id", as: "cartItems" });
CartItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

Category.hasMany(Category, { foreignKey: "parent_id", as: "subcategories" });
Category.belongsTo(Category, { foreignKey: "parent_id", as: "parent" });

User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

Address.hasMany(Order, { foreignKey: "address_id", as: "orders" });
Order.belongsTo(Address, { foreignKey: "address_id", as: "address" });

Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

Product.hasMany(OrderItem, { foreignKey: "product_id", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

module.exports = { User, Address, Category, Product, CartItem, Order, OrderItem };
