const express = require("express");
const { addForum } = require("../controllers/forum");
const router = express.Router();

router.post("/forum", addForum);

module.exports = router;
