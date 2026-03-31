import React, { useEffect, useState } from "react";
import { Menu, LayoutGrid, Map, Calendar, Settings } from "lucide-react";

export default function WeatherPage() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [extras, setExtras] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      const api = "https://api.openweathermap.org/data/2.5";
      const key = "f6de6fbfb3a1f3c55abe8b3f60d4a0eb";

      const c = await fetch(`${api}/weather?lat=39.4735&lon=-118.7774&units=imperial&appid=${key}`);
      const f = await fetch(`${api}/forecast?lat=39.4735&lon=-118.7774&units=imperial&appid=${key}`);

      const currentData = await c.json();
      const forecastData = await f.json();

      setCurrent(currentData);
      setForecast(forecastData);

      const locations = [
        { name: "Reno", lat: 39.5296, lon: -119.8138 },
        { name: "Lovelock", lat: 40.1793, lon: -118.4735 }
      ];

      const extraData = await Promise.all(
        locations.map(async (loc) => {
          const res = await fetch(`${api}/weather?lat=${loc.lat}&lon=${loc.lon}&units=imperial&appid=${key}`);
          const data = await res.json();

          return {
            name: loc.name,
            temp: Math.round(data.main.temp),
            icon: data.weather[0].icon,
            desc: data.weather[0].main
          };
        })
      );

      setExtras(extraData);
    };

    fetchWeather();
  }, []);

  if (!current || !forecast) return <div>Loading...</div>;

  const daily = [...new Set(forecast.list.map(i => i.dt_txt.split(" ")[0]))]
    .slice(0, 7)
    .map(date => {
      const dayData = forecast.list.filter(d => d.dt_txt.startsWith(date));
      const temps = dayData.map(d => d.main.temp);

      return {
        date,
        max: Math.max(...temps),
        min: Math.min(...temps),
        icon: dayData[0].weather[0].icon
      };
    });

  return (
    <div className="weather-shell">

      {/* SIDEBAR */}
      <div className="sidebar">
        <Menu />
        <LayoutGrid />
        <Map />
        <Calendar />
        <Settings />
      </div>

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="header">
          <div>
            <div className="greeting">Good Morning</div>
          </div>

          <input className="search" placeholder="Search location..." />
        </div>

        {/* GRID */}
        <div className="grid">

          {/* MAIN CARD */}
          <div className="card main-card">
            <div>Fallon, NV</div>
            <div className="temp">{Math.round(current.main.temp)}°</div>
            <div>{current.weather[0].description}</div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="card highlights">
            <div className="highlight">
              <span>Wind</span>
              <strong>{current.wind.speed} mph</strong>
            </div>

            <div className="highlight">
              <span>Humidity</span>
              <strong>{current.main.humidity}%</strong>
            </div>

            <div className="highlight">
              <span>Feels</span>
              <strong>{Math.round(current.main.feels_like)}°</strong>
            </div>

            <div className="highlight">
              <span>Pressure</span>
              <strong>{current.main.pressure}</strong>
            </div>
          </div>

          {/* EXTRA LOCATIONS */}
          <div className="card">
            <div className="card-title">Nearby</div>

            {extras.map((loc, i) => (
              <div key={i} className="row">
                <div>
                  <div>{loc.name}</div>
                  <small>{loc.desc}</small>
                </div>

                <div className="row-right">
                  <img src={`https://openweathermap.org/img/wn/${loc.icon}.png`} />
                  <span>{loc.temp}°</span>
                </div>
              </div>
            ))}
          </div>

          {/* FORECAST */}
          <div className="card forecast">
            {daily.map((d, i) => (
              <div key={i} className="day">
                <div>{new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}</div>
                <img src={`https://openweathermap.org/img/wn/${d.icon}.png`} />
                <div>{Math.round(d.max)}°</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .weather-shell {
          display: flex;
          background: #0b0b0b;
          border-radius: 30px;
          overflow: hidden;
          height: 100vh;
          color: white;
        }

        .sidebar {
          width: 70px;
          background: #111;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          padding: 20px 0;
        }

        .main {
          flex: 1;
          padding: 30px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .search {
          background: #1c1c1c;
          border: none;
          padding: 10px 15px;
          border-radius: 20px;
          color: white;
        }

        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .card {
          background: #161616;
          border-radius: 20px;
          padding: 20px;
        }

        .main-card .temp {
          font-size: 70px;
          font-weight: 700;
        }

        .highlights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .highlight {
          background: #1f1f1f;
          padding: 15px;
          border-radius: 15px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        }

        .row-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .forecast {
          grid-column: span 2;
          display: flex;
          justify-content: space-between;
        }

        .day {
          text-align: center;
        }
      `}</style>
    </div>
  );
}
