import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFound, errorHandler } from "./middlewares/errorHandling.js";
import { dbConnect } from "./config/dbConnect.js";
import { authRouter } from "./routes/userRoute.js";
import { productRouter } from "./routes/productRoute.js";
import { blogRouter } from "./routes/blogRoute.js";
import { productCatRouter } from "./routes/productCatRoute.js";
import { blogCatRouter } from "./routes/blogCatRoute.js";
import { brandRouter } from "./routes/brandRoute.js";
import { couponRouter } from "./routes/couponRoute.js";

// port
const port = process.env.PORT || 5000;

// rest object
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));

// database service
dbConnect();

// routes
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", productCatRouter);
app.use("/api/blogcategory", blogCatRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);

// server
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
