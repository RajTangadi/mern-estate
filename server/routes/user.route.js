import { Router } from "express";
import { updateUser, deleteUser, getUserListings } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import uploadMiddleware from "../utils/uploadMiddleware.js";

const router = Router();

router.post("/update/:id", verifyToken, uploadMiddleware, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);

// getUserListings
export default router;
