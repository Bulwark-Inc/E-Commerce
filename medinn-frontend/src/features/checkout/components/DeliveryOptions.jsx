import React from 'react';

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard (3–5 days)', price: 500 },
  { id: 'express', label: 'Express (1–2 days)', price: 1000 },
  { id: 'pickup', label: 'Pickup (Free)', price: 0 },
];

const DeliveryOptions = ({ onChange }) => {
  const [selected, setSelected] = React.useState(DELIVERY_OPTIONS[0]);

  React.useEffect(() => {
    onChange(selected);
  }, []);

  const handleChange = (option) => {
    setSelected(option);
    onChange(option);
  };

  return (
    <section>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        Delivery Method
      </h3>
      <div className="space-y-2">
        {DELIVERY_OPTIONS.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
          >
            <input
              type="radio"
              name="delivery"
              checked={selected.id === option.id}
              onChange={() => handleChange(option)}
            />
            <span>{option.label} — ₦{option.price}</span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default DeliveryOptions;
