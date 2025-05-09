import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const PaymentStatus = ({ status, message }) => {
  const statusConfig = {
    success: {
      color: 'border-green-500 text-green-600',
      icon: <CheckCircleIcon className="w-6 h-6 text-green-600" />
    },
    failed: {
      color: 'border-red-500 text-red-600',
      icon: <XCircleIcon className="w-6 h-6 text-red-600" />
    },
    pending: {
      color: 'border-yellow-500 text-yellow-600',
      icon: <ClockIcon className="w-6 h-6 text-yellow-600" />
    }
  }[status] || { color: 'border-gray-300 text-gray-600', icon: null };

  return (
    <div className={`p-4 border rounded-xl flex items-center gap-3 mt-6 ${statusConfig.color}`}>
      {statusConfig.icon}
      <div>
        <h3 className="font-semibold">Payment Status: {status}</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
