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

  const hourly = forecast.list.slice(0, 8);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          background: "rgba(30,30,30,0.85)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "25px",
          color: "white",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>
            Fallon, NV
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "64px", fontWeight: "600" }}>
              {Math.round(current.main.temp)}°
            </div>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>
              F / C
            </div>
          </div>

          <div style={{ opacity: 0.8 }}>
            {current.weather[0].description}
          </div>
        </div>

        {/* DAILY ROW */}
        <div
          style={{
            display: "flex",
            gap: "18px",
            marginBottom: "25px",
          }}
        >
          {[...new Set(forecast.list.map(i => i.dt_txt.split(" ")[0]))]
            .slice(0, 8)
            .map((date, i) => {
              const dayData = forecast.list.filter(d =>
                d.dt_txt.startsWith(date)
              );

              const temps = dayData.map(d => d.main.temp);

              return (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px" }}>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </div>

                  <img
                    src={`https://openweathermap.org/img/wn/${dayData[0].weather[0].icon}.png`}
                    alt=""
                  />

                  <div>{Math.max(...temps).toFixed(0)}°</div>
                  <div style={{ opacity: 0.6, fontSize: "12px" }}>
                    {Math.min(...temps).toFixed(0)}°
                  </div>
                </div>
              );
            })}
        </div>

        {/* SIMPLE TEMP GRAPH */}
        <div style={{ marginTop: "10px" }}>
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "10px" }}>
            Temperature
          </div>

          <div style={{ position: "relative", height: "80px" }}>
            <svg width="100%" height="80">
              <polyline
                fill="none"
                stroke="white"
                strokeWidth="2"
                points={hourly
                  .map((h, i) => `${i * 40},${80 - h.main.temp}`)
                  .join(" ")}
              />
            </svg>
          </div>

          {/* TIME LABELS */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", opacity: 0.6 }}>
            {hourly.map((h, i) => {
              const time = new Date(h.dt * 1000).getHours();
              return <div key={i}>{time}:00</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
