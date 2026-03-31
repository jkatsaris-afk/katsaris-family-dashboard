import React, { useEffect, useState } from "react";

export default function WeatherPage() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
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
    };

    fetchWeather();
  }, []);

  if (!current || !forecast) return <div>Loading...</div>;

  const hourly = forecast.list.slice(0, 12);

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
    <div style={{ padding: "30px", color: "white" }}>

      {/* 🔥 CURRENT */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "18px", opacity: 0.7 }}>
          Fallon, NV
        </div>

        <div style={{ fontSize: "80px", fontWeight: "700" }}>
          {Math.round(current.main.temp)}°
        </div>

        <div style={{ fontSize: "22px", opacity: 0.8 }}>
          {current.weather[0].description}
        </div>
      </div>

      {/* 🔥 HOURLY (MAIN FEATURE) */}
      <div style={{ marginBottom: "50px" }}>
        <div style={{ marginBottom: "15px", opacity: 0.7 }}>
          Today
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          {hourly.map((h, i) => {
            const time = new Date(h.dt * 1000).getHours();

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  background: "rgba(255,255,255,0.1)",
                  padding: "15px 5px",
                  borderRadius: "12px",
                }}
              >
                <div style={{ fontSize: "14px", marginBottom: "5px" }}>
                  {time}:00
                </div>

                <img
                  src={`https://openweathermap.org/img/wn/${h.weather[0].icon}.png`}
                  alt=""
                />

                <div style={{ fontSize: "18px", fontWeight: "600" }}>
                  {Math.round(h.main.temp)}°
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔥 7 DAY */}
      <div>
        <div style={{ marginBottom: "15px", opacity: 0.7 }}>
          7-Day Forecast
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "15px",
          }}
        >
          {daily.map((d, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.1)",
                padding: "15px",
                borderRadius: "12px",
              }}
            >
              <div style={{ marginBottom: "5px" }}>
                {new Date(d.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${d.icon}.png`}
                alt=""
              />

              <div style={{ fontWeight: "600" }}>
                {Math.round(d.max)}°
              </div>

              <div style={{ fontSize: "12px", opacity: 0.6 }}>
                {Math.round(d.min)}°
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
