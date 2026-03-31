import React, { useEffect, useState } from "react";

export default function WeatherPage() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [condition, setCondition] = useState("clear");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 🌤 CURRENT WEATHER
        const currentRes = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?lat=39.4735&lon=-118.7774&units=imperial&appid=f6de6fbfb3a1f3c55abe8b3f60d4a0eb"
        );
        const currentData = await currentRes.json();

        // 📅 FORECAST
        const forecastRes = await fetch(
          "https://api.openweathermap.org/data/2.5/forecast?lat=39.4735&lon=-118.7774&units=imperial&appid=f6de6fbfb3a1f3c55abe8b3f60d4a0eb"
        );
        const forecastData = await forecastRes.json();

        setCurrent(currentData);
        setForecast(forecastData);

        // 🌦 DETERMINE CONDITION
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

  if (!current || !forecast) {
    return <div>Loading weather...</div>;
  }

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        padding: "25px",
        color: "white",
        background: "linear-gradient(135deg, #3b82f6, #60a5fa)", // base sky
      }}
    >
      {/* 🌤 BACKGROUND ANIMATION */}

      {/* ☁️ CLOUDS */}
      {(condition === "clouds" || condition === "rain") && (
        <div className="clouds"></div>
      )}

      {/* 🌧 RAIN */}
      {condition === "rain" && <div className="rain"></div>}

      {/* 🌫 CONTENT */}
      <div style={{ position: "relative", zIndex: 3 }}>

        {/* 🌤 BIG TEMP */}
        <div style={{ fontSize: "64px", fontWeight: "700" }}>
          {Math.round(current.main.temp)}°
        </div>

        <div style={{ marginBottom: "20px", fontSize: "18px" }}>
          {current.weather[0].description}
        </div>

        {/* 📊 DETAILS */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
          <div>Feels: {Math.round(current.main.feels_like)}°</div>
          <div>Wind: {Math.round(current.wind.speed)} mph</div>
          <div>Humidity: {current.main.humidity}%</div>
        </div>

        {/* ⏰ HOURLY FORECAST */}
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "10px",
            marginBottom: "25px",
          }}
        >
          {forecast.list.slice(0, 10).map((h, i) => {
            const hour = new Date(h.dt * 1000).getHours();

            return (
              <div
                key={i}
                style={{
                  minWidth: "65px",
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

        {/* 📅 7 DAY FORECAST */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "10px",
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
                  <div style={{ fontSize: "12px" }}>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    {Math.max(...temps).toFixed(0)}°
                  </div>
                  <div style={{ fontSize: "11px" }}>
                    {Math.min(...temps).toFixed(0)}°
                  </div>
                </div>
              );
            })}
        </div>

      </div>
    </div>
  );
}
