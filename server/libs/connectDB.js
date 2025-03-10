import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};
