import { Link } from 'react-router-dom';

const AddressCard = ({ address, onDelete }) => {
  return (
    <li className="border p-4 rounded flex justify-between items-start">
      <div>
        <p className="font-medium">{address.line1}</p>
        <p className="text-sm text-gray-500">
          {address.city}, {address.state}, {address.country}
        </p>
      </div>
      <div className="space-x-2">
        <Link
          to={`/addresses/${address.id}/edit`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(address.id)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default AddressCard;
