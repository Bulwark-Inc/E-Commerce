import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaUserPlus, FaShieldAlt, FaBookMedical, FaGamepad, FaMicroscope } from 'react-icons/fa';
import { MdMedicalServices } from 'react-icons/md';
import { RiComputerLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';
import CategoryCard from '../../components/widgets/CategoryCard';
import FeatureCard from '../../components/widgets/FeatureCard';
import Button from '../../components/ui/Button';

const HomePage = () => {
  const { user: currentUser } = useAuth();

  const categories = ['Electronics', 'Medical Apparels', 'Medical Equipment'];

  const features = [
    {
      title: 'Up-to-date Medical Articles',
      description: 'Stay informed with verified research and medical publications.',
      icon: FaBookMedical,
    },
    {
      title: 'Games & Quizzes',
      description: 'Engage your brain with medical games and knowledge tests.',
      icon: FaGamepad,
    },
    {
      title: 'Secured Purchase',
      description: 'We protect your transactions with best-in-class security.',
      icon: FaShieldAlt,
    },
  ];

  const blogs = [
    {
      title: 'Latest in Medicine',
      summary: 'From disease breakthroughs to surgical advances.',
      icon: MdMedicalServices,
    },
    {
      title: 'Healthcare Technology',
      summary: 'Explore AI, robotics, and innovations in diagnostics.',
      icon: RiComputerLine,
    },
    {
      title: 'Digital Health Trends',
      summary: 'Discover the future of virtual care and health apps.',
      icon: FaMicroscope,
    },
  ];

  return (
    <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 shadow-inner">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-blue-900">
            Welcome {currentUser ? currentUser.name || 'back' : 'to MedInn'}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {currentUser
              ? "You're logged in! Explore new resources, tools, and medical insights."
              : 'Your portal to medical knowledge, tools, and innovation. Get started now.'}
          </p>
          {!currentUser ? (
            <div className="flex justify-center gap-4">
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

      {/* Featured Categories */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(category => (
              <CategoryCard key={category} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="py-16">
        <div className="rounded-lg shadow-md p-6 hover:shadow-xl transition-all">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Featured Blogs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-center mb-4 text-4xl text-gold-500">
                  <blog.icon />
                </div>
                <h3 className="text-xl font-semibold text-purple-700 mb-2 text-center">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-center">{blog.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">Why Choose MedInn</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
