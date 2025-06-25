import Expense from "../models/Expense.js";
import jwt from "jsonwebtoken";

// export const createExpense = async (req, res) => {
//   try {
//     const { title, amount, type } = req.body;
//     const expense = await Expense.create({
//       userId: req.user,
//       title,
//       amount,
//       type,
//     });
//     res.status(201).json(expense);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
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
      category,
      date: date || new Date(), // fallback to now
      emotion,
      refundable,
      refundStatus,
    });

    res.status(201).json(expense);
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
