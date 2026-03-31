import React, { useEffect, useState } from "react";

export default function WeatherPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.openweathermap.org/data/2.5/forecast?lat=39.4735&lon=-118.7774&units=imperial&appid=df51aa425988c81b25062b9c64532dbb"
        );

        const json = await res.json();

        if (!json || json.cod !== "200") throw new Error();

        setData(json);
      } catch (e) {
        setError(true);
      }
    };

    fetchWeather();
  }, []);

  if (error) return <div>Weather unavailable</div>;
  if (!data) return <div>Loading...</div>;

  const current = data.list[0];

  // 🎨 Background based on weather
  const condition = current.weather[0].main.toLowerCase();

  let bg = "#60a5fa";
  if (condition.includes("cloud")) bg = "#94a3b8";
  if (condition.includes("rain")) bg = "#475569";
  if (condition.includes("clear")) bg = "#3b82f6";

  return (
    <div
      style={{
        background: bg,
        color: "white",
        padding: "25px",
        borderRadius: "20px",
      }}
    >
      {/* 🌤 BIG TEMP */}
      <div style={{ marginBottom: "25px" }}>
        <div style={{ fontSize: "64px", fontWeight: "700" }}>
          {Math.round(current.main.temp)}°
        </div>

        <div style={{ fontSize: "20px" }}>
          {current.weather[0].description}
        </div>
      </div>

      {/* 📊 DETAILS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <div>Feels: {Math.round(current.main.feels_like)}°</div>
        <div>Wind: {Math.round(current.wind.speed)} mph</div>
        <div>Rain: {current.pop ? Math.round(current.pop * 100) : 0}%</div>
      </div>

      {/* ⏰ HOURLY SCROLL */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "12px",
          marginBottom: "25px",
        }}
      >
        {data.list.slice(0, 12).map((hour, i) => {
          const time = new Date(hour.dt * 1000).getHours();

          return (
            <div
              key={i}
              style={{
                minWidth: "70px",
                textAlign: "center",
                background: "rgba(255,255,255,0.2)",
                padding: "10px",
                borderRadius: "12px",
              }}
            >
              <div>{time}:00</div>
              <img
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt=""
              />
              <div>{Math.round(hour.main.temp)}°</div>
            </div>
          );
        })}
      </div>

      {/* 📅 7 DAY (SIMULATED FROM DATA) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
        }}
      >
        {[...new Set(data.list.map(i => i.dt_txt.split(" ")[0]))]
          .slice(0, 7)
          .map((date, i) => {
            const dayData = data.list.filter(d =>
              d.dt_txt.startsWith(date)
            );

            const temps = dayData.map(d => d.main.temp);

            const dayName = new Date(date).toLocaleDateString("en-US", {
              weekday: "short",
            });

            return (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "10px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <div>{dayName}</div>
                <div>{Math.max(...temps).toFixed(0)}°</div>
                <div style={{ fontSize: "12px" }}>
                  {Math.min(...temps).toFixed(0)}°
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
