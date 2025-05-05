import { useState, useEffect, useRef, useCallback } from 'react';
import { useAdminProduct } from '../../context/AdminProductContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminProductListPage = () => {
  const { fetchProducts, deleteProduct } = useAdminProduct();
  const [products, setProducts] = useState([]);
  const [nextPage, setNextPage] = useState(1); // track the actual next page
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);
  const controllerRef = useRef(null);

  const dedupeProducts = (existing, incoming) => {
    const slugs = new Set(existing.map((p) => p.slug));
    return [...existing, ...incoming.filter((p) => !slugs.has(p.slug))];
  };

  const loadMoreProducts = async () => {
    if (!hasNextPage || loading) return;

    setLoading(true);

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    try {
      const { products: newProducts, hasNextPage: nextExists, nextPage: nextPageValue } = await fetchProducts(
        nextPage,
        controllerRef.current.signal
      );

      setProducts((prev) => dedupeProducts(prev, newProducts));
      setNextPage(nextPageValue);
      setHasNextPage(nextExists);
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(slug);
      toast.success('Product deleted.');
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMoreProducts();
      }
    },
    [hasNextPage, nextPage]
  );

  useEffect(() => {
    loadMoreProducts(); // initial load
  }, []);

  useEffect(() => {
    const option = { root: null, rootMargin: '20px', threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    const currentRef = loadMoreRef.current;

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [handleObserver]);

  return (
    <div className="p-8 text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Products</h1>

      <Link to="/admin/products/create">
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-6">+ Add Product</button>
      </Link>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.slug} className="p-4 bg-gray-800 flex justify-between items-center rounded">
            <span>{product.name}</span>
            <div className="flex gap-2">
              <Link to={`/admin/products/${product.slug}/images`}>
                <button className="bg-green-600 px-3 py-1 rounded">Images</button>
              </Link>
              <Link to={`/admin/products/edit/${product.slug}`}>
                <button className="bg-yellow-600 px-3 py-1 rounded">Edit</button>
              </Link>
              <button onClick={() => handleDelete(product.slug)} className="bg-red-600 px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div ref={loadMoreRef}></div>

      {loading && <p className="text-center mt-4">Loading more products...</p>}
    </div>
  );
};

export default AdminProductListPage;
