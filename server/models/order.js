const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
	products: [
		{
			product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
			count: { type: Number, default: 1 },
			color: { type: String, default: "" },
		},
	],
	status: {
		type: String,
		default: "Processing",
		enum: [
			"Processing",
			"Shipped",
			"Delivered",
			"Cancelled",
			"Returned",
			"Cash on Delivery",
			"Success",
		],
	},
	total: {
		type: Number,
		default: 0,
	},
	coupon: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Coupon",
	},
   orderBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

//Export the model
module.exports = mongoose.model("Order", orderSchema);
