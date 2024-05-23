import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import { createPhoto, deletePhoto, getAllPhotos, getPhoto } from "../controllers/photo.controller";


const router = Router();

router.get('/', getAllPhotos)
router.get('/:id/get-photo', getPhoto)
router.post('/create-photo', verifyToken, createPhoto)
router.delete('/:id/delete-photo', verifyToken, deletePhoto)


export default router;
