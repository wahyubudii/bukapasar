import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/userRoute";
import bodyParser from "body-parser";
import { notFound, errorHandler } from "./middlewares/errorHandling";
import { dbConnect } from "./config/dbConnect";

// port
const port = process.env.PORT || 4000;

// rest object
const app = express();

// middlewares
app.use(bodyParser.json());

// database servic
dbConnect();

// routes
app.use("/api/user", authRouter);

// server
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
