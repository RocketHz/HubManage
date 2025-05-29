import axios from 'axios';
import { Product, CreateProductDTO, UpdateProductDTO } from '../../core/products/Product';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export class ProductApiService {
  private token: string | null = null;

  constructor() {
    // Get token from local storage if available
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    };
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.get<Product[]>(`${API_URL}/products`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axios.get<Product>(`${API_URL}/products/${id}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  }

  async createProduct(product: CreateProductDTO): Promise<Product> {
    try {
      const response = await axios.post<Product>(`${API_URL}/products`, product, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, product: UpdateProductDTO): Promise<Product> {
    try {
      const response = await axios.put<Product>(`${API_URL}/products/${id}`, product, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
export const productApiService = new ProductApiService();

