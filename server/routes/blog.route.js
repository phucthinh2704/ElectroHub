const router = require("express").Router();
const { blog } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.get("/", blog.getAllBlogs);
router.get("/:blogId", blog.getBlogById);
router.put("/like/:blogId", verifyAccessToken, blog.likeBlog);
router.put("/dislike/:blogId", verifyAccessToken, blog.dislikeBlog);

// Admin routes
router.post("/", [verifyAccessToken, isAdmin], blog.createNewBlog);
router.put("/:blogId", [verifyAccessToken, isAdmin], blog.updateBlog);
router.delete("/:blogId", [verifyAccessToken, isAdmin], blog.deleteBlog);

module.exports = router;
