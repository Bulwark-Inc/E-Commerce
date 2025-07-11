import React, { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';

const PaymentForm = ({ orderId }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const { startPayment, loading, paymentSuccess, error } = usePayment();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    startPayment(orderId); // Start the payment process
  };

  if (paymentSuccess) {
    return <div className="success-message">Payment initiated successfully!</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>

      <div>
        <label>Expiry Date</label>
        <input
          type="text"
          name="expiryDate"
          value={paymentDetails.expiryDate}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>

      <div>
        <label>CVV</label>
        <input
          type="text"
          name="cvv"
          value={paymentDetails.cvv}
          onChange={handleChange}
          className="p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
};

export default PaymentForm;
