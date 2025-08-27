import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../index.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const r = Router();
r.use(requireAuth);

r.get('/', requireRole('ADMIN'), async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id:true, email:true, name:true, role:true, createdAt:true }});
  res.json(users);
});

r.post('/', requireRole('ADMIN'), async (req, res) => {
  const { email, name, role, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const u = await prisma.user.create({ data: { email, name, role, password: hashed } });
  res.status(201).json({ id: u.id });
});

export default r;
