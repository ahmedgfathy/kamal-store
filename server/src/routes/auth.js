const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", auth, authController.getMe);
router.put("/profile", auth, authController.updateProfile);
router.get("/addresses", auth, authController.getAddresses);
router.post("/addresses", auth, authController.addAddress);
router.put("/addresses/:id", auth, authController.updateAddress);
router.delete("/addresses/:id", auth, authController.deleteAddress);

module.exports = router;
