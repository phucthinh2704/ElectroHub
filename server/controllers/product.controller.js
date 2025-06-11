const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const convertQueryFormat = require("../utils/convertQuery");
const createSKU = require("uniqid");
require("dotenv").config();

// [POST] /product
const createProduct = asyncHandler(async (req, res) => {
	if (!req.body) throw new Error("Please fill all the fields");
	if (req.body.title) req.body.slug = slugify(req.body.title);
	const product = await Product.findOne({
		slug: req.body.slug,
	});
	if (product) {
		throw new Error("Product with this name already exists");
	}

	const thumb = req?.files?.thumb[0]?.path;
	const images = req.files?.images?.map((file) => file.path);
	if (thumb) req.body.thumb = thumb;
	if (images) req.body.images = images;

	const newProduct = await Product.create({
		...req.body,
		color: req.body.color.toUpperCase(),
	});

	res.status(201).json({
		success: newProduct ? true : false,
		message: newProduct
			? "Product created successfully"
			: "Can't create product",
		createdProduct: newProduct ? newProduct : null,
	});
});

// [GET] /product/:pid
const getProductById = asyncHandler(async (req, res) => {
	const { pid } = req.params;
	const product = await Product.findById(pid).populate({
		path: "ratings",
		populate: {
			path: "postedBy",
			select: "name avatar",
		},
	});
	if (!product) throw new Error("Product not found");
	res.status(200).json({
		success: true,
		message: "Product found",
		product,
	});
});

// [GET] /product
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

	let formattedQueries = {};
	// Filtering
	if (queries?.title)
		formattedQueries.title = { $regex: queries.title, $options: "i" };

	if (queries?.category)
		formattedQueries.category = { $regex: queries.category, $options: "i" };

	if (queries?.minPrice) {
		if (queries?.maxPrice) {
			formattedQueries.price = {
				$gte: queries.minPrice,
				$lte: queries.maxPrice,
			};
		} else {
			formattedQueries.price = { $gte: queries.minPrice };
		}
	}

	const colorQueryObject = queries.color
		? {
				$or: queries.color.split(",").map((color) => ({
					color: { $regex: color, $options: "i" },
				})),
		  }
		: {};

	formattedQueries = { ...colorQueryObject, ...formattedQueries };
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
	const limit = parseInt(req.query.limit) || 999999;
	const skip = (page - 1) * limit; // tương tự như offset trong SQL
	queryCommand = queryCommand.skip(skip).limit(limit);

	// Execute query
	const products = await queryCommand;
	const count = await Product.find(formattedQueries).countDocuments();

	return res.status(200).json({
		success: products ? true : false,
		count,
		products,
		currentPage: page,
		totalPages: Math.ceil(count / limit),
	});
});

// [PUT] /product/:id
const updateProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	if (!req.body) throw new Error("Please fill all the fields");

	const files = req.files;
	if (files) {
		const thumb = files.thumb ? files.thumb[0].path : undefined;
		const images = files.images
			? files.images.map((file) => file.path)
			: [];
		if (thumb) req.body.thumb = thumb;
		if (images.length > 0) req.body.images = images;
	}
	if (req.body.title) req.body.slug = slugify(req.body.title);

	const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
		new: true,
	});
	if (!updatedProduct) throw new Error("Product not found");
	res.status(200).json({
		success: true,
		message: "Product updated successfully",
		updatedProduct,
	});
});

// [DELETE] /product/:id
const deleteProduct = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const deletedProduct = await Product.findByIdAndDelete(id);
	if (!deletedProduct) throw new Error("Product not found");
	res.status(200).json({
		success: true,
		message: "Product deleted successfully",
		deletedProduct,
	});
});

// [PUT] /product/ratings
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
					date: Date.now(),
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
	product.ratingCount = product.ratings.length;

	await product.save();
	res.status(200).json({
		success: true,
		message: "Rating updated successfully",
		product,
	});
});

// [PUT] /product/upload-image/:id
const uploadImagesProduct = asyncHandler(async (req, res) => {
	if (!req.files) throw new Error("Please upload images");
	const product = await Product.findByIdAndUpdate(
		req.params.id,
		// push each image path to the images array
		{ $push: { images: { $each: req.files.map((file) => file.path) } } },
		{ new: true }
	);
	if (!product) throw new Error("Product not found");
	res.status(200).json({
		success: true,
		message: "Images uploaded successfully",
		product,
	});
});

// [PUT] /product/variant/:id
const addVariantProduct = asyncHandler(async (req, res) => {
	const { stock, price, color } = req.body;
	const files = req.files;
	if (!stock || !price || !color) {
		throw new Error("Please fill all the fields");
	}
	if (files) {
		const thumb = files.thumb ? files.thumb[0].path : undefined;
		const images = files.images
			? files.images.map((file) => file.path)
			: [];
		if (thumb) req.body.thumb = thumb;
		if (images.length > 0) req.body.images = images;
	}
	const productVariantValidate = await Product.findOne({
		_id: req.params.id,
		"variants.color": color,
	});
	if (productVariantValidate) {
		throw new Error("Variant with this color already exists");
	}

	const product = await Product.findByIdAndUpdate(
		req.params.id,
		// push each image path to the images array
		{
			$push: {
				variants: {
					color: color.toUpperCase(),
					price,
					stock,
					thumb: req.body.thumb ? req.body.thumb : "",
					images: req.body.images ? req.body.images : [],
					sku: createSKU(),
				},
			},
		},
		{ new: true }
	);
	if (!product) throw new Error("Product not found");
	res.status(200).json({
		success: true,
		message: "Variant added successfully",
		product,
	});
});

module.exports = {
	createProduct,
	getProductById,
	getAllProducts,
	updateProduct,
	deleteProduct,
	ratingProduct,
	uploadImagesProduct,
	addVariantProduct,
};
