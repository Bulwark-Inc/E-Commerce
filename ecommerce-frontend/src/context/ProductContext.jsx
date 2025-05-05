import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { getPrimaryImage } from '../utils/productHelpers';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const pageSize = 12;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    min_price: '',
    max_price: '',
    ordering: '',
    page: 1,
  });

  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPages = Math.ceil(totalProducts / pageSize); // computed value, not state

  const setCategoryFilterAndNavigate = (slug) => {
    setFilters((prev) => ({
      ...prev,
      category: slug,
      page: 1,
    }));
    navigate('/products');
  };

  const buildQueryParams = () => {
    const params = { ...filters };
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    return params;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getAll(buildQueryParams());
      
      const enrichedProducts = data.results.map((p) => {
        const { image, alt_text } = getPrimaryImage(p);
        return {
          ...p,
          primary_image: {
            url: image,
            alt_text: alt_text,
          },
        };
      });

      setProducts(enrichedProducts);
      setTotalProducts(data.count || data.results.length || 0);
      setError(null);
      
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async (slug) => {
    setLoading(true);
    try {
      const { data } = await productService.getBySlug(slug);
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await productService.getFeatured();
      setFeaturedProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await productService.getCategories();
      setCategories(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProductsByCategory = async (slug) => {
    setLoading(true);
    try {
      const { data } = await productService.getProductsByCategory(slug);
      const enrichedProducts = data.results.map((p) => {
        const { image, alt_text } = getPrimaryImage(p);
        return {
          ...p,
          primary_image: {
            url: image,
            alt_text: alt_text,
          },
        };
      });
      setProducts(enrichedProducts);
      setTotalProducts(data.count || data.results.length || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch category products');
    } finally {
      setLoading(false);
    }
  };

  // ⭐ New: Add product review (migrated from admin context)
  const addProductReview = async (slug, reviewData) => {
    try {
      await productService.addReview(slug, reviewData);
    } catch (err) {
      console.error('Failed to submit review:', err);
      throw err;
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        product,
        fetchProduct,
        categories,
        filters,
        setFilters,
        totalProducts,
        totalPages,
        loading,
        error,
        fetchProducts,
        fetchFeaturedProducts,
        fetchCategories,
        fetchProductsByCategory,
        setCategoryFilterAndNavigate,
        addProductReview,
        pageSize, // expose if needed elsewhere
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
