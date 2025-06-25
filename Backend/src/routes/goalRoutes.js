import express from "express";
import { createGoal, getGoals } from "../controllers/goalController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createGoal);
router.get("/", authMiddleware, getGoals);

export default router;
