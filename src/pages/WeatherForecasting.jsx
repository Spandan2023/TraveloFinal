import React, { useState, useEffect } from 'react';
import {
  WiDaySunny,
  WiRain,
  WiCloudy,
  WiSnow,
  WiThunderstorm,
  WiFog
} from 'weather-icons-react';

const API_KEY = 'fd0e1b1f6066fe977fb8bd1a11cddc45';

const WeatherForecasting = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  const getWeatherIcon = (condition) => {
    const size = 48;
    switch (condition) {
      case 'Clear': return <WiDaySunny size={size} color="#FFD700" />;
      case 'Rain': return <WiRain size={size} color="#4682B4" />;
      case 'Clouds': return <WiCloudy size={size} color="#778899" />;
      case 'Snow': return <WiSnow size={size} color="#E0FFFF" />;
      case 'Thunderstorm': return <WiThunderstorm size={size} color="#483D8B" />;
      case 'Mist':
      case 'Fog':
      case 'Haze': return <WiFog size={size} color="#D3D3D3" />;
      default: return <WiDaySunny size={size} color="#FFD700" />;
    }
  };

  const fetchWeather = async (e, searchCity = null) => {
    if (e) e.preventDefault();
    const queryCity = searchCity || city;
    if (!queryCity) return;

    setLoading(true);
    setError(null);

    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          queryCity
        )}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentRes.json();
      if (!currentRes.ok) throw new Error(currentData.message || 'City not found');

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          queryCity
        )}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();
      if (!forecastRes.ok) throw new Error(forecastData.message || 'Forecast not available');

      setWeather(currentData);
      setForecast(forecastData);

      setRecentSearches((prev) => {
        const updated = [queryCity, ...prev.filter((c) => c !== queryCity)].slice(0, 5);
        localStorage.setItem('weatherRecentSearches', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('weatherRecentSearches');
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  const formatDate = (timestamp, options = {}) =>
    new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      ...options
    });

  const getDailyForecast = () => {
    if (!forecast) return [];
    const middayForecasts = forecast.list.filter((f) =>
      f.dt_txt.includes('12:00:00')
    );
    return middayForecasts.slice(0, 5); // Limit to 5 days
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Weather Forecast</h1>

      <form onSubmit={fetchWeather} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            list="recentSearches"
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>
        {recentSearches.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {recentSearches.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => fetchWeather(e, c)}
                className="bg-gray-600 text-sm text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </form>

      {error && (
        <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {weather && (
        <div className="space-y-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {weather.name}, {weather.sys.country}
                </h2>
                <p className="text-gray-400">{formatDate(weather.dt)}</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</div>
                <div className="text-center">
                  {getWeatherIcon(weather.weather[0].main)}
                  <p className="capitalize text-sm text-gray-300">{weather.weather[0].description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoBlock label="Feels Like" value={`${Math.round(weather.main.feels_like)}°C`} />
              <InfoBlock label="Humidity" value={`${weather.main.humidity}%`} />
              <InfoBlock label="Wind" value={`${Math.round(weather.wind.speed * 3.6)} km/h`} />
              <InfoBlock label="Pressure" value={`${weather.main.pressure} hPa`} />
              <InfoBlock label="Sunrise" value={new Date(weather.sys.sunrise * 1000).toLocaleTimeString()} />
              <InfoBlock label="Sunset" value={new Date(weather.sys.sunset * 1000).toLocaleTimeString()} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">5-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-white">
              {getDailyForecast().map((day) => (
                <div key={day.dt} className="bg-gray-700 p-3 rounded-lg text-center">
                  <p className="font-medium">{formatDate(day.dt, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <div className="flex justify-center my-2">
                    {getWeatherIcon(day.weather[0].main)}
                  </div>
                  <p className="text-sm capitalize">{day.weather[0].description}</p>
                  <div className="flex justify-center space-x-2 mt-1">
                    <span className="font-bold">{Math.round(day.main.temp_max)}°</span>
                    <span className="text-gray-300">{Math.round(day.main.temp_min)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div className="bg-gray-700 p-3 rounded-lg text-center">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="font-semibold text-white">{value}</p>
  </div>
);

export default WeatherForecasting;
