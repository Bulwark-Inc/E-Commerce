import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Button from '../../../shared/components/ui/Button';


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setStatus(null);

    if (!email) {
      return setFormError('Email is required');
    }

    try {
      setIsLoading(true);
      const res = await requestPasswordReset(email);
      setStatus('Password reset instructions have been sent to your email.');
      setEmail('');
    } catch (error) {
      const detail = error?.response?.data?.detail;
      setFormError(detail || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>

      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{formError}</div>
      )}
      {status && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{status}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Enter your account email:
          </label>
          <input
            type="email"
            name="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          icon={FaPaperPlane}
        >
          Send Reset Link
        </Button>

      </form>
    </div>
  );
};

export default ForgotPasswordPage;
