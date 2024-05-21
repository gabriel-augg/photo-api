import { Router } from "express";
import { signUp, signIn, google } from "../controllers/auth.controller";

const router = Router();

router.post("/sign-up", signUp)
router.post("/sign-in", signIn)
router.post("/google-sign-in", google)
    

export default router;