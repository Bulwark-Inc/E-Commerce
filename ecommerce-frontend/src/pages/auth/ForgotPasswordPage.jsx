import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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
      await requestPasswordReset(email);
      setStatus('Password reset instructions sent to your email.');
    } catch (error) {
      setFormError(error.response?.data?.detail || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Reset Password</h1>

      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{formError}</div>
      )}
      {status && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{status}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
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

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 rounded-md font-medium ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
