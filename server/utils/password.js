const bcrypt = require("bcrypt");
const crypto = require("crypto");

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

const createPasswordResetToken = () => {
	// Generate a random token
	const resetToken = crypto.randomBytes(32).toString("hex");

   const tokenSaveDb = crypto.createHash("sha256").update(resetToken).digest("hex");

	return [resetToken, tokenSaveDb];
};

module.exports = {
	hashPassword,
	createPasswordResetToken,
};
