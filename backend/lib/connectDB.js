import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
