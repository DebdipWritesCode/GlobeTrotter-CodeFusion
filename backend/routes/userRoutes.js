import express from "express";
import { completeProfile } from "../controllers/userController.js";

const router = express.Router();

router.put("/:id/profile", completeProfile);

export default router;