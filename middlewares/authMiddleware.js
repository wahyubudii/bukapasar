import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new Error("Token not found");

  const authSplit = authorization.split(" ");
  const [authType, authToken] = authSplit;

  if (authType !== "Bearer") throw new Error("Please use Barer to auth");

  try {
    const decode = jwt.verify(authToken, process.env.JWT_SECRET);
    const user = await User.findById(decode?.id);
    req.user = user;
    next();
  } catch (err) {
    throw new Error("Not Authorized token expired, Please login again");
  }
});

export const isAdmin = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.user;
  let adminUser;
  try {
    adminUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (adminUser.role !== "admin") {
    throw new Error("You are not admin");
  } else {
    next();
  }
});
