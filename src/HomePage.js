import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState({
    temp: "--",
    condition: "Loading...",
  });

  // 🕒 LIVE CLOCK
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🌤️ WEATHER
  useEffect(() => {
    const fetchWeather = () => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Fallon,US&units=imperial&appid=YOUR_API_KEY`
      )
        .then((res) => res.json())
        .then((data) => {
          setWeather({
            temp: Math.round(data.main.temp),
            condition: data.weather[0].main,
          });
        })
        .catch(() => {
          setWeather({
            temp: "--",
            condition: "Unavailable",
          });
        });
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  // 📅 FORMAT
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "24px",
        padding: "60px 20px",
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      {/* 🕒 TIME */}
      <div
        style={{
          fontSize: "100px",
          fontWeight: "700",
          color: "#111827",
          lineHeight: "1",
        }}
      >
        {formattedTime}
      </div>

      {/* 📅 DATE */}
      <div
        style={{
          fontSize: "22px",
          color: "#6b7280",
          marginBottom: "25px",
        }}
      >
        {formattedDate}
      </div>

      {/* 🌤️ WEATHER */}
      <div
        style={{
          fontSize: "20px",
          color: "#374151",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🌤 {weather.temp}° — {weather.condition}
      </div>
    </div>
  );
}
