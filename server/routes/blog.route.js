const router = require("express").Router();
const { blog } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");
const uploader = require("../config/cloudinary.config");

router.get("/", blog.getAllBlogs);
router.get("/:blogId", blog.getBlogById);
router.put("/like/:blogId", verifyAccessToken, blog.likeBlog);
router.put("/dislike/:blogId", verifyAccessToken, blog.dislikeBlog);
router.post("/comment/:blogId", verifyAccessToken, blog.commentBlog);
router.delete("/comment/:blogId/:commentId", verifyAccessToken, blog.deleteCommentBlog);
router.put("/like-comment/:blogId/:commentId", verifyAccessToken, blog.likeCommentBlog);

// Admin routes
router.post("/", [verifyAccessToken, isAdmin], blog.createNewBlog);
router.put("/:blogId", [verifyAccessToken, isAdmin], blog.updateBlog);
router.delete("/:blogId", [verifyAccessToken, isAdmin], blog.deleteBlog);
router.put("/upload-image/:blogId", [verifyAccessToken, isAdmin], uploader.single("image"), blog.uploadImageBlog);

module.exports = router;
