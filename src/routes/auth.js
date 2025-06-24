const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refreshtoken", refreshToken);
router.get("/logout", logout);
module.exports = router;
