const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const connectToMongoDB = () => {
  mongoose.connect(MONGODB_CONNECTION_STRING);

  mongoose.connection.on("connected", () => {
    console.log("Successfully Connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error Connecting to MongoDB", err);
  });
};
connectToMongoDB();

module.exports = connectToMongoDB;
