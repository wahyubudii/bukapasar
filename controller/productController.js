import Product from "../models/Product";
import expressAsyncHandler from "express-async-handler";
import { validateMongodbId } from "../utils/validateMongodbId";
import slugify from "slugify";

export const getAllProduct = expressAsyncHandler(async (req, res, next) => {
  let product;

  try {
    // Fitering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((value) => delete queryObj[value]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This page doesn't exists");
    }

    product = await query;
  } catch (err) {
    throw new Error(err);
  }

  res.status(200).json({ product });
});

export const getProductById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let product;

  try {
    product = await Product.findById(id);
  } catch (err) {
    console.log(err);
  }

  validateMongodbId(id);

  res.status(200).json({ product });
});

export const addProduct = expressAsyncHandler(async (req, res, next) => {
  let { title } = req.body;
  let newProduct;
  try {
    if (title) {
      req.body.slug = slugify(title);
    }
    newProduct = await Product.create(req.body);
  } catch (err) {
    throw new Error(err);
  }

  return res
    .status(201)
    .json({ message: "successfully create product", product: newProduct });
});

export const updateProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  let updateProduct;

  try {
    if (title) {
      req.body.slug = slugify(title);
    }
    updateProduct = await Product.findOneAndUpdate(id, req.body, { new: true });
  } catch (err) {
    throw new Error(err);
  }

  res
    .status(200)
    .json({ message: "successfully update product", updateProduct });
});

export const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let existingProduct;
  try {
    existingProduct = await Product.findByIdAndDelete(id);
  } catch (err) {
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Successfully delete product" });
});
