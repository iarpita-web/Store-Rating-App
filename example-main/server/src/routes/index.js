import { Router } from 'express';
import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import storeRoutes from './stores.js';
import ratingRoutes from './ratings.js';
import ownerRoutes from './owner.js';
import mockRoutes from './mock.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/stores', storeRoutes);
router.use('/ratings', ratingRoutes);
router.use('/owner', ownerRoutes);
router.use('/mock', mockRoutes);

export default router;
