import { readFile } from 'node:fs/promises';
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

export async function ownerStoresMock(req, res, next) {
  try {
    if (!req.user || req.user.role !== 'OWNER') throw new HttpError(403, 'Forbidden');
    const ownerName = req.user.name;
    const stores = (await readStores()).filter(s => s.ownerName === ownerName);
    res.json({ stores: stores.map(s => ({ id: s.id, name: s.name, description: s.description })) });
  } catch (e) { next(e); }
}

export async function storeRatingsMock(req, res, next) {
  try {
    if (!req.user || req.user.role !== 'OWNER') throw new HttpError(403, 'Forbidden');
    const { id } = req.params;
    const stores = await readStores();
    const store = stores.find(s => s.id === id);
    if (!store) throw new HttpError(404, 'Store not found');
    if (store.ownerName !== req.user.name) throw new HttpError(403, 'Forbidden');

    const ratings = mockRatings
      .filter(r => r.storeId === id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(r => ({ id: r.id, stars: r.stars, comment: r.comment, user: { id: r.userId, name: r.userName, email: `${r.userId}@mock.local` } }));
    const averageRating = ratings.length ? ratings.reduce((a, r) => a + r.stars, 0) / ratings.length : null;
    res.json({ ratings, averageRating });
  } catch (e) { next(e); }
}
