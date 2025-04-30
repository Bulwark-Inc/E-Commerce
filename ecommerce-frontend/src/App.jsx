import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { AdminProductProvider } from './context/AdminProductContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <ProductProvider>
            <AdminProductProvider>
              <Layout>
                <AppRoutes />
              </Layout>
            </AdminProductProvider>
          </ProductProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
