import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AddressCard from '../components/widgets/AddressCard';

const AddressListPage = () => {
  const { addresses, fetchUserAddresses, deleteAddress, userLoading } = useUser();

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  if (userLoading) {
    return <p className="text-center mt-6">Loading addresses...</p>;
  }

  if (!userLoading && (!addresses || addresses.length === 0)) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <Link
            to="/addresses/new"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Address
          </Link>
        </div>
        <p>No addresses found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Link
          to="/addresses/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Address
        </Link>
      </div>

      <ul className="space-y-4">
        {addresses.map((addr) => (
          <AddressCard key={addr.id} address={addr} onDelete={deleteAddress} />
        ))}
      </ul>
    </div>
  );
};

export default AddressListPage;
