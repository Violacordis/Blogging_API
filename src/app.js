const express = require("express");
const { connectToMongoDB } = require("./db/db_connect");
const errorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const authRoute = require("./routes/authRoute");
const blogRoute = require("./routes/blogRoute");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
connectToMongoDB();

// This is to eanble the proxy in the app which is required for rate limiting on hosted servers eg Render, heroku etc. This is not required for local development
app.set("trust proxy", 1); // trust first proxy

// Adding middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Applying the rate limiting middleware to all requests
const limiter = rateLimit({
  windowMs: 0.5 * 60 * 1000, // 15 minutes
  max: 4, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);

// Adding security headers
app.use(helmet());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/blog", blogRoute);

app.get("/api/v1", (req, res) => {
  console.log(request.ip);
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
