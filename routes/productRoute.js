import express from "express";
import {
  addProduct,
  addToWishlist,
  deleteProduct,
  getAllProduct,
  getProductById,
  rating,
  updateProduct,
} from "../controller/productController";
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware";

export const productRouter = express.Router();

// GET
productRouter.get("/", getAllProduct);
productRouter.get("/:id", getProductById);

// POST
productRouter.post("/", authMiddleware, isAdmin, addProduct);

// PUT
productRouter.put("/wishlist", authMiddleware, addToWishlist);
productRouter.put("/rating", authMiddleware, rating);
productRouter.put("/:id", authMiddleware, isAdmin, updateProduct);

// DELETE
productRouter.delete("/:id", authMiddleware, isAdmin, deleteProduct);
