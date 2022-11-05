const mongoose = require("mongoose");
const User = require("./userModel");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide the title"],
      unique: [true, "The title name already exists"],
    },
    description: {
      type: String,
    },
    author: {
      type: String,
      required: [true, "Please provide the author"],
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: String,
      required: [true, "Please provide the reading time"],
    },
    tags: {
      type: [String],
      required: [true, "Please provide the tags"],
    },
    body: {
      type: String,
      required: [true, "Please provide the body"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
