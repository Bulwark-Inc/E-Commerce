import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResetPasswordPage = () => {
  const { uid, token } = useParams();
  const { passwordResetConfirm } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setStatus(null);

    if (!password || !password2) {
      return setFormError('Please fill out both fields');
    }

    if (password !== password2) {
      return setFormError('Passwords do not match');
    }

    try {
      setIsLoading(true);
      await passwordResetConfirm(uid, token, password, password2);
      setStatus('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setFormError(error.response?.data?.detail || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Set New Password</h1>

      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{formError}</div>
      )}
      {status && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{status}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password2" className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            id="password2"
            autoComplete="new-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
