const userRouter = require("./user.route");
const productRouter = require("./product.route");
const { notFound, errorHandler } = require("../middlewares/error-handler");

const initRoutes = (app) => {
	app.use("/api/user", userRouter);
	app.use("/api/product", productRouter);

	app.use(notFound);
	app.use(errorHandler);
};

module.exports = initRoutes;
