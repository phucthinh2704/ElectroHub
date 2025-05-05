const Blog = require("../model/blog");
const asyncHandler = require("express-async-handler");

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

const getAllBlogs = asyncHandler(async (req, res) => {
	const blogs = await Blog.find();
	if (!blogs) throw new Error("No blogs found");

	return res.status(200).json({
		success: true,
		message: "Blogs fetched successfully",
		blogs,
	});
});

const getBlogById = asyncHandler(async (req, res) => {
	const fields = "firstName lastName email";
	const blog = await Blog.findById(req.params.blogId)
		.populate("likes", fields)
		.populate("dislikes", fields);
	if (!blog) throw new Error("No blog found");

   blog.numberViews += 1;
   await blog.save();

	return res.status(200).json({
		success: true,
		message: "Blog fetched successfully",
		blog,
	});
});

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

module.exports = {
	createNewBlog,
	updateBlog,
   deleteBlog,
	getAllBlogs,
	getBlogById,
	likeBlog,
	dislikeBlog,
};
