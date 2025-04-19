import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import CategoryCard from '../../components/widgets/CategoryCard';
import FeatureCard from '../../components/widgets/FeatureCard';
import Button from '../../components/ui/Button';

const HomePage = () => {
  const { user: currentUser } = useAuth();

  const categories = ['Electronics', 'Clothing', 'Home & Garden'];
  const features = [
    { title: 'Free Shipping', description: 'Free shipping on all orders over $50', icon: '🚚' },
    { title: 'Easy Returns', description: '30-day return policy on all purchases', icon: '↩️' },
    { title: 'Secure Payments', description: 'Multiple secure payment options', icon: '🔒' },
  ];

  return (
    <div>
      <section className="py-16 bg-gray-100 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Welcome {currentUser ? currentUser.name || 'back' : 'to E-Shop'}!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {currentUser
              ? "You're logged in! Explore your dashboard or check out new arrivals."
              : 'Discover amazing products at competitive prices. Sign up to get started!'}
          </p>
          {!currentUser ? (
            <div className="flex justify-center gap-4 mt-6">
              <Link to="/login">
                <Button variant="solid" icon={FaLock}>
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" icon={FaUserPlus}>
                  Register
                </Button>
              </Link>
            </div>          
          ) : (
            <Link to="/profile">
              <Button icon={FaUser} variant="solid">
                Go to Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(category => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
