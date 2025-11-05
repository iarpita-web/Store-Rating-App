import prisma from '../lib/prisma.js';
import { HttpError } from '../middleware/error.js';

export async function ownerStores(req, res, next) {
  try {
    const ownerId = req.user.id;
    const stores = await prisma.store.findMany({ where: { ownerId } });
    res.json({ stores });
  } catch (e) { next(e); }
}

export async function storeRatings(req, res, next) {
  try {
    const ownerId = req.user.id;
    const { id } = req.params; // store id
    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) throw new HttpError(404, 'Store not found');
    if (store.ownerId !== ownerId) throw new HttpError(403, 'Forbidden');

    const ratings = await prisma.rating.findMany({
      where: { storeId: id },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const averageRating = ratings.length ? ratings.reduce((a, r) => a + r.stars, 0) / ratings.length : null;

    res.json({ ratings, averageRating });
  } catch (e) { next(e); }
}
