import { createContext, useContext } from 'react';
import productService from '../services/productService';

const AdminProductContext = createContext();

export const AdminProductProvider = ({ children }) => {
  const createProduct = async (productData) => {
    try {
      await productService.create(productData);
    } catch (err) {
      console.error('Failed to create product:', err);
      // You could set an error state here as well for feedback
    }
  };  
  const updateProduct = (slug, productData) => productService.update(slug, productData);
  const deleteProduct = (slug) => productService.delete(slug);
  const addProductImage = (slug, formData) => productService.addImage(slug, formData);
  const addProductReview = (slug, reviewData) => productService.addReview(slug, reviewData);

  return (
    <AdminProductContext.Provider
      value={{
        createProduct,
        updateProduct,
        deleteProduct,
        addProductImage,
        addProductReview,
      }}
    >
      {children}
    </AdminProductContext.Provider>
  );
};

export const useAdminProduct = () => useContext(AdminProductContext);
