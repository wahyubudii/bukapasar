import express from "express";
import {
  getAllCategory,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controller/blogCatController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

export const blogCatRouter = express.Router();

// GET
blogCatRouter.get("/", getAllCategory);
blogCatRouter.get("/:id", getCategoryById);

// POST
blogCatRouter.post("/", authMiddleware, isAdmin, addCategory);

// PUT
blogCatRouter.put("/:id", authMiddleware, isAdmin, updateCategory);

// DELETE
blogCatRouter.delete("/:id", authMiddleware, isAdmin, deleteCategory);
