const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
	if (!req.body) throw new Error("Please fill all the fields");
	const newBrand = await Brand.create(req.body);
	return res.status(201).json({
		success: newBrand ? true : false,
		message: newBrand
			? "Brand created successfully"
			: "Can't create brand",
		createdBrand: newBrand ? newBrand : null,
	});
});

const getAllBrands = asyncHandler(async (req, res) => {
	const brands = await Brand.find();
	if (!brands) throw new Error("No brands found");
	return res.status(200).json({
		success: true,
		message: "Brands fetched successfully",
		brands,
	});
});

const getBrandById = asyncHandler(async (req, res) => {
	const brand = await Brand.findById(req.params.id);
	if (!brand) throw new Error("No brand found");
	return res.status(200).json({
		success: true,
		message: "Brand fetched successfully",
		brand,
	});
});

const updateBrand = asyncHandler(async (req, res) => {
	const updatedBrand = await Brand.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	if (!updatedBrand) throw new Error("No brand found");
	return res.status(200).json({
		success: true,
		message: "Brand updated successfully",
		updatedBrand,
	});
});

const deleteBrand = asyncHandler(async (req, res) => {
	const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
	if (!deletedBrand) throw new Error("No brand found");
	return res.status(200).json({
		success: true,
		message: "Brand deleted successfully",
		deletedBrand,
	});
});

module.exports = {
	createBrand,
   getAllBrands,
   getBrandById,
   updateBrand,
   deleteBrand,
};
