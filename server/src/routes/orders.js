const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { auth, adminAuth } = require("../middleware/auth");

router.post("/", auth, orderController.createOrder);
router.get("/", auth, orderController.getOrders);
router.get("/stats", adminAuth, orderController.getOrderStats);
router.get("/admin/all", adminAuth, orderController.getAllOrders);
router.get("/admin/customers", adminAuth, orderController.getAllCustomers);
router.get("/:id", auth, orderController.getOrder);
router.put("/:id/cancel", auth, orderController.cancelOrder);
router.put("/:id/status", adminAuth, orderController.updateOrderStatus);

module.exports = router;
