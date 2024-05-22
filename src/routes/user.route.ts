import { Router } from "express";
import { updateUser } from "../controllers/user.controller";
import { verifyToken } from "../utils/verifyToken";

const router = Router();

router.put("/:id/update", verifyToken, updateUser)

export default router;