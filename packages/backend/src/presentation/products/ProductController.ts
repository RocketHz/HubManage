import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../shared/dependency-injection/types';
import { IProductService } from '../../application/products/interfaces/IProductService';
import { CreateProductDto } from '../../application/products/dtos/CreateProductDto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@injectable()
export class ProductController {
  constructor(
    @inject(TYPES.ProductService) private productService: IProductService
  ) {}

  getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productDto = plainToClass(CreateProductDto, req.body);
      const errors = await validate(productDto);
      
      if (errors.length > 0) {
        res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }
      
      const product = await this.productService.createProduct(productDto);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const productDto = plainToClass(CreateProductDto, req.body);
      const errors = await validate(productDto, { skipMissingProperties: true });
      
      if (errors.length > 0) {
        res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.map(error => ({
            property: error.property,
            constraints: error.constraints
          }))
        });
        return;
      }
      
      const updatedProduct = await this.productService.updateProduct(id, productDto);
      
      if (!updatedProduct) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.productService.deleteProduct(id);
      
      if (!result) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

