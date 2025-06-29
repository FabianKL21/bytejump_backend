const express = require("express");
const {
  addPost,
  deletePost,
  updatePost,
  updateView,
  getPosts,
  getPostsByTitle,
  getPostNewest,
} = require("../controllers/post");
const upload = require("../middlewares/upload");
const checkLogin = require("../middlewares/checkLogin");
const checkRole = require("../middlewares/checkRole");
const router = express.Router();

router.post(
  "/",
  [checkLogin, checkRole("admin"), upload.single("post_banner")],
  addPost
);
router.delete("/:id", [checkLogin, checkRole("admin")], deletePost);
router.put("/view/:id", updateView);
router.put(
  "/:id",
  [checkLogin, checkRole("admin"), upload.single("post_banner")],
  updatePost
);
router.get("/", getPosts);
router.get("/newest", getPostNewest);
router.get("/:post_title", getPostsByTitle);
module.exports = router;
