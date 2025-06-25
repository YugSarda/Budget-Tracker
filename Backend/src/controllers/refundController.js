import Expense from "../models/Expense.js";

export const getPendingRefunds = async (req, res) => {
  try {
    const userId = req.user._id || req.user;
    const refunds = await Expense.find({
      userId,
      refundable: true,
      refundStatus: "pending",
    }).sort({ date: -1 });

    res.json(refunds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markRefundClaimed = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user;

    const updated = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { refundStatus: "claimed" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Refund not found" });
      const incomeEntry = new Expense({
      userId,
      title: `Refund: ${updated.title}`,
      amount: updated.amount,
      type: "income",
      category: "refund",
      date: new Date(), // use current date
    });

    await incomeEntry.save();

    res.json({ msg: "Refund claimed and income added." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
