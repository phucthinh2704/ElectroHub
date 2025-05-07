const router = require("express").Router();
const { product } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");
const uploader = require("../config/cloudinary.config");

router.get("/", product.getAllProducts);
router.get("/:pid", product.getProductById);
router.put("/ratings", verifyAccessToken, product.ratingProduct);

// Admin routes
router.post("/", [verifyAccessToken, isAdmin], product.createProduct);
router.put("/:pid", [verifyAccessToken, isAdmin], product.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], product.deleteProduct);
router.put(
	"/upload-image/:id",
	[verifyAccessToken, isAdmin],
	uploader.array("images", 10),
	product.uploadImagesProduct
);

module.exports = router;
