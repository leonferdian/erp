import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';
import { config } from '../config.js';

const r = Router();

/** Seed admin if none exists */
r.post('/seed-admin', async (_req, res) => {
  const exists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (exists) return res.json({ created: false });
  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: { email: 'admin@erp.local', name: 'Admin', role: 'ADMIN', password }
  });
  return res.json({ created: true, admin });
});

r.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, config.jwtSecret, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

export default r;
