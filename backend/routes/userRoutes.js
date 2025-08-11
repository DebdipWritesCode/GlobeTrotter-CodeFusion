import express from "express";
import {
  getUserById,
  updateUser,
  getUserTrips,
  completeProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.get("/:id/trips", getUserTrips);
router.put("/:id/profile", completeProfile);

export default router;
