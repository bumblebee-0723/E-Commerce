import { Router } from 'express';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = Router();

// Mount product and order routes
router.use('/', productRoutes);
router.use('/', orderRoutes);

export default router;
