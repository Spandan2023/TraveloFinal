import React, { useState, useEffect } from 'react';
import {
  WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog
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
      case 'Thunderstorm': return <WiThunderstorm size={size} color="#FFA500" />;
      case 'Mist':
      case 'Fog':
      case 'Haze': return <WiFog size={size} color="#D3D3D3" />;
      default: return <WiDaySunny size={size} color="#FFD700" />;
    }
  };

  const getBackgroundByWeather = (type) => {
    switch (type) {
      case 'Clear': return 'from-yellow-100 to-white';
      case 'Rain': return 'from-blue-300 to-blue-500';
      case 'Clouds': return 'from-white to-blue-100';
      case 'Snow': return 'from-white to-gray-200';
      case 'Thunderstorm': return 'from-gray-600 to-yellow-300';
      case 'Mist':
      case 'Fog': return 'from-white to-purple-100';
      default: return 'from-slate-200 to-slate-400';
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
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(queryCity)}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentRes.json();
      if (!currentRes.ok) throw new Error(currentData.message || 'City not found');

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(queryCity)}&units=metric&appid=${API_KEY}`
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

  const removeSearch = (removeCity) => {
    const filtered = recentSearches.filter((c) => c !== removeCity);
    setRecentSearches(filtered);
    localStorage.setItem('weatherRecentSearches', JSON.stringify(filtered));
  };

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
    return middayForecasts.slice(0, 5);
  };

  const bgGradient = weather ? getBackgroundByWeather(weather.weather[0].main) : 'from-slate-200 to-slate-400';

  return (
    <div className={`min-h-screen px-4 py-8 bg-gradient-to-br ${bgGradient} text-gray-800`}>
      <div className="backdrop-blur-xl bg-white/30 shadow-black/40 shadow-2xl rounded-3xl p-8 max-w-4xl mx-auto border border-black/10">
        <h1 className="text-4xl font-extrabold mb-6 text-center drop-shadow-md text-black">Weather Forecast</h1>

        <form onSubmit={fetchWeather} className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-grow px-4 py-2 bg-white/60 backdrop-blur-md border border-black/30 rounded-lg text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm shadow-black/10"
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r from-gray-800 to-black text-white hover:from-black hover:to-gray-800 px-6 py-2 rounded-xl font-semibold shadow-md shadow-black/40 transition-all ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
          </div>
        </form>

        {recentSearches.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {recentSearches.map((c, i) => (
              <div key={i} className="flex items-center gap-1 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full text-sm shadow shadow-black/10">
                <button
                  type="button"
                  onClick={(e) => fetchWeather(e, c)}
                  className="text-gray-900 font-medium"
                >
                  {c}
                </button>
                <button
                  type="button"
                  onClick={() => removeSearch(c)}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-200 text-red-900 p-4 rounded-lg mb-6 text-center shadow shadow-black/20">
            {error}
          </div>
        )}

        {weather && (
          <div className="space-y-8 text-black">
            <div className="rounded-xl p-6 shadow-md shadow-black/40 border border-black/10 bg-white/40 backdrop-blur-md">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <p className="text-gray-700">{formatDate(weather.dt)}</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="text-5xl font-bold text-black">{Math.round(weather.main.temp)}°C</div>
                  <div className="text-center">
                    {getWeatherIcon(weather.weather[0].main)}
                    <p className="capitalize text-sm text-gray-800">{weather.weather[0].description}</p>
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

            <div className="rounded-xl p-6 shadow-md shadow-black/40 border border-black/10 bg-white/40 backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">5-Day Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {getDailyForecast().map((day) => (
                  <div key={day.dt} className="bg-white/70 backdrop-blur-sm p-4 rounded-lg text-center shadow shadow-black/20 border border-black/10">
                    <p className="font-medium text-black">
                      {formatDate(day.dt, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <div className="flex justify-center my-2">{getWeatherIcon(day.weather[0].main)}</div>
                    <p className="text-sm capitalize text-gray-800">{day.weather[0].description}</p>
                    <div className="flex justify-center space-x-2 mt-1 text-black">
                      <span className="font-bold">{Math.round(day.main.temp_max)}°</span>
                      <span className="text-gray-700">{Math.round(day.main.temp_min)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div className="bg-white/70 backdrop-blur-md p-3 rounded-lg text-center border border-black/10 shadow shadow-black/10">
    <p className="text-gray-700 text-sm">{label}</p>
    <p className="font-semibold text-black">{value}</p>
  </div>
);

export default WeatherForecasting;
