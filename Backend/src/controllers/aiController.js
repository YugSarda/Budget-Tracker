import Expense from "../models/Expense.js";
import MLR from "ml-regression-multivariate-linear";

export const predictExpenses = async (req, res) => {
  try {
    const userId = req.user._id || req.user;

    const expenses = await Expense.find({ userId, type: "expense" }).sort({ date: 1 });

    const monthlyMap = {};

    for (let exp of expenses) {
      const date = new Date(exp.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + exp.amount;
    }

    const months = Object.keys(monthlyMap).map((m, i) => i + 1);
    const values = Object.values(monthlyMap);

    if (months.length < 2) {
      return res.status(400).json({ msg: "Not enough data for prediction" });
    }

    const x = months.map((m) => [m]); // X input
    const y = values.map((v) => [v]); // Y output

    const mlr = new MLR(x, y);
    const nextMonth = [months.length + 1];
    const predicted = mlr.predict([nextMonth])[0][0];

    res.json({ predicted: Number(predicted.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
