const express = require("express");
const { chat, image } = require("../controllers/chatbot");
const router = express.Router();

router.post("/chat", chat);
router.post("/image", image);

module.exports = router;
