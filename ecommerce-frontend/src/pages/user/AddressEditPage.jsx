import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const AddressEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addresses, fetchUserAddresses, updateAddress } = useUser();

  const [form, setForm] = useState({
    full_name: '',
    address_type: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone_number: '',
    default: false,
  });

  useEffect(() => {
    fetchUserAddresses(); // fetch all addresses on component mount
  }, []);

  useEffect(() => {
    if (id) {
      const address = addresses.find((addr) => addr.id === parseInt(id)); // match the address based on id from URL
      if (address) {
        setForm({
          full_name: address.full_name,
          address_type: address.address_type,
          address_line1: address.address_line1,
          address_line2: address.address_line2 || '',
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
          phone_number: address.phone_number,
          default: address.default,
        });
      }
    }
  }, [addresses, id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAddress(id, form); // Update the address with the new data
      navigate('/addresses'); // Redirect to the address list page
    } catch (err) {
      console.error('Address update failed', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Address</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {['full_name', 'address_type', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'phone_number'].map((field) => (
          <Input
            key={field}
            id={field}
            name={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            required
          />
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="default"
            name="default"
            checked={form.default}
            onChange={() => setForm({ ...form, default: !form.default })}
            className="mr-2"
          />
          <label htmlFor="default">Set as default address</label>
        </div>

        <Button type="submit">Update Address</Button>
      </form>
    </div>
  );
};

export default AddressEditPage;
