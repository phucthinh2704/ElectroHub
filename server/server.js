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

app.all("*", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
});

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect();
initRoutes(app);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
