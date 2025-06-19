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
					required: true,
				},
				comment: {
					type: String,
				},
				date: {
					type: Date,
					default: Date.now,
				},
			},
		],
		totalRatings: {
			type: Number,
			default: 0,
		},
		variants: {
			type: [
				{
					color: {
						type: String,
						required: true,
					},
					price: {
						type: Number,
						required: true,
					},
					stock: {
						type: Number,
						default: 0,
					},
					sold: {
						type: Number,
						default: 0,
					},
					thumb: {
						type: String,
						default: "",
					},
					images: {
						type: Array,
						default: [],
					},
					sku: {
						type: String,
						required: true,
					},
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
