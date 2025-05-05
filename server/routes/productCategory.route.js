const router = require("express").Router();
const { productCategory } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.get("/", productCategory.getAllCategories);
router.get("/:id", productCategory.getCategoryById);

// Admin routes
router.post("/", [verifyAccessToken, isAdmin], productCategory.createCategory);
router.put("/:id", [verifyAccessToken, isAdmin], productCategory.updateCategory);
router.delete("/:id", [verifyAccessToken, isAdmin], productCategory.deleteCategory);
module.exports = router;
