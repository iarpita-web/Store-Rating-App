import { Router } from 'express';
import { listMockStores, getMockStoreById, upsertMockRating } from '../controllers/mockController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { ownerStoresMock, storeRatingsMock } from '../controllers/mockOwnerController.js';

const router = Router();

router.get('/stores', listMockStores);
router.get('/stores/:id', getMockStoreById); // id or slug
router.post('/ratings', authenticate, requireRole('USER'), upsertMockRating);

// Owner mock endpoints
router.get('/owner/my-stores', authenticate, requireRole('OWNER'), ownerStoresMock);
router.get('/owner/my-stores/:id/ratings', authenticate, requireRole('OWNER'), storeRatingsMock);

export default router;
