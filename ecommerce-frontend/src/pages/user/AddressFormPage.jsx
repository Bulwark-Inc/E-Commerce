import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import AddressForm from '../../components/forms/AddressForm';
import toast from 'react-hot-toast';

const AddressFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addresses, fetchUserAddresses, addAddress, updateAddress } = useUser();

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const addressToEdit = isEdit
    ? addresses.find((addr) => addr.id === parseInt(id))
    : null;

  const handleSubmit = async (formData) => {
    try {
      if (isEdit) {
        await updateAddress(id, formData);
        toast.success('Address updated successfully!');
      } else {
        await addAddress(formData);
        toast.success('Address Created successfully!');
      }
      navigate('/addresses');
    } catch (err) {
      console.error('Address submission failed', err);
      toast.error(err?.response?.data?.detail || 'Failed to save address');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Address' : 'Add New Address'}
      </h1>
      <AddressForm
        initialData={addressToEdit}
        onSubmit={handleSubmit}
        isEdit={isEdit}
      />
    </div>
  );
};

export default AddressFormPage;
