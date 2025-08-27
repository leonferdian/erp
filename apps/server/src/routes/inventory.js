import { Router } from 'express';
import { prisma } from '../index.js';
import { requireAuth } from '../middleware/auth.js';

const r = Router();
r.use(requireAuth);

r.patch('/:productId/adjust', async (req, res) => {
  const { productId } = req.params;
  const { delta } = req.body; // can be negative
  const inv = await prisma.inventory.update({
    where: { productId },
    data: { quantity: { increment: delta } }
  });
  res.json(inv);
});

export default r;
