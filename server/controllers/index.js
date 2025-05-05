const user = require("./user.controller");
const product = require("./product.controller");
const productCategory = require("./productCategory.controller");
const blog = require("./blog.controller");
const blogCategory = require("./blogCategory.controller");
const brand = require("./brand.controller");
const coupon = require("./coupon.controller");


module.exports = {
	user,
	product,
	productCategory,
	blogCategory,
	blog,
	brand,
	coupon,
};
