import { Router } from 'express';
import { Container } from 'inversify';
import { ProductController } from './products/ProductController';
import { TaskController } from './tasks/TaskController';
import { UserController } from './users/UserController';
import { authenticate, authorize } from './middlewares/authMiddleware';
import { TYPES } from '../shared/dependency-injection/types';

// Export a function that takes a container and returns configured routes
export default function(container: Container): Router {
  const router = Router();

  // Get controller instances from container
  const productController = container.get<ProductController>(TYPES.ProductController);
  const taskController = container.get<TaskController>(TYPES.TaskController);
  const userController = container.get<UserController>(TYPES.UserController);

  // Auth routes
  router.post('/auth/register', userController.register);
  router.post('/auth/login', userController.login);

  // Product routes
  router.get('/products', productController.getAllProducts);
  router.get('/products/search', productController.findByPriceRange);
  router.get('/products/:id', productController.getProductById);
  router.patch('/products/:id/stock', authenticate, authorize(['admin']), productController.updateProductStock);
  router.post('/products', authenticate, authorize(['admin']), productController.createProduct);
  router.put('/products/:id', authenticate, authorize(['admin']), productController.updateProduct);
  router.delete('/products/:id', authenticate, authorize(['admin']), productController.deleteProduct);

  // Task routes
  // Note: specific GET routes must be declared before '/tasks/:id' to avoid shadowing
  router.get('/tasks', taskController.getAllTasks);
  router.get('/tasks/due-date', taskController.getTasksByDueDateRange);
  router.get('/tasks/status/:status', taskController.getTasksByStatus);
  router.get('/tasks/:id', taskController.getTaskById);
  router.post('/tasks', authenticate, taskController.createTask);
  router.put('/tasks/:id', authenticate, taskController.updateTask);
  router.patch('/tasks/:id/status', authenticate, taskController.updateTaskStatus);
  router.delete('/tasks/:id', authenticate, taskController.deleteTask);

  // User routes
  router.get('/users', authenticate, authorize(['admin']), userController.getAllUsers);
  router.get('/users/:id', authenticate, authorize(['admin']), userController.getUserById);
  router.put('/users/:id', authenticate, authorize(['admin']), userController.updateUser);
  router.delete('/users/:id', authenticate, authorize(['admin']), userController.deleteUser);
  router.patch('/users/:id/roles', authenticate, authorize(['admin']), userController.addRole);
  router.patch('/users/:id/roles/remove', authenticate, authorize(['admin']), userController.removeRole);

  return router;
}
