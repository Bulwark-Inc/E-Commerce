import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{category}</h3>
      <p className="text-gray-600 mb-4">
        Explore our selection of {category.toLowerCase()}.
      </p>
      <Link
        to={`/category/${category.toLowerCase().replace(' & ', '-')}`}
        className="text-blue-600 font-medium hover:underline"
      >
        Browse {category} →
      </Link>
    </div>
  </div>
);

export default CategoryCard;