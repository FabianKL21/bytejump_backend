const express = require("express");
const {
  articlesRouter,
  chatBotRouter,
  postRouter,
  toDoListrouter,
  authRouter,
  userRouter,
  forumRouter,
} = require("./src/routes");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://bytejump.vercel.app"],
    credentials: true,
  })
);
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // domain frontend
res.setHeader('Access-Control-Allow-Credentials', 'true');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chatbot", chatBotRouter);
app.use("/api/v1/articles", articlesRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/todolist", toDoListrouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/forum", forumRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
