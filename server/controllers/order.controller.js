const Order = require("../model/order");
const User = require("../model/user");
const asyncHandler = require("express-async-handler");

const createNewOrder = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const userCart = await User.findById(_id).select("cart");
   // if (!req.body) throw new Error("Missing request body");

   // const { products, totalPrice, user } = req.body;
   // if (!products || !totalPrice || !user)
   //    throw new Error("Please fill all the fields");
   // const newOrder = await Order.create(req.body);
   
   return res.status(201).json({
      success: userCart ? true : false,
      message: userCart ? "Order created successfully" : "Can't create order",
      createdOrder: userCart ? userCart : null,
   });
});

module.exports = {
	createNewOrder,
};
