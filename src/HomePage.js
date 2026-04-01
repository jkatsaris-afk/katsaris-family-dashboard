import React, { useState, useEffect } from "react";
import logo from "./assets/logo.png";

export default function HomePage() {
  const [now, setNow] = useState(new Date());

  const [weather, setWeather] = useState({
    temp: "--",
    feels: "--",
    high: "--",
    low: "--",
    condition: "Loading...",
    tomorrowHigh: "--",
    tomorrowLow: "--",
    tomorrowCondition: "",
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
    const fetchWeather = async () => {
      try {
        const apiKey = "f6de6fbfb3a1f3c55abe8b3f60d4a0eb";

        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=39.4735&lon=-118.7774&units=imperial&appid=${apiKey}`
        );
        const current = await currentRes.json();

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=39.4735&lon=-118.7774&units=imperial&appid=${apiKey}`
        );
        const forecast = await forecastRes.json();

        const tomorrow = forecast.list.find(item =>
          item.dt_txt.includes("12:00:00")
        );

        setWeather({
          temp: Math.round(current.main.temp),
          feels: Math.round(current.main.feels_like),
          high: Math.round(current.main.temp_max),
          low: Math.round(current.main.temp_min),
          condition: current.weather[0].description,
          tomorrowHigh: tomorrow ? Math.round(tomorrow.main.temp_max) : "--",
          tomorrowLow: tomorrow ? Math.round(tomorrow.main.temp_min) : "--",
          tomorrowCondition: tomorrow ? tomorrow.weather[0].description : "",
        });

      } catch (err) {
        setWeather({
          temp: "--",
          feels: "--",
          high: "--",
          low: "--",
          condition: "Unavailable",
          tomorrowHigh: "--",
          tomorrowLow: "--",
          tomorrowCondition: "",
        });
      }
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
        minHeight: "100vh",
        paddingBottom: "90px", // 👈 CRITICAL: prevents bottom nav overlap
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
          opacity: 0.08, // 👈 toned down (looks cleaner behind text)
          top: "55%",
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

      {/* 🌤️ WEATHER (click-ready for later) */}
      <div
        style={{
          textAlign: "center",
          zIndex: 1,
          color: "#374151",
          cursor: "pointer", // 👈 ready for click navigation later
          padding: "10px 20px",
          borderRadius: "12px",
        }}
      >
        <div style={{ fontSize: "28px", fontWeight: "600" }}>
          {weather.temp}° • {weather.condition}
        </div>

        <div style={{ fontSize: "16px", color: "#6b7280" }}>
          Feels like {weather.feels}° • H {weather.high}° / L {weather.low}°
        </div>

        {/* 🔮 TOMORROW */}
        <div style={{
          marginTop: "12px",
          fontSize: "15px",
          color: "#6b7280"
        }}>
          Tomorrow: {weather.tomorrowHigh}° / {weather.tomorrowLow}° • {weather.tomorrowCondition}
        </div>
      </div>

      {/* 📅 EVENTS (ready for backend next) */}
      <div
        style={{
          marginTop: "40px",
          width: "60%",
          textAlign: "center",
          background: "rgba(0,0,0,0.04)",
          padding: "20px",
          borderRadius: "12px",
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: "18px", marginBottom: "10px" }}>
          Today's Events
        </div>
        <div style={{ opacity: 0.6 }}>
          No events yet
        </div>
      </div>

    </div>
  );
}
