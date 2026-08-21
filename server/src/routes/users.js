const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { User } = require("../models");
const { requireRole } = require("../middleware/auth");

const ROLES = ["customer", "editor", "manager", "admin"];
const safeUser = (u) => JSON.parse(JSON.stringify(u));

router.use(requireRole("admin"));

router.get("/", async (req, res) => {
  try {
    const { role, search } = req.query;
    const where = {};
    if (role && ROLES.includes(role)) where.role = role;
    if (search) where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
    const users = await User.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json({ users: users.map(safeUser) });
  } catch (error) {
    res.status(500).json({ message: "Failed to get users", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;
    if (!firstName || !lastName || !email || !password || !role) return res.status(400).json({ message: "First name, last name, email, password and role are required" });
    if (!ROLES.includes(role)) return res.status(400).json({ message: "Invalid role" });
    if (String(password).length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const exists = await User.findOne({ where: { email: String(email).toLowerCase() } });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const user = await User.create({ firstName, lastName, email, password, phone: phone || null, role });
    res.status(201).json({ user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { firstName, lastName, email, password, role, phone, isActive } = req.body;
    if (role && !ROLES.includes(role)) return res.status(400).json({ message: "Invalid role" });
    const losingAdmin = user.role === "admin" && ((role && role !== "admin") || isActive === false);
    if ((losingAdmin || (user.role === "admin" && req.user.id === user.id)) && (losingAdmin || isActive === false)) {
      if (req.user.id === user.id) return res.status(400).json({ message: "You cannot demote or deactivate your own account" });
      const activeAdmins = await User.count({ where: { role: "admin", isActive: true } });
      if (activeAdmins <= 1) return res.status(400).json({ message: "Cannot remove the last active admin" });
    }
    const patch = {};
    if (firstName) patch.firstName = firstName;
    if (lastName) patch.lastName = lastName;
    if (email) patch.email = email;
    if (phone !== undefined) patch.phone = phone;
    if (role) patch.role = role;
    if (isActive !== undefined) patch.isActive = Boolean(isActive);
    if (password) {
      if (String(password).length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
      patch.password = password;
    }
    await user.update(patch);
    res.json({ user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.user.id === user.id) return res.status(400).json({ message: "You cannot delete your own account" });
    if (user.role === "admin") {
      const activeAdmins = await User.count({ where: { role: "admin", isActive: true } });
      if (activeAdmins <= 1) return res.status(400).json({ message: "Cannot remove the last active admin" });
    }
    await user.update({ isActive: false });
    res.json({ message: "User deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

module.exports = router;
