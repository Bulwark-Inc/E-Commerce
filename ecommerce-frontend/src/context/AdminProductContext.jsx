import { createContext, useContext } from 'react';
import productService from '../services/productService';

const AdminProductContext = createContext();

export const AdminProductProvider = ({ children }) => {
  const createProduct = async (productData) => {
    try {
      await productService.create(productData);
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  const updateProduct = (slug, productData) => productService.update(slug, productData);
  const deleteProduct = (slug) => productService.delete(slug);
  const addProductImage = (slug, formData) => productService.addImage(slug, formData);
  const addProductReview = (slug, reviewData) => productService.addReview(slug, reviewData);

  // ✅ Updated: fetchProducts without page_size
  const fetchProducts = async (page = 1, signal = null) => {
    const params = { page };
    const { data } = await productService.getAll(params, { signal });
  
    // Extract next page number if exists
    let nextPageValue = null;
    if (data.next) {
      const urlParams = new URLSearchParams(data.next.split('?')[1]);
      nextPageValue = parseInt(urlParams.get('page'), 10);
    }
  
    return {
      products: data.results,
      total: data.count,
      hasNextPage: !!data.next,
      nextPage: nextPageValue,
    };
  };
  

  return (
    <AdminProductContext.Provider
      value={{
        createProduct,
        updateProduct,
        deleteProduct,
        addProductImage,
        addProductReview,
        fetchProducts,
      }}
    >
      {children}
    </AdminProductContext.Provider>
  );
};

export const useAdminProduct = () => useContext(AdminProductContext);
