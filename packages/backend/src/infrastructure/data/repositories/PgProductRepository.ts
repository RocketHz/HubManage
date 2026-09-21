import { inject, injectable } from 'inversify';
import { DataSource, Repository, Between } from 'typeorm';
import { Product } from '../../../core/products/entities/Product';
import { IProductRepository } from '../../../application/products/interfaces/IProductRepository';
import { TYPES } from '../../../shared/dependency-injection/types';

@injectable()
export class PgProductRepository implements IProductRepository {
  private repository: Repository<Product>;

  constructor(
    @inject(TYPES.DataSource) dataSource: DataSource
  ) {
    this.repository = dataSource.getRepository(Product);
  }

  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.repository.findOneBy({ id });
    return product;
  }

  async findByName(name: string): Promise<Product | null> {
    const product = await this.repository.findOneBy({ name });
    return product;
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.repository.find({
      where: {
        price: Between(minPrice, maxPrice)
      }
    });
  }

  async save(entity: Product): Promise<Product> {
    return this.repository.save(entity);
  }

  async update(id: string, entity: Partial<Product>): Promise<Product | null> {
    await this.repository.update(id, entity);
    return this.findById(id);
  }

  async updateStock(id: string, quantity: number): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }
    
    product.stock = quantity;
    return this.repository.save(product);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}

