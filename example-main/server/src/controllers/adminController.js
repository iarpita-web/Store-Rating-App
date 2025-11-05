import prisma from '../lib/prisma.js';
import { HttpError } from '../middleware/error.js';
import { createStoreSchema } from '../validators/store.js';
import { adminCreateUserSchema } from '../validators/auth.js';
import { hashPassword } from '../utils/crypto.js';

export async function listUsers(_req, res, next) {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
    res.json({ users });
  } catch (e) { next(e); }
}

export async function createUser(req, res, next) {
  try {
    // Admin creating user with role
    const data = adminCreateUserSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new HttpError(409, 'Email already in use');
    const password = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: { email: data.email, name: data.name, password, role: data.role || 'USER' },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    res.status(201).json({ user });
  } catch (e) { next(e); }
}

export async function listStores(_req, res, next) {
  try {
    const stores = await prisma.store.findMany({
      include: { ratings: { select: { stars: true } }, owner: { select: { id: true, email: true, name: true } } },
    });
    const withAvg = stores.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      owner: s.owner,
      averageRating: s.ratings.length ? s.ratings.reduce((a, r) => a + r.stars, 0) / s.ratings.length : null,
    }));
    res.json({ stores: withAvg });
  } catch (e) { next(e); }
}

export async function createStore(req, res, next) {
  try {
    const data = createStoreSchema.parse(req.body);
    const owner = await prisma.user.findUnique({ where: { id: data.ownerId } });
    if (!owner || owner.role !== 'OWNER') throw new HttpError(400, 'ownerId must reference a user with role OWNER');
    const store = await prisma.store.create({ data: { name: data.name, description: data.description, ownerId: data.ownerId } });
    res.status(201).json({ store });
  } catch (e) { next(e); }
}

export async function getStats(_req, res, next) {
  try {
    const [userCount, storeCount, ratingCount] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);
    res.json({ stats: { users: userCount, stores: storeCount, ratings: ratingCount } });
  } catch (e) { next(e); }
}
