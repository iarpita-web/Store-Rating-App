import prisma from '../lib/prisma.js';
import { queryStoresSchema } from '../validators/store.js';
import { HttpError } from '../middleware/error.js';

export async function getStores(req, res, next) {
  try {
    const { search } = queryStoresSchema.parse(req.query);
    const where = search ? { name: { contains: search, mode: 'insensitive' } } : {};
    const stores = await prisma.store.findMany({
      where,
      include: { ratings: { select: { stars: true } }, owner: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
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

export async function getStoreById(req, res, next) {
  try {
    const { id } = req.params;
    const store = await prisma.store.findUnique({
      where: { id },
      include: { ratings: { include: { user: { select: { id: true, name: true } } } }, owner: { select: { id: true, name: true } } },
    });
    if (!store) throw new HttpError(404, 'Store not found');
    const averageRating = store.ratings.length ? store.ratings.reduce((a, r) => a + r.stars, 0) / store.ratings.length : null;
    res.json({ store: { ...store, averageRating } });
  } catch (e) { next(e); }
}
