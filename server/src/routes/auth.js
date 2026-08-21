const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const { User } = require("../models");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/setup-admin", async (req, res) => {
  try {
    const adminExists = await User.findOne({ where: { role: "admin" } });
    if (adminExists) return res.status(400).json({ message: "Admin already exists. Use login instead." });
    const { firstName, lastName, email, password, phone } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const user = await User.create({ firstName: firstName || "Admin", lastName: lastName || "Admin", email, password, phone, role: "admin" });
    res.status(201).json({ message: "Admin created successfully", user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Setup failed", error: error.message });
  }
});
router.get("/me", auth, authController.getMe);
router.put("/profile", auth, authController.updateProfile);
router.get("/addresses", auth, authController.getAddresses);
router.post("/addresses", auth, authController.addAddress);
router.put("/addresses/:id", auth, authController.updateAddress);
router.delete("/addresses/:id", auth, authController.deleteAddress);

module.exports = router;
