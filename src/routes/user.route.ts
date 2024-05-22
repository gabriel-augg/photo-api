import { Router } from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.controller";
import { verifyToken } from "../utils/verifyToken";

const router = Router();

router.get("/:id", getUser)
router.put("/:id/update", verifyToken, updateUser)
router.delete("/:id/delete", verifyToken, deleteUser)

export default router;