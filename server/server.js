import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import miscRoutes from './routes/miscRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'ShopEase API' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', miscRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`ShopEase API running on port ${PORT}`);
});
