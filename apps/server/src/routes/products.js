import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.use(requireAuth);

r.get('/', async (_req, res) => {
  const list = await prisma.product.findMany({ include: { inventory: true }});
  res.json(list);
});

r.post('/', async (req, res) => {
  const { sku, name, unitPrice } = req.body;
  const p = await prisma.product.create({
    data: { sku, name, unitPrice, inventory: { create: { quantity: 0 } } }
  });
  res.status(201).json(p);
});

export default r;
