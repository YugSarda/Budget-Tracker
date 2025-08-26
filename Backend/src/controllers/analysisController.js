
import Expense from "../models/Expense.js";

export const getCategoryAnalysis = async (req, res) => {
  try {
    const userId = req.user._id || req.user;

    const expenses = await Expense.find({ userId, type: "expense" });

    const categoryMap = {};
    for (let exp of expenses) {
      if (!exp.category || typeof exp.amount !== "number") continue;
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    }

    const formatted = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2)),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Category Analysis Error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getWeeklyAnalysis = async (req, res) => {
  try {
    const userId = req.user._id || req.user;

    const expenses = await Expense.find({ userId, type: "expense" });

    const weeklyMap = {};

    for (let exp of expenses) {
      const date = new Date(exp.date);
      if (isNaN(date)) continue;

      const week = getWeekKey(date);
      weeklyMap[week] = (weeklyMap[week] || 0) + exp.amount;
    }

    const formatted = Object.entries(weeklyMap)
      .map(([week, amount]) => ({
        week,
        amount: Number(amount.toFixed(2)),
      }))
      .sort((a, b) => a.week.localeCompare(b.week));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function getWeekKey(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const millisecsInDay = 86400000;
  const dayOfYear = Math.floor((date - onejan) / millisecsInDay) + 1;
  const week = Math.ceil(dayOfYear / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
}


export const getExpenseForecast = async (req, res) => {
  try {
    const userId = req.user._id || req.user;
    const expenses = await Expense.find({ userId, type: "expense" });

    // ----------------- Build monthly totals -----------------
    const monthly = {};
    for (const e of expenses) {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] = (monthly[key] || 0) + e.amount;
    }
    const series = Object.entries(monthly)
      .map(([m, total]) => ({ month: m, total }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // ----------------- Choose prediction method -------------
    if (series.length < 3) {
      // Fallback: simple mean forecast
      const avg = series.reduce((s, p) => s + p.total, 0) / (series.length || 1);
      return res.json({ history: series, forecast: buildMAForecast(avg) });
    }

    // --------- Prepare data for least-squares regression ----
    const recent = series.slice(-12); // last year
    const xs = recent.map((_, i) => i);            // 0 … n-1
    const ys = recent.map(p => p.total);

    const n = xs.length;
    const sumX = xs.reduce((a, b) => a + b, 0);
    const sumY = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
    const sumX2 = xs.reduce((s, x) => s + x * x, 0);

    const slope   = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercept = (sumY - slope * sumX) / n;

    // σ (std-dev) of residuals → simple confidence band
    const residuals = ys.map((y, i) => y - (slope * xs[i] + intercept));
    const sigma = Math.sqrt(residuals.reduce((s, r) => s + r ** 2, 0) / n);

    const forecast = [];
    for (let step = 1; step <= 3; step++) {
      const x = xs.length + step - 1;
      const pred = slope * x + intercept;
      forecast.push({
        month: nextMonthKey(series.at(-1).month, step),
        pred: Number(pred.toFixed(2)),
        upper: Number((pred + sigma).toFixed(2)),
        lower: Number(Math.max(pred - sigma, 0).toFixed(2)),
      });
    }

    res.json({ history: recent, forecast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------- helpers ----------
const buildMAForecast = avg => {
  const out = [];
  const base = new Date();
  base.setDate(1);
  for (let i = 1; i <= 3; i++) {
    base.setMonth(base.getMonth() + 1);
    const key = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}`;
    out.push({ month: key, pred: Number(avg.toFixed(2)), upper: avg, lower: avg });
  }
  return out;
};

const nextMonthKey = (key, step) => {
  const [y, m] = key.split("-").map(Number);
  const date = new Date(y, m - 1 + step, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};
