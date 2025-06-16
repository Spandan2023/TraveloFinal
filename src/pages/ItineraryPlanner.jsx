import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import axios from 'axios';

const ItineraryPlanner = () => {
  const [items, setItems] = useState([]);
  const [date, setDate] = useState('');
  const [activity, setActivity] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState(1000);
  const [travelers, setTravelers] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('saved-itinerary');
    if (saved) {
      const parsed = JSON.parse(saved);
      setItems(parsed.items || []);
      setDestination(parsed.destination || '');
      setDays(parsed.days || 1);
      setBudget(parsed.budget || 1000);
      setTravelers(parsed.travelers || 1);
    }
  }, []);

  const saveToLocalStorage = () => {
    const itineraryData = {
      items,
      destination,
      days,
      budget,
      travelers,
    };
    localStorage.setItem('saved-itinerary', JSON.stringify(itineraryData));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!date || !activity) return;
    setItems([...items, { date, activity, completed: false }]);
    setDate('');
    setActivity('');
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    setItems(items.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    ));
  };

  const generateItinerary = async () => {
    if (!destination) return;
    setIsGenerating(true);

    try {
      const response = await axios.post('http://localhost:8080/api/itinerary/generate', {
        destination,
        days,
        budget,
        travelers
      });

      const responseData = response.data.response;
      if (responseData) {
        const parsed = JSON.parse(responseData);
        const aiContent = parsed.ai || '';
        const lines = aiContent.split('\n').filter(line => line.trim() !== '');

        const today = new Date();
        const generatedItems = [];
        let dayOffset = 0;
        let lastHeader = '';

        for (const line of lines) {
          if (/\w{3}, \w{3} \d{1,2}/.test(line)) {
            lastHeader = new Date(today);
            lastHeader.setDate(today.getDate() + dayOffset);
            dayOffset++;
            continue;
          }

          if (line.replace(/[*_]/g, '').trim().length > 0) {
            const cleaned = line.replace(/[*_]/g, '');
            generatedItems.push({ date: lastHeader.toISOString().split('T')[0], activity: cleaned, completed: false });
          }
        }
        setItems(generatedItems);
      } else {
        alert("Failed to generate itinerary.");
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      alert("An error occurred while generating the itinerary.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveItineraryToFile = () => {
    const itineraryText = `Travel Itinerary for ${destination}\n\n` +
      `Duration: ${days} days\nBudget: ₹${budget}\nTravelers: ${travelers}\n\n` +
      items.map(item => `${item.date}: ${item.activity} ${item.completed ? '✓' : ''}`).join('\n');

    const blob = new Blob([itineraryText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${destination}-itinerary.txt`);
  };

  const groupByDate = () => {
    return items.reduce((acc, item) => {
      acc[item.date] = acc[item.date] || [];
      acc[item.date].push(item);
      return acc;
    }, {});
  };

  const borderColors = [
    'from-blue-500 to-purple-600',
    'from-pink-500 to-red-500',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-orange-500',
    'from-indigo-500 to-blue-400'
  ];

  const grouped = groupByDate();
  const dates = Object.keys(grouped).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-[Poppins]">
      <h1 className="text-4xl font-bold mb-10 text-center text-white bg-gradient-to-r from-purple-500 to-blue-500 inline-block text-transparent bg-clip-text">Trip Planner</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/70 rounded-2xl p-6 shadow-lg border border-gray-700 backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Trip Details</h2>
          <div className="space-y-4">
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Location" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none text-white placeholder-gray-400" />
            <input type="number" min="1" value={days} onChange={(e) => setDays(Number(e.target.value))} placeholder="Days" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none text-white placeholder-gray-400" />
            <input type="number" min="100" step="100" value={budget} onChange={(e) => setBudget(Number(e.target.value))} placeholder="Budget" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none text-white placeholder-gray-400" />
            <input type="number" min="1" value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} placeholder="No. of People Travelling" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none text-white placeholder-gray-400" />
            <button onClick={generateItinerary} disabled={!destination || isGenerating} className={`w-full py-2 rounded-xl font-medium transition bg-gradient-to-r from-blue-500 to-purple-600 text-white ${!destination || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isGenerating ? 'Generating...' : 'Generate Itinerary'}
            </button>
          </div>
        </div>

        <div className="bg-gray-900/70 rounded-2xl p-6 shadow-lg border border-gray-700 backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Add Custom Activities</h2>
          <form onSubmit={addItem} className="flex flex-col gap-4">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none text-white" required />
            <input type="text" value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Activity description" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none text-white placeholder-gray-400" required />
            <button type="submit" className="bg-gradient-to-r from-green-400 to-lime-500 text-white font-semibold py-2 rounded-xl flex items-center justify-center gap-2"><FaPlus /> Add</button>
          </form>
          {items.length > 0 && (
            <div className="flex justify-end mt-4">
              <button onClick={() => { saveToLocalStorage(); saveItineraryToFile(); }} className="bg-gradient-to-r from-teal-400 to-green-500 px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center gap-2">
                <FaSave /> Save Itinerary
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        {dates.length === 0 ? (
          <div className="bg-gray-900/70 rounded-2xl p-8 shadow-lg border border-gray-700 text-center">
            <p className="text-gray-400">
              {destination ? 'Your itinerary is empty. Add activities or generate a suggested itinerary.' : 'Enter your trip details to get started.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {dates.map((date, index) => (
              <div key={date} className={`p-6 rounded-2xl backdrop-blur-md border-2 border-transparent bg-gradient-to-r ${borderColors[index % borderColors.length]} shadow-xl text-white`}>
                <h3 className="text-2xl font-semibold mb-4">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'short', day: 'numeric'
                  })}
                </h3>
                <div className="space-y-3">
                  {grouped[date].map((item, i) => (
                    <div key={i} className="flex justify-between items-start bg-gray-900/70 rounded-lg p-3">
                      <div className="flex gap-2">
                        <input type="checkbox" checked={item.completed} onChange={() => toggleComplete(items.indexOf(item))} className="h-5 w-5 text-blue-500 accent-blue-500" />
                        <p className={`${item.completed ? 'text-gray-500 line-through' : 'text-white'}`}>{item.activity}</p>
                      </div>
                      <button onClick={() => removeItem(items.indexOf(item))} className="text-red-400 hover:text-red-600 text-lg"><FaTimes /></button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryPlanner;
