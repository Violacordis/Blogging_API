const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("Starting my exam!!!");
  return res.status(200).json({
    status: "success",
    message: "Welcome to my Blog Website",
  });
});
module.exports = app;
