import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-gold-500 mb-4">MedInn</h3>
          <p className="text-sm text-gray-300">Tech-powered solutions for better healthcare.</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/products" className="hover:text-white">Products</Link></li>
            <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link to="/blogs" className="hover:text-white">Medical Blogs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/profile" className="hover:text-white">Profile</Link></li>
            <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <FaEnvelope />
              <a href="mailto:shilohe.write@gmail.com" className="hover:text-white">shilohe.write@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt />
              <a href="tel:+2347060971405" className="hover:text-white">+234 706 097 1405</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-800 pt-6 text-center text-gray-400">
        <p>&copy; {currentYear} MedInn. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
