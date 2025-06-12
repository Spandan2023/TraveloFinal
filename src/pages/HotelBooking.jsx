import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TAXES_FEES = 45;

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return diff > 0 ? diff / (1000 * 60 * 60 * 24) : 0;
};

const HotelCard = ({ hotel, selected, onSelect }) => (
  <div
    className={`bg-gray-800 rounded-lg p-0 shadow-lg overflow-hidden border-2 transition cursor-pointer ${
      selected ? 'border-blue-500' : 'border-gray-700 hover:border-blue-400'
    }`}
    onClick={() => onSelect(hotel)}
  >
    <div className="h-48 overflow-hidden">
      <img src={hotel.imageUrl} alt={hotel.hotelName} className="w-full h-full object-cover" />
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-1">{hotel.hotelName}</h2>
          <p className="text-gray-400 mb-2">{hotel.location}</p>
        </div>
        <div className="flex items-center bg-gray-700 px-2 py-1 rounded">
          <span className="text-yellow-400">★</span>
          <span className="ml-1">{hotel.rating}</span>
        </div>
      </div>

      <div className="my-3">
        {(hotel.amenities?.split(',') || []).map((amenity, i) => (
          <span key={i} className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded mr-2 mb-2">
            {amenity.trim()}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-2xl font-bold">
          ${hotel.pricePerNight} <span className="text-sm text-gray-400 font-normal">/ night</span>
        </p>
        <span className={`text-xs px-2 py-1 rounded ${hotel.available ? 'bg-green-600' : 'bg-red-600'}`}>
          {hotel.available ? 'Available' : 'Booked'}
        </span>
      </div>
    </div>
  </div>
);

const HotelDetailsModal = ({ hotel, checkIn, checkOut, nights, onClose, onBook, isBooking }) => {
  const totalPrice = nights * hotel.pricePerNight + TAXES_FEES;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{hotel.hotelName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img src={hotel.imageUrl} alt={hotel.hotelName} className="w-full rounded-lg" />
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {(hotel.amenities?.split(',') || []).map((a, i) => (
                  <span key={i} className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded">{a.trim()}</span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Location</h3>
              <p className="text-gray-300">{hotel.location}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Your Stay</h3>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Check-in:</span>
                  <span>{checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Check-out:</span>
                  <span>{checkOut}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-1">Price Summary</h3>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">${hotel.pricePerNight} x {nights} nights</span>
                  <span>${hotel.pricePerNight * nights}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Taxes & Fees</span>
                  <span>${TAXES_FEES}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-600 font-bold">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onBook}
              disabled={nights <= 0 || isBooking}
              className={`w-full py-3 rounded-lg font-bold transition ${isBooking ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isBooking ? 'Processing...' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelBooking = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();

  const nights = calculateNights(checkIn, checkOut);

  useEffect(() => {
    axios.get('http://localhost:8080/api/hotels/all')
      .then(res => {
        setHotels(res.data);
        setFilteredHotels(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = [...hotels];

    if (availabilityOnly) {
      filtered = filtered.filter(h => h.available);
    }

    if (sortOption === 'priceLowHigh') {
      filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortOption === 'priceHighLow') {
      filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortOption === 'ratingLowHigh') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sortOption === 'ratingHighLow') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredHotels(filtered);
  }, [sortOption, availabilityOnly, hotels]);

  const handleBookNow = () => {
    if (!selectedHotel || nights <= 0) return alert('Complete selection before booking.');
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      navigate('/payment', { state: { hotel: selectedHotel, checkIn, checkOut } });
    }, 1000);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Hotel Booking</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-800 p-3 rounded text-white" />
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
          className="bg-gray-800 p-3 rounded text-white" />
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
          className="bg-gray-800 p-3 rounded text-white" />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}
          className="bg-gray-800 p-3 rounded text-white">
          <option value="">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="ratingHighLow">Rating: High to Low</option>
          <option value="ratingLowHigh">Rating: Low to High</option>
        </select>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={availabilityOnly} onChange={() => setAvailabilityOnly(!availabilityOnly)} />
          Show only Available Hotels
        </label>
      </div>

      {filteredHotels.length === 0 ? (
        <p className="text-center text-gray-400">No hotels found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredHotels.map(hotel => (
            <HotelCard
              key={hotel.hotelId}
              hotel={hotel}
              selected={selectedHotel?.hotelId === hotel.hotelId}
              onSelect={(h) => h.available && setSelectedHotel(h)}
            />
          ))}
        </div>
      )}

      {selectedHotel && (
        <HotelDetailsModal
          hotel={selectedHotel}
          checkIn={checkIn}
          checkOut={checkOut}
          nights={nights}
          onClose={() => setSelectedHotel(null)}
          onBook={handleBookNow}
          isBooking={isBooking}
        />
      )}
    </div>
  );
};

export default HotelBooking;
