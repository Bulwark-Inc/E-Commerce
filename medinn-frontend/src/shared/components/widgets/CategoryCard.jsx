import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
    <div className="h-48 bg-gray-200 dark:bg-gray-700 transition-colors duration-300"></div>
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
        {category}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Explore our selection of {category.toLowerCase()}.
      </p>
      <Link
        to={`/category/${category.toLowerCase().replace(' & ', '-').replace(/\s+/g, '-')}`}
        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
      >
        Browse {category} →
      </Link>
    </div>
  </div>
);

export default CategoryCard;
