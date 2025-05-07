const mongoose = require("mongoose"); // Erase if already required
const product = require("./product");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		mobile: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, default: "user" },
		cart: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
				quantity: { type: Number, default: 1 },
				color: { type: String, default: "black" },
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
	},
	{ timestamps: true }
);

//Export the model
module.exports = mongoose.model("User", userSchema);
