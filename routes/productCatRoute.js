import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controller/productCatController.js";
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware.js";

export const productCatRouter = express.Router();

// GET
productCatRouter.get("/", getAllCategory);
productCatRouter.get("/:id", getCategoryById);

// POST
productCatRouter.post("/", authMiddleware, isAdmin, addCategory);

// PUT
productCatRouter.put("/:id", authMiddleware, isAdmin, updateCategory);

// DELETE
productCatRouter.delete("/:id", authMiddleware, isAdmin, deleteCategory);
