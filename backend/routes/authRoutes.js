import express from "express";
import {
  loginUser,
  signupUser,
  refreshAccessToken,
  logoutUser,
  googleAuth,
  resetPasswordConfirm,
  sendResetPasswordEmail,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/refresh_access_token", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/google", googleAuth);
router.post("/reset-password", sendResetPasswordEmail);
router.post("/reset-password/confirm", resetPasswordConfirm);

export default router;
