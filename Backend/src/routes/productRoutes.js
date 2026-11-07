import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import upload from '../middlewares/upload.js';

const router = Router();

// Search products (must come before :productId to avoid route conflicts)
router.get('/products/search', productController.search);

// Get all products
router.get('/products', productController.getAllProducts);

// Get product by ID
router.get('/product/:productId', productController.getProductById);

// Get product image binary
router.get('/product/:productId/image', productController.getImage);

// Add product (multipart/form-data with imageFile)
router.post('/product', upload.single('imageFile'), productController.addProduct);

// Update product (multipart/form-data with optional imageFile)
router.put('/product/:id', upload.single('imageFile'), productController.updateProduct);

// Delete product
router.delete('/product/:productId', productController.deleteProduct);

export default router;
