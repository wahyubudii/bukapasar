import expressAsyncHandler from "express-async-handler";
import Coupon from "../models/Coupon";
import { validateMongodbId } from "../utils/validateMongodbId";

export const getAllCoupon = expressAsyncHandler(async (req, res, next) => {
  let coupon;

  try {
    coupon = await Coupon.find();
  } catch (err) {
    throw new Error(err);
  }

  res.json(coupon);
});

export const getCouponById = expressAsyncHandler(async (req, res, next) => {
  let coupon;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    coupon = await Coupon.findById(id);
  } catch (err) {
    throw new Error(err);
  }

  res.json(coupon);
});

export const addCoupon = expressAsyncHandler(async (req, res, next) => {
  let newCoupon;

  try {
    newCoupon = await Coupon.create(req.body);
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successully added coupon", newCoupon });
});

export const updateCoupon = expressAsyncHandler(async (req, res, next) => {
  let coupon;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successully update coupon", coupon });
});

export const deleteCoupon = expressAsyncHandler(async (req, res, next) => {
  let coupon;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    coupon = await Coupon.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successully delete coupon", coupon });
});
