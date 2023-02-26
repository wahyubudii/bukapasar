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
  signIn,
  signUp,
  unblockUser,
  updatePassword,
  updateUser,
} from "../controller/userController";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";

const authRouter = express.Router();

// GET
authRouter.get("/", getAllUser);
authRouter.get("/:id", authMiddleware, isAdmin, getUserById);
authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/logout", logout);

// POST
authRouter.post("/register", signUp);
authRouter.post("/login", signIn);
authRouter.post("/forgot-password-token", forgotPasswordToken);

// PUT
authRouter.put("/edit", authMiddleware, updateUser);
authRouter.put("/block/:id", authMiddleware, isAdmin, blockUser);
authRouter.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);
authRouter.put("/password", authMiddleware, updatePassword);
authRouter.put("/reset-password/:token", resetPassword);

// DELETE
authRouter.delete("/:id", deleteUser);

export default authRouter;
