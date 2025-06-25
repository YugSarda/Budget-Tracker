import express from "express";
import { predictExpenses } from "../controllers/aiController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/predict-expense", authMiddleware, predictExpenses);

export default router;
