import express from "express";
import { loginUser, signupUser, refreshAccessToken, logoutUser, googleAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/refresh_access_token", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/google", googleAuth);

export default router;
