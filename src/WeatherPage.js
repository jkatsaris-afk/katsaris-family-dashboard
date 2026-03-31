import React, { useEffect, useState } from "react";

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

  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const visibility = (current.visibility / 1000).toFixed(1);

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
    <div style={{
      background: "#f5f5f5",
      minHeight: "100vh",
      padding: "30px"
    }}>

      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "20px",
        marginBottom: "20px"
      }}>

        {/* MAIN TILE */}
        <div className="card">
          <div style={{ opacity: 0.6 }}>Fallon, NV</div>

          <div style={{ fontSize: "80px", fontWeight: "700" }}>
            {Math.round(current.main.temp)}°
          </div>

          <div style={{ opacity: 0.7 }}>
            {current.weather[0].description}
          </div>

          <div style={{ marginTop: "10px", fontSize: "14px", opacity: 0.6 }}>
            Feels like {Math.round(current.main.feels_like)}°
          </div>
        </div>

        {/* HIGHLIGHTS */}
        <div className="card grid-2">

          <div className="highlight">
            <span>Wind</span>
            <strong>{current.wind.speed} mph</strong>
          </div>

          <div className="highlight">
            <span>Humidity</span>
            <strong>{current.main.humidity}%</strong>
          </div>

          <div className="highlight">
            <span>Visibility</span>
            <strong>{visibility} km</strong>
          </div>

          <div className="highlight">
            <span>Sunrise</span>
            <strong>{sunrise}</strong>
          </div>

          <div className="highlight">
            <span>Sunset</span>
            <strong>{sunset}</strong>
          </div>

        </div>
      </div>

      {/* EXTRA LOCATIONS */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px", opacity: 0.6 }}>
          Nearby Locations
        </div>

        {extras.map((loc, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i !== extras.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none"
          }}>
            <div>
              <div>{loc.name}, NV</div>
              <div style={{ fontSize: "12px", opacity: 0.5 }}>{loc.desc}</div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img src={`https://openweathermap.org/img/wn/${loc.icon}.png`} />
              <div>{loc.temp}°</div>
            </div>
          </div>
        ))}
      </div>

      {/* FORECAST */}
      <div className="card">
        <div style={{ marginBottom: "10px", opacity: 0.6 }}>
          7 Day Forecast
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {daily.map((d, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div>
                {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
              </div>

              <img src={`https://openweathermap.org/img/wn/${d.icon}.png`} />

              <div>{Math.round(d.max)}°</div>
              <div style={{ opacity: 0.5 }}>{Math.round(d.min)}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .card {
          background: #121212;
          color: white;
          border-radius: 20px;
          padding: 20px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .highlight {
          background: #1e1e1e;
          padding: 15px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .highlight span {
          font-size: 12px;
          opacity: 0.6;
        }

        .highlight strong {
          font-size: 16px;
        }
      `}</style>

    </div>
  );
}
