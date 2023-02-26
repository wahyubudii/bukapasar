import expressAsyncHandler from "express-async-handler";
import Blog from "../models/Blog";
import User from "../models/User";
import Product from "../models/Product";
import { validateMongodbId } from "../utils/validateMongodbId";

export const getAllBlog = expressAsyncHandler(async (req, res, next) => {
  let blogs;

  try {
    blogs = await Blog.find();
  } catch (err) {
    throw new Error(err);
  }

  res.json({ blogs });
});

export const getBlogById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);

  let updateViews;
  let blog;

  try {
    blog = await Blog.findById(id).populate("likes").populate("dislikes");
    updateViews = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
  } catch (err) {
    throw new Error(err);
  }

  res.json(blog);
});

export const addBlog = expressAsyncHandler(async (req, res, next) => {
  let newBlog;

  try {
    newBlog = await Blog.create(req.body);
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successfully create blog", blog: newBlog });
});

export const updateBlog = expressAsyncHandler(async (req, res, next) => {
  let blog;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  } catch (err) {
    console.log(err);
  }

  res.json({ message: "Successfully update blog", blog });
});

export const deleteBlog = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);

  let blog;
  try {
    blog = await Blog.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  res.json({ message: "Delete successfully" });
});

export const likeBlog = expressAsyncHandler(async (req, res, next) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);

  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // Find the login user
  const loginUserId = req?.user?._id;
  // Find if the user has liked the blog
  const isLiked = blog?.isLiked;
  // Find if the user has disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

export const dislikeBlog = expressAsyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);

  // Find the blog which you want to be liked
  const blog = await Blog.findById(blogId);
  // Find the login user
  const loginUserId = req?.user?._id;
  // Find if the user has liked the blog
  const isDisliked = blog?.isDisliked;
  // Find if the user has disliked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

export const uploadImage = expressAsyncHandler(async (req, res, next) => {
  console.log("zxczxc");
});
