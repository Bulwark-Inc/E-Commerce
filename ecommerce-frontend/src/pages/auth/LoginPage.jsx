import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import LoginForm from '../../components/form/LoginForm';
import AuthWrapper from '../../components/layout/AuthLayout';
import Button from '../../components/ui/Button';

const LoginPage = () => (
  <AuthWrapper title="Login">
    <LoginForm />
    <p className="text-center mt-4">
      Don't have an account?{' '}
        <Link to="/register">
          <Button variant="outline" icon={FaUserPlus}>
            Register
          </Button>
        </Link>
    </p>
  </AuthWrapper>
);

export default LoginPage;
