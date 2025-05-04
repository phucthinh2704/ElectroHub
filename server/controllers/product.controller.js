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

function convertQueryFormat(params) {
	const result = {};

	for (const key in params) {
		// Kiểm tra xem key có chứa cú pháp toán tử không (ví dụ: "price[$gte]")
		const operatorMatch = key.match(/(\w+)\[([$\w]+)\]/);

		if (operatorMatch) {
			// Lấy tên trường (price) và toán tử ($gte)
			const fieldName = operatorMatch[1];
			const operator = operatorMatch[2];

			// Chuyển đổi giá trị từ string sang số nếu cần
			const value = isNaN(params[key])
				? params[key]
				: Number(params[key]);

			// Tạo hoặc cập nhật cấu trúc lồng nhau
			if (!result[fieldName]) {
				result[fieldName] = {};
			}

			result[fieldName][operator] = value;
		} else {
			// Xử lý các trường thông thường không có toán tử
			result[key] = params[key];
		}
	}

	return result;
}
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

	// Price filtering
	// if (queries?.price) {
	// 	// Handle price[gte] and price[lte]
	// 	const priceQuery = {};
	// 	if (queries.price.gte) priceQuery.$gte = Number(queries.price.gte);
	// 	if (queries.price.lte) priceQuery.$lte = Number(queries.price.lte);
	// 	formattedQueries.price = priceQuery;
	// }

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
	const limit = parseInt(req.query.limit) || 10;
	const skip = (page - 1) * limit;
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

module.exports = {
	createProduct,
	getProductById,
	getAllProducts,
	updateProduct,
	deleteProduct,
};
