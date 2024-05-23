import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import { createPhoto } from "../controllers/photo.controller";


const router = Router();

router.post('/create-photo', verifyToken, createPhoto)

export default router;
