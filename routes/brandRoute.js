import express from "express";
import {
  addBrand,
  deleteBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
} from "../controller/brandController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

export const brandRouter = express.Router();

// GET
brandRouter.get("/", getAllBrand);
brandRouter.get("/:id", getBrandById);

// POST
brandRouter.post("/", authMiddleware, isAdmin, addBrand);

// PUT
brandRouter.put("/:id", authMiddleware, isAdmin, updateBrand);

// DELETE
brandRouter.delete("/:id", authMiddleware, isAdmin, deleteBrand);
