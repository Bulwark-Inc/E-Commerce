import React from 'react';

const BillingSelector = ({ addresses, selectedId, onSelect, shippingId }) => {
  const [useSame, setUseSame] = React.useState(true);

  // When 'Same as shipping address' is selected, use the shipping address ID for billing
  const selectedBillingId = useSame ? shippingId : selectedId;

  return (
    <section>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        Billing Address
      </h3>
      <label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={useSame}
          onChange={() => setUseSame(!useSame)}
        />
        <span>Same as shipping address</span>
      </label>

      {/* Only show the dropdown if 'Same as shipping address' is unchecked */}
      {!useSame && (
        <select
          value={selectedBillingId || ''}
          onChange={(e) => onSelect(parseInt(e.target.value))}
          className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        >
          {addresses.map((address) => (
            <option key={address.id} value={address.id}>
              {address.full_name}, {address.address_line1}, {address.city}
            </option>
          ))}
        </select>
      )}
    </section>
  );
};

export default BillingSelector;
