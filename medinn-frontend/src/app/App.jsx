import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '../routes/AppRoutes';
import ThemeToggle from '../shared/components/ui/ThemeToggle';
import { AuthProvider } from '../features/auth/context/AuthContext';
import { UserProvider } from '../features/users/context/UserContext';
// import { EngagementProvider } from '../shared/context/EngagementContext';
import { ProductProvider } from '../features/products/context/ProductContext';
import { CartProvider } from '../features/cart/context/CartContext';
import { CheckoutProvider } from '../features/checkout/context/CheckoutContext';
import { OrderProvider } from '../features/order/context/OrderContext';
import { PaymentProvider } from '../features/payment/context/PaymentContext';
// import { AdminProductProvider } from './context/AdminProductContext';
// import { BlogProvider } from './context/BlogContext';
import Layout from '../shared/components/layout/Layout';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <UserProvider>
            {/* <EngagementProvider> */}
              <ProductProvider>
                <CartProvider>
                  <CheckoutProvider>
                    <OrderProvider>
                      <PaymentProvider>
                        {/* <AdminProductProvider>
                          <BlogProvider> */}
                            <Layout>
                              <AppRoutes />
                            </Layout>
                          {/* </BlogProvider>
                        </AdminProductProvider> */}
                      </PaymentProvider>
                    </OrderProvider>
                  </CheckoutProvider>
                </CartProvider>
              </ProductProvider>
            {/* </EngagementProvider> */}
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
