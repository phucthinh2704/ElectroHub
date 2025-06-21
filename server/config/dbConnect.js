const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
	try {
		const conn = await mongoose.connect(MONGODB_URI, {
			maxPoolSize: 10, // Maintain up to 10 socket connections
			serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
			bufferCommands: false, // Disable mongoose buffering
			allowPartialTrustChain: true, // Allow partial trust chain for MongoDB Atlas
		});
		if (conn.connection.readyState === 1) {
			console.log(`Connect to MongoDB successfully`);
			// mongoose.set("strictQuery", false); // Set strictQuery to false
			// mongoose.set("autoIndex", false); // Disable autoIndex
			// mongoose.set("debug", false); // Disable mongoose debug mode

		} else {
			console.log("Connect to MongoDB failed");
		}
	} catch (error) {
		console.log("Connect to MongoDB failed");
		throw new Error(error);
	}
};

module.exports = { connect };
