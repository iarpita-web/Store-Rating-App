import prisma from '../lib/prisma.js';
import { upsertRatingSchema } from '../validators/rating.js';

export async function upsertRating(req, res, next) {
  try {
    const { storeId, stars, comment } = upsertRatingSchema.parse(req.body);
    const userId = req.user.id;

    const rating = await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { stars, comment },
      create: { userId, storeId, stars, comment },
    });

    res.status(201).json({ rating });
  } catch (e) { next(e); }
}
