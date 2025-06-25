// import Goal from "../models/Goal.js";
// import Expense from "../models/Expense.js";

// export const createGoal = async (req, res) => {
//   try {
//     const { title, targetAmount, deadline, goalType, category } = req.body;
//     const goal = await Goal.create({
//       userId: req.user,
//       title,
//       targetAmount,
//       deadline,
//       goalType,
//       category,
//     });
//     res.status(201).json(goal);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// export const getGoals = async (req, res) => {
//   try {
//     const goals = await Goal.find({ userId: req.user });
//     const expenses = await Expense.find({ userId: req.user });

//     const updatedGoals = goals.map(goal => {
//       const relevantExpenses = expenses.filter(e => e.category === goal.category);

//       let progress = 0;
//       if (goal.goalType === "savings") {
//         progress = relevantExpenses
//           .filter(e => e.type === "income")
//           .reduce((sum, e) => sum + e.amount, 0);
//       } else {
//         progress = relevantExpenses
//           .filter(e => e.type === "expense")
//           .reduce((sum, e) => sum + e.amount, 0);
//       }

//       return {
//         ...goal.toObject(),
//         currentAmount: progress,
//       };
//     });

//     res.json(updatedGoals);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };
import Goal from "../models/Goal.js";
import Expense from "../models/Expense.js";

export const getGoals = async (req, res) => {
  try {
    const userId = req.user._id || req.user;

    const goals = await Goal.find({ userId });

    // For each goal, find total expenses in that category
    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const expenses = await Expense.find({
          userId,
          category: goal.category,
          type: "expense",
          date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        const currentAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        return {
          ...goal._doc,
          currentAmount,
        };
      })
    );

    res.json(updatedGoals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, goalType, category } = req.body;
    const userId = req.user._id || req.user;

    const goal = await Goal.create({
      userId,
      title,
      targetAmount,
      deadline,
      goalType,
      category,
    });

    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};