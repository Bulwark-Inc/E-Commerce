const ShippingForm = ({ addresses, selectedId, onSelect }) => {
  // Ensure the default address is selected if no selectedId is provided
  const defaultAddress = addresses.find((address) => address.default) || addresses[0];

  return (
    <section>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        Shipping Address
      </h3>
      <select
        value={selectedId || defaultAddress?.id || ''}
        onChange={(e) => onSelect(parseInt(e.target.value))}
        className="w-full border border-gray-300 dark:border-gray-700 rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
      >
        {addresses.map((address) => (
          <option key={address.id} value={address.id}>
            {/* Display address info in the dropdown */}
            {address.full_name}, {address.address_line1}, {address.city}, {address.state}
          </option>
        ))}
      </select>
    </section>
  );
};

export default ShippingForm;
