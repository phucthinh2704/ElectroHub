const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
	try {
		const conn = await mongoose.connect(MONGODB_URI);
		if (conn.connection.readyState === 1) {
			console.log(`Connect to MongoDB successfully`);
		} else {
			console.log("Connect to MongoDB failed");
		}
	} catch (error) {
		console.log("Connect to MongoDB failed");
		throw new Error(error);
	}
};

module.exports = { connect };
