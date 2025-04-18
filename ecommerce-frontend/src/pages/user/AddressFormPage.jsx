import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const AddressFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addresses, fetchUserAddresses, addAddress, updateAddress } = useUser();

  const [form, setForm] = useState({
    line1: '',
    city: '',
    state: '',
    country: ''
  });

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const address = addresses.find((addr) => addr.id === parseInt(id));
      if (address) setForm(address);
    }
  }, [addresses, id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateAddress(id, form);
      } else {
        await addAddress(form);
      }
      navigate('/addresses');
    } catch (err) {
      console.error('Address submission failed', err);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Address' : 'Add New Address'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {['line1', 'city', 'state', 'country'].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEdit ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default AddressFormPage;
