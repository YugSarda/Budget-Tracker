
import express from "express";
import {
  createExpense,
  getExpenses,
  getSummary,
} from "../controllers/expenseController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/summary", authMiddleware, getSummary);

export default router;
