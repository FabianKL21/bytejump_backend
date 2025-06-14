const express = require("express");
const {
  getTags,
  getArticles,
  getArticlesTop,
} = require("../controllers/articles");
const router = express.Router();

router.get("/tags", getTags);
router.get("/", getArticles);
router.get("/:top", getArticlesTop);

module.exports = router;
