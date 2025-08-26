import Alert from "../models/Alert.js";
import Expense from "../models/Expense.js";

// Save or update category limit
export const setLimit = async (req, res) => {
  const { category, limit } = req.body;
  const userId = req.user._id;

  try {
       const normalizedCategory = category.toLowerCase();
    const updated = await Alert.findOneAndUpdate(
      { userId, category: normalizedCategory },
      { limit },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to set alert limit" });
  }
};

// Fetch all limits for a user
export const getLimits = async (req, res) => {
  const userId = req.user._id;
  const alerts = await Alert.find({ userId });
  res.json(alerts);
};
