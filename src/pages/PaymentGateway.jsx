import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PaymentGateway = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
    paymentMethod: 'Credit Card',
  });

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (state?.hotel && state?.checkIn && state?.checkOut) {
      const checkInDate = new Date(state.checkIn);
      const checkOutDate = new Date(state.checkOut);
      const diffTime = Math.abs(checkOutDate - checkInDate);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const subtotal = state.hotel.pricePerNight * nights;
      const tax = subtotal * 0.15;
      const total = subtotal + tax;

      setBookingDetails({
        hotel: state.hotel,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        nights,
        subtotal,
        tax,
        total,
      });
    } else {
      navigate('/hotels');
    }
  }, [state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus(null);

    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    const isCardValid =
      formData.cardName.trim() !== '' &&
      cleanCardNumber.length === 16 &&
      formData.expiry.trim() !== '' &&
      formData.cvv.length === 3 &&
      /^\d{3}$/.test(formData.cvv);

    const isUpiValid = formData.upiId.trim() !== '' && /@/.test(formData.upiId);

    const isPaymentValid =
      formData.paymentMethod === 'Credit Card' ? isCardValid : isUpiValid;

    if (isPaymentValid) {
      const transactionId = `TRX-${Math.floor(Math.random() * 1000000)}`;
      try {
        const response = await axios.post('http://localhost:8080/api/payments/process', {
          
            userEmail: currentUser.email,
            hotelName: bookingDetails.hotel.name,
            checkIn: bookingDetails.checkIn,
            checkOut: bookingDetails.checkOut,
            amount: bookingDetails.total,
            paymentMethod: formData.paymentMethod

          });

        if (response.status === 200 || response.status === 201) {
          setPaymentStatus({
            success: true,
            message: 'Payment successful! Your booking is confirmed.',
            transactionId,
          });
        } else {
          setPaymentStatus({
            success: false,
            message: 'Payment failed. Server error.',
          });
        }
      } catch (error) {
        setPaymentStatus({
          success: false,
          message: 'Payment failed. Network or server issue.',
        });
        console.error('Payment Error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setPaymentStatus({
        success: false,
        message: 'Payment failed. Please check your details and try again.',
      });
    }
  };

  if (!bookingDetails) {
    return <div className="text-white text-center py-8 px-4">Loading booking details...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        {!paymentStatus?.success ? (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
            noValidate
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Card Payment</h2>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-1">Name on Card</label>
              <input name="cardName" value={formData.cardName} onChange={handleChange} type="text" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-1">Card Number</label>
              <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} type="text" maxLength={19} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Expiry Date</label>
                <input name="expiry" value={formData.expiry} onChange={handleChange} type="month" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">CVV</label>
                <input name="cvv" value={formData.cvv} onChange={handleChange} type="password" maxLength={3} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-white">UPI Payment</h2>
            <div className="flex gap-4 mb-4">
              <label className="text-gray-400">
                <input type="radio" name="paymentMethod" value="Google Pay" checked={formData.paymentMethod === 'Google Pay'} onChange={handleChange} className="mr-2" />
                Google Pay
              </label>
              <label className="text-gray-400">
                <input type="radio" name="paymentMethod" value="PhonePe" checked={formData.paymentMethod === 'PhonePe'} onChange={handleChange} className="mr-2" />
                PhonePe
              </label>
              <label className="text-gray-400">
                <input type="radio" name="paymentMethod" value="Credit Card" checked={formData.paymentMethod === 'Credit Card'} onChange={handleChange} className="mr-2" />
                Credit Card
              </label>
            </div>

            {(formData.paymentMethod === 'Google Pay' || formData.paymentMethod === 'PhonePe') && (
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-1">Enter your UPI ID</label>
                <input name="upiId" value={formData.upiId} onChange={handleChange} type="text" placeholder="example@upi" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
              </div>
            )}

            {paymentStatus && !paymentStatus.success && (
              <div className="bg-red-900 text-red-200 p-3 rounded-lg mb-4">{paymentStatus.message}</div>
            )}

            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold transition ${loading ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Processing Payment...' : 'Pay Now'}
            </button>
          </form>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-green-600 text-center">
            <div className="text-green-400 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-300 mb-4">{paymentStatus.message}</p>
            <p className="text-gray-400 text-sm mb-6">Transaction ID: <code>{paymentStatus.transactionId}</code></p>
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Booking Confirmation</h3>
              <p className="text-sm text-gray-300">We've sent the booking details to <strong>{currentUser.email}</strong>.</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition">Go to Dashboard</button>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Booking Summary</h2>
        <div className="flex items-start mb-4">
          <img src={bookingDetails.hotel.image} alt={bookingDetails.hotel.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
          <div>
            <h3 className="font-bold">{bookingDetails.hotel.name}</h3>
            <p className="text-gray-400 text-sm">{bookingDetails.hotel.location}</p>
            <p className="text-blue-400 mt-1">${bookingDetails.hotel.pricePerNight.toFixed(2)} per night</p>
            <p className="text-gray-400 text-sm mt-1">{bookingDetails.nights} night(s)</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-sm">Check-in</p>
            <p>{new Date(bookingDetails.checkIn).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Check-out</p>
            <p>{new Date(bookingDetails.checkOut).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between mb-1">
            <p className="text-gray-400">Subtotal</p>
            <p>${bookingDetails.subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-1">
            <p className="text-gray-400">Tax (15%)</p>
            <p>${bookingDetails.tax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold text-xl text-white">
            <p>Total</p>
            <p>${bookingDetails.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;