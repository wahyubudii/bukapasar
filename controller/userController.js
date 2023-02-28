import User from "../models/User";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwtToken";
import { generateRefreshToken } from "../config/refreshToken";
import { validateMongodbId } from "../utils/validateMongodbId";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "./emailController";

export const register = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (existingUser) {
    throw new Error("User already exists, login instead");
  }

  const newUser = new User(req.body);

  try {
    await newUser.save();
  } catch (err) {
    return console.log(err);
  }

  return res
    .status(201)
    .json({ message: "Successfully create account", newUser });
});

// Login by User
export const userLogin = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    throw new Error(err);
  }

  if (!existingUser) {
    throw new Error("Incorrect Email");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    throw new Error("Incorrect Password");
  }

  const refreshToken = await generateRefreshToken(existingUser?._id);
  const updateUser = await User.findByIdAndUpdate(
    existingUser?.id,
    {
      refreshToken,
    },
    { new: true }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });

  const data = {
    _id: existingUser?._id,
    firstname: existingUser?.firstname,
    lastname: existingUser?.lastname,
    email: existingUser?.email,
    mobile: existingUser?.mobile,
    token: generateToken(existingUser?._id),
  };

  return res.status(200).json({ message: "Login Successfully", data });
});

// Login by Admin
export const adminLogin = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await User.findOne({ email });
  } catch (err) {
    throw new Error(err);
  }

  if (existingAdmin.role !== "admin") throw new Error("Not Authorized");

  if (!existingAdmin) throw new Error("Incorrect Email");

  const isPasswordCorrect = bcrypt.compareSync(
    password,
    existingAdmin.password
  );

  if (!isPasswordCorrect) throw new Error("Incorrect Password");

  const refreshToken = await generateRefreshToken(existingAdmin?._id);
  const updateUser = await User.findByIdAndUpdate(
    existingAdmin?.id,
    {
      refreshToken,
    },
    { new: true }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 72 * 60 * 60 * 1000,
  });

  const data = {
    _id: existingAdmin?._id,
    firstname: existingAdmin?.firstname,
    lastname: existingAdmin?.lastname,
    email: existingAdmin?.email,
    mobile: existingAdmin?.mobile,
    token: generateToken(existingAdmin?._id),
  };

  return res.status(200).json({ message: "Login successfully admin", data });
});

export const handleRefreshToken = expressAsyncHandler(
  async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken)
      throw new Error("Refresh token not found in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh token matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something error with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  }
);

export const logout = expressAsyncHandler(async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("Refresh token not found in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

export const getAllUser = expressAsyncHandler(async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (err) {
    throw new Error(err);
  }

  return res.status(200).json({ users });
});

export const getUserById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);

  let user;

  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json(user);
});

export const deleteUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let user;

  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  validateMongodbId(id);

  res.status(200).json({ message: "Delete successfully" });
});

export const updateUser = expressAsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { firstname, lastname, email, mobile } = req.body;
  let user;

  try {
    user = await User.findByIdAndUpdate(
      _id,
      {
        firstname,
        lastname,
        email,
        mobile,
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }

  validateMongodbId(_id);

  res.status(200).json({ message: "Update successfully", user });
});

export const blockUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let block;
  try {
    block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }

  validateMongodbId(id);

  res.status(200).json({
    message: "User Blocked",
  });
});

export const unblockUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let block;
  try {
    block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
  } catch (err) {
    console.log(err);
  }

  validateMongodbId(id);

  res.status(200).json({
    message: "User Unblocked",
  });
});

export const updatePassword = expressAsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);

  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json({ message: "Successfully update password", updatePassword });
  } else {
    res.json(user);
  }
});

export const forgotPasswordToken = expressAsyncHandler(
  async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email!");

    try {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${resetToken}'>Click Here</>`;
      const data = {
        to: email,
        subject: "Forgot Password Link",
        text: "Hey User!",
        htm: resetURL,
      };
      sendEmail(data);
      res.json(resetToken);
    } catch (err) {
      throw new Error(err);
    }
  }
);

export const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Token expired, please try again later!");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ message: "Successfully reset password", user });
});

export const getWishlist = expressAsyncHandler(async (req, res, next) => {
  let user;
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    user = await User.findById(_id).populate("wishlist");
  } catch (err) {
    throw new Error(err);
  }
  res.json(user);
});

export const updateAddress = expressAsyncHandler(async (req, res, next) => {
  let newAddress;
  const { _id } = req.user;
  validateMongodbId(_id);

  try {
    newAddress = await User.findByIdAndUpdate(
      _id,
      { address: req?.body?.address },
      {
        new: true,
      }
    );
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successfully update address", newAddress });
});
