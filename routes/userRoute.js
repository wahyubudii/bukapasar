import express from "express";
import {
  blockUser,
  deleteUser,
  forgotPasswordToken,
  getAllUser,
  getUserById,
  handleRefreshToken,
  logout,
  resetPassword,
  userLogin,
  register,
  unblockUser,
  updatePassword,
  updateUser,
  adminLogin,
  getWishlist,
  updateAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrdersUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controller/userController";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";

export const authRouter = express.Router();

// GET
authRouter.get("/", getAllUser);
authRouter.get("/wishlist", authMiddleware, getWishlist);
authRouter.get("/cart", authMiddleware, getUserCart);
authRouter.get("/get-orders", authMiddleware, getOrdersUser);
authRouter.get("/get-orders/:id", authMiddleware, isAdmin, getOrderById);
authRouter.get("/get-all-orders", authMiddleware, isAdmin, getAllOrders);
authRouter.get("/:id", authMiddleware, isAdmin, getUserById);
authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/logout", logout);

// POST
authRouter.post("/register", register);
authRouter.post("/login", userLogin);
authRouter.post("/admin-login", adminLogin);
authRouter.post("/forgot-password-token", forgotPasswordToken);
authRouter.post("/cart", authMiddleware, userCart);
authRouter.post("/cart/apply-coupon", authMiddleware, applyCoupon);
authRouter.post("/cart/cash-order", authMiddleware, createOrder);

// PUT
authRouter.put("/edit", authMiddleware, updateUser);
authRouter.put("/block/:id", authMiddleware, isAdmin, blockUser);
authRouter.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);
authRouter.put("/password", authMiddleware, updatePassword);
authRouter.put("/reset-password/:token", resetPassword);
authRouter.put("/update-address", authMiddleware, updateAddress);
authRouter.put(
  "/order/update-status/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);

// DELETE
authRouter.delete("/empty-cart", authMiddleware, emptyCart);
authRouter.delete("/:id", deleteUser);
