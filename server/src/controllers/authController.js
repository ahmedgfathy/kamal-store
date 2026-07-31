const { User, Address } = require("../models");
const { generateToken } = require("../middleware/auth");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ firstName, lastName, email, password, phone });
    const token = generateToken(user.id);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
    const token = generateToken(user.id);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { include: [{ model: Address, as: "addresses" }] });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    await req.user.update({ firstName, lastName, phone });
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const address = await Address.create({ userId: req.user.id, ...req.body });
    res.status(201).json({ address });
  } catch (error) {
    res.status(500).json({ message: "Failed to add address", error: error.message });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id }, order: [["is_default", "DESC"]] });
    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Failed to get addresses", error: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!address) return res.status(404).json({ message: "Address not found" });
    await address.update(req.body);
    res.json({ address });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!address) return res.status(404).json({ message: "Address not found" });
    await address.destroy();
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
