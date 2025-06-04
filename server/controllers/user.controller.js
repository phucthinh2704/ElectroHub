const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const createToken = require("uniqid");
require("dotenv").config();
const sendMail = require("../utils/sendMail");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../middlewares/jwt");
const { hashPassword, createPasswordResetToken } = require("../utils/password");

const register = asyncHandler(async (req, res) => {
	const { name, email, mobile, password } = req.body || {};

	if (!name || !email || !mobile || !password) {
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
			message: `This email is already registered. Please log in or use a different email.`,
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
	const token = createToken();

	// Tam thời lưu thông tin người dùng vào cookie, nếu người dùng click vào link xác thực thì mới lưu vào db
	res.cookie(
		"dataRegister",
		{
			name,
			email,
			mobile,
			password: passwordHash,
			token,
		},
		{ httpOnly: true, maxAge: 15 * 60 * 1000 }
	); // 15 phút

	const html = `<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);">
        <div style="background: linear-gradient(135deg, #4776E6, #8E54E9); padding: 30px 20px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold; color: white; letter-spacing: 1px; margin-bottom: 5px;">ELECTRO HUB</div>
            <div style="color: rgba(255, 255, 255, 0.8); font-size: 14px; font-weight: 300;">Your Digital Electronics Destination</div>
        </div>

		  <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eaeaea;">
            <p style="font-size: 22px; font-weight: 600; color: #4776E6; margin: 0; text-transform: uppercase; letter-spacing: 1px; position: relative; display: inline-block;">Electro Hub Account Verification</p>
        </div>
        
        <div style="padding: 35px 30px; color: #333; line-height: 1.6;">
            <p style="font-size: 20px; font-weight: 500; margin-bottom: 20px; color: #333;">Dear ${name},</p>
            
            <p style="margin-bottom: 25px; font-size: 15px;">
                Thank you for registering with Electro Hub. We're excited to have you join our community of tech enthusiasts!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.SERVER_URL}/api/user/auth-register/${token}" style="display: inline-block; background: linear-gradient(135deg, #4776E6, #8E54E9); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; font-size: 16px; box-shadow: 0 4px 10px rgba(142, 84, 233, 0.3);">Verify Your Account</a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #8E54E9;">
                ⏱️ This verification link is valid for <strong>15 minutes</strong> from the time of receipt. If you don't verify your account within this period, you'll need to request a new verification link.
            </p>
            
            <p style="font-size: 14px; color: #666;">
                If you have any questions or need assistance, our support team is here to help at <a href="mailto:electrohub-digital@support.com" style="color: #4776E6; text-decoration: none; font-weight: 500;">electrohub-digital@support.com</a>
            </p>
            
            <div style="height: 1px; background-color: #eaeaea; margin: 25px 0;"></div>
            
            <p style="font-weight: 500; margin-bottom: 5px; color: #333;">Best regards,</p>
            <p>The Electro Hub Team</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #666;">
            © 2025 Electro Hub. All rights reserved.<br>
            This is an automated message, please do not reply directly to this email.
        </div>
    </div>`;

	await sendMail({
		email,
		html,
		subject: "Electro Hub Account Verification",
	});
	// Gửi email xác thực tài khoản
	return res.status(200).json({
		success: true,
		message:
			"Register successfully. Please check your email to verify your account.",
	});
});

const authRegister = asyncHandler(async (req, res) => {
	const { token } = req.params;
	const cookies = req.cookies;

	if (
		!cookies ||
		!cookies?.dataRegister ||
		cookies?.dataRegister?.token != token
	) {
		res.clearCookie("dataRegister");
		return res.redirect(
			`${process.env.CLIENT_URL}/login?error=An error occurred during authentication. Please try again later!`
		);
	}
	const { name, email, mobile, password } = cookies.dataRegister || {};
	const newUser = await User.create({
		name,
		email,
		mobile,
		password,
	});
	res.clearCookie("dataRegister");
	return res.redirect(
		`${process.env.CLIENT_URL}/login?message=Register successfully. Please log in!&email=${email}`
	);
});

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body || {};

	if (!email || !password) throw new Error("Missing required fields");

	const user = await User.findOne({ email });
	if (!user)
		throw new Error(
			"Login failed: User not found. Please check your username and try again."
		);

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch)
		throw new Error("The password that you've entered is incorrect.");

	if (user.isBlocked) {
		throw new Error(
			"Your account has been blocked. Please contact support."
		);
	}

	// Chuyển về Object thuần và loại bỏ các trường không cần thiết
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.refreshToken;

	const accessToken = generateAccessToken(user._id, user.role);
	const refreshToken = generateRefreshToken(user._id);
	// Lưu refresh token vào cookie và db
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
	const { email } = req.body;
	if (!email) throw new Error("Missing required fields");

	// Kiểm tra xem email có tồn tại trong db không
	const user = await User.findOne({ email });
	if (!user)
		throw new Error(
			"Email not found. Please check the email address and try again!"
		);

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

	const html = `<div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">

        <div style="background: linear-gradient(135deg, #4776E6, #8E54E9); padding: 30px 20px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold; color: white; letter-spacing: 1px; margin-bottom: 5px;">ELECTRO HUB</div>
            <div style="color: rgba(255, 255, 255, 0.8); font-size: 14px; font-weight: 300;">Your Digital Electronics Destination</div>
        </div>
        
        <div style="padding: 30px; line-height: 1.6;">
            <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #202124;">Password Reset</h1>
            
            <p style="font-size: 16px; margin-bottom: 25px; color: #5f6368;">Hello,</p>
            
            <p style="font-size: 16px; margin-bottom: 25px; color: #5f6368;">We received a request to reset your password. Please click the button below to create a new password. This link will expire in 15 minutes from now.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}" style="display: inline-block; background-image: linear-gradient(to right, #4568dc, #b06ab3); color: white; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px; transition: background-color 0.3s ease;">Reset Password</a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #8E54E9;">
                ⏱️ This verification link is valid for <strong>15 minutes</strong> from the time of receipt. If you don't verify your account within this period, you'll need to request a new verification link.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 25px; color: #5f6368;">If you didn't request a password reset, please ignore this email or contact support if you have any questions.</p>

				<div style="height: 1px; background-color: #eaeaea; margin: 25px 0;"></div>
					 
				 <p style="font-weight: 500; margin-bottom: 5px; color: #333;">Best regards,</p>
				 <p>The Electro Hub Team</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #666;">
            © 2025 Electro Hub. All rights reserved.<br>
            This is an automated message, please do not reply directly to this email.
        </div>
    </div>`;
	const data = {
		email,
		html,
		subject: "Password Reset",
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
		message: "A reset link has been sent to your email. Please check it!",
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

const blockUser = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const user = await User.findById(id).select("-refreshToken -password");
	if (!user) throw new Error("User not found");
	if (user.role === "admin") {
		throw new Error("Cannot block admin user");
	}
	user.isBlocked = !user.isBlocked; // Chuyển trạng thái block
	await user.save();
	return res.status(200).json({
		success: true,
		message: `User ${user.email} has been ${
			user.isBlocked ? "blocked" : "unblocked"
		}`,
		user,
	});
});

