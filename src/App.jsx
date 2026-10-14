import { useState, useEffect } from 'react';
import { CITIES, getWeatherInfo } from './data';
import './App.css';

function App() {

  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);  
  const [loading, setLoading] = useState(false);       
  const [error, setError] = useState(null);               
  const [unit, setUnit] = useState('C');                 

  const fetchWeather = async (city) => {
    if (!city) return;
    
    setLoading(true);
    setError(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu thời tiết. Vui lòng thử lại!');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchWeather(selectedCity);
    }
  }, [selectedCity]);

  const convertTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return Math.round((tempC * 1.8 + 32) * 10) / 10;
    }
    return Math.round(tempC * 10) / 10;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return {
      dayName: days[date.getDay()],
      formattedDate: `${date.getDate()}/${date.getMonth() + 1}`,
    };
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Dự Báo Thời Tiết 8 Thành Phố</h1>
        <button 
          className="unit-toggle-btn"
          onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
        >
          Đổi sang °{unit === 'C' ? 'F' : 'C'}
        </button>
      </header>


      <div className="city-list">
        {CITIES.map((city) => (
          <button
            key={city.id}
            className={`city-btn ${selectedCity?.id === city.id ? 'active' : ''}`}
            onClick={() => setSelectedCity(city)}
          >
            {city.name}
          </button>
        ))}
      </div>

      {!selectedCity && (
        <div className="status-message">
          Vui lòng chọn một thành phố để xem thời tiết!
        </div>
      )}

      {loading && (
        <div className="status-message loading">
           Đang tải dữ liệu thời tiết...
        </div>
      )}

      {error && !loading && (
        <div className="status-message error">
          ❌ {error}
          <br />
          <button onClick={() => fetchWeather(selectedCity)} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      )}

      {!loading && !error && weatherData && selectedCity && (
        <div className="weather-content">
          {/* YC2: Thời tiết hiện tại */}
          <section className="current-weather">
            <h2>{selectedCity.name} </h2>
            <div className="current-main">
              <span className="weather-icon">
                {getWeatherInfo(weatherData.current.weather_code).icon}
              </span>
              <div className="temp-display">
                <span className="temp-value">
                  {convertTemp(weatherData.current.temperature_2m)}°{unit}
                </span>
                <span className="weather-desc">
                  {getWeatherInfo(weatherData.current.weather_code).description}
                </span>
              </div>
            </div>

            <div className="current-details">
              <p>Độ ẩm: <strong>{weatherData.current.relative_humidity_2m}%</strong></p>
              <p>Tốc độ gió: <strong>{weatherData.current.wind_speed_10m} km/h</strong></p>
              <p>Cập nhật: <strong>{new Date(weatherData.current.time).toLocaleTimeString('vi-VN')}</strong></p>
            </div>
          </section>

          <section className="forecast-weather">
            <h3>Dự báo 7 ngày tới</h3>
            <div className="forecast-grid">
              {weatherData.daily.time.map((time, index) => {
                const { dayName, formattedDate } = formatDate(time);
                const info = getWeatherInfo(weatherData.daily.weather_code[index]);
                const maxTemp = convertTemp(weatherData.daily.temperature_2m_max[index]);
                const minTemp = convertTemp(weatherData.daily.temperature_2m_min[index]);

                return (
                  <div key={time} className="forecast-card">
                    <p className="day-name">{index === 0 ? 'Hôm nay' : dayName}</p>
                    <p className="date">{formattedDate}</p>
                    <span className="forecast-icon">{info.icon}</span>
                    <p className="forecast-desc">{info.description}</p>
                    <div className="temp-range">
                      <span className="min-temp"> {minTemp}°{unit}</span>
                      <p className="separator"> - </p>
                      <span className="max-temp"> {maxTemp}°{unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;