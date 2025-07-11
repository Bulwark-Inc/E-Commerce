import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../../../shared/components/ui/Input';
import Button from '../../../shared/components/ui/Button';
import { FaKey } from 'react-icons/fa';

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

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <Input
          label="New Password"
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm Password"
          id="password2"
          type="password"
          autoComplete="new-password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />

        <Button
          type="submit"
          isLoading={isLoading}
          icon={FaKey}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
