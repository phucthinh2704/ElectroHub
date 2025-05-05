const router = require("express").Router();
const { brand } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.get("/", brand.getAllBrands);
router.get("/:id", brand.getBrandById);

// Admin routes
router.post("/", [verifyAccessToken, isAdmin], brand.createBrand);
router.put("/:id", [verifyAccessToken, isAdmin] ,brand.updateBrand);
router.delete("/:id", [verifyAccessToken, isAdmin], brand.deleteBrand);

module.exports = router;

