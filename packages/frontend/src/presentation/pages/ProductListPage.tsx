import React, { useState, useEffect } from 'react';
import { Product } from '../../core/products/Product';
import { productApiService } from '../../application/api-services/ProductApiService';

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productApiService.getAllProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApiService.deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('Failed to delete product. Please try again later.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-list-page">
      <h1>Products</h1>
      
      <button className="add-product-btn">Add New Product</button>
      
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-details">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <span className="product-stock">Stock: {product.stock}</span>
              </div>
              <div className="product-actions">
                <button className="edit-btn">Edit</button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;

