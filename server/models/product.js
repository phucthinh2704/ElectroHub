const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		description: {
			type: Array,
			required: true,
		},
		brand: {
			type: String,
			required: true,
		},
		thumb: {
			type: String,
			default: "",
		},
		originalPrice: {
			type: Number,
			required: true,
		},
		discount: {
			type: Number,
			default: 0,
		},
		stock: {
			type: Number,
			default: 0,
		},
		ratingCount: {
			type: Number,
			default: 0,
		},
		category: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		quantity: {
			type: Number,
			default: 0,
		},
		sold: {
			type: Number,
			default: 0,
		},
		images: {
			type: Array,
			default: [],
		},
		color: {
			type: String,
			required: true,
		},
		ratings: [
			{
				star: {
					type: Number,
					default: 0,
				},
				postedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				comment: {
					type: String,
				},
			},
		],
		totalRatings: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
