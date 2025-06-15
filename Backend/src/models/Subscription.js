import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  billingDate: { type: Date, required: true },
  autoRemind: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
