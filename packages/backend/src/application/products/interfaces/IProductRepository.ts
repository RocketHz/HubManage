import { IRepository } from '../../../core/shared/interfaces/repository';
import { Product } from '../../../core/products/entities/Product';

export interface IProductRepository extends IRepository<Product> {
  findByName(name: string): Promise<Product | null>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
  updateStock(id: string, quantity: number): Promise<Product | null>;
}

