const router = require("express").Router();
const { order } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.post("/", verifyAccessToken, order.createNewOrder);

module.exports = router;