const getAllUsers = asyncHandler(async (req, res) => {
	const queries = { ...req.query };
	// Tách các trường đặc biệt khỏi query
	const excludeFields = ["page", "sort", "limit", "fields"];
	excludeFields.forEach((el) => delete queries[el]);

	let formattedQueries = {};
	// Filtering
	if (queries?.name)
		formattedQueries.name = { $regex: queries.name, $options: "i" };

	let queryCommand = User.find(formattedQueries);

	// Sorting
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		queryCommand = queryCommand.sort(sortBy);
	}

	// Fields limiting
	if (req.query.fields) {
		const fields = req.query.fields.split(",").join(" ");
		queryCommand = queryCommand.select(fields);
	}

	// Pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 999999;
	const skip = (page - 1) * limit; // tương tự như offset trong SQL
	queryCommand = queryCommand.skip(skip).limit(limit);

	// Execute query
	const users = await queryCommand;
	const count = await User.find(formattedQueries).countDocuments();

	return res.status(200).json({
		success: users ? true : false,
		count,
		users,
		currentPage: page,
		totalPages: Math.ceil(count / limit),
	});
});

const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	if (!id) throw new Error("Missing id");

	const user = await User.findById(id);
	if (!user) throw new Error("User not found");

	if (user.role === "admin") {
		throw new Error("Cannot delete admin user");
	}
	await User.findByIdAndDelete(id);

	return res.status(200).json({
		success: true,
		message: `User with email ${user.email} has been deleted`,
		deletedUser: user,
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
		const mobileRegex = /^[0-9]{10,11}$/;
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

const updateUserAddress = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	if (!req.body?.address) throw new Error("Missing address");
	const user = await User.findByIdAndUpdate(
		_id,
		{ $push: { address: req.body.address } },
		{ new: true }
	).select("-refreshToken -password -role");
	if (!user) throw new Error("User not found");
	return res.status(200).json({
		success: true,
		message: "Update user address successfully",
		user,
	});
});
const updateCart = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	if (!req.body) throw new Error("Missing request body");
	const { pid, quantity, color } = req.body;
	if (!pid || !quantity || !color) throw new Error("Missing required fields");
	const user = await User.findById(_id).select("cart");
	const alreadyProduct = user?.cart?.find(
		(item) => item.product.toString() === pid && item.color === color
	);
	if (alreadyProduct) {
		// Update quantity if product already exists in cart
		const response = await User.findOneAndUpdate(
			{ cart: { $elemMatch: alreadyProduct } }, // sẽ cập nhật chính xác dù không cung cấp userId vì mỗi phần tử trong cart đều có id riêng
			{ $set: { "cart.$.quantity": quantity } }, // cập nhật số lượng sản phẩm cho trường quantity của cart của user tìm được
			{ new: true }
		);
		return res.status(200).json({
			success: response ? true : false,
			message: response
				? "Updated cart successfully"
				: "Cannot update cart",
			response,
		});
	} else {
		// Add new product to cart
		const response = await User.findByIdAndUpdate(
			_id,
			{ $push: { cart: { product: pid, quantity, color } } },
			{ new: true }
		);
		return res.status(200).json({
			success: response ? true : false,
			message: response
				? "Added to cart successfully"
				: "Cannot add to cart",
			response,
		});
	}
});

module.exports = {
	register,
	login,
	getCurrent,
	blockUser,
	refreshAccessToken,
	logout,
	forgotPassword,
	resetPassword,
	getAllUsers,
	deleteUser,
	updateUser,
	updateUserByAdmin,
	updateUserAddress,
	updateCart,
	authRegister,
};
