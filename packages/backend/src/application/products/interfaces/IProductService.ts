import { Product } from '../../../core/products/entities/Product';
import { CreateProductDto } from '../dtos/CreateProductDto';

export interface IProductService {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(productDto: CreateProductDto): Promise<Product>;
  updateProduct(id: string, productDto: Partial<CreateProductDto>): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
  searchProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>;
  updateProductStock(id: string, quantity: number): Promise<Product | null>;
}

