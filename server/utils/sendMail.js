const nodemailer = require("nodemailer");
require("dotenv").config();
const asyncHandler = require("express-async-handler");

// async..await is not allowed in global scope, must use a wrapper
const sendMail = asyncHandler(async ({ email, html, subject }) => {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false, // true for port 465, false for other ports
		auth: {
			user: process.env.EMAIL_NAME, // generated ethereal user
			pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
		},
	});

	// send mail with defined transport object
	const info = await transporter.sendMail({
		from: '"Electro Hub" <no-reply@electrohub.com>', // sender address
		to: email, // list of receivers
		subject: subject, // Subject line
		html: html, // html body
	});

	return info;
});

module.exports = sendMail;
