import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Helper: Detect emotion from title/category
const detectEmotion = (title, category) => {
  const text = `${title} ${category}`.toLowerCase();

  if (text.includes("gift") || text.includes("party") || text.includes("vacation")) return "happy";
  if (text.includes("fine") || text.includes("late fee") || text.includes("penalty")) return "sad";
  if (text.includes("doctor") || text.includes("hospital") || text.includes("emergency")) return "urgent";
  if (text.includes("shopping") || text.includes("food delivery") || text.includes("online shopping")) return "impulsive";
  return "neutral";
};

// POST: Create a new expense with emotion
router.post('/', async (req, res) => {
  try {
    const { title, category } = req.body;
    const emotion = detectEmotion(title, category);
    const expense = new Expense({ ...req.body, emotion });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update expense
router.put('/:id', async (req, res) => {
  try {
    const { title, category } = req.body;
    const emotion = detectEmotion(title, category);
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { ...req.body, emotion },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove expense
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get all expenses for a user (just array)
router.get('/:userId', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(expenses); // ✅ return plain array only
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) GET: Smart insights for dashboard
router.get('/analysis/:userId', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId });

    let total = 0;
    const monthlySpending = {};
    expenses.forEach(exp => {
      total += exp.amount;
      const month = new Date(exp.date).getMonth();
      monthlySpending[month] = (monthlySpending[month] || 0) + exp.amount;
    });

    const avgBurnRate = total / (Object.keys(monthlySpending).length || 1);
    const today = new Date();
    const daysLeft = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();
    const prediction = avgBurnRate > 0
      ? `You may run out of money in ${Math.round(30 * 1000 / avgBurnRate)} days at current pace.`
      : "Not enough data to predict.";

    const leaks = expenses.filter(e => e.amount < 100);
    const refunds = expenses.filter(e =>
      new Date(e.date) > new Date() || e.category.toLowerCase().includes("refund")
    );

    res.json({
      avgBurnRate,
      prediction,
      leaks,
      refunds
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
