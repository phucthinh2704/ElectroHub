const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
		},
		discount: {
			type: Number,
			required: true,
		},
		expiry: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
