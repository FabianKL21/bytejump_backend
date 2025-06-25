const articlesRouter = require("./articles");
const authRouter = require("./auth");
const chatBotRouter = require("./chatbot");
const forumRouter = require("./forum");
const postRouter = require("./post");
const toDoListrouter = require("./toDoList");
const userRouter = require("./user");

module.exports = {
  articlesRouter,
  chatBotRouter,
  postRouter,
  toDoListrouter,
  authRouter,
  userRouter,
  forumRouter,
};
