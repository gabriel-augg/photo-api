import { Router } from "express";
import { verifyToken } from "../utils/verifyToken";
import { createPhoto, deletePhoto, getAllPhotos, getPhoto, updatePhoto } from "../controllers/photo.controller";


const router = Router();

router.get('/', getAllPhotos)
router.get('/:id/get-photo', getPhoto)
router.post('/create-photo', verifyToken, createPhoto)
router.put('/:id/update-photo', verifyToken, updatePhoto)
router.delete('/:id/delete-photo', verifyToken, deletePhoto)


export default router;
