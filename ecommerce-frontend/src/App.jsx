import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AdminProductProvider } from './context/AdminProductContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <AdminProductProvider>
                  <Layout>
                    <AppRoutes />
                  </Layout>
                </AdminProductProvider>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
