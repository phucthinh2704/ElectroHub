const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");

const createNewOrder = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { products, total, address, status, recipientInfo } = req.body;
	const user = await User.findById(_id);

	// Kiểm tra địa chỉ đã tồn tại trong mảng address của người dùng
	const addressExists = user.address?.some(
		(addr) => addr.toLowerCase() === address.toLowerCase(),
	);

	const updateData = { cart: [] };
	if (!addressExists) {
		updateData.$push = { address: address };
	}

	await User.findByIdAndUpdate(_id, updateData);

	products.forEach(async (product) => {
		const productUpdate = await Product.findById(product.product);
		if (productUpdate && product.color === productUpdate.color) {
			productUpdate.stock -= product.quantity;
			productUpdate.sold += product.quantity;
			await productUpdate.save();
		} else {
			const variantProductUpdate = productUpdate.variants.find(
				(variant) => variant.color === product.color,
			);
			if (variantProductUpdate) {
				variantProductUpdate.stock -= product.quantity;
				variantProductUpdate.sold += product.quantity;
				await productUpdate.save();
			}
		}
	});

	const newOrder = await Order.create({
		products,
		shippingAddress: address,
		total,
		status,
		orderBy: _id,
		recipientInfo,
	});

	return res.status(201).json({
		success: newOrder ? true : false,
		message: newOrder ? "Order created successfully" : "Can't create order",
		createdOrder: newOrder ? newOrder : null,
	});
});

const updateStatusOrder = asyncHandler(async (req, res) => {
	const { orderId } = req.params;
	const { status } = req.body;

	if (!status) throw new Error("Missing status");

	const order = await Order.findById(orderId);
	if (!order) throw new Error("No order found");

	// 1. Logic chặn cập nhật nếu đơn hàng đã hoàn thành hoặc đã hủy
	if (order.status === "delivered" || order.status === "cancelled") {
		return res.status(400).json({
			success: false,
			message: "Cannot update status of a completed or cancelled order",
		});
	}

	// 2. Logic hoàn trả kho (Stock) nếu Admin hủy đơn hàng
	// Nếu trạng thái mới là 'cancelled', ta cần cộng lại stock và trừ đi sold
	if (status === "cancelled") {
		// Lặp qua từng sản phẩm trong đơn hàng để trả kho
		for (const item of order.products) {
			const product = await Product.findById(item.product);
			if (product) {
				// Nếu sản phẩm không có biến thể hoặc màu trùng với màu gốc (xử lý logic giống createOrder)
				if (product.color === item.color) {
					product.stock += item.quantity;
					product.sold = Math.max(0, product.sold - item.quantity); // Đảm bảo không âm
					await product.save();
				} else {
					// Xử lý cho biến thể (variants)
					const variantIndex = product.variants.findIndex(
						(v) => v.color === item.color,
					);
					if (variantIndex !== -1) {
						product.variants[variantIndex].stock += item.quantity;
						product.variants[variantIndex].sold = Math.max(
							0,
							product.variants[variantIndex].sold - item.quantity,
						);
						await product.save();
					}
				}
			}
		}
	}

	// Cập nhật trạng thái mới
	order.status = status;
	await order.save();

	return res.status(200).json({
		success: true,
		message: "Order updated successfully",
		updatedOrder: order,
	});
});

const getUserOrder = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const queries = { ...req.query };

	const excludeFields = ["page", "sort", "limit", "fields"];
	excludeFields.forEach((el) => delete queries[el]);
	let formattedQueries = { orderBy: _id };

	let queryCommand = Order.find(formattedQueries)
		.populate("products.product", "title category brand")
		.populate("orderBy", "name mobile email address")
		.sort({ createdAt: -1 });

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

const getAllOrders = asyncHandler(async (req, res) => {
	const queries = { ...req.query };

	const excludeFields = ["page", "sort", "limit", "fields"];
	excludeFields.forEach((el) => delete queries[el]);
	let formattedQueries = {};

	let queryCommand = Order.find(formattedQueries)
		.populate("products.product")
		.populate("orderBy", "name mobile email address")
		.sort({ createdAt: -1 });

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
