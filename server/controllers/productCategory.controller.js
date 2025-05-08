const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
	if (!req.body) throw new Error("Please fill all the fields");
	const newProductCategory = await ProductCategory.create(req.body);
	return res.status(201).json({
		success: newProductCategory ? true : false,
		message: newProductCategory
			? "Product category created successfully"
			: "Can't create product category",
		createdCategory: newProductCategory ? newProductCategory : null,
	});
});

const getAllCategories = asyncHandler(async (req, res) => {
	const categories = await ProductCategory.find().select("_id title");
	if (!categories) throw new Error("No categories found");
	return res.status(200).json({
		success: true,
		message: "Product categories fetched successfully",
		categories: categories,
	});
});

const getCategoryById = asyncHandler(async (req, res) => {
	const category = await ProductCategory.findById(req.params.id);
	if (!category) throw new Error("No category found");
	return res.status(200).json({
		success: true,
		message: "Product category fetched successfully",
		category,
	});
});

const updateCategory = asyncHandler(async (req, res) => {
	const updatedCategory = await ProductCategory.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	if (!updatedCategory) throw new Error("No category found");
	return res.status(200).json({
		success: true,
		message: "Product category updated successfully",
		updatedCategory,
	});
});

const deleteCategory = asyncHandler(async (req, res) => {
	const deletedCategory = await ProductCategory.findByIdAndDelete(req.params.id);
	if (!deletedCategory) throw new Error("No category found");
	return res.status(200).json({
		success: true,
		message: "Product category deleted successfully",
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
