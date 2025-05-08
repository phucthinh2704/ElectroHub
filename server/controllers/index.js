const user = require("./user.controller");
const product = require("./product.controller");
const productCategory = require("./productCategory.controller");
const blog = require("./blog.controller");
const blogCategory = require("./blogCategory.controller");
const brand = require("./brand.controller");
const coupon = require("./coupon.controller");
const order = require("./order.controller");
const insert = require("./insertData");

module.exports = {
	user,
	product,
	productCategory,
	blogCategory,
	blog,
	brand,
	coupon,
	order,
	insert,
};
