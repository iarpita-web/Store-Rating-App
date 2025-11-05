import prisma from '../lib/prisma.js';
import { signupSchema, loginSchema } from '../validators/auth.js';
import { HttpError } from '../middleware/error.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';
import { signToken } from '../utils/jwt.js';

export async function signup(req, res, next) {
  try {
    const data = signupSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new HttpError(409, 'Email already in use');

    const password = await hashPassword(data.password);
    const role = data.role || 'USER';
    const user = await prisma.user.create({
      data: { email: data.email, name: data.name, password, role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new HttpError(401, 'Invalid credentials');
    const ok = await comparePassword(password, user.password);
    if (!ok) throw new HttpError(401, 'Invalid credentials');

    const safeUser = { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt };
    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
}
