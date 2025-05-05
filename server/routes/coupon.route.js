const router = require("express").Router();
const { coupon } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.get("/", coupon.getAllBrands);
router.get("/:id", coupon.getBrandById);

// Admin routes
router.post("/", [verifyAccessToken, isAdmin], coupon.createBrand);
router.put("/:id", [verifyAccessToken, isAdmin] ,coupon.updateBrand);
router.delete("/:id", [verifyAccessToken, isAdmin], coupon.deleteBrand);

module.exports = router;

