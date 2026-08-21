const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { auth, requireRole } = require("../middleware/auth");

router.post("/", auth, orderController.createOrder);
router.get("/", auth, orderController.getOrders);
router.get("/stats", requireRole("admin", "manager"), orderController.getOrderStats);
router.get("/admin/all", requireRole("admin", "manager"), orderController.getAllOrders);
router.get("/admin/customers", requireRole("admin", "manager"), orderController.getAllCustomers);
router.get("/:id", auth, orderController.getOrder);
router.put("/:id/cancel", auth, orderController.cancelOrder);
router.put("/:id/status", requireRole("admin", "manager"), orderController.updateOrderStatus);

module.exports = router;
