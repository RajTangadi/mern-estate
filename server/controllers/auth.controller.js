import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username, email and password",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "User already exists", success: false });
  }

  // Hash the password
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password,salt);
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  try {

    await newUser.save();
    res
      .status(201)
      .json({ message: "user created successfully", newUser, status: true });
      
  } catch (error) {
    res.status(500).json({ error: error.message, status: false });
  }
};
