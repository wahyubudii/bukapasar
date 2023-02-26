import expressAsyncHandler from "express-async-handler";
import ProductCategory from "../models/ProductCat";
import { validateMongodbId } from "../utils/validateMongodbId";

export const getAllCategory = expressAsyncHandler(async (req, res, next) => {
  let category;

  try {
    category = await ProductCategory.find();
  } catch (err) {
    throw new Error(err);
  }

  res.json(category);
});

export const getCategoryById = expressAsyncHandler(async (req, res, next) => {
  let category;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    category = await ProductCategory.findById(id);
  } catch (err) {
    throw new Error(err);
  }

  res.json(category);
});

export const addCategory = expressAsyncHandler(async (req, res, next) => {
  let newCategory;

  try {
    newCategory = await ProductCategory.create(req.body);
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successfully added category", newCategory });
});

export const updateCategory = expressAsyncHandler(async (req, res, next) => {
  let category;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    category = await ProductCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successfully update category", category });
});

export const deleteCategory = expressAsyncHandler(async (req, res, next) => {
  let category;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    category = await ProductCategory.findByIdAndDelete(id);
  } catch (err) {
    throw new Error(err);
  }

  res.json({ message: "Successfully delete category" });
});
