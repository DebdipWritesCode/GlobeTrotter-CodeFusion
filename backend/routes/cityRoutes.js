import express from "express";
import {
  createCity,
  updateCity,
  deleteCity,
  getCities,
  getCity
} from "../controllers/cityController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", getCities);
router.get("/:id", getCity);

router.post("/", authenticate, createCity);
router.put("/:id", authenticate,  updateCity);
router.delete("/:id", authenticate,  deleteCity);

export default router;
