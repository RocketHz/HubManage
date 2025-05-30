import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { TYPES } from './types';

// Repositories
import { IProductRepository } from '../../application/products/interfaces/IProductRepository';
import { PgProductRepository } from '../../infrastructure/data/repositories/PgProductRepository';

// Services
import { IProductService } from '../../application/products/interfaces/IProductService';
import { ProductService } from '../../application/products/services/ProductService';

// Controllers
import { ProductController } from '../../presentation/products/ProductController';

// Create container function
export function createContainer(dataSource: DataSource): Container {
  const container = new Container();

  // Register repositories
  container.bind<IProductRepository>(TYPES.ProductRepository).to(PgProductRepository).inSingletonScope();
  
  // After binding the repository, we need to initialize it with the DataSource
  const productRepository = container.get<PgProductRepository>(TYPES.ProductRepository);
  productRepository.initialize(dataSource);

  // Register services
  container.bind<IProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();

  // Register controllers
  container.bind<ProductController>(TYPES.ProductController).to(ProductController).inSingletonScope();

  // Other bindings would go here as the application grows

  return container;
}

// Export a default empty container for type hinting
export const container = new Container();

