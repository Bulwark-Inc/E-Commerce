import { Link } from 'react-router-dom';
import { PhoneIcon } from '@heroicons/react/24/solid';
import Button from '../ui/Button';

const AddressCard = ({ address, onDelete }) => {
  return (
    <li className="border p-4 rounded">
      <div className="flex justify-between items-start">
        <address className="not-italic">
          <h2 className="font-bold text-lg">{address.full_name}</h2>
          <p className="text-sm text-gray-500 capitalize">{address.address_type} Address</p>
          <p>{address.address_line1}</p>
          {address.address_line2 && <p>{address.address_line2}</p>}
          <p>{address.city}, {address.state}, {address.postal_code}</p>
          <p>{address.country}</p>
          {address.phone_number && (
            <p className="mt-1 flex items-center gap-1 text-gray-700">
              <PhoneIcon className="w-4 h-4 text-gray-500" />
              {address.phone_number}
            </p>
          )}
          {address.default && (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-600 text-white rounded">
              Default
            </span>
          )}
        </address>
        <div className="space-y-2 text-right">
          <Link to={`/addresses/${address.id}/edit`} className="text-blue-600 hover:underline block">
            Edit
          </Link>
          <Button onClick={() => onDelete(address.id)} variant="danger">
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
};

export default AddressCard;
