import { useProduct } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import ProductListSkeleton from '../skeleton/ProductListSkeleton';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const ProductGrid = () => {
  const { products, loading, filters, totalPages, setFilters } = useProduct();
  const { ref, inView } = useInView();

  // Trigger next page fetch when in view
  useEffect(() => {
    if (inView && !loading && filters.page < totalPages) {
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [inView, loading, filters.page, totalPages]);

  if (loading && products.length === 0) return <ProductListSkeleton count={8} />;

  if (!products || products.length === 0) {
    return <p className="text-center py-10 text-gray-500">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <div ref={ref} className="h-10" />
    </div>
  );
};

export default ProductGrid;
