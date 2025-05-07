const userRouter = require("./user.route");
const productRouter = require("./product.route");
const productCategoryRouter = require("./productCategory.route");
const blogCategoryRouter = require("./blogCategory.route");
const blogRouter = require("./blog.route");
const brandRouter = require("./brand.route");
const couponRouter = require("./coupon.route");
const orderRouter = require("./order.route");
const { notFound, errorHandler } = require("../middlewares/error-handler");

const initRoutes = (app) => {
	app.use("/api/user", userRouter);
	app.use("/api/product", productRouter);
	app.use("/api/product-category", productCategoryRouter);
	app.use("/api/blog", blogRouter);
	app.use("/api/blog-category", blogCategoryRouter);
	app.use("/api/brand", brandRouter);
	app.use("/api/coupon", couponRouter);
	app.use("/api/order", orderRouter);


	app.use(notFound);
	app.use(errorHandler);
};

module.exports = initRoutes;
