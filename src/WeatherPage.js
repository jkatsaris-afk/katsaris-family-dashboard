import React, { useEffect, useState } from "react";

export default function WeatherPage() {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.openweathermap.org/data/2.5/forecast?lat=39.4735&lon=-118.7774&units=imperial&appid=df51aa425988c81b25062b9c64532dbb"
        );

        const data = await res.json();

        if (!data || data.cod !== "200") {
          throw new Error("Bad forecast data");
        }

        // 🔥 Convert 3-hour data into daily forecast
        const dailyMap = {};

        data.list.forEach((item) => {
          const date = item.dt_txt.split(" ")[0];

          if (!dailyMap[date]) {
            dailyMap[date] = {
              temps: [],
              icon: item.weather[0].icon,
            };
          }

          dailyMap[date].temps.push(item.main.temp);
        });

        const daily = Object.keys(dailyMap)
          .slice(0, 7)
          .map((date) => {
            const temps = dailyMap[date].temps;
            return {
              date,
              max: Math.max(...temps),
              min: Math.min(...temps),
              icon: dailyMap[date].icon,
            };
          });

        setForecast(daily);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchWeather();

    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{ background: "#fff", padding: "20px", borderRadius: "20px" }}>
        Weather unavailable ⚠️
      </div>
    );
  }

  if (!forecast) {
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
      {/* 📅 7 DAY FORECAST */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "12px",
        }}
      >
        {forecast.map((day, i) => {
          const date = new Date(day.date);
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
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt=""
                style={{ width: "50px" }}
              />

              <div style={{ fontWeight: "600", fontSize: "16px" }}>
                {Math.round(day.max)}°
              </div>

              <div style={{ fontSize: "12px", color: "#666" }}>
                {Math.round(day.min)}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
