import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

const ItineraryPlanner = () => {
  const [items, setItems] = useState([]);
  const [date, setDate] = useState('');
  const [activity, setActivity] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState(1000);
  const [travelers, setTravelers] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load itinerary from localStorage on component mount
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

  // Save itinerary to localStorage
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

  const generateItinerary = () => {
    if (!destination) return;
    setIsGenerating(true);

    const activityTemplates = [
      `Visit a local museum in ${destination}`,
      `Explore historic landmarks of ${destination}`,
      `Try traditional food in ${destination}`,
      `Take a scenic walk or park tour in ${destination}`,
      `Attend a cultural or music event in ${destination}`,
      `Relax with a spa or wellness session in ${destination}`,
      `Shop at local markets in ${destination}`,
      `Take a guided tour of ${destination}`,
      `Go on a local adventure or hike`,
    ];

    const getRandomActivity = () =>
      activityTemplates[Math.floor(Math.random() * activityTemplates.length)];

    setTimeout(() => {
      const generatedItems = [];
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        generatedItems.push(
          { date: dateStr, activity: `Morning: ${getRandomActivity()}`, completed: false },
          { date: dateStr, activity: `Afternoon: ${getRandomActivity()}`, completed: false },
          { date: dateStr, activity: `Evening: ${getRandomActivity()}`, completed: false }
        );
      }

      setItems(generatedItems);
      setIsGenerating(false);
    }, 1500);
  };

  const saveItineraryToFile = () => {
    const itineraryText = `Travel Itinerary for ${destination}\n\n` +
      `Duration: ${days} days\nBudget: $${budget}\nTravelers: ${travelers}\n\n` +
      items.map(item =>
        `${item.date}: ${item.activity} ${item.completed ? '✓' : ''}`
      ).join('\n');

    const blob = new Blob([itineraryText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${destination}-itinerary.txt`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Trip Planner</h1>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Trip Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-white"
              placeholder="Where are you going?"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Duration (days)</label>
            <input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Budget ($)</label>
            <input
              type="number"
              min="100"
              step="100"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-white"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Number of Travelers</label>
          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-white"
          />
        </div>

        <button
          onClick={generateItinerary}
          disabled={!destination || isGenerating}
          className={`bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition ${
            !destination || isGenerating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Itinerary'}
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Custom Activities</h2>

        <form onSubmit={addItem} className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-white"
            required
          />
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Activity description"
            className="flex-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            Add
          </button>
        </form>

        {items.length > 0 && (
          <div className="flex gap-3 justify-end mb-4">
            <button
              onClick={() => {
                saveToLocalStorage();
                saveItineraryToFile();
              }}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Save Itinerary
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700 text-center">
          <p className="text-gray-400">
            {destination
              ? 'Your itinerary is empty. Add activities or generate a suggested itinerary.'
              : 'Enter your trip details to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(({ date, activity, completed }, index) => (
              <div
                key={index}
                className={`bg-gray-800 p-4 rounded-lg shadow border-2 flex items-start ${
                  completed
                    ? 'border-green-600 bg-gray-700'
                    : 'border-gray-700 hover:border-blue-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={() => toggleComplete(index)}
                  className="mt-1 mr-3 h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-grow">
                  <p className={`font-semibold ${completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className={`${completed ? 'text-gray-500' : 'text-gray-300'}`}>{activity}</p>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                  aria-label="Remove activity"
                >
                  ×
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryPlanner;
