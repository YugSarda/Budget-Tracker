// import Expense from "../models/Expense.js";

// export const getRecommendations = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const allExpenses = await Expense.find({ userId, type: "expense" });

//     const total = allExpenses.reduce((sum, e) => sum + e.amount, 0);

//     const byCategory = {};
//     allExpenses.forEach((e) => {
//       const cat = e.category || "general";
//       byCategory[cat] = (byCategory[cat] || 0) + e.amount;
//     });

//     const recommendations = [];

//     // Example: basic 50/30/20 allocation check
//     const ideal = {
//       savings: 0.2 * total,
//       wants: 0.3 * total,
//       needs: 0.5 * total,
//     };

//     if (byCategory.travel && byCategory.travel > total * 0.3) {
//       recommendations.push("✈️ You spent more than 30% on travel. Consider cutting down on non-essential trips.");
//     }

//     if (byCategory.food && byCategory.food > total * 0.4) {
//       recommendations.push("🍕 High food spending detected. Try home-cooked meals to save more.");
//     }

//     if (!byCategory.savings || byCategory.savings < ideal.savings) {
//       recommendations.push("💰 Increase your savings to at least 20% of your income.");
//     }

//     const emotionalOverspend = await Expense.aggregate([
//       { $match: { userId, type: "expense" } },
//       { $group: { _id: "$emotion", total: { $sum: "$amount" } } }
//     ]);

//     const sadSpend = emotionalOverspend.find(e => e._id === "sad")?.total || 0;
//     if (sadSpend > total * 0.3) {
//       recommendations.push("😞 You tend to overspend when feeling sad. Be mindful of emotional spending.");
//     }

//     res.json({ recommendations });
//   } catch (err) {
//     console.error("Recommendation error:", err);
//     res.status(500).json({ error: "Failed to generate recommendations" });
//   }
// };
import Expense from "../models/Expense.js";
import moment from "moment";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const expenses = await Expense.find({ userId, type: "expense" });

    if (expenses.length === 0) return res.json({ recommendations: ["No expenses to analyze yet."] });

    // Sort expenses by date and group by ISO week
    const weeks = {};

    expenses.forEach((e) => {
      const week = moment(e.date).isoWeek(); // week number
      const year = moment(e.date).year();
      const weekKey = `${year}-W${week}`;

      if (!weeks[weekKey]) weeks[weekKey] = [];
      weeks[weekKey].push(e);
    });

    const recommendations = [];

    // Weekly analysis
    const weekKeys = Object.keys(weeks).sort();

    weekKeys.forEach((weekKey, idx) => {
      const weekExpenses = weeks[weekKey];
      const total = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
      const byCategory = {};
      const byEmotion = {};
      const byDay = {};

      let savings = 0;

      for (const e of weekExpenses) {
        const cat = e.category || "general";
        byCategory[cat] = (byCategory[cat] || 0) + e.amount;

        const emo = e.emotion || "neutral";
        byEmotion[emo] = (byEmotion[emo] || 0) + e.amount;

        const day = moment(e.date).format("dddd"); // "Monday", "Tuesday", etc
        byDay[day] = (byDay[day] || 0) + e.amount;

        if (cat === "savings") savings += e.amount;
      }

      const weekLabel = `📅 Week ${weekKey}`;

      // 1. Savings Analysis
      const savingsRate = savings / total;
      if (savingsRate < 0.2) {
        recommendations.push(`${weekLabel}: You saved only ${(savingsRate * 100).toFixed(1)}%. Try to save at least 20%.`);
      }

      // 2. Category comparison with previous week
      if (idx > 0) {
        const prevWeekKey = weekKeys[idx - 1];
        const prev = weeks[prevWeekKey];

        const prevByCategory = {};
        for (const e of prev) {
          const cat = e.category || "general";
          prevByCategory[cat] = (prevByCategory[cat] || 0) + e.amount;
        }

        for (const cat in byCategory) {
          if (prevByCategory[cat]) {
            const rise = ((byCategory[cat] - prevByCategory[cat]) / prevByCategory[cat]) * 100;
            if (rise > 30) {
              recommendations.push(`${weekLabel}: ${cat} expenses rose by ${rise.toFixed(1)}% compared to last week.`);
            }
          }
        }
      }

      // 3. Emotional Spending
      if (byEmotion.sad && byEmotion.sad > total * 0.3) {
        recommendations.push(`${weekLabel}: You spent over 30% during ‘sad’ moods. Be mindful of emotional purchases.`);
      }

      // 4. Refundable tracking
      const refundables = weekExpenses.filter(e => e.refundable && e.refundStatus !== "claimed");
      const refundTotal = refundables.reduce((sum, e) => sum + e.amount, 0);
      if (refundTotal > 0) {
        recommendations.push(`${weekLabel}: You have ₹${refundTotal} in unclaimed refundable expenses.`);
      }

      // 5. Day-time pattern
      const topDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0];
      if (topDay) {
        recommendations.push(`${weekLabel}: Highest spending day was ${topDay[0]} (₹${topDay[1].toFixed(0)}).`);
      }
    });

    res.json({ recommendations });

  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};
