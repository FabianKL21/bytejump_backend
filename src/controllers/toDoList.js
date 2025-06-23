const prisma = require("../../prisma/prisma");

const addToDoList = async (req, res) => {
  try {
    const { todolist_desc } = req.body;

    const result = await prisma.todolist.create({
      data: {
        todolist_desc: todolist_desc,
        todolist_status: "Not Done",
        todolist_worker: null,
        deletedAt: null,
      },
    });

    return res
      .status(201)
      .json({ message: "Success Add Task", result: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed To Add Task" });
  }
};

const updateToDoList = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.todolist.findFirst({ where: { id: id } });

    if (!task) {
      return res.status(404).json({ message: "The task is not found" });
    }

    let updatedTask;
    if (task.todolist_worker !== null) {
      updatedTask = await prisma.todolist.update({
        where: { id: id },
        data: { todolist_status: "Done", deletedAt: new Date() },
      });
    } else {
      updatedTask = await prisma.todolist.update({
        where: { id: id },
        data: { todolist_status: "Process", todolist_worker: "admin" },
      });
    }

    return res
      .status(200)
      .json({ message: "Success Update Task", result: updatedTask });
  } catch (error) {
    return res.status(500).json({ message: "Failed To Update Task" });
  }
};
const deleteToDoList = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.todolist.findFirst({ where: { id: id } });
    if (!task) {
      return res.status(404).json({ message: "The task is not found" });
    }

    const result = await prisma.todolist.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });

    return res
      .status(200)
      .json({ message: "Success Delete Task", result: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed To Delete Task" });
  }
};
const getAll = async (req, res) => {
  try {
    const { status, worker } = req.query;
    let where = {};
    if (status) {
      where = { ...where, todolist_status: status };
    }
    if (worker) {
      where = {
        ...where,
        todolist_worker: { contains: worker, mode: "insensitive" },
      };
    }

    const result = await prisma.todolist.findMany({ where: where });
    return res.status(200).json({ message: "Success Get Tasks", result });
  } catch (error) {
    return res.status(500).json({ message: "Failed To Get Task" });
  }
};
const getByDesc = async (req, res) => {
  try {
    const { desc } = req.params;
    const result = await prisma.todolist.findMany({
      where: { todolist_desc: { contains: desc, mode: "insensitive" } },
    });

    return res
      .status(200)
      .json({ message: "Success Get All Task based on desc ", result: result });
  } catch (error) {
    return res.status(500).json({ message: "Failed To Get Task" });
  }
};

module.exports = {
  addToDoList,
  updateToDoList,
  deleteToDoList,
  getAll,
  getByDesc,
};
