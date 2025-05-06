const Coupon = require("../model/coupon");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
	if (!req.body) throw new Error("Please fill all the fields");
	const { name, discount, expiry } = req.body;
	if (!name || !discount || !expiry)
		throw new Error("Please fill all the fields");
	const newCoupon = await Coupon.create({
		...req.body,
		expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
	});
	if (!newCoupon) throw new Error("Can't create coupon");
	return res.status(201).json({
		success: true,
		message: "Coupon created successfully",
		createdCoupon: newCoupon,
	});
});

const getAllCoupons = asyncHandler(async (req, res) => {
	const coupons = await Coupon.find().select("-createdAt -updatedAt");
	if (!coupons) throw new Error("No coupons found");
	return res.status(200).json({
		success: true,
		message: "Coupons fetched successfully",
		coupons,
	});
});

const getCouponById = asyncHandler(async (req, res) => {
	const coupon = await Coupon.findById(req.params.id);
	if (!coupon) throw new Error("No coupon found");
	return res.status(200).json({
		success: true,
		message: "Coupon fetched successfully",
		coupon,
	});
});

const updateCoupon = asyncHandler(async (req, res) => {
	if (!req.body) throw new Error("Please fill all the fields");
	if (req.body.expiry)
		req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
	const updatedCoupon = await Coupon.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	if (!updatedCoupon) throw new Error("No coupon found");
	return res.status(200).json({
		success: true,
		message: "Coupon updated successfully",
		updatedCoupon,
	});
});

const deleteCoupon = asyncHandler(async (req, res) => {
	const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
	if (!deletedCoupon) throw new Error("No coupon found");
	return res.status(200).json({
		success: true,
		message: "Coupon deleted successfully",
		deletedCoupon,
	});
});

module.exports = {
	createCoupon,
	getAllCoupons,
	getCouponById,
	updateCoupon,
	deleteCoupon,
};
