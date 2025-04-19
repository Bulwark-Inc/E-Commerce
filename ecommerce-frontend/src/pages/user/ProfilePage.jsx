import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FaSave } from 'react-icons/fa';

const ProfilePage = () => {
  const { profile, fetchUserProfile, updateUserProfile, userLoading } = useUser();
  const [form, setForm] = useState({ email: '', name: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setForm({ email: profile.email || '', name: profile.username || '' });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateUserProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (userLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {success && <p className="text-green-600 mb-4">Profile updated successfully!</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Button type="submit" icon={FaSave}>
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
