import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../public/images/"));
  },
  filename: (req, file, callback) => {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback({ message: "Unsupported file format" }, false);
  }
};

export const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});

export const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  const redirectProduct = path.join(process.cwd(), "/public/images/products/");
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${redirectProduct}${file.filename}`);
      // fs.unlinkSync(`${redirectProduct}${file.filename}`);
    })
  );
  next();
};

export const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  const redirectBlogs = path.join(process.cwd(), "/public/images/blogs/");
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${redirectBlogs}${file.filename}`);
      // fs.unlinkSync(`${redirectBlogs}${file.filename}`);
    })
  );
  next();
};
