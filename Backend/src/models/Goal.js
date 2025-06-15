import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String }, // optional
  amount: { type: Number, required: true },
  month: { type: String }, // e.g., "2025-06"
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
