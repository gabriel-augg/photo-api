import { Router } from "express";
import { updateUser, deleteUser } from "../controllers/user.controller";
import { verifyToken } from "../utils/verifyToken";

const router = Router();

router.put("/:id/update", verifyToken, updateUser)
router.delete("/:id/delete", verifyToken, deleteUser)

export default router;