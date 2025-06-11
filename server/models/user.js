const mongoose = require("mongoose");
const product = require("./product");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		avatar: { type: String },
		email: { type: String, required: true, unique: true },
		mobile: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String, default: "user" },
		cart: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
				quantity: { type: Number, default: 1 },
				color: { type: String, required: true },
				thumb: { type: String, required: true },
				price: { type: Number, required: true },
				stock: { type: Number, required: true },
			},
		],
		address: {
			type: Array,
			default: [],
		},
		wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
		isBlocked: { type: Boolean, default: false },
		refreshToken: { type: String },
		//Dùng cho chức năng quên mật khẩu
		passwordChangedAt: { type: Date },
		passwordResetToken: { type: String },
		passwordResetExpires: { type: Date },
		registerToken: { type: String },
	},
	{ timestamps: true }
);

//Export the model
module.exports = mongoose.model("User", userSchema);
