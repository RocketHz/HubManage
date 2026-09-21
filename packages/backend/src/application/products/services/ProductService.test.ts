import { ProductService } from './ProductService';
import { IProductRepository } from '../interfaces/IProductRepository';
import { Product } from '../../../core/products/entities/Product';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<IProductRepository>;

  const mockProduct = new Product(
    'prod-1',
    'Laptop',
    'A nice laptop',
    999.99,
    10
  );

  beforeEach(() => {
    productRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findByPriceRange: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      updateStock: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<IProductRepository>;

    productService = new ProductService(productRepository);
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      productRepository.findAll.mockResolvedValue([mockProduct]);

      const products = await productService.getAllProducts();

      expect(products).toEqual([mockProduct]);
      expect(productRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      productRepository.findById.mockResolvedValue(mockProduct);

      const product = await productService.getProductById('prod-1');

      expect(product).toEqual(mockProduct);
    });

    it('should return null when not found', async () => {
      productRepository.findById.mockResolvedValue(null);

      const product = await productService.getProductById('missing');

      expect(product).toBeNull();
    });
  });

  describe('createProduct', () => {
    it('should create and save a new product', async () => {
      productRepository.save.mockResolvedValue(mockProduct);

      const product = await productService.createProduct({
        name: 'Laptop',
        description: 'A nice laptop',
        price: 999.99,
        stock: 10
      });

      expect(productRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Laptop',
          price: 999.99,
          stock: 10
        })
      );
      expect(product).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const updated = { ...mockProduct, name: 'Gaming Laptop' };
      productRepository.update.mockResolvedValue(updated);

      const result = await productService.updateProduct('prod-1', { name: 'Gaming Laptop' });

      expect(productRepository.update).toHaveBeenCalledWith('prod-1', { name: 'Gaming Laptop' });
      expect(result).toEqual(updated);
    });

    it('should return null if product does not exist', async () => {
      productRepository.update.mockResolvedValue(null);

      const result = await productService.updateProduct('missing', { name: 'X' });

      expect(result).toBeNull();
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product', async () => {
      productRepository.delete.mockResolvedValue(true);

      const result = await productService.deleteProduct('prod-1');

      expect(result).toBe(true);
    });

    it('should return false when product does not exist', async () => {
      productRepository.delete.mockResolvedValue(false);

      const result = await productService.deleteProduct('missing');

      expect(result).toBe(false);
    });
  });

  describe('searchProductsByPriceRange', () => {
    it('should return products within price range', async () => {
      productRepository.findByPriceRange.mockResolvedValue([mockProduct]);

      const result = await productService.searchProductsByPriceRange(500, 1500);

      expect(productRepository.findByPriceRange).toHaveBeenCalledWith(500, 1500);
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('updateProductStock', () => {
    it('should update stock via repository', async () => {
      const updated = { ...mockProduct, stock: 5 };
      productRepository.updateStock.mockResolvedValue(updated);

      const result = await productService.updateProductStock('prod-1', 5);

      expect(productRepository.updateStock).toHaveBeenCalledWith('prod-1', 5);
      expect(result).toEqual(updated);
    });
  });
});