const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {

	const authHeader = req.headers?.authorization;
	if (!authHeader) {
		return res.status(401).json({
			success: false,
			message: "Require authentication!",
		});
	}

	const token = authHeader.split(" ")[1];
	try {
		// user là data đã bỏ vào lúc sign token
		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user;
		next();
	} catch (err) {
		return res.status(403).json({
			success: false,
			message: "Token is not matched!",
		});
	}
});

const isAdmin = asyncHandler(async (req, res, next) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({
			success: false,
			message: "You are not admin!",
		});
	}
	next();
});

module.exports = { verifyAccessToken, isAdmin };
