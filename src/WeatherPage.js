import React, { useEffect, useState } from "react";

export default function WeatherPage() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [extras, setExtras] = useState([]);
  const [condition, setCondition] = useState("clear");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const api = "https://api.openweathermap.org/data/2.5";
        const key = "f6de6fbfb3a1f3c55abe8b3f60d4a0eb";

        // 🌤 MAIN (Fallon)
        const c = await fetch(
          `${api}/weather?lat=39.4735&lon=-118.7774&units=imperial&appid=${key}`
        );
        const f = await fetch(
          `${api}/forecast?lat=39.4735&lon=-118.7774&units=imperial&appid=${key}`
        );

        const currentData = await c.json();
        const forecastData = await f.json();

        setCurrent(currentData);
        setForecast(forecastData);

        // 🌦 CONDITION (for background)
        const cond = currentData.weather[0].main.toLowerCase();
        if (cond.includes("rain")) setCondition("rain");
        else if (cond.includes("cloud")) setCondition("clouds");
        else setCondition("clear");

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
  const daily = [...new Set(forecast.list.map(i => i.dt_txt.split(" ")[0]))]
    .slice(0, 7)
    .map(date => {
      const dayData = forecast.list.filter(d =>
        d.dt_txt.startsWith(date)
      );

      const temps = dayData.map(d => d.main.temp);

      return {
        date,
        max: Math.max(...temps),
        min: Math.min(...temps),
        icon: dayData[0].weather[0].icon
      };
    });

  return (
    <div className={`weather-page ${condition}`}>

      {/* 🌤 BACKGROUND */}
      <div className="weather-bg"></div>

      {/* CONTENT */}
      <div className="weather-content">

        {/* 🔥 TOP GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginBottom: "20px"
        }}>

          {/* MAIN TILE */}
          <div className="card">
            <div style={{ opacity: 0.7 }}>Fallon, NV</div>

            <div style={{ fontSize: "80px", fontWeight: "700" }}>
              {Math.round(current.main.temp)}°
            </div>

            <div style={{ opacity: 0.8 }}>
              {current.weather[0].description}
            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="card grid-2">
            <div>
              <div className="label">Wind</div>
              <div className="value">{current.wind.speed} mph</div>
            </div>

            <div>
              <div className="label">Humidity</div>
              <div className="value">{current.main.humidity}%</div>
            </div>

            <div>
              <div className="label">Feels Like</div>
              <div className="value">{Math.round(current.main.feels_like)}°</div>
            </div>

            <div>
              <div className="label">Pressure</div>
              <div className="value">{current.main.pressure}</div>
            </div>
          </div>
        </div>

        {/* 📍 EXTRA LOCATIONS */}
        <div className="card" style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "10px", opacity: 0.7 }}>
            Nearby Locations
          </div>

          {extras.map((loc, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: i !== extras.length - 1
                ? "1px solid rgba(255,255,255,0.1)"
                : "none"
            }}>
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

          <div style={{
            display: "flex",
            justifyContent: "space-between"
          }}>
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

      </div>
    </div>
  );
}
