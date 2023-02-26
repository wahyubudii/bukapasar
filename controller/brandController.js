import expressAsyncHandler from "express-async-handler";
import Brand from "../models/Brand";
import { validateMongodbId } from "../utils/validateMongodbId";

export const getAllBrand = expressAsyncHandler(async (req, res, next) => {
  let category;

  try {
    category = await Brand.find();
  } catch (err) {
    throw new Error(err);
  }

  res.json(category);
});

export const getBrandById = expressAsyncHandler(async (req, res, next) => {
  let category;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    category = await Brand.findById(id);
  } catch (err) {
    throw new Error(err);
  }

  res.json(category);
});

export const addBrand = expressAsyncHandler(async (req, res, next) => {
  let newCategory;

  try {
    newCategory = await Brand.create(req.body);
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successfully added category", newCategory });
});

export const updateBrand = expressAsyncHandler(async (req, res, next) => {
  let category;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    category = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successfully update category", category });
});

export const deleteBrand = expressAsyncHandler(async (req, res, next) => {
  let category;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    category = await Brand.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successfully delete category" });
});
