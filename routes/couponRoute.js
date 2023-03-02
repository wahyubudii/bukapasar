import express from "express";
import {
  addCoupon,
  deleteCoupon,
  getAllCoupon,
  getCouponById,
  updateCoupon,
} from "../controller/couponController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

export const couponRouter = express.Router();

// GET
couponRouter.get("/", getAllCoupon);
couponRouter.get("/:id", getCouponById);

// POST
couponRouter.post("/", authMiddleware, isAdmin, addCoupon);

// PUT
couponRouter.put("/:id", authMiddleware, isAdmin, updateCoupon);

// DELET
couponRouter.delete("/:id", authMiddleware, isAdmin, deleteCoupon);
