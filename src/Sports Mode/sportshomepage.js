import React, { useState, useEffect } from "react";
import logo from "../assets/sports-logo.png";
import background from "../assets/sports-background.png";

export default function SportsHomePage() {
  const [now, setNow] = useState(new Date());

  const [weather, setWeather] = useState({
    temp: "--",
    condition: "Loading...",
  });

  // CLOCK
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WEATHER
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=39.4735&lon=-118.7774&units=imperial&appid=f6de6fbfb3a1f3c55abe8b3f60d4a0eb`
        );
        const data = await res.json();

        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description,
        });
      } catch {
        setWeather({
          temp: "--",
          condition: "Unavailable",
        });
      }
    };

    fetchWeather();
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
    <div style={styles.container}>
      
      {/* BACKGROUND */}
      <div style={styles.background} />

      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        {/* LEFT LOGO */}
        <img src={logo} style={styles.headerLogo} />

        {/* RIGHT SETTINGS */}
        <div style={styles.settings}>
          ⚙️
        </div>
      </div>

      {/* ===== MAIN TILE ===== */}
      <div style={styles.glassTile}>
        <div style={styles.time}>{formattedTime}</div>
        <div style={styles.date}>{formattedDate}</div>

        <div style={styles.weather}>
          {weather.temp}° • {weather.condition}
        </div>
      </div>

      {/* ===== DOCK ===== */}
      <div style={styles.dock}>
        <div style={styles.dockItemActive}>
          🏠
          <div style={styles.dockLabel}>Home</div>
        </div>
      </div>

    </div>
  );
}

/* =========================
   🎨 STYLES
========================= */

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  background: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },

  /* ===== HEADER ===== */
  header: {
    position: "absolute",
    top: "20px",
    left: "20px",
    right: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 3,
  },

  headerLogo: {
    width: "140px",
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
  },

  settings: {
    fontSize: "26px",
    cursor: "pointer",
    background: "rgba(0,0,0,0.4)",
    padding: "10px 14px",
    borderRadius: "12px",
    backdropFilter: "blur(8px)",
    color: "#fff",
  },

  /* ===== MAIN TILE ===== */
  glassTile: {
    zIndex: 2,
    padding: "40px 60px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    textAlign: "center",
  },

  time: {
    fontSize: "110px",
    fontWeight: "700",
    color: "#fff",
    lineHeight: "1",
  },

  date: {
    fontSize: "24px",
    color: "#e5e7eb",
    marginBottom: "15px",
  },

  weather: {
    fontSize: "20px",
    color: "#e5e7eb",
  },

  /* ===== DOCK ===== */
  dock: {
    position: "absolute",
    bottom: "25px",
    display: "flex",
    gap: "25px",
    padding: "14px 28px",
    borderRadius: "22px",
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
    zIndex: 3,
  },

  dockItemActive: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    fontSize: "22px",
    fontWeight: "600",
  },

  dockLabel: {
    fontSize: "12px",
    marginTop: "4px",
  },
};
