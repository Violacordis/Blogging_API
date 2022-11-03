const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const tryCatchError = require("../utils/tryCatchError");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { readingTime } = require("../utils/readingTimeFunc");

exports.createArticle = tryCatchError(async (req, res, next) => {
  const { title, description, state, tags, body } = req.body;

  if (!title || !description || !state || !tags || !body) {
    return next(new AppError("Please provide all the required fields", 400));
  }
  // find the user who is creating the blog
  const user = await userModel.findById(req.user._id);
  // console.log(req.user._id);

  const time = readingTime(body);
  const reading_time = `${time} min read`;

  // create the blog
  const newArticle = new blogModel({
    title: title,
    description: description,
    author: `${user.firstName} ${user.lastName}`,
    reading_time: reading_time,
    state: state,
    tags: tags,
    body: body,
    user: user._id,
  });

  // save the blog
  const savedArticle = await newArticle.save();
  // add the blog to the user's blogs array
  user.articles = user.articles.concat(savedArticle._id);
  // save the user
  await user.save();

  res.status(201).json({
    status: "success",
    message: "Article created successfully",
    data: {
      blog: savedArticle,
    },
  });
});

exports.getAllArticles = tryCatchError(async (req, res, next) => {
  const queryObj = { ...req.query };

  // Filtering
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  let query = blogModel.find(queryObj);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt"); // default sorting : starting from the most recent
  }

  // Pagination
  const page = req.query.page * 1 || 1; // convert to number and set default value to 1
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numArticles = await blogModel
      .countDocuments()
      .where({ state: "published" });
    if (skip >= numArticles)
      throw new AppError("This page does not exist", 404);
  }

  const publishedArticles = await blogModel
    .find(query)
    .where({ state: "published" })
    .populate("user", { firstName: 1, lastName: 1, _id: 1 });

  // Displaying only published state blogs
  // const publishedBlogs = allBlogsInDB
  //   .find(query)
  //   .filter((blog) => blog.state === "published");

  res.status(200).json({
    status: "success",
    result: publishedArticles.length,
    current_page: page,
    limit: limit,
    total_pages: Math.ceil(publishedArticles.length / limit),
    data: {
      publishedArticles,
    },
  });
});

exports.getArticle = tryCatchError(async (req, res, next) => {
  const { id } = req.params;
  // finding the blog by id
  const article = await blogModel
    .findById(id)
    .where({ state: "published" })
    .populate("user", { firstName: 1, lastName: 1, _id: 1 });

  // if the blog is not found
  if (!article) {
    return next(new AppError("Article not found", 404));
  }
  // Update the read_count
  article.read_count += 1;
  // save to the database
  article.save();

  res.status(200).json({
    status: "success",
    article,
  });
});

exports.getUserArticle = tryCatchError(async (req, res, next) => {
  const user = req.user;
  // console.log(user.id);

  // Fetching the user articles with user id
  const User = await userModel.findById(user.id).populate("articles");

  // console.log(User);
  const articles = User.articles;

  return res.status(200).json({
    status: "success",
    result: articles.length,
    data: {
      articles: articles,
    },
  });
});

exports.updateUserArticle = tryCatchError(async (req, res, next) => {
  const { title, description, state, tags, body } = req.body;
  // Getting the logged in user
  const user = req.user;
  // console.log(user.id);

  // Getting the blog id
  const article = await blogModel.findById(req.params.id);
  // console.log(article.user._id);

  //Checking if the logged in user is the owner of the blog in order to update it
  if (user.id !== article.user._id.toString())
    return next(
      new AppError("You are not authorized to update this article", 401)
    );
  // Updating the blog
  const updatedArticle = await blogModel.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: title,
        description: description,
        state: state,
        tags: tags,
        body: body,
      },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedArticle,
    },
  });
});

exports.deleteUserArticle = tryCatchError(async (req, res, next) => {
  const user = req.user;
  const article = await blogModel.findById(req.params.id);

  if (user.id !== article.user._id.toString())
    return next(
      new AppError("You are not authorized to delete this article", 401)
    );

  await blogModel.findByIdAndDelete(req.params.id);

  console.log("Article deleted successfully");
  res.status(204).json({
    status: "success",
  });
});
