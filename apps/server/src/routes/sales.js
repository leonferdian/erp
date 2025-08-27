import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.use(requireAuth);

r.post('/', async (req, res) => {
  const { productId, qty } = req.body;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const total = (Number(product.unitPrice) * qty).toFixed(2);
  const sale = await prisma.sale.create({ data: { productId, qty, total } });
  await prisma.inventory.update({
    where: { productId },
    data: { quantity: { decrement: qty } }
  });
  res.status(201).json(sale);
});

r.get('/report', async (_req, res) => {
  const sales = await prisma.sale.findMany({ orderBy: { createdAt: 'desc' }});
  res.json(sales);
});

export default r;
