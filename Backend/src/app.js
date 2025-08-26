import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import routes from './routes/index.js';

dotenv.config();

const app = express();
connectDB()
app.use(cors(
  {
     origin: 'http://localhost:5173', 
  credentials: true, 
  optionsSuccessStatus: 200
  }
))

 app.use(express.json());
app.use('/api',routes);

export default app;
