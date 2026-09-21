import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../../core/products/entities/Product';
import { IProductRepository } from '../interfaces/IProductRepository';
import { IProductService } from '../interfaces/IProductService';
import { CreateProductDto } from '../dtos/CreateProductDto';
import { TYPES } from '../../../shared/dependency-injection/types';

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async createProduct(productDto: CreateProductDto): Promise<Product> {
    const product = new Product(
      uuidv4(),
      productDto.name,
      productDto.description,
      productDto.price,
      productDto.stock
    );
    
    return this.productRepository.save(product);
  }

  async updateProduct(id: string, productDto: Partial<CreateProductDto>): Promise<Product | null> {
    return this.productRepository.update(id, productDto);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }

  async searchProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return this.productRepository.findByPriceRange(minPrice, maxPrice);
  }

  async updateProductStock(id: string, quantity: number): Promise<Product | null> {
    return this.productRepository.updateStock(id, quantity);
  }
}

