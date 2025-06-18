const express = require("express");
const { articlesRouter, chatBotRouter } = require("./src/routes");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
app.use(cookieParser());

app.use("/api/v1/chatbot", chatBotRouter);
app.use("/api/v1/articles", articlesRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
