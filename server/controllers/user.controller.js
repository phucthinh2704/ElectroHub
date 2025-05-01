const User = require("../model/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../middlewares/jwt");

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

const register = asyncHandler(async (req, res) => {
	const { firstName, lastName, email, mobile, password } = req.body || {};

	if (!firstName || !lastName || !email || !mobile || !password) {
		return res.status(400).json({
			success: false,
			message: "Missing required fields",
		});
	}

	// Kiểm tra xem email đã tồn tại chưa
	const user = await User.findOne({ email });
	if (user) {
		return res.status(400).json({
			success: false,
			message: "User already exists",
		});
	}
	// Kiểm tra định dạng email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) throw new Error("Invalid email format");

	// Kiểm tra định dạng số điện thoại (ví dụ)
	const mobileRegex = /^[0-9]{10}$/;
	if (!mobileRegex.test(mobile))
		throw new Error("Invalid mobile number format");

	// Kiểm tra độ mạnh của mật khẩu (ví dụ)
	if (password.length < 6)
		throw new Error("Password must be at least 6 characters");

	const passwordHash = await hashPassword(password);
	const newUser = await User.create({
		firstName,
		lastName,
		email,
		mobile,
		password: passwordHash,
	});

	return res.status(201).json({
		success: newUser ? true : false,
		message: newUser ? "Register successfully" : "Something went wrong",
		newUser,
	});
});

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body || {};

	if (!email || !password) throw new Error("Missing required fields");

	const user = await User.findOne({ email });
	if (!user) throw new Error("User not found");

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error("Invalid password");

	// Chuyển về Object thuần và loại bỏ các trường không cần thiết
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.role;

	const accessToken = generateAccessToken(user._id, user.role);
	const refreshToken = generateRefreshToken(user._id);
	// Lưu access token vào cookie và refresh token vào db
	await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true }); // new:true là trả về data sau khi update
	res.cookie("refresh_token", refreshToken, {
		httpOnly: true,
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
	});

	return res.status(200).json({
		success: true,
		message: "Login successfully",
		access_token: `Bearer ${accessToken}`,
		user: userObject,
	});
});

const getCurrent = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const user = await User.findById(_id).select(
		"-refreshToken -password -role"
	);

	if (!user) {
		return res.status(400).json({
			success: false,
			message: "User not found",
		});
	}

	return res.status(200).json({
		success: true,
		message: "Get current user successfully",
		user,
	});
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	// Lấy refresh token từ cookie
	const cookies = req.cookies;

	// Kiểm tra xem refresh token có tồn tại trong cookie không
	if (!cookies.refresh_token) throw new Error("No refresh token in cookies");

	// Check token có hợp lệ hay không
	const rs = await jwt.verify(cookies.refresh_token, process.env.JWT_SECRET);
	const user = await User.findOne({
		_id: rs._id,
		refreshToken: cookies.refresh_token,
	});
	return res.status(200).json({
		success: user ? true : false,
		newAccessToken: user
			? `Bearer ${generateAccessToken(user._id, user.role)}`
			: "Refresh token is not matched",
	});
});


const logout = asyncHandler(async (req, res) => {
	// const { _id } = req.user;
	// Kiểm tra xem refresh token có tồn tại trong cookie không
	const cookies = req.cookies;
	if(!cookies.refresh_token) throw new Error("No refresh token in cookies");
	// console.log(req.cookies.refresh_token);
	// Xóa refresh token trong db
	await User.findOneAndUpdate({ refreshToken: cookies.refresh_token }, { refreshToken: "" }, { new: true });

	// Xóa refresh token trong cookie
	res.clearCookie("refresh_token", {
		httpOnly: true,
		secure: true,
	});
	return res.status(200).json({
		success: true,
		message: "Logout successfully",
	});
});

module.exports = {
	register,
	login,
	getCurrent,
	refreshAccessToken,
	logout,
};
