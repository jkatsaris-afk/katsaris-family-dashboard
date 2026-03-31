import React, { useState, useEffect } from "react";
import logo from "./assets/logo.png";

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
        `https://api.openweathermap.org/data/2.5/weather?q=Fallon,US&units=imperial&appid=f6de6fbfb3a1f3c55abe8b3f60d4a0eb`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.cod !== 200) throw new Error(data.message);

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
        position: "relative",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "80px",
        overflow: "hidden",
      }}
    >

      {/* 🔥 GHOSTED LOGO */}
      <img
        src={logo}
        alt="Katsaris Brand"
        style={{
          position: "absolute",
          width: "450px",
          opacity: 1.00,
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* 🕒 TIME */}
      <div
        style={{
          fontSize: "110px",
          fontWeight: "700",
          color: "#111827",
          lineHeight: "1",
          zIndex: 1,
        }}
      >
        {formattedTime}
      </div>

      {/* 📅 DATE */}
      <div
        style={{
          fontSize: "24px",
          color: "#6b7280",
          marginBottom: "25px",
          zIndex: 1,
        }}
      >
        {formattedDate}
      </div>

      {/* 🌤️ WEATHER */}
      <div
        style={{
          fontSize: "22px",
          color: "#374151",
          zIndex: 1,
        }}
      >
        🌤 {weather.temp}° — {weather.condition}
      </div>
    </div>
  );
}
