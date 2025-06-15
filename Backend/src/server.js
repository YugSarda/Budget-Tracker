import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import groupRoutes from './routes/groups.js';
import subscriptionRoutes from './routes/subscriptions.js';
import goalRoutes from './routes/goals.js';


dotenv.config();

const app = express();
connectDB()
app.use(cors());
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Budget Tracker API is running...");
});

// Routes
app.use("/api/auth", authRoutes);

app.use('/api/expenses', expenseRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/goals',goalRoutes)
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

