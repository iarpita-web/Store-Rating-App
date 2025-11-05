import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { ownerStores, storeRatings } from '../controllers/ownerController.js';

const router = Router();

router.use(authenticate, requireRole('OWNER'));
router.get('/my-stores', ownerStores);
router.get('/my-stores/:id/ratings', storeRatings);

export default router;
