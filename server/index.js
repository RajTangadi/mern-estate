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
app.use('/user', userRouter);
app.use('/api/auth',authRouter);




app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
