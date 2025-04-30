import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    min_price: '',
    max_price: '',
    ordering: '',
    page: 1,
  });

  const setCategoryFilterAndNavigate = (slug) => {
    setFilters((prev) => ({
      ...prev,
      category: slug,
      page: 1,
    }));
    navigate('/products');
  };

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQueryParams = () => {
    const params = { ...filters, page: currentPage };
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    return params;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getAll(buildQueryParams());
      setProducts(data.results || data);
      setTotalProducts(data.count || data.length || 0);
      setTotalPages(data.total_pages || 1);
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
      setProducts(data.results || data);
      setTotalProducts(data.count || data.length || 0);
      setTotalPages(data.total_pages || 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch category products');
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("hello");
  }, [categories]);

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
        currentPage,
        setCurrentPage,
        totalProducts,
        totalPages,
        loading,
        error,
        fetchProducts,
        fetchFeaturedProducts,
        fetchCategories,
        fetchProductsByCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
