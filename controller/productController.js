import Product from "../models/Product";
import expressAsyncHandler from "express-async-handler";
import { validateMongodbId } from "../utils/validateMongodbId";
import slugify from "slugify";
import User from "../models/User";
import { cloudinaryUploadImg } from "../utils/cloudinary";
import fs from "fs";

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
  let product;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    product = await Product.findById(id);
  } catch (err) {
    console.log(err);
  }

  res.status(200).json(product);
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
  let updateProduct;

  const { id } = req.params;
  validateMongodbId(id);

  const { title } = req.body;

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
  let product;
  const { id } = req.params;
  validateMongodbId(id);

  try {
    product = await Product.findByIdAndDelete(id);
  } catch (err) {
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Successfully delete product" });
});

export const addToWishlist = expressAsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (err) {
    throw new Error(err);
  }
});

export const rating = expressAsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;

  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingsum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (err) {
    throw new Error(err);
  }
});

export const uploadImages = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    res.json(findProduct);
  } catch (err) {
    throw new Error(err);
  }
});
