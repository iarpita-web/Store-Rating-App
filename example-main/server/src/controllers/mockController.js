import { readFile } from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HttpError } from '../middleware/error.js';
import { mockRatings } from '../data/mockState.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../data/stores.json');

async function readStores() {
  const buf = await readFile(dataPath, 'utf-8');
  return JSON.parse(buf);
}

export async function listMockStores(req, res, next) {
  try {
    const all = await readStores();
    const q = (req.query.search || '').toString().trim().toLowerCase();
    const stores = q
      ? all.filter(s => s.name.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q))
      : all;
    const withAvg = stores.map(s => {
      const ratings = mockRatings.filter(r => r.storeId === s.id);
      const avg = ratings.length ? ratings.reduce((a, r) => a + r.stars, 0) / ratings.length : null;
      return {
        id: s.id,
        name: s.name,
        description: s.description,
        owner: { name: s.ownerName },
        averageRating: avg,
        slug: s.slug,
      };
    });
    res.json({ stores: withAvg });
  } catch (e) { next(e); }
}

export async function getMockStoreById(req, res, next) {
  try {
    const { id } = req.params;
    const stores = await readStores();
    const store = stores.find(s => s.id === id || s.slug === id);
    if (!store) throw new HttpError(404, 'Store not found');
    const ratings = mockRatings
      .filter(r => r.storeId === store.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(r => ({ id: r.id, stars: r.stars, comment: r.comment, user: { id: r.userId, name: r.userName } }));
    const averageRating = ratings.length ? ratings.reduce((a, r) => a + r.stars, 0) / ratings.length : null;
    res.json({ store: {
      id: store.id,
      name: store.name,
      description: store.description,
      owner: { name: store.ownerName },
      ratings,
      averageRating,
    } });
  } catch (e) { next(e); }
}

export async function upsertMockRating(req, res, next) {
  try {
    const { storeId, stars, comment } = req.body || {};
    if (!storeId) throw new HttpError(400, 'storeId is required');
    const s = Number(stars);
    if (!Number.isInteger(s) || s < 1 || s > 5) throw new HttpError(400, 'stars must be an integer 1-5');

    const userId = req.user?.id;
    const userName = req.user?.name || 'Anonymous';
    if (!userId) throw new HttpError(401, 'Unauthenticated');

    const existingIdx = mockRatings.findIndex(r => r.userId === userId && r.storeId === storeId);
    const now = new Date().toISOString();
    if (existingIdx >= 0) {
      mockRatings[existingIdx] = { ...mockRatings[existingIdx], stars: s, comment: comment || '', updatedAt: now };
      return res.status(201).json({ rating: mockRatings[existingIdx] });
    }

    const newRating = {
      id: crypto.randomUUID(),
      storeId,
      userId,
      userName,
      stars: s,
      comment: comment || '',
      createdAt: now,
      updatedAt: now,
    };
    mockRatings.push(newRating);
    return res.status(201).json({ rating: newRating });
  } catch (e) { next(e); }
}
