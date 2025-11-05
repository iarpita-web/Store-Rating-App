import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getStores, getStoreById } from '../controllers/storeController.js';

const router = Router();

router.get('/', authenticate, getStores);
router.get('/:id', authenticate, getStoreById);

export default router;
