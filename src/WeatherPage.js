import React, { useEffect, useState } from "react";

export default function WeatherPage() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [condition, setCondition] = useState("clear");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const currentRes = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?lat=39.4735&lon=-118.7774&units=imperial&appid=f6de6fbfb3a1f3c55abe8b3f60d4a0eb"
        );

        const currentData = await currentRes.json();

        const forecastRes = await fetch(
          "https://api.openweathermap.org/data/2.5/forecast?lat=39.4735&lon=-118.7774&units=imperial&appid=f6de6fbfb3a1f3c55abe8b3f60d4a0eb"
        );

        const forecastData = await forecastRes.json();

        setCurrent(currentData);
        setForecast(forecastData);

        const cond = currentData.weather[0].main.toLowerCase();

        if (cond.includes("rain")) setCondition("rain");
        else if (cond.includes("cloud")) setCondition("clouds");
        else setCondition("clear");

      } catch (e) {
        console.error("Weather error:", e);
      }
    };

    fetchWeather();
  }, []);

  if (!current || !forecast) return <div>Loading weather...</div>;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
        color: "white",
        padding: "25px",
      }}
    >

      {/* 🌤 ANIMATED BACKGROUND */}

      {/* ☁️ CLOUDS */}
      {(condition === "clouds" || condition === "rain") && (
        <div className="clouds"></div>
      )}

      {/* 🌧 RAIN */}
      {condition === "rain" && <div className="rain"></div>}

      {/* 🌫 CONTENT */}
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* 🌤 TEMP */}
        <div style={{ fontSize: "64px", fontWeight: "700" }}>
          {Math.round(current.main.temp)}°
        </div>

        <div style={{ marginBottom: "20px" }}>
          {current.weather[0].description}
        </div>

        {/* 📊 DETAILS */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
          <div>Feels: {Math.round(current.main.feels_like)}°</div>
          <div>Wind: {Math.round(current.wind.speed)} mph</div>
          <div>Humidity: {current.main.humidity}%</div>
        </div>

        {/* ⏰ HOURLY */}
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {forecast.list.slice(0, 10).map((h, i) => {
            const hour = new Date(h.dt * 1000).getHours();

            return (
              <div
                key={i}
                style={{
                  minWidth: "60px",
                  textAlign: "center",
                  background: "rgba(255,255,255,0.2)",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <div>{hour}:00</div>
                <img
                  src={`https://openweathermap.org/img/wn/${h.weather[0].icon}.png`}
                  alt=""
                />
                <div>{Math.round(h.main.temp)}°</div>
              </div>
            );
          })}
        </div>

        {/* 📅 DAILY */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
          }}
        >
          {[...new Set(forecast.list.map(i => i.dt_txt.split(" ")[0]))]
            .slice(0, 7)
            .map((date, i) => {
              const dayData = forecast.list.filter(d =>
                d.dt_txt.startsWith(date)
              );

              const temps = dayData.map(d => d.main.temp);

              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "8px",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <div>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>
                  <div>{Math.max(...temps).toFixed(0)}°</div>
                  <div style={{ fontSize: "12px" }}>
                    {Math.min(...temps).toFixed(0)}°
                  </div>
                </div>
              );
            })}
        </div>

      </div>

      {/* 🎨 ANIMATION CSS */}
      <style>
        {`
        .clouds {
          position: absolute;
          inset: 0;
          background: url("https://i.imgur.com/NM6KQ.gif");
          opacity: 0.25;
          animation: moveClouds 60s linear infinite;
          z-index: 1;
        }

        .rain {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.3) 0px,
            rgba(255,255,255,0.3) 2px,
            transparent 2px,
            transparent 10px
          );
          animation: rainFall 0.4s linear infinite;
          z-index: 1;
        }

        @keyframes moveClouds {
          0% { background-position: 0 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes rainFall {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }
        `}
      </style>
    </div>
  );
}
