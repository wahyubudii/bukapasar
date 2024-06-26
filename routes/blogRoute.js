import express from "express";
import {
  addBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlog,
  getBlogById,
  likeBlog,
  updateBlog,
  uploadImage,
} from "../controller/blogController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { blogImgResize, uploadPhoto } from "../middlewares/uploadImages.js";

export const blogRouter = express.Router();

// GET
blogRouter.get("/", getAllBlog);
blogRouter.get("/:id", getBlogById);

// POST
blogRouter.post("/", authMiddleware, isAdmin, addBlog);

// PUT
blogRouter.put("/likes", authMiddleware, isAdmin, likeBlog);
blogRouter.put("/dislikes", authMiddleware, isAdmin, dislikeBlog);
blogRouter.put("/:id", authMiddleware, isAdmin, updateBlog);
blogRouter.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImage
);

// DELETE
blogRouter.delete("/:id", authMiddleware, isAdmin, deleteBlog);
