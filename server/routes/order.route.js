const router = require("express").Router();
const { order } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.get("/", verifyAccessToken, order.getUserOrder);
router.get("/admin", [verifyAccessToken, isAdmin], order.getAllOrders);
router.post("/", verifyAccessToken, order.createNewOrder);
router.put("/status/:orderId", [verifyAccessToken, isAdmin], order.updateStatusOrder);

module.exports = router;
