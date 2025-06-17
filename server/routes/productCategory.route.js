const router = require("express").Router();
const { productCategory } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");
const uploader = require("../config/cloudinary.config");

router.get("/", productCategory.getAllCategories);
router.get("/:id", productCategory.getCategoryById);

// Admin routes
router.post(
	"/",
	[verifyAccessToken, isAdmin],
	uploader.fields([{ name: "image", maxCount: 1 }]),
	productCategory.createCategory
);
router.put(
	"/:id",
	uploader.fields([{ name: "image", maxCount: 1 }]),
	[verifyAccessToken, isAdmin],
	productCategory.updateCategory
);
router.delete(
	"/:id",
	[verifyAccessToken, isAdmin],
	productCategory.deleteCategory
);
module.exports = router;
