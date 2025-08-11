import express from "express";
import {getUserById, updateUser, getUserTrips} from "../controllers/userController.js";


const router = express.Router();

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.get("/:id/trips", getUserTrips);


export default router;