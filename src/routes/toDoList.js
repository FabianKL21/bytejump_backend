const express = require("express");
const {
  addToDoList,
  updateToDoList,
  deleteToDoList,
  getAll,
  getByDesc,
} = require("../controllers/toDoList");
const checkLogin = require("../middlewares/checkLogin");
const checkRole = require("../middlewares/checkRole");
const router = express.Router();

router.post("/", [checkLogin, checkRole("admin")], addToDoList);
router.put("/:id", [checkLogin, checkRole("admin")], updateToDoList);
router.delete("/:id", [checkLogin, checkRole("admin")], deleteToDoList);
router.get("/", [checkLogin, checkRole("admin")], getAll);
router.get("/:desc", [checkLogin, checkRole("admin")], getByDesc);
module.exports = router;
