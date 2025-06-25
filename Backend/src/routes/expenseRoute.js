// import express from 'express';
// import Expense from '../models/Expense.js';

// const router = express.Router();

// // Helper: Detect emotion from title/category
// const detectEmotion = (title, category) => {
//   const text = `${title} ${category}`.toLowerCase();
//   if (text.includes("gift") || text.includes("party") || text.includes("vacation")) return "happy";
//   if (text.includes("fine") || text.includes("late fee") || text.includes("penalty")) return "sad";
//   if (text.includes("doctor") || text.includes("hospital") || text.includes("emergency")) return "urgent";
//   if (text.includes("shopping") || text.includes("food delivery") || text.includes("online shopping")) return "impulsive";
//   return "neutral";
// };

// // POST: Create a new expense
// router.post('/', async (req, res) => {
//   try {
//     const { title, category, userId } = req.body;
    
//     // Validate required fields
//     if (!title || !category || !userId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const emotion = detectEmotion(title, category);
//     const expense = new Expense({ ...req.body, emotion });
//     await expense.save();
//     res.status(201).json(expense);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // PUT: Update expense
// router.put('/:id', async (req, res) => {
//   try {
//     const { title, category } = req.body;
//     const emotion = detectEmotion(title, category);
//     const updated = await Expense.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, emotion },
//       { new: true }
//     );
//     if (!updated) {
//       return res.status(404).json({ error: "Expense not found" });
//     }
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE: Remove expense
// router.delete('/:id', async (req, res) => {
//   try {
//     const deleted = await Expense.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ error: "Expense not found" });
//     }
//     res.json({ message: 'Expense deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET: Get all expenses for a user
// router.get('/:userId', async (req, res) => {
//   try {
//     const expenses = await Expense.find({ userId: req.params.userId }).sort({ date: -1 });
//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
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
