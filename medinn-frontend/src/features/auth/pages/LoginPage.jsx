import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import LoginForm from '../components/forms/LoginForm';
import AuthWrapper from '../../../shared/components/layout/AuthLayout';
import Button from '../../../shared/components/ui/Button';

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
