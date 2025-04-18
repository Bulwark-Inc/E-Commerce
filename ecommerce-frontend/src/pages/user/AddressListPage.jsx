import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const AddressListPage = () => {
  const { addresses, fetchUserAddresses, deleteAddress, userLoading } = useUser();

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  if (userLoading) return <p>Loading addresses...</p>;

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

      {addresses.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="border p-4 rounded flex justify-between items-start"
            >
              <div>
                <p className="font-medium">{addr.line1}</p>
                <p className="text-sm text-gray-500">
                  {addr.city}, {addr.state}, {addr.country}
                </p>
              </div>
              <div className="space-x-2">
                <Link
                  to={`/addresses/${addr.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressListPage;
