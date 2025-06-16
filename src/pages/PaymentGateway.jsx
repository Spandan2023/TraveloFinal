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
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
    paymentMethod: '',
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
      const transactionId = `TRX-${Math.floor(Math.random() * 1000000000000000)}`;
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

  const inputStyle = "w-full px-4 py-2 rounded-lg border bg-[#1e1e1e] border-gray-600 placeholder-white text-white";
  const isCardDisabled = formData.paymentMethod !== 'Credit Card';
  const isUpiSelected = formData.paymentMethod === 'Google Pay' || formData.paymentMethod === 'PhonePe';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-100 to-orange-200 py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        <div className={`rounded-2xl p-6 shadow-xl border-2 border-orange-300 bg-white/20 backdrop-blur-md ${paymentStatus?.success ? 'text-center' : ''}`}>
          {!paymentStatus?.success ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-2xl font-bold text-black">Card Payment</h2>
              <div>
                <label className="block text-black text-sm mb-1">Email id</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  className={inputStyle}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-black text-sm mb-1">Name on Card</label>
                <input
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  type="text"
                  className={`${inputStyle} ${isCardDisabled ? 'opacity-60' : ''}`}
                  disabled={isCardDisabled}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-black text-sm mb-1">Card Number</label>
                <input
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  type="text"
                  maxLength={19}
                  className={`${inputStyle} font-[Times New Roman] tracking-widest ${isCardDisabled ? 'opacity-60' : ''}`}
                  disabled={isCardDisabled}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-black text-sm mb-1">Expiry Date</label>
                  <input
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    type="month"
                    className={`${inputStyle} ${isCardDisabled ? 'opacity-60' : ''}`}
                    disabled={isCardDisabled}
                  />
                </div>
                <div>
                  <label className="block text-black text-sm mb-1">CVV</label>
                  <input
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    type="password"
                    maxLength={3}
                    className={`${inputStyle} font-[Times New Roman] ${isCardDisabled ? 'opacity-60' : ''}`}
                    disabled={isCardDisabled}
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-black mt-6">UPI Payment</h2>
              <div className="flex gap-4 mb-3">
                {['Google Pay', 'PhonePe', 'Credit Card'].map((method) => (
                  <label key={method} className="text-black flex items-center space-x-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleChange}
                      className="w-5 h-5 accent-orange-400"
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>

              {isUpiSelected && (
                <div>
                  <label className="block text-black text-sm mb-1">Enter your UPI ID</label>
                  <input
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    type="text"
                    className={`${inputStyle} ring-2 ring-green-300`}
                    placeholder="example@upi"
                  />
                </div>
              )}

              {paymentStatus && !paymentStatus.success && (
                <div className="bg-red-600/80 text-white p-3 rounded-lg">{paymentStatus.message}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-green-400 to-orange-400 hover:from-green-500 hover:to-orange-500 transition`}
              >
                {loading ? 'Processing Payment...' : 'Pay Now'}
              </button>
            </form>
          ) : (
            <div className="text-white space-y-4">
              <div className="text-green-800 text-5xl">✓</div>
              <h2 className="text-2xl font-bold text-black">Payment Successful!</h2>
              <p className="text-black">{paymentStatus.message}</p>
              <p className="text-sm text-black">
                Transaction ID: <code className="text-black">{paymentStatus.transactionId}</code>
              </p>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold text-black">Booking Confirmation</h3>
                <p className="text-sm text-black">
                  We've sent the booking details to <strong className="text-black">{currentUser.email}</strong>.
                </p>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-lg text-white font-semibold"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-6 shadow-xl border-2 border-red-300 bg-white/20 backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-4 text-black">Booking Summary</h2>
          <div className="flex items-start mb-4">
            <img src={bookingDetails.hotel.image} alt={bookingDetails.hotel.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
            <div>
              <h3 className="font-bold text-black">{bookingDetails.hotel.name}</h3>
              <p className="text-black text-sm">{bookingDetails.hotel.location}</p>
              <p className="text-green-300 mt-1">${bookingDetails.hotel.pricePerNight.toFixed(2)} per night</p>
              <p className="text-black text-sm mt-1">{bookingDetails.nights} night(s)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4 text-black">
            <div>
              <p className="text-sm text-black">Check-in</p>
              <p>{new Date(bookingDetails.checkIn).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-black">Check-out</p>
              <p>{new Date(bookingDetails.checkOut).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="border-t border-gray-400 pt-4 text-black">
            <div className="flex justify-between mb-1">
              <p className="text-black">Subtotal</p>
              <p>${bookingDetails.subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="text-black">Tax (15%)</p>
              <p>${bookingDetails.tax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <p>Total</p>
              <p>${bookingDetails.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
