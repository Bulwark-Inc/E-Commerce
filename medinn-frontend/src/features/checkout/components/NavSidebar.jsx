import React from 'react';

const steps = [
  { id: 1, label: 'Shipping Info' },
  { id: 2, label: 'Billing Info' },
  { id: 3, label: 'Delivery Method' },
  { id: 4, label: 'Review & Confirm' },
];

const NavSidebar = () => {
  return (
    <nav className="border border-gray-200 dark:border-gray-700 rounded p-4 bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Checkout Steps
      </h2>
      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center space-x-2">
            <span className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400 dark:border-gray-500 text-sm font-medium">
              {step.id}
            </span>
            <span>{step.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavSidebar;
