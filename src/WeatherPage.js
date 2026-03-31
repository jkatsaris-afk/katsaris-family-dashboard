import React, { useEffect, useState } from "react";

export default function WeatherPage() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [extras, setExtras] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const api = "https://api.openweathermap.org/data/2.5";
        const key = "f6de6fbfb3a1f3c55abe8b3f60d4a0eb";

        // 🌤 MAIN LOCATION (Fallon)
        const currentRes = await fetch(
          `${api}/weather?lat=39.4735&lon=-118.7774&units=imperial&appid=${key}`
        );
        const currentData = await currentRes.json();

        const forecastRes = await fetch(
          `${api}/forecast?lat=39.4735&lon=-118.7774&units=imperial&appid=${key}`
        );
        const forecastData = await forecastRes.json();

        setCurrent(currentData);
        setForecast(forecastData);

        // 📍 EXTRA LOCATIONS
        const locations = [
          { name: "Lovelock", lat: 40.1793, lon: -118.4735 },
          { name: "Reno", lat: 39.5296, lon: -119.8138 }
        ];

        const extraData = await Promise.all(
          locations.map(async (loc) => {
            const res = await fetch(
              `${api}/weather?lat=${loc.lat}&lon=${loc.lon}&units=imperial&appid=${key}`
            );
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
      } catch (err) {
        console.error("Weather error:", err);
      }
    };

    fetchWeather();
  }, []);

  if (!current || !forecast) {
    return <div style={{ padding: 20 }}>Loading weather...</div>;
  }

  // 📅 DAILY FORECAST
  const daily = [...new Set(forecast.list.map((i) => i.dt_txt.split(" ")[0]))]
    .slice(0, 7)
    .map((date) => {
      const dayData = forecast.list.filter((d) =>
        d.dt_txt.startsWith(date)
      );
      const temps = dayData.map((d) => d.main.temp);

      return {
        date,
        max: Math.max(...temps),
        min: Math.min(...temps),
        icon: dayData[0].weather[0].icon
      };
    });

  return (
    <div style={{ padding: "30px", color: "white" }}>
      {/* 🔥 TOP GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginBottom: "20px"
        }}
      >
        {/* 🌤 MAIN */}
        <div className="card">
          <div style={{ opacity: 0.7 }}>Fallon, NV</div>

          <div style={{ fontSize: "70px", fontWeight: "700" }}>
            {Math.round(current.main.temp)}°
          </div>

          <div>{current.weather[0].description}</div>
        </div>

        {/* 📊 HIGHLIGHTS */}
        <div className="card grid-2">
          <div>
            <div className="label">Wind</div>
            <div>{current.wind.speed} mph</div>
          </div>

          <div>
            <div className="label">Humidity</div>
            <div>{current.main.humidity}%</div>
          </div>

          <div>
            <div className="label">Feels Like</div>
            <div>{Math.round(current.main.feels_like)}°</div>
          </div>

          <div>
            <div className="label">Pressure</div>
            <div>{current.main.pressure}</div>
          </div>
        </div>
      </div>

      {/* 📍 EXTRA LOCATIONS */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px", opacity: 0.7 }}>
          Nearby Locations
        </div>

        {extras.map((loc, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom:
                i !== extras.length - 1
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "none"
            }}
          >
            <div>
              <div>{loc.name}, NV</div>
              <div style={{ fontSize: "12px", opacity: 0.6 }}>
                {loc.desc}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <img
                src={`https://openweathermap.org/img/wn/${loc.icon}.png`}
                alt=""
              />
              <div>{loc.temp}°</div>
            </div>
          </div>
        ))}
      </div>

      {/* 📅 FORECAST */}
      <div className="card">
        <div style={{ marginBottom: "10px", opacity: 0.7 }}>
          7 Day Forecast
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {daily.map((d, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div>
                {new Date(d.date).toLocaleDateString("en-US", {
                  weekday: "short"
                })}
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                alt=""
              />

              <div>{Math.round(d.max)}°</div>
              <div style={{ opacity: 0.5 }}>
                {Math.round(d.min)}°
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎨 STYLES */}
      <style>{`
        .card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 18px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .label {
          font-size: 12px;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
