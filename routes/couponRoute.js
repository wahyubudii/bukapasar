import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
import {
  addCoupon,
  deleteCoupon,
  getAllCoupon,
  getCouponById,
  updateCoupon,
} from "../controller/couponController";

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
