import User from "../models/User";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwtToken";
import { validateMongodbId } from "../utils/validateMongodbId";

export const signUp = expressAsyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, mobile, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (existingUser) {
    throw new Error("User already exists, login instead");
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = new User({
    firstname,
    lastname,
    email,
    mobile,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (err) {
    return console.log(err);
  }

  return res
    .status(201)
    .json({ message: "successfully create account", newUser });
});

export const signIn = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (!existingUser) {
    throw new Error("Incorrect Email");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    throw new Error("Incorrect Password");
  }

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

export const getAllUser = expressAsyncHandler(async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (err) {
    throw new Error("User not found");
  }

  return res.status(200).json({ users });
});

export const getUserById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let user;

  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);
  }

  validateMongodbId(id);

  res.status(200).json({ data: user });
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

  // if (!user) throw new Error("User not found");

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
