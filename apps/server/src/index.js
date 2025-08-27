import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import { PrismaClient } from '../generated/prisma';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import inventoryRoutes from './routes/inventory.js';
import salesRoutes from './routes/sales.js';

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(config.port, () => {
  console.log(`API listening on :${config.port}`);
});
