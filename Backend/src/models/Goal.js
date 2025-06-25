import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  currentAmount: { type: Number, default: 0 },
   goalType: { type: String, enum: ["savings", "spending"], default: "savings" },
 
},{ timestamps: true });

export default mongoose.model("Goal", goalSchema);
