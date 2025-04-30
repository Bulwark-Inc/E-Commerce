import { useProduct } from '../../context/ProductContext';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  const { products, loading } = useProduct();

  if (loading) return <p className="text-center py-10 text-gray-600">Loading products...</p>;

  if (!products || products.length === 0) {
    return <p className="text-center py-10 text-gray-500">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
