import ProductFilter from '../components/filters/ProductFilter';
import ProductGrid from '../components/widgets/ProductGrid';
import ProductSearchBar from '../components/filters/ProductSearchBar';
import Pagination from '../../../shared/utils/Pagination';
import { useProduct } from '../context/ProductContext';

const ProductListPage = () => {
  const {
    filters,
    setFilters,
    totalProducts,
    pageSize,
    error,
  } = useProduct();

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Products</h1>
      <ProductSearchBar />
      <ProductFilter />
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <ProductGrid />
      <Pagination
        currentPage={filters.page}
        totalItems={totalProducts}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductListPage;
