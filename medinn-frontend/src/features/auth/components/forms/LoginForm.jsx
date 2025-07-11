import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../../../../shared/components/ui/Button';
import Input from '../../../../shared/components/ui/Input';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const { email, password } = formData;

    if (!email || !password) {
      setFormError('Email and password are required.');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      navigate('/profile');
    } catch (error) {
      setFormError(error.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {formError}
        </div>
      )}
      <Input
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label htmlFor="password" className="text-gray-700">Password</label>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit"
        variant="primary"
        isLoading={isLoading}
        icon={ FaLock }
        >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
