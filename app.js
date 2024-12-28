const express = require("express");
const app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

const userRouter = require("./routers/user_router");
app.use("/ur",userRouter);

const adminRouter = require("./routers/admin_router");
app.use("/ad",adminRouter);

module.exports = app;