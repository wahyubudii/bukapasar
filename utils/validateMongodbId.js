import mongoose from "mongoose";

export const validateMongodbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("User id not valid or not found");
};
