import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { upsertRating } from '../controllers/ratingController.js';

const router = Router();

router.post('/', authenticate, requireRole('USER'), upsertRating);

export default router;
