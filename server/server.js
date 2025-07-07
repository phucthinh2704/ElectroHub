const express = require("express");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./config/dbConnect");
const initRoutes = require("./routes");

const app = express();
const PORT = process.env.PORT || 8888;

app.use(
	compression({
		level: 6,
		filter: (req, res) => {
			return req.headers["x-no-compression"]
				? false
				: compression.filter(req, res);
		},
	})
);

const corsOptions = {
	origin: process.env.CLIENT_URL,
	credentials: true,
	optionsSuccessStatus: 200,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Requested-With",
		"Accept",
		"Origin",
	],
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect();
initRoutes(app);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
