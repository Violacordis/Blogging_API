const mongoose = require("mongoose");
const logger = require("../logger/logger");
require("dotenv").config();

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
// const MONGODB_LOCALHOST_URL = process.env.MONGODB_LOCALHOST_URL;

const connectToMongoDB = () => {
  mongoose.connect(MONGODB_CONNECTION_STRING);

  mongoose.connection.on("connected", () => {
    logger.info("Successfully Connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    logger.error(err);
  });
};

module.exports = { connectToMongoDB };
