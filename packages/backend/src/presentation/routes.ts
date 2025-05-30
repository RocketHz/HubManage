import { Router } from 'express';
import { Container } from 'inversify';
import { ProductController } from './products/ProductController';
import { authenticate, authorize } from './middlewares/authMiddleware';
import { TYPES } from '../shared/dependency-injection/types';

// Export a function that takes a container and returns configured routes
export default function(container: Container): Router {
  const router = Router();

  // Get controller instances from container
  const productController = container.get<ProductController>(TYPES.ProductController);

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

  return router;
}

