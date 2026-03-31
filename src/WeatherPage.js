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

        // 🌦 determine condition
        const cond = currentData.weather[0].main.toLowerCase();
        if (cond.includes("rain")) setCondition("rain");
        else if (cond.includes("cloud")) setCondition("clouds");
        else setCondition("clear");

      } catch (err) {
        console.error("Weather error:", err);
      }
    };

    fetchWeather();
  }, []);

  if (!current || !forecast) return <div style={{ padding: 20 }}>Loading weather...</div>;

  const hourly = forecast.list.slice(0, 12);

  const daily = [...new Set(forecast.list.map(i => i.dt_txt.split(" ")[0]))]
    .slice(0, 7)
    .map(date => {
      const dayData = forecast.list.filter(d => d.dt_txt.startsWith(date));
      const temps = dayData.map(d => d.main.temp);

      return {
        date,
        max: Math.max(...temps),
        min: Math.min(...temps),
        icon: dayData[0].weather[0].icon
      };
    });

  return (
    <div className={`weather-page ${condition}`}>

      {/* 🌤 BACKGROUND */}
      <div className="weather-bg"></div>

      {/* 🌫 CONTENT */}
      <div className="weather-content">

        {/* CURRENT */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "18px", opacity: 0.7 }}>
            Fallon, NV
          </div>

          <div style={{ fontSize: "90px", fontWeight: "700" }}>
            {Math.round(current.main.temp)}°
          </div>

          <div style={{ fontSize: "24px", opacity: 0.85 }}>
            {current.weather[0].description}
          </div>
        </div>

        {/* HOURLY */}
        <div style={{ marginBottom: "50px" }}>
          <div style={{ marginBottom: "15px", opacity: 0.7 }}>
            Today
          </div>

          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "space-between"
          }}>
            {hourly.map((h, i) => {
              const time = new Date(h.dt * 1000).getHours();

              return (
                <div key={i} style={{
                  flex: 1,
                  textAlign: "center",
                  background: "rgba(255,255,255,0.15)",
                  padding: "15px 5px",
                  borderRadius: "12px"
                }}>
                  <div style={{ fontSize: "14px" }}>{time}:00</div>

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

        {/* 7 DAY */}
        <div>
          <div style={{ marginBottom: "15px", opacity: 0.7 }}>
            7-Day Forecast
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "15px"
          }}>
            {daily.map((d, i) => (
              <div key={i} style={{
                textAlign: "center",
                background: "rgba(255,255,255,0.15)",
                padding: "15px",
                borderRadius: "12px"
              }}>
                <div>
                  {new Date(d.date).toLocaleDateString("en-US", {
                    weekday: "short"
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

      {/* 🔥 STYLES */}
      <style>{`

        .weather-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: white;
        }

        .weather-content {
          position: relative;
          z-index: 2;
          padding: 40px;
        }

        .weather-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-size: 200% 200%;
          animation: skyMove 20s linear infinite;
        }

        /* THEMES */
        .weather-page.clear .weather-bg {
          background: linear-gradient(135deg, #2563eb, #60a5fa);
        }

        .weather-page.clouds .weather-bg {
          background: linear-gradient(135deg, #64748b, #94a3b8);
        }

        .weather-page.rain .weather-bg {
          background: linear-gradient(135deg, #1e293b, #334155);
        }

        /* CLOUDS */
        .weather-page.clouds::after,
        .weather-page.rain::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;

          background:
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 60%),
            radial-gradient(circle at 70% 40%, rgba(255,255,255,0.25) 0%, transparent 60%);

          animation: cloudMove 60s linear infinite;
        }

        /* RAIN */
        .weather-page.rain::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;

          background-image: repeating-linear-gradient(
            120deg,
            rgba(255,255,255,0.2) 0px,
            rgba(255,255,255,0.2) 2px,
            transparent 2px,
            transparent 12px
          );

          animation: rainFall 0.35s linear infinite;
        }

        /* ANIMATIONS */
        @keyframes skyMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        @keyframes cloudMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes rainFall {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }

      `}</style>

    </div>
  );
}
