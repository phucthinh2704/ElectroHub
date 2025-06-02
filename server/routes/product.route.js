const router = require("express").Router();
const { product } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");
const uploader = require("../config/cloudinary.config");

router.get("/", product.getAllProducts);
router.get("/:pid", product.getProductById);
router.put("/ratings", verifyAccessToken, product.ratingProduct);

// Admin routes
router.post(
	"/",
	[verifyAccessToken, isAdmin],
	uploader.fields([
		{ name: "images", maxCount: 10 },
		{ name: "thumb", maxCount: 1 },
	]),
	product.createProduct
);
router.put(
	"/upload-image/:id",
	[verifyAccessToken, isAdmin],
	uploader.array("images", 10),
	product.uploadImagesProduct
);
router.delete("/:id", [verifyAccessToken, isAdmin], product.deleteProduct);

module.exports = router;
