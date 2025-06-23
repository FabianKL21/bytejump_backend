const express = require("express");
const {
  addToDoList,
  updateToDoList,
  deleteToDoList,
  getAll,
  getByDesc,
} = require("../controllers/toDoList");
const router = express.Router();

router.post("/", addToDoList);
router.put("/:id", updateToDoList);
router.delete("/:id", deleteToDoList);
router.get("/", getAll);
router.get("/:desc", getByDesc);
module.exports = router;
