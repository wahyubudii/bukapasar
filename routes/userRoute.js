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
} from "../controller/userController";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";

export const authRouter = express.Router();

// GET
authRouter.get("/", getAllUser);
authRouter.get("/wishlist", authMiddleware, getWishlist);
authRouter.get("/:id", authMiddleware, isAdmin, getUserById);
authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/logout", logout);

// POST
authRouter.post("/register", register);
authRouter.post("/login", userLogin);
authRouter.post("/admin-login", adminLogin);
authRouter.post("/forgot-password-token", forgotPasswordToken);

// PUT
authRouter.put("/edit", authMiddleware, updateUser);
authRouter.put("/block/:id", authMiddleware, isAdmin, blockUser);
authRouter.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);
authRouter.put("/password", authMiddleware, updatePassword);
authRouter.put("/reset-password/:token", resetPassword);
authRouter.put("/update-address", authMiddleware, updateAddress);

// DELETE
authRouter.delete("/:id", deleteUser);
