const express = require("express");
const { chat, image } = require("../controllers/chatbot");
const checkLogin = require("../middlewares/checkLogin");
const router = express.Router();

router.post("/chat", [checkLogin], chat);
router.post("/image", [checkLogin], image);

module.exports = router;
