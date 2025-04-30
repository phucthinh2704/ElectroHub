const User = require("../model/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

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

	// Kiểm tra định dạng email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email))
		return res.status(400).json({ err: 1, mes: "Invalid email format" });

	// Kiểm tra định dạng số điện thoại (ví dụ)
	const mobileRegex = /^[0-9]{10}$/;
	if (!mobileRegex.test(mobile))
		return res
			.status(400)
			.json({ err: 1, mes: "Invalid mobile number format" });

	// Kiểm tra độ mạnh của mật khẩu (ví dụ)
	if (password.length < 6)
		return res
			.status(400)
			.json({ err: 1, mes: "Password must be at least 6 characters" });

	const passwordHash = await hashPassword(password);
	const user = await User.create({
		firstName,
		lastName,
		email,
		mobile,
		password: passwordHash,
	});

	return res.status(201).json({
		success: user ? true : false,
		message: user ? "User created successfully" : "Something went wrong",
		user,
	});
});

module.exports = {
	register,
};
