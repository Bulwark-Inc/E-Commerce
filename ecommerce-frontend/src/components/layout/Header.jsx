import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUser } from '../../utils/token';
import { useState } from 'react';
import { FaBars, FaTimes, FaBlog, FaBox, FaUserMd, FaShoppingCart, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Header = () => {
  const { logout } = useAuth();
  const { currentUser } = getUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/blogs', icon: <FaBlog />, label: 'Blogs' },
    { to: '/products', icon: <FaBox />, label: 'Products' },
    ...(currentUser ? [{ to: '/cart', icon: <FaShoppingCart />, label: 'Cart' }] : [])
  ];

  const authLinks = currentUser
    ? [
        { to: '/profile', label: 'My Profile' },
        { to: '/orders', label: 'Orders' },
        { to: '/addresses', label: 'Addresses' }
      ]
    : [
        { to: '/login', icon: <FaSignInAlt />, label: 'Login' },
        { to: '/register', icon: <FaUserPlus />, label: 'Register' }
      ];

  return (
    <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white shadow-md z-50 relative">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gold-500">MedInn</Link>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <nav className={`md:flex md:items-center absolute md:static left-0 w-full md:w-auto bg-blue-900 md:bg-transparent transition-all duration-300 ease-in-out ${menuOpen ? 'top-full opacity-100' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'} z-40`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0">
            {navLinks.map(({ to, icon, label }) => (
              <li key={label}>
                <Link to={to} className="flex items-center gap-2 py-2 px-2 hover:text-gold-500">
                  {icon}
                  {label}
                </Link>
              </li>
            ))}

            {currentUser ? (
              <li className="relative group">
                <button className="flex items-center gap-2 py-2 px-2 hover:text-gold-500">
                  <FaUserMd />
                  {currentUser.email}
                </button>
                <ul className="absolute bg-white text-gray-800 shadow-lg rounded-md hidden group-hover:block mt-2 w-48">
                  {authLinks.map(({ to, label }) => (
                    <li key={label}>
                      <Link to={to} className="block px-4 py-2 hover:bg-gray-100">
                        {label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              authLinks.map(({ to, icon, label }) => (
                <li key={label}>
                  <Link to={to} className="flex items-center gap-2 py-2 px-2 hover:text-gold-500">
                    {icon}
                    {label}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
