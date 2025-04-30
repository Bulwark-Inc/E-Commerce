import ProductFilter from '../../components/filters/ProductFilter';
import ProductGrid from '../../components/widgets/ProductGrid';
import ProductSearchBar from '../../components/filters/ProductSearchBar';

const ProductListPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Products</h1>
      <ProductSearchBar />
      <ProductFilter />
      <ProductGrid />
    </div>
  );
};

export default ProductListPage;
