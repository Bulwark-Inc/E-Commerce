import React from 'react';
import { FaSortAmountDownAlt } from 'react-icons/fa';

const DropdownSelect = ({ value, onChange, options }) => {
  return (
    <div className="relative w-full">
      <div className="flex items-center px-3 py-2 border rounded-full bg-white shadow-sm focus-within:ring-1 focus-within:ring-purple-700">
        <FaSortAmountDownAlt className="mr-2 text-purple-700" />
        <select
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DropdownSelect;
