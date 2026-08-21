const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { requireRole } = require("../middleware/auth");

router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/categories", productController.getCategories);
router.get("/:slug", productController.getProduct);

router.post("/", requireRole("admin", "editor"), productController.createProduct);
router.put("/:id", requireRole("admin", "editor"), productController.updateProduct);
router.delete("/:id", requireRole("admin", "editor"), productController.deleteProduct);
router.post("/categories", requireRole("admin", "editor"), productController.createCategory);
router.put("/categories/:id", requireRole("admin", "editor"), productController.updateCategory);
router.delete("/categories/:id", requireRole("admin", "editor"), productController.deleteCategory);

module.exports = router;
