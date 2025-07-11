import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
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

  const totalPages = useMemo(
    () => Math.ceil(totalProducts / pageSize),
    [totalProducts, pageSize]
  );

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

  const enrichProductList = (products) =>
    products.map((p) => {
      const { image, alt_text } = getPrimaryImage(p);
      return {
        ...p,
        primary_image: {
          url: image,
          alt_text,
        },
      };
    });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productService.list(buildQueryParams());
      setProducts(enrichProductList(data.results));
      setTotalProducts(data.count || data.results.length || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.detail || 'Failed to fetch products';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []); // stable across re-renders

  const fetchProduct = async (slug) => {
    setLoading(true);
    try {
      const { data } = await productService.getBySlug(slug);
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.detail || 'Failed to fetch product';
      setError(message);
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

  const fetchCategories = useCallback(async () => {
    if (categories.length > 0) return;
    try {
      const { data } = await productService.getCategories();
      setCategories(data.results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchProductsByCategory = async (slug) => {
    setLoading(true);
    try {
      const { data } = await productService.getProductsByCategorySlug(slug);
      setProducts(enrichProductList(data.results));
      setTotalProducts(data.count || data.results.length || 0);
      setError(null);
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.detail || 'Failed to fetch category products';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // ✅ Only on filters change
  }, [filters]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, [fetchCategories]);

  return (
    <ProductContext.Provider
      value={{
        products,
        featuredProducts,
        product,
        fetchProduct,
        fetchProducts,
        categories,
        filters,
        setFilters,
        totalProducts,
        totalPages,
        loading,
        error,
        fetchFeaturedProducts,
        fetchCategories,
        fetchProductsByCategory,
        setCategoryFilterAndNavigate,
        pageSize,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
