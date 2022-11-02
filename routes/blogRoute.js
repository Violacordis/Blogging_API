const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(blogController.getAllArticles)
  .post(authController.authenticate, blogController.createArticle);

router.route("/:id").get(blogController.getArticle);

router
  .route("/userArticles/:id")
  .get(authController.authenticate, blogController.getUserArticle)
  .put(authController.authenticate, blogController.updateUserArticle)
  .delete(authController.authenticate, blogController.deleteUserArticle);

module.exports = router;
