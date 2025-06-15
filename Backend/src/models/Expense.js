import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  emotion: { type: String }, // 😄 😐 😞
  receiptUrl: { type: String },
  refundable: { type: Boolean, default: false },
  refundStatus: { type: String, enum: ['pending', 'claimed'], default: 'pending' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  // upi:{type:string}, // optional
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
