const router = require("express").Router();
const { product } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.get("/", product.getAllProducts);
router.get("/:pid", product.getProductById);

// Admin routes
router.post("/", [verifyAccessToken, isAdmin], product.createProduct);
router.put("/:pid", [verifyAccessToken, isAdmin], product.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], product.deleteProduct);

module.exports = router;

