import Expense from "../models/Expense.js";
import jwt from "jsonwebtoken";
import Alert from "../models/Alert.js";

const checkOverspending = async (userId, category) => {
  try {
    const normalized = category.toLowerCase();

    const alert = await Alert.findOne({ userId, category: normalized });
    if (!alert) return false;

    const expenses = await Expense.find({ userId, category: normalized, type: "expense" });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return total > alert.limit;
  } catch (err) {
    console.error("Overspending Check Error:", err);
    return false;
  }
};



export const createExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      category,
      date,
      emotion,
      refundable,
      refundStatus,
    } = req.body;

    const expense = await Expense.create({
      userId: req.user,
      title,
      amount,
      type,
      category: category.toLowerCase(),
      date: date || new Date(), 
      emotion,
      refundable,
      refundStatus,
    });


  const isOver = await checkOverspending(req.user._id, expense.category.toLowerCase());

  if (isOver) {
    res.status(201).json({ expense, overspent: true, category: expense.category });
  } else {
    res.status(201).json({ expense, overspent: false });
  }
   
  } catch (err) {
    console.error("Create Expense Error:", err);
    res.status(500).json({ msg: err.message });
  }
};


export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user })
      .sort({ date: -1 })
      .limit(5);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user });
    const income = expenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0);
    const spent = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0);
    const balance = income - spent;
    res.json({ income, spent, balance });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
