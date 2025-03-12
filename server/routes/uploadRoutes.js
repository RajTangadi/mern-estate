import express from 'express';
import { uploadMiddleware, uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/upload', uploadMiddleware, uploadImage);

export default router;

