import { Router } from 'express';
import { container } from '../shared/dependency-injection/inversify.config';
import { ProductController } from './products/ProductController';
import { authenticate, authorize } from './middlewares/authMiddleware';

const router = Router();

// Get controller instances from container
const productController = container.get<ProductController>(ProductController);

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authenticate, authorize(['admin']), productController.createProduct);
router.put('/products/:id', authenticate, authorize(['admin']), productController.updateProduct);
router.delete('/products/:id', authenticate, authorize(['admin']), productController.deleteProduct);

// Task routes would go here
// router.get('/tasks', ...);

// User routes would go here
// router.post('/users/register', ...);
// router.post('/users/login', ...);

export default router;

