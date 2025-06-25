const express = require("express");
const {
  addForum,
  updateForum,
  giveLike,
  giveReply,
  deleteForum,
  getAllForum,
} = require("../controllers/forum");
const checkLogin = require("../middlewares/checkLogin");
const upload = require("../middlewares/upload");
const checkOwner = require("../middlewares/checkOwner");
const checkRole = require("../middlewares/checkRole");
const router = express.Router();

router.post("/", [checkLogin, upload.single("forum_img")], addForum);
router.post("/like/:id", giveLike);
router.post("/reply/:id", [checkLogin], giveReply);
router.put(
  "/:id",
  [checkLogin, checkOwner, upload.single("forum_img")],
  updateForum
);
router.delete("/:id", [checkLogin, checkRole("admin")], deleteForum);
router.get("/", getAllForum);

module.exports = router;
