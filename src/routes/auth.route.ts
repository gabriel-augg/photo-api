import { Router } from "express";
import { signUp, signIn, google, signOut } from "../controllers/auth.controller";

const router = Router();

router.post("/sign-up", signUp)
router.post("/sign-in", signIn)
router.post("/google-sign-in", google)
router.post("/sign-out", signOut)
    

export default router;