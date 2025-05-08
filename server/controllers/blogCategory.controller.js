const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
	if (!req.body) throw new Error("Please fill all the fields");
	const newBlogCategory = await BlogCategory.create(req.body);
	return res.status(201).json({
		success: newBlogCategory ? true : false,
		message: newBlogCategory
			? "Blog category created successfully"
			: "Can't create blog category",
		createdCategory: newBlogCategory ? newBlogCategory : null,
	});
});

const getAllCategories = asyncHandler(async (req, res) => {
	const categories = await BlogCategory.find().select("_id title");
	if (!categories) throw new Error("No categories found");
	return res.status(200).json({
		success: true,
		message: "Blog categories fetched successfully",
		categories: categories,
	});
});

const getCategoryById = asyncHandler(async (req, res) => {
	const category = await BlogCategory.findById(req.params.id);
	if (!category) throw new Error("No category found");
	return res.status(200).json({
		success: true,
		message: "Blog category fetched successfully",
		category: category,
	});
});

const updateCategory = asyncHandler(async (req, res) => {
	const updatedCategory = await BlogCategory.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	if (!updatedCategory) throw new Error("No category found");
	return res.status(200).json({
		success: true,
		message: "Blog category updated successfully",
		updatedCategory,
	});
});

const deleteCategory = asyncHandler(async (req, res) => {
	const deletedCategory = await BlogCategory.findByIdAndDelete(req.params.id);
	if (!deletedCategory) throw new Error("No category found");
	return res.status(200).json({
		success: true,
		message: "Blog category deleted successfully",
		deletedCategory,
	});
});

module.exports = {
	createCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
};
