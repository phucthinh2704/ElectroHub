const router = require("express").Router();
const { blogCategory } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.get("/", blogCategory.getAllCategories);
router.get("/:id", blogCategory.getCategoryById);

// Admin routes
router.post("/", [verifyAccessToken, isAdmin], blogCategory.createCategory);
router.put("/:id", [verifyAccessToken, isAdmin], blogCategory.updateCategory);
router.delete("/:id", [verifyAccessToken, isAdmin], blogCategory.deleteCategory);
module.exports = router;
