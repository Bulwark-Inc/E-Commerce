import Header from './Header';
import Footer from './Footer';

{/* <div className="bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300"> */}
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;