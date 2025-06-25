import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import routes from './routes/index.js';
import receiptRoutes from './routes/receipt.js';
dotenv.config();

const app = express();
connectDB()
app.use(cors(
  {
     origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 200
  }
))

 app.use(express.json());



app.use('/api',routes);
app.use('/api/receipt-scan', receiptRoutes);
export default app;
