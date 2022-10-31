const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(authController.authenticate, blogController.createBlog);

router.route("/:id").get(blogController.getBlog);

module.exports = router;
