const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		mobile: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, default: "user" },
		cart: { type: Array, default: [] },
		address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
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
