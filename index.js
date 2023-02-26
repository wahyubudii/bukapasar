import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";
import bodyParser from "body-parser";
import { notFound, errorHandler } from "./middlewares/errorHandling";
import { dbConnect } from "./config/dbConnect";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import blogRouter from "./routes/blogRouter";

// port
const port = process.env.PORT || 4000;

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

// server
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
