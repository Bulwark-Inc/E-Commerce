import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import countries from '../../constants/countries';

const AddressForm = ({ initialData, onSubmit, isEdit }) => {
  const [form, setForm] = useState({
    full_name: '',
    address_type: 'shipping',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Nigeria',
    phone_number: '',
    default: false,
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="full_name" label="Full Name" value={form.full_name} onChange={handleChange} required />
      <Select
        name="address_type"
        label="Address Type"
        value={form.address_type}
        onChange={handleChange}
        options={[
          { value: 'shipping', label: 'Shipping' },
          { value: 'billing', label: 'Billing' }
        ]}
      />
      <Input name="address_line1" label="Address Line 1" value={form.address_line1} onChange={handleChange} required />
      <Input name="address_line2" label="Address Line 2" value={form.address_line2} onChange={handleChange} />
      <Input name="city" label="City" value={form.city} onChange={handleChange} required />
      <Input name="state" label="State" value={form.state} onChange={handleChange} required />
      <Input name="postal_code" label="Postal Code" value={form.postal_code} onChange={handleChange} required />
      <Select
        name="country"
        label="Country"
        value={form.country}
        onChange={handleChange}
        options={countries.map(c => ({ value: c.name, label: c.name }))}
      />
      <Input name="phone_number" label="Phone Number" value={form.phone_number} onChange={handleChange} required />
      <div className="flex items-center">
        <input
          type="checkbox"
          id="default"
          name="default"
          checked={form.default}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="default">Set as default</label>
      </div>
      <Button type="submit">{isEdit ? 'Update' : 'Add'}</Button>
    </form>
  );
};

export default AddressForm;
