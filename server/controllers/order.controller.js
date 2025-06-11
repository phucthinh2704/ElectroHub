const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createNewOrder = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { products, total, address, status } = req.body;
	// let totalPrice = user.cart.reduce((acc, item) => {
	// 	return acc + item.product.price * item.quantity;
	// }, 0);
	// if (req.body?.coupon) {
	// 	const couponDiscount = await Coupon.findById(req.body.coupon);
	// 	if (couponDiscount) {
	// 		totalPrice =
	// 			totalPrice - (totalPrice * couponDiscount.discount) / 100;
	// 	}
	// }
	const user = await User.findById(_id);

	// Kiểm tra địa chỉ đã tồn tại trong mảng address của người dùng
	const addressExists = user.address?.some(
		(addr) => addr.toLowerCase() === address.toLowerCase()
	);

	const updateData = { cart: [] };
	if (!addressExists) {
		updateData.$push = { address: address };
	}

	await User.findByIdAndUpdate(_id, updateData);

	const newOrder = await Order.create({
		products,
		// coupon: req.body?.coupon || null,
		// total: totalPrice,
		shippingAddress: address,
		total,
		status,
		orderBy: _id,
	});

	return res.status(201).json({
		success: newOrder ? true : false,
		message: newOrder ? "Order created successfully" : "Can't create order",
		createdOrder: newOrder ? newOrder : null,
	});
});

const updateStatusOrder = asyncHandler(async (req, res) => {
	const { orderId } = req.params;

	if (!req.body) throw new Error("Missing status");
	const { status } = req.body;

	const updatedOrder = await Order.findByIdAndUpdate(
		orderId,
		{ status },
		{ new: true }
	);

	if (!updatedOrder) throw new Error("No order found");

	return res.status(200).json({
		success: true,
		message: "Order updated successfully",
		updatedOrder,
	});
});

const getUserOrder = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const queries = { ...req.query };
	
	const excludeFields = ["page", "sort", "limit", "fields"];
	excludeFields.forEach((el) => delete queries[el]);
	let formattedQueries = {orderBy: _id};

	let queryCommand = Order.find(formattedQueries);

	// Sorting
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		queryCommand = queryCommand.sort(sortBy);
	}

	// Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 999999;
	const skip = (page - 1) * limit; // tương tự như offset trong SQL
	queryCommand = queryCommand.skip(skip).limit(limit);

	const orders = await queryCommand;
	const count = await Order.find(formattedQueries).countDocuments();

	return res.status(200).json({
		success: orders ? true : false,
		count,
		orders,
		currentPage: page,
		totalPages: Math.ceil(count / limit),
	});
	// const orders = await Order.find({ orderBy: _id });
	// if (!orders) throw new Error("No orders found");
	// return res.status(200).json({
	// 	success: true,
	// 	message: "Orders fetched successfully",
	// 	orders,
	// });
});

const getAllOrders = asyncHandler(async (req, res) => {
	const queries = { ...req.query };
	
	const excludeFields = ["page", "sort", "limit", "fields"];
	excludeFields.forEach((el) => delete queries[el]);
	let formattedQueries = {};

	let queryCommand = Order.find(formattedQueries);

	// Sorting
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		queryCommand = queryCommand.sort(sortBy);
	}

	// Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 999999;
	const skip = (page - 1) * limit; // tương tự như offset trong SQL
	queryCommand = queryCommand.skip(skip).limit(limit);

	const orders = await queryCommand;
	const count = await Order.find(formattedQueries).countDocuments();

	return res.status(200).json({
		success: orders ? true : false,
		count,
		orders,
		currentPage: page,
		totalPages: Math.ceil(count / limit),
	});
});

module.exports = {
	createNewOrder,
	updateStatusOrder,
	getUserOrder,
	getAllOrders,
};
