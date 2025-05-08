const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
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
			type: String,
			default: "Admin",
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
