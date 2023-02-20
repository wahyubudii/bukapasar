import express from "express";
import {
  blockUser,
  deleteUser,
  getAllUser,
  getUserById,
  handleRefreshToken,
  logout,
  signIn,
  signUp,
  unblockUser,
  updateUser,
} from "../controller/userController";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";

const authRouter = express.Router();

// GET
authRouter.get("/", getAllUser);
authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/logout", logout);
authRouter.get("/:id", authMiddleware, isAdmin, getUserById);

// POST
authRouter.post("/register", signUp);
authRouter.post("/login", signIn);

// PUT
authRouter.put("/edit", authMiddleware, updateUser);
authRouter.put("/block/:id", authMiddleware, isAdmin, blockUser);
authRouter.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);

// DELETE
authRouter.delete("/:id", deleteUser);

export default authRouter;
