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

  // WEATHER (simple version)
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

      {/* LOGO TOP */}
      <img src={logo} style={styles.topLogo} />

      {/* MAIN GLASS TILE */}
      <div style={styles.glassTile}>
        <div style={styles.time}>{formattedTime}</div>
        <div style={styles.date}>{formattedDate}</div>

        <div style={styles.weather}>
          {weather.temp}° • {weather.condition}
        </div>
      </div>

      {/* DOCK */}
      <div style={styles.dock}>
        <div style={styles.dockItemActive}>Home</div>
        <div style={styles.dockItem}>Settings</div>
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
    flexDirection: "column",
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

  topLogo: {
    position: "absolute",
    top: "30px",
    width: "180px",
    zIndex: 2,
    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
  },

  glassTile: {
    zIndex: 2,
    padding: "40px 60px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
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

  dock: {
    position: "absolute",
    bottom: "25px",
    display: "flex",
    gap: "20px",
    padding: "10px 20px",
    borderRadius: "20px",
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(10px)",
    zIndex: 2,
  },

  dockItem: {
    color: "#ccc",
    fontWeight: "600",
    cursor: "pointer",
  },

  dockItemActive: {
    color: "#fff",
    fontWeight: "700",
  },
};
