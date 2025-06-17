const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

// [POST] /api/product-category/
const createCategory = asyncHandler(async (req, res) => {
	if (!req.body) throw new Error("Please fill all the fields");

	const files = req.files;
	if (!files || !files.image) {
		throw new Error("Please upload an image for the category");
	}

	const category = await ProductCategory.findOne({
		title: req.body.title,
	}).collation({ locale: "en", strength: 2 }); // so sánh không phân biệt chữ hoa chữ thường

	if (category) throw new Error("Category with this title already exists");

	const newProductCategory = await ProductCategory.create({
		...req.body,
		title:
			req.body.title[0].toUpperCase() +
			req.body.title.slice(1).toLowerCase(),
		image: files.image[0].path,
	});
	return res.status(201).json({
		success: newProductCategory ? true : false,
		message: newProductCategory
			? "Product category created successfully"
			: "Can't create product category",
		createdCategory: newProductCategory ? newProductCategory : null,
	});
});

// [GET] /api/product-category/
const getAllCategories = asyncHandler(async (req, res) => {
	const categories = await ProductCategory.find();
	if (!categories) throw new Error("No categories found");
	return res.status(200).json({
		success: true,
		message: "Product categories fetched successfully",
		categories,
	});
});

// [GET] /api/product-category/:id
const getCategoryById = asyncHandler(async (req, res) => {
	const category = await ProductCategory.findById(req.params.id);
	if (!category) throw new Error("No category found");
	return res.status(200).json({
		success: true,
		message: "Product category fetched successfully",
		category,
	});
});

// [PUT] /api/product-category/:id
const updateCategory = asyncHandler(async (req, res) => {
	if(req.files && req.files.image) {
		req.body.image = req.files.image[0].path;
	}
	const updatedCategory = await ProductCategory.findByIdAndUpdate(
		req.params.id,
		{
			...req.body,
			title:
				req.body.title[0].toUpperCase() +
				req.body.title.slice(1).toLowerCase(),
		},
		{ new: true }
	);
	if (!updatedCategory) throw new Error("No category found");
	return res.status(200).json({
		success: true,
		message: "Product category updated successfully",
		updatedCategory,
	});
});

// [DELETE] /api/product-category/:id
const deleteCategory = asyncHandler(async (req, res) => {
	const deletedCategory = await ProductCategory.findByIdAndDelete(
		req.params.id
	);
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
