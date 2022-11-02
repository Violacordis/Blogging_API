const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const tryCatchError = require("../utils/tryCatchError");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { readingTime } = require("../utils/readingTimeFunc");

exports.createBlog = tryCatchError(async (req, res, next) => {
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
  const newBlog = new blogModel({
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
  const savedBlog = await newBlog.save();
  // add the blog to the user's blogs array
  user.blogs = user.blogs.concat(savedBlog._id);
  // save the user
  await user.save();

  res.status(201).json({
    status: "success",
    message: "Blog created successfully",
    data: {
      blog: savedBlog,
    },
  });
});

exports.getAllBlogs = tryCatchError(async (req, res, next) => {
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
    const numBlogs = await blogModel
      .countDocuments()
      .where({ state: "published" });
    if (skip >= numBlogs) throw new AppError("This page does not exist", 404);
  }

  const publishedBlogs = await blogModel
    .find(query)
    .where({ state: "published" })
    .populate("user", { firstName: 1, lastName: 1, _id: 1 });

  // Displaying only published state blogs
  // const publishedBlogs = allBlogsInDB
  //   .find(query)
  //   .filter((blog) => blog.state === "published");

  res.status(200).json({
    status: "success",
    result: publishedBlogs.length,
    current_page: page,
    limit: limit,
    total_pages: Math.ceil(publishedBlogs.length / limit),
    data: {
      publishedBlogs,
    },
  });
});

exports.getBlog = tryCatchError(async (req, res, next) => {
  const { id } = req.params;
  // finding the blog by id
  const foundBlog = await blogModel.findById(id).where({ state: "published" });

  // if the blog is not found
  if (!foundBlog) {
    return next(new AppError("Blog not found", 404));
  }
  // if the blog is found
  const blog = await foundBlog
    .updateOne({ $inc: { read_count: 1 } })
    .populate("user", {
      firstName: 1,
      lastName: 1,
      _id: 1,
    });

  res.status(200).json({
    status: "success",
    blog,
  });
});

exports.getUserBlogs = tryCatchError(async (req, res, next) => {
  const user = req.user;

  // Fetching the blogs of the user
  const User = await userModel.findById(user.id);
  if (!User) return next(new AppError("User not found", 404));

  const foundUser = await User.populate("blogs");
  const blogs = foundUser.blogs;

  return res.status(200).json({
    status: "success",
    result: blogs.length,
    current_page: page,
    limit: limit,
    total_pages: Math.ceil(blogs.length / limit),
    data: {
      blogs: blogs,
    },
  });
});

exports.updateUserBlog = tryCatchError(async (req, res, next) => {
  const { title, description, state, tags, body } = req.body;
  // Getting the logged in user
  const user = req.user;
  // console.log(user.id);

  // Getting the blog id
  const blog = await blogModel.findById(req.params.id);
  // console.log(blog.user._id);

  //Checking if the logged in user is the owner of the blog in order to update it
  if (user.id !== blog.user._id.toString())
    return next(
      new AppError("You are not authorized to update this blog", 401)
    );
  // Updating the blog
  const Blog = await blogModel.findByIdAndUpdate(
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
      Blog,
    },
  });
});
