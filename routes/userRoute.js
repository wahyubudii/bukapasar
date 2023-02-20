import express from "express";
import {
  blockUser,
  deleteUser,
  getAllUser,
  getUserById,
  signIn,
  signUp,
  unblockUser,
  updateUser,
} from "../controller/userController";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.get("/", getAllUser);
authRouter.get("/:id", authMiddleware, isAdmin, getUserById);
authRouter.post("/register", signUp);
authRouter.post("/login", signIn);
authRouter.delete("/:id", deleteUser);
authRouter.put("/edit", authMiddleware, updateUser);
authRouter.put("/block/:id", authMiddleware, isAdmin, blockUser);
authRouter.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);

export default authRouter;
