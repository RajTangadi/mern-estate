import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/connectDB.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.router.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// console.log(mongoose.connection.readyState);
// console.log(mongoose.version);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware
app.use("/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
