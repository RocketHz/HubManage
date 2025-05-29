import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';

// Repositories
import { IProductRepository } from '../../application/products/interfaces/IProductRepository';
import { PgProductRepository } from '../../infrastructure/data/repositories/PgProductRepository';

// Services
import { IProductService } from '../../application/products/interfaces/IProductService';
import { ProductService } from '../../application/products/services/ProductService';

// Create and configure container
const container = new Container();

// Register repositories
container.bind<IProductRepository>(TYPES.ProductRepository).to(PgProductRepository).inSingletonScope();

// Register services
container.bind<IProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();

// Other bindings would go here as the application grows

export { container };

