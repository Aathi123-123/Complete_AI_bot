import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    /\.vercel\.app$/,  // allow all vercel subdomains
  ],
  credentials: true,
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
