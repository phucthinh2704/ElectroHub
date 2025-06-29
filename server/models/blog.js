const mongoose = require("mongoose"); // Erase if already required

const contentBlockSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			enum: ["paragraph", "heading", "list", "image"],
			trim: true,
		},
		text: {
			type: String,
			required: function () {
				return (
					this.type === "paragraph" ||
					this.type === "heading"
				);
			},
			trim: true,
		},
		items: {
			type: [String],
			required: function () {
				return this.type === "list";
			},
			validate: {
				validator: function (arr) {
					return this.type !== "list" || (arr && arr.length > 0);
				},
				message: "List type must have at least one item",
			},
		},
		src: {
			type: String,
			required: function () {
				return this.type === "image";
			},
			trim: true,
		},
		caption: {
			type: String,
			default: "",
			trim: true,
		},
		alt: {
			type: String,
			default: "",
			trim: true,
		},
		level: {
			type: Number,
			min: 1,
			max: 6,
			default: 2,
			required: function () {
				return this.type === "heading";
			},
		},
	},
	{
		_id: false, // Không tạo _id cho sub-document
	}
);

// Declare the Schema of the Mongo model
const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: [200, "Title cannot exceed 200 characters"],
		},
		description: {
			type: String,
			required: true,
			trim: true,
			maxlength: [500, "Description cannot exceed 500 characters"],
		},
		content: {
			type: [contentBlockSchema],
			required: true,
			validate: {
				validator: function (arr) {
					return arr && arr.length > 0;
				},
				message: "Content must have at least one block",
			},
		},
		category: {
			type: String,
			required: true,
		},
		numberViews: {
			type: Number,
			default: 0,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		dislikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		image: {
			type: String,
			default:
				"https://images.pexels.com/photos/1108571/pexels-photo-1108571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);
