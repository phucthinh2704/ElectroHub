const router = require("express").Router();
const { user } = require("../controllers");
const { verifyAccessToken, isAdmin } = require("../middlewares/verify-token");

router.post("/register", user.register);
router.get("/auth-register/:token", user.authRegister);
router.post("/login", user.login);
router.get("/current", verifyAccessToken, user.getCurrent);
router.post("/refresh-token", user.refreshAccessToken);
router.post("/logout", user.logout);
router.get("/forgot-password", user.forgotPassword);
router.put("/reset-password/:token", user.resetPassword);
router.put("/current", verifyAccessToken, user.updateUser);
router.put("/address", verifyAccessToken, user.updateUserAddress);
router.put("/cart", verifyAccessToken, user.updateCart);

// Admin routes
router.get("/", [verifyAccessToken, isAdmin], user.getAllUsers);
router.delete("/:id", [verifyAccessToken, isAdmin], user.deleteUser);
router.put("/:id", [verifyAccessToken, isAdmin], user.updateUserByAdmin);

module.exports = router;

