const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { auth, adminAuth } = require("../middleware/auth");

router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/categories", productController.getCategories);
router.get("/:slug", productController.getProduct);

router.post("/", adminAuth, productController.createProduct);
router.put("/:id", adminAuth, productController.updateProduct);
router.delete("/:id", adminAuth, productController.deleteProduct);
router.post("/categories", adminAuth, productController.createCategory);
router.put("/categories/:id", adminAuth, productController.updateCategory);
router.delete("/categories/:id", adminAuth, productController.deleteCategory);

module.exports = router;
