import { useState } from 'react';
import { useUser } from '../../users/context/UserContext';

const ChangePasswordPage = () => {
  const { changePassword } = useUser();
  const [form, setForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (form.new_password !== form.confirm_password) {
      setError("New passwords don't match");
      return;
    }

    try {
      await changePassword({
        old_password: form.old_password,
        new_password: form.new_password
      });
      setSuccess(true);
      setForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError('Password change failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>

      {success && <p className="text-green-600 mb-4">Password changed successfully.</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="old_password"
          type="password"
          placeholder="Old Password"
          value={form.old_password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="new_password"
          type="password"
          placeholder="New Password"
          value={form.new_password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="confirm_password"
          type="password"
          placeholder="Confirm New Password"
          value={form.confirm_password}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;