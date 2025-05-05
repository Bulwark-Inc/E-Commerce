import { useProduct } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useInView } from 'react-intersection-observer';

const ProductGrid = () => {
  const { products, loading } = useProduct();
  const { ref, inView } = useInView();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} height={300} />
        ))}
      </div>
    );
  }

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
