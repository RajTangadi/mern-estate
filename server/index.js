import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/connectDB.js";
import mongoose from "mongoose";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// console.log(mongoose.connection.readyState);
// console.log(mongoose.version);


app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
