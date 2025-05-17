const express = require("express");
const cors = require("cors");
const db = require("./config/dbConnect");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const initRoutes = require("./routes");

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cookieParser());
app.use(cors({
	origin: process.env.CLIENT_URL,
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect();
initRoutes(app);
app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});
