import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUser } from '../../utils/token';

const HomePage = () => {
  const { currentUser } = getUser();
  const { isAuthenticated, authLoading } = useAuth();
  
  const categories = ['Electronics', 'Clothing', 'Home & Garden'];

  const features = [
    {
      title: 'Free Shipping',
      description: 'Free shipping on all orders over $50',
      icon: '🚚',
    },
    {
      title: 'Easy Returns',
      description: '30-day return policy on all purchases',
      icon: '↩️',
    },
    {
      title: 'Secure Payments',
      description: 'Multiple secure payment options',
      icon: '🔒',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 bg-gray-100 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Welcome {currentUser ? currentUser.name || 'back' : 'to E-Shop'}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {currentUser
                ? "You're logged in! Explore your dashboard or check out new arrivals."
                : 'Discover amazing products at competitive prices. Sign up to get started!'}
            </p>
            {!currentUser ? (
              <div className="flex justify-center gap-4">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Register
                </Link>
              </div>
            ) : (
              <Link
                to="/profile"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
              >
                Go to Profile
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
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
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
