const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
	products: [
		{
			product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
			quantity: { type: Number, default: 1 },
			color: { type: String, required: true },
			thumb: { type: String, required: true },
			price: { type: Number, required: true },
		},
	],
	status: {
		type: String,
		default: "processing",
		enum: ["cancelled", "delivered", "shipped", "processing"],
	},
	shippingAddress: {
		type: String,
		required: true,
	},
	recipientInfo: {
		name: { type: String, required: true, trim: true },
		mobile: { type: String, required: true, trim: true },
	},
	total: {
		type: Number,
		default: 0,
	},
	// coupon: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "Coupon",
	// },
	orderBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

//Export the model
module.exports = mongoose.model("Order", orderSchema);
