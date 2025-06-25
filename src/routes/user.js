const express = require("express");
const {
  updatePersonalData,
  updateProfpic,
  topup,
} = require("../controllers/user");
const checkLogin = require("../middlewares/checkLogin");
const upload = require("../middlewares/upload");
const router = express.Router();

router.put("/personal", [checkLogin], updatePersonalData);
router.put("/profpic", [checkLogin, upload.single("profpic")], updateProfpic);
router.post("/topup", [checkLogin], topup);
module.exports = router;
