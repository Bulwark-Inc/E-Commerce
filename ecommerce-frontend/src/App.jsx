import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import ThemeToggle from './components/ui/ThemeToggle';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AdminProductProvider } from './context/AdminProductContext';
import { BlogProvider } from './context/BlogContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <UserProvider>
            <ProductProvider>
              <CartProvider>
                <OrderProvider>
                  <AdminProductProvider>
                    <BlogProvider>
                      <Layout>
                        <AppRoutes />
                      </Layout>
                    </BlogProvider>
                  </AdminProductProvider>
                </OrderProvider>
              </CartProvider>
            </ProductProvider>
          </UserProvider>
        </AuthProvider>
      </Router>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </>
  );
}

export default App;
