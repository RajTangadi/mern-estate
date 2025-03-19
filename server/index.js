import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./libs/connectDB.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.router.js";
import listingRouter from "./routes/listing.route.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
// import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// console.log(mongoose.connection.readyState);
// console.log(mongoose.version);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

//middleware
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
// app.use('/api/user', uploadRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
  connectDB();
  // mongoose.disconnect();
  console.log(`Server is running on port ${PORT}`);
});
