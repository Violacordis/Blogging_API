const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const tryCatchError = require("../utils/tryCatchError");
const AppError = require("../utils/appError");
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
  const allBlogsInDB = await blogModel
    .find({})
    .populate("user", { firstName: 1, lastName: 1, _id: 1 });

  // Displaying only published state blogs
  const publishedBlogs = allBlogsInDB.filter(
    (blog) => blog.state === "published"
  );

  res.status(200).json({
    status: "success",
    result: publishedBlogs.length,
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
  const blog = await foundBlog.populate("user", {
    firstName: 1,
    lastName: 1,
    _id: 1,
  });
  blog.read_count += 1;

  res.status(200).json({
    status: "success",
    blog,
  });
});
