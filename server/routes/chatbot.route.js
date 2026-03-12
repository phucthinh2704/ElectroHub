const router = require("express").Router();
const { chatbot } = require("../controllers");

router.post("/ask", chatbot.askChatbot);

module.exports = router;