const router = require("express").Router();
const { user } = require("../controllers");

router.post("/register", user.register);

module.exports = router;

