const express = require("express");
const { chat, image, getChat } = require("../controllers/chatbot");
const checkLogin = require("../middlewares/checkLogin");
const {
  checkBalanceChat,
  kurangiBalanceChat,
  checkBalanceGambar,
  kurangiBalanceGambar,
} = require("../middlewares/business");
const router = express.Router();

router.post("/chat", [checkLogin, checkBalanceChat, kurangiBalanceChat], chat);
router.post(
  "/image",
  [checkLogin, checkBalanceGambar, kurangiBalanceGambar],
  image
);
router.get("/chat", [checkLogin], getChat);

module.exports = router;
