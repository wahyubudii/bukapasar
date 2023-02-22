import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controller/productController";
import { isAdmin, authMiddleware } from "../middlewares/authMiddleware";

const productRouter = express.Router();

// GET
productRouter.get("/", getAllProduct);
productRouter.get("/:id", getProductById);

// POST
productRouter.post("/", authMiddleware, isAdmin, addProduct);

// PUT
productRouter.put("/:id", authMiddleware, isAdmin, updateProduct);

// DELETE
productRouter.delete("/:id", authMiddleware, isAdmin, deleteProduct);

export default productRouter;
