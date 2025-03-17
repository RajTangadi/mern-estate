import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js"; // Ensure this file exists

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    timestamp: Math.floor(Date.now() / 1000)  // Force fresh timestamp
  },
});

const upload = multer({ storage });

export default (req, res, next) => {
  console.log("Multer Middleware Triggered");
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(500).json({ error: "File upload failed" });
    }
    console.log("File uploaded successfully:", req.file);
    next();
  });
};
