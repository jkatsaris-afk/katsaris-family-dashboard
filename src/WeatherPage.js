import React, { useEffect, useState } from "react";

export default function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.openweathermap.org/data/2.5/onecall?lat=39.4735&lon=-118.7774&units=imperial&appid=f6de6fbfb3a1f3c55abe8b3f60d4a0eb"
        );

        const data = await res.json();

        // 🚨 Catch bad API responses
        if (!data || data.cod) {
          throw new Error("Bad weather data");
        }

        setWeather(data);
      } catch (err) {
        console.error("Weather error:", err);
        setError(true);
      }
    };

    fetchWeather();

    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  // ❌ ERROR STATE (won’t crash app)
  if (error) {
    return (
      <div style={{ background: "#fff", padding: "20px", borderRadius: "20px" }}>
        Weather unavailable ⚠️
      </div>
    );
  }

  // ⏳ LOADING STATE
  if (!weather) {
    return (
      <div style={{ background: "#fff", padding: "20px", borderRadius: "20px" }}>
        Loading weather...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "20px",
      }}
    >
      {/* 🌤 CURRENT */}
      <div style={{ marginBottom: "25px" }}>
        <div style={{ fontSize: "48px", fontWeight: "700" }}>
          {Math.round(weather.current.temp)}°
        </div>

        <div style={{ fontSize: "20px", color: "#555" }}>
          {weather.current.weather[0].main}
        </div>
      </div>

      {/* 📅 7 DAY FORECAST */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "12px",
        }}
      >
        {weather.daily.slice(0, 7).map((day, i) => {
          const date = new Date(day.dt * 1000);
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });

          return (
            <div
              key={i}
              style={{
                background: "#f3f4f6",
                padding: "14px",
                borderRadius: "16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "14px", marginBottom: "6px" }}>
                {dayName}
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt=""
                style={{ width: "50px" }}
              />

              <div style={{ fontWeight: "600", fontSize: "16px" }}>
                {Math.round(day.temp.max)}°
              </div>

              <div style={{ fontSize: "12px", color: "#666" }}>
                {Math.round(day.temp.min)}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
