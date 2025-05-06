import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUser } from '../../utils/token';

const Header = () => {
  const { logout } = useAuth();
  const { currentUser } = getUser();

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">MedInn</Link>
        
        <nav className="flex items-center">
          <Link to="/products" className="mx-3 hover:text-gray-300">
            Products
          </Link>
          
          {currentUser ? (
            <div className="flex items-center">
              <Link to="/cart" className="mx-3 hover:text-gray-300">
                Cart
              </Link>
              <div className="relative group ml-3">
                <button className="flex items-center hover:text-gray-300">
                  <span>{currentUser.email}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-md hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <Link to="/addresses" className="block px-4 py-2 hover:bg-gray-100">
                    My Addresses
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex">
              <Link to="/login" className="mx-3 hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="mx-3 hover:text-gray-300">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;