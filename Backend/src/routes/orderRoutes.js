import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';

const router = Router();

// Place order
router.post('/orders/place', orderController.placeOrder);

// Get all orders
router.get('/orders', orderController.getAllOrders);

export default router;
