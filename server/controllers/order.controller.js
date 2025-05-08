const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createNewOrder = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const user = await User.findById(_id)
		.select("cart")
		.populate("cart.product", "title price");
	const products = user.cart.map((item) => ({
		product: item.product._id,
		count: item.quantity,
		color: item.color,
	}));
	let totalPrice = user.cart.reduce((acc, item) => {
		return acc + item.product.price * item.quantity;
	}, 0);
	if (req.body?.coupon) {
		const couponDiscount = await Coupon.findById(req.body.coupon);
		if (couponDiscount) {
			totalPrice =
				totalPrice - (totalPrice * couponDiscount.discount) / 100;
		}
	}
	const newOrder = await Order.create({
		products,
		coupon: req.body?.coupon || null,
		total: totalPrice,
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
	const orders = await Order.find({ orderBy: _id });
	if (!orders) throw new Error("No orders found");
	return res.status(200).json({
		success: true,
		message: "Orders fetched successfully",
		orders,
	});
});

const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find()
		.populate("orderBy", "firstName lastName")
		.populate("coupon", "name discount expiry");
	if (!orders) throw new Error("No orders found");
	return res.status(200).json({
		success: true,
		message: "Orders fetched successfully",
		orders,
	});
});

module.exports = {
	createNewOrder,
	updateStatusOrder,
	getUserOrder,
	getAllOrders,
};
