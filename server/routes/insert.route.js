const router = require("express").Router();
const { insert } = require("../controllers");


router.post("/product", insert.insertProduct);
router.post("/category", insert.insertCategory);

module.exports = router;
