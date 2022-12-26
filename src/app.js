const express = require("express");
const { connectToMongoDB } = require("./db/db_connect");
const errorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const authRoute = require("./routes/authRoute");
const blogRoute = require("./routes/blogRoute");
require("dotenv").config();

const app = express();
connectToMongoDB();

// Adding middlewares

app.use(express.json());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/blog", blogRoute);

app.get("/api/v1", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Welcome to my Blog Website",
  });
});

// catching all undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Page not found!`, 404));
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
