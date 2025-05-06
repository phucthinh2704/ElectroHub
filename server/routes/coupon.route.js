const router = require("express").Router();
const { coupon } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.get("/", coupon.getAllCoupons);
router.get("/:id", coupon.getCouponById);

// Admin routes
router.post("/", [verifyAccessToken, isAdmin], coupon.createCoupon);
router.put("/:id", [verifyAccessToken, isAdmin] ,coupon.updateCoupon);
router.delete("/:id", [verifyAccessToken, isAdmin], coupon.deleteCoupon);

module.exports = router;

