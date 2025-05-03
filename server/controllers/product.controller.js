const Product = require("../model/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
require("dotenv").config();

const createProduct = asyncHandler(async (req, res) => {
	if (!req.body) throw new Error("Please fill all the fields");

	if (req.body.title) req.body.slug = slugify(req.body.title);

	const newProduct = await Product.create(req.body);
	// 	const { name, description, price, imageUrl } = req.body;
	//
	// 	if (!name || !description || !price || !imageUrl) {
	// 		res.status(400);
	// 		throw new Error("Please fill all the fields");
	// 	}
	//
	// 	const product = await Product.create({
	// 		name,
	// 		description,
	// 		price,
	// 		imageUrl,
	// 	});

	res.status(201).json({
		success: newProduct ? true : false,
		message: newProduct
			? "Product created successfully"
			: "Can't create product",
		createdProduct: newProduct ? newProduct : null,
	});
});

const getProductById = asyncHandler(async (req, res) => {
	const { pid } = req.params;
	const product = await Product.findById(pid); //.populate("category");
	if (!product) throw new Error("Product not found");
	res.status(200).json({
		success: true,
		message: "Product found",
		product,
	});
});

//filtering, sorting, pagination
const getAllProducts = asyncHandler(async (req, res) => {
	// const { page = 1, limit = 10 } = req.query;
	// const products = await Product.find()
	//    .limit(limit * 1)
	//    .skip((page - 1) * limit)
	//    .populate("category")
	//    .sort({ createdAt: -1 });
	// const count = await Product.countDocuments();
	// res.status(200).json({
	//    success: true,
	//    message: "Products found",
	//    products,
	//    totalPages: Math.ceil(count / limit),
	//    currentPage: page,
	// });
	const product = await Product.find();
	const count = await Product.countDocuments();
	return res.status(200).json({
		success: true,
		message: `Found ${count} products`,
		product,
	});
});

const updateProduct = asyncHandler(async (req, res) => {
	const { pid } = req.params;
	if (!req.body) throw new Error("Please fill all the fields");
	if (req.body.title) req.body.slug = slugify(req.body.title);
	const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
		new: true,
	});
	if (!updatedProduct) throw new Error("Product not found");
	res.status(200).json({
		success: true,
		message: "Product updated successfully",
		updatedProduct,
	});
});

const deleteProduct = asyncHandler(async (req, res) => {
	const { pid } = req.params;
   const deletedProduct = await Product.findByIdAndDelete(pid);
   if (!deletedProduct) throw new Error("Product not found");
   res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
   });
});

module.exports = {
	createProduct,
	getProductById,
	getAllProducts,
	updateProduct,
	deleteProduct,
};
