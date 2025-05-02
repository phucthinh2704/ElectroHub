const router = require("express").Router();
const { user } = require("../controllers");
const { verifyAccessToken } = require("../middlewares/verify-token");

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/current", verifyAccessToken, user.getCurrent);
router.post("/refresh-token", user.refreshAccessToken);
router.post("/logout", user.logout);
router.get("/forgot-password", user.forgotPassword);
router.put("/reset-password/:token", user.resetPassword);

module.exports = router;

