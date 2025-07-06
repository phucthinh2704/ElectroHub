const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

// [POST] /blog
const createNewBlog = asyncHandler(async (req, res) => {
	if (!req.body) throw new Error("Missing request body");

	const { title, description, category } = req.body;
	if (!title || !description || !category)
		throw new Error("Please fill all the fields");
	const newBlog = await Blog.create(req.body);

	return res.status(201).json({
		success: newBlog ? true : false,
		message: newBlog ? "Blog created successfully" : "Can't create blog",
		createdBlog: newBlog ? newBlog : null,
	});
});

// [GET] /blog
const getAllBlogs = asyncHandler(async (req, res) => {
	const queryCommand = Blog.find().populate("author", "name avatar email");

	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 999999;
	const skip = (page - 1) * limit; // tương tự như offset trong SQL
	const blogs = await queryCommand.skip(skip).limit(limit);

	return res.status(200).json({
		success: true,
		message: "Blogs fetched successfully",
		blogs,
	});
});

// [GET] /blog/:blogId
const getBlogById = asyncHandler(async (req, res) => {
	const fields = "name email avatar";
	const blog = await Blog.findById(req.params.blogId)
		.populate("likes", fields)
		.populate("dislikes", fields)
		.populate("author", fields)
		.populate({
			path: "comments",
			populate: {
				path: "postedBy",
				select: "name avatar",
			},
		});
	if (!blog) throw new Error("No blog found");

	blog.numberViews += 1;
	await blog.save();

	return res.status(200).json({
		success: true,
		message: "Blog fetched successfully",
		blog,
	});
});

// [PUT] /blog/:blogId
const updateBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.params;

	const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, {
		new: true,
	});
	if (!updatedBlog) throw new Error("No blog found");

	return res.status(200).json({
		success: true,
		message: "Blog updated successfully",
		updatedBlog,
	});
});

// [DELETE] /blog/:blogId
const deleteBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.params;

	const deletedBlog = await Blog.findByIdAndDelete(blogId);
	if (!deletedBlog) throw new Error("No blog found");

	return res.status(200).json({
		success: true,
		message: "Blog deleted successfully",
		deletedBlog,
	});
});

// [PUT] /blog/like/:blogId
const likeBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.params;
	const { _id } = req.user;
	if (!blogId) throw new Error("Blog ID is required");

	const blog = await Blog.findById(blogId);
	if (!blog) throw new Error("No blog found");

	const isLiked = blog.likes.includes(_id);
	if (isLiked) {
		blog.likes = blog.likes.filter((id) => id.toString() !== _id);
	} else {
		blog.likes.push(_id);
	}

	const isDisliked = blog.dislikes.includes(_id);
	if (isDisliked) {
		blog.dislikes = blog.dislikes.filter((id) => id.toString() !== _id);
	}

	await blog.save();

	return res.status(200).json({
		success: true,
		message: "Blog liked successfully",
		blog,
	});
});

// [PUT] /blog/dislike/:blogId
const dislikeBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.params;
	const { _id } = req.user;
	if (!blogId) throw new Error("Blog ID is required");

	const blog = await Blog.findById(blogId);
	if (!blog) throw new Error("No blog found");

	const isDisliked = blog.dislikes.includes(_id);
	if (isDisliked) {
		blog.dislikes = blog.dislikes.filter((id) => id.toString() !== _id);
	} else {
		blog.dislikes.push(_id);
	}

	const isLiked = blog.likes.includes(_id);
	if (isLiked) {
		blog.likes = blog.likes.filter((id) => id.toString() !== _id);
	}

	await blog.save();

	return res.status(200).json({
		success: true,
		message: "Blog disliked successfully",
		blog,
	});
});

// [POST] /blog/comment/:blogId
const commentBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.params;
	const { _id } = req.user;

	const blog = await Blog.findById(blogId);
	if (!blog) throw new Error("No blog found");

	if (!req.body.comment) throw new Error("Comment is required");
	blog.comments.push({
		postedBy: _id,
		comment: req.body.comment,
	});

	await blog.save();

	return res.status(200).json({
		success: true,
		message: "Comment added successfully",
	});
});

// [POST] /blog/comment/:blogId
const deleteCommentBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.params;
	const { commentId } = req.params;

	const blog = await Blog.findById(blogId);
	if (!blog) throw new Error("No blog found");

	if (!commentId) throw new Error("Comment ID is required");

	const comment = blog.comments.id(commentId);
	if (!comment) throw new Error("No comment found");
	
	blog.comments = blog.comments.filter((c) => c._id.toString() !== commentId);

	await blog.save();

	return res.status(200).json({
		success: true,
		message: "Comment deleted successfully",
	});
});

// [PUT] /blog/like-comment/:blogId/:commentId
const likeCommentBlog = asyncHandler(async (req, res) => {
	const { blogId } = req.params;
	const { commentId } = req.params;
	const { _id } = req.user;

	const blog = await Blog.findById(blogId);
	if (!blog) throw new Error("No blog found");

	const comment = blog.comments.id(commentId);
	if (!comment) throw new Error("No comment found");

	const isLiked = comment.likes.includes(_id);
	if (isLiked) {
		comment.likes = comment.likes.filter((id) => id.toString() !== _id);
	} else {
		comment.likes.push(_id);
	}
	blog.comments = blog.comments.map((c) =>
		c._id.toString() === commentId ? comment : c
	);

	await blog.save();

	return res.status(200).json({
		success: true,
		message: "Comment liked successfully",
	});
});

// [PUT] /blog/upload-image/:blogId
const uploadImageBlog = asyncHandler(async (req, res) => {
	if (!req.file) throw new Error("Please upload image");
	const blog = await Blog.findByIdAndUpdate(
		req.params.blogId,
		{ image: req.file.path },
		{ new: true }
	);
	if (!blog) throw new Error("Blog not found");
	res.status(200).json({
		success: true,
		message: "Image uploaded successfully",
		blog,
	});
});

module.exports = {
	createNewBlog,
	updateBlog,
	deleteBlog,
	getAllBlogs,
	getBlogById,
	likeBlog,
	dislikeBlog,
	uploadImageBlog,
	commentBlog,
	likeCommentBlog,
	deleteCommentBlog
};
