import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controller/productCatController";
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware";

const productCatRoute = express.Router();

// GET
productCatRoute.get("/", getAllCategory);
productCatRoute.get("/:id", getCategoryById);

// POST
productCatRoute.post("/", authMiddleware, isAdmin, addCategory);

// PUT
productCatRoute.put("/:id", authMiddleware, isAdmin, updateCategory);

// DELETE
productCatRoute.delete("/:id", authMiddleware, isAdmin, deleteCategory);

export default productCatRoute;
