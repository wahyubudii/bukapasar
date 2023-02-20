import mongoose from "mongoose";

export const dbConnect = () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log(`Database Successfully Connected`))
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("Database error");
  }
};
