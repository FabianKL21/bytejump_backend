const express = require("express");
const {
  articlesRouter,
  chatBotRouter,
  postRouter,
  toDoListrouter,
} = require("./src/routes");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:5173", "https://bytejump.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
app.use(cookieParser());

app.use("/api/v1/chatbot", chatBotRouter);
app.use("/api/v1/articles", articlesRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/todolist", toDoListrouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
