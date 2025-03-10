import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/connectDB.js";
import userRouter from "./routes/user.route.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// console.log(mongoose.connection.readyState);
// console.log(mongoose.version);

//middleware
app.use('/user', userRouter);



app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
