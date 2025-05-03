const User = require("../model/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();
const sendMail = require("../utils/sendMail");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../middlewares/jwt");
const { hashPassword, createPasswordResetToken } = require("../utils/password");

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
	delete userObject.refreshToken;

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
	// Kiểm tra xem refresh token có tồn tại trong cookie không
	const cookies = req.cookies;
	if (!cookies.refresh_token) throw new Error("No refresh token in cookies");

	// Xóa refresh token trong db
	await User.findOneAndUpdate(
		{ refreshToken: cookies.refresh_token },
		{ refreshToken: "" },
		{ new: true }
	);

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

const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.query;
	if (!email) throw new Error("Missing required fields");

	// Kiểm tra xem email có tồn tại trong db không
	const user = await User.findOne({ email });
	if (!user) throw new Error("User not found");

	// Tạo token reset password
	const [resetToken, tokenSaveDb] = createPasswordResetToken();
	// resetToken là token gửi qua email
	// tokenSaveDb là resetToken đã được mã hóa bằng sha256, lưu vào db
	// Lưu token vào db
	await User.updateOne(
		{ email },
		{
			passwordResetToken: tokenSaveDb,
			passwordResetExpires: Date.now() + 15 * 60 * 1000, // 15 phút
		}
	);

	const html = `<p>Vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link sẽ hết hạn sau 15 phút kể từ bây giờ. <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}">Click here</a></p>`;
	const data = {
		email: "thinhb2203636@student.ctu.edu.vn",
		html,
	};

	const rs = await sendMail(data);
	if (!rs) {
		return res.status(400).json({
			success: false,
			message: "Something went wrong",
		});
	}
	return res.status(200).json({
		success: true,
		message: "Reset password link sent to your email",
	});
});

const resetPassword = asyncHandler(async (req, res) => {
	const { password } = req.body;
	const { token } = req.params;

	if (!password) throw new Error("Missing required fields");

	// Kiểm tra xem token có tồn tại trong db không
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	if (!user) throw new Error("Token is invalid or has expired");

	const passwordHash = await hashPassword(password);
	await User.updateOne(
		{ passwordResetToken: hashedToken },
		{
			password: passwordHash,
			passwordResetToken: null,
			passwordResetExpires: null,
			passwordChangedAt: Date.now(),
		}
	);

	return res.status(200).json({
		success: user ? true : false,
		message: user ? "Password reset successfully" : "Something went wrong",
	});
});

const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select("-refreshToken -password -role");
	if (!users) throw new Error("No users found");

	return res.status(200).json({
		success: true,
		message: "Get all users successfully",
		users,
	});
});

const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) throw new Error("Missing id");

	const user = await User.findByIdAndDelete(id);
	if (!user) throw new Error("User not found");

	return res.status(200).json({
		success: true,
		message: "Delete user successfully",
		deletedUser: `User ${user.email} deleted`,
	});
});

const updateUser = asyncHandler(async (req, res) => {
	const { _id } = req.user;

	if (!_id) throw new Error("Missing id");
	if (!req.body) throw new Error("Missing body");

	const user = await User.findById(_id);
	if (!user) throw new Error("User not found");

	// Kiểm tra định dạng email
	if (req.body.email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(req.body.email))
			throw new Error("Invalid email format");
	}

	// Kiểm tra định dạng số điện thoại (ví dụ)
	if (req.body.mobile) {
		const mobileRegex = /^[0-9]{10}$/;
		if (!mobileRegex.test(req.body.mobile))
			throw new Error("Invalid mobile number format");
	}

	const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
		new: true,
	}).select("-refreshToken -password -role"); // new:true là trả về data sau khi update

	return res.status(200).json({
		success: true,
		message: "Update user successfully",
		updatedUser,
	});
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!id) throw new Error("Missing id");
	if (!req.body) throw new Error("Missing body");

	const user = await User.findById(id);
	if (!user) throw new Error("User not found");

	// Kiểm tra định dạng email
	if (req.body.email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(req.body.email))
			throw new Error("Invalid email format");
	}

	// Kiểm tra định dạng số điện thoại (ví dụ)
	if (req.body.mobile) {
		const mobileRegex = /^[0-9]{10}$/;
		if (!mobileRegex.test(req.body.mobile))
			throw new Error("Invalid mobile number format");
	}

	const updatedUser = await User.findByIdAndUpdate(id, req.body, {
		new: true,
	}).select("-refreshToken -password -role"); // new:true là trả về data sau khi update

	return res.status(200).json({
		success: true,
		message: "Update user successfully",
		updatedUser,
	});
});

module.exports = {
	register,
	login,
	getCurrent,
	refreshAccessToken,
	logout,
	forgotPassword,
	resetPassword,
	getAllUsers,
	deleteUser,
	updateUser,
	updateUserByAdmin,
};
