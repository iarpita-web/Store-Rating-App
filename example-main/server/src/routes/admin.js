import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { listUsers, createUser, listStores, createStore, getStats } from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/users', listUsers);
router.post('/users', createUser);
router.get('/stores', listStores);
router.post('/stores', createStore);
router.get('/stats', getStats);

export default router;
