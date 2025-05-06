const Product = require("../model/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const convertQueryFormat = require("../utils/convertQuery");
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
	// Example routes to test in Postman:
	// GET /api/product - Get all products
	// GET /api/product?title=iphone - Search products by title
	// GET /api/product?sort=price - Sort by price ascending
	// GET /api/product?sort=-price - Sort by price descending
	// GET /api/product?fields=title,price - Get only title and price fields
	// GET /api/product?page=2&limit=5 - Pagination with 5 items per page

	const queries = { ...req.query };
	// Tách các trường đặc biệt khỏi query
	const excludeFields = ["page", "sort", "limit", "fields"];
	excludeFields.forEach((el) => delete queries[el]);

	// Format lại các operators ($gt, $gte, etc)
	let queryString = JSON.stringify(queries);
	queryString = queryString.replace(
		/\b(gte|gt|lt|lte)\b/g,
		(match) => `$${match}`
	);
	let formattedQueries = JSON.parse(queryString);
	formattedQueries = convertQueryFormat(formattedQueries); // convert from {price[$gte]: 1000} ==> {price: {$gte: 1000}}

	// Filtering
	if (queries?.title)
		formattedQueries.title = { $regex: queries.title, $options: "i" };

	let queryCommand = Product.find(formattedQueries);

	// Sorting
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		queryCommand = queryCommand.sort(sortBy);
	}

	// Fields limiting
	if (req.query.fields) {
		const fields = req.query.fields.split(",").join(" ");
		queryCommand = queryCommand.select(fields);
	}

	// Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || process.env.LIMIT_PRODUCTS;
	const skip = (page - 1) * limit; // tương tự như offset trong SQL
	queryCommand = queryCommand.skip(skip).limit(limit);

	// Execute query
	const products = await queryCommand;
	const count = await Product.find(formattedQueries).countDocuments();

	// Example routes for testing price filtering:
	// GET /api/product?price[gte]=100 - Get products with price >= 100
	// GET /api/product?price[lte]=1000 - Get products with price <= 1000
	// GET /api/product?price[gte]=100&price[lte]=1000 - Get products with 100 <= price <= 1000

	return res.status(200).json({
		success: products ? true : false,
		count,
		products,
		currentPage: page,
		totalPages: Math.ceil(count / limit),
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

const ratingProduct = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { rating, comment, pid } = req.body;

	if (!rating) throw new Error("Please fill all the fields");
	if (rating < 1 || rating > 5)
		throw new Error("Rating must be between 1 and 5");

	const product = await Product.findById(pid);
	if (!product) throw new Error("Product not found");

	const alreadyRated = product.ratings.some(
		(rating) => rating.postedBy.toString() === _id
	);

	// Check if user has already rated the product
	if (alreadyRated) {
		// Update existing rating
		product.ratings = product.ratings.map((item) => {
			if (item.postedBy.toString() === _id) {
				return {
					...item,
					star: rating,
					comment: comment || item.comment,
				};
			}
			return item;
		});
	} else {
		// Add new rating
		product.ratings.push({ star: rating, postedBy: _id, comment });
	}

	// Calculate average rating
	const totalRating = product.ratings.reduce(
		(sum, item) => sum + item.star,
		0
	);
	product.totalRatings = totalRating / product.ratings.length;

	await product.save();
	res.status(200).json({
		success: true,
		message: "Rating updated successfully",
		product,
	});
});

const uploadImageProduct = asyncHandler(async (req, res) => {
	console.log("ok");
	res.status(200).json({
		success: true,
		message: "Image uploaded successfully",
	});
	// 	const file = req.files.file;
	// 	if (!file) throw new Error("Please upload an image");
	// 	if (file.size > 1024 * 1024) throw new Error("File size too large");
	//
	// 	const imagePath = `${process.env.BASE_URL}/uploads/products/${file.name}`;
	// 	file.mv(imagePath, (err) => {
	// 		if (err) throw new Error("Error uploading image");
	// 		return res.status(200).json({
	// 			success: true,
	// 			message: "Image uploaded successfully",
	// 			imagePath,
	// 		});
	// 	});
});

module.exports = {
	createProduct,
	getProductById,
	getAllProducts,
	updateProduct,
	deleteProduct,
	ratingProduct,
	uploadImageProduct,
};
