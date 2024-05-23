import { Router } from 'express';
import { verifyToken } from '../utils/verifyToken';
import { createPhoto, deletePhoto, getAllPhotos, getPhoto, updatePhoto } from '../controllers/photo.controller';

const router = Router();

router.get('/', getAllPhotos);
router.get('/:id', getPhoto);
router.post('/create', verifyToken, createPhoto);
router.put('/:id', verifyToken, updatePhoto);
router.delete('/:id', verifyToken, deletePhoto);

export default router;
