// ===== BLOCK 1: IMPORTS =====
import React, { useState, useEffect } from "react";
import logo from "../assets/sports-logo.png";
import background from "../assets/sports-background.png";


// ===== BLOCK 2: MAIN COMPONENT =====
export default function HomePage({ displaySettings }) {

  // ===== BLOCK 3: STATE =====
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

  const [verse, setVerse] = useState(null);


  // ===== CLOCK =====
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  // ===== WEATHER =====
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "f6de6fbfb3a1f3c55abe8b3f60d4a0eb";

        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=39.4735&lon=-118.7774&units=imperial&appid=${apiKey}`
        );
        const current = await currentRes.json();

        setWeather({
          temp: Math.round(current.main.temp),
          feels: Math.round(current.main.feels_like),
          high: Math.round(current.main.temp_max),
          low: Math.round(current.main.temp_min),
          condition: current.weather[0].description,
        });

      } catch {
        setWeather({
          temp: "--",
          feels: "--",
          high: "--",
          low: "--",
          condition: "Unavailable",
        });
      }
    };

    fetchWeather();
  }, []);


  // ===== BIBLE =====
  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const today = new Date().toDateString();
        const cached = JSON.parse(localStorage.getItem("dailyVerse"));

        if (cached && cached.date === today) {
          setVerse(cached);
          return;
        }

        const res = await fetch("https://bible-api.com/?random=verse");
        const data = await res.json();

        const verseData = {
          text: data.text,
          reference: data.reference,
          date: today,
        };

        localStorage.setItem("dailyVerse", JSON.stringify(verseData));
        setVerse(verseData);

      } catch {
        setVerse({
          text: "Unable to load verse",
          reference: "",
        });
      }
    };

    fetchVerse();
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


  // ===== UI =====
  return (
    <div style={styles.container}>

      {/* BACKGROUND */}
      <div style={styles.background} />

      {/* HEADER */}
      <div style={styles.header}>
        <img src={logo} style={styles.logo} />

        <div style={styles.settings}>
          ⚙️
        </div>
      </div>

      {/* MAIN TILE */}
      <div style={styles.glassTile}>

        <div style={styles.time}>{formattedTime}</div>
        <div style={styles.date}>{formattedDate}</div>

        <div style={styles.weather}>
          {weather.temp}° • {weather.condition}
        </div>

        {displaySettings?.visible_widgets?.bible && verse && (
          <div style={styles.verse}>
            <div style={{ fontStyle: "italic" }}>
              "{verse.text}"
            </div>
            <div style={{ marginTop: "5px", fontWeight: "600" }}>
              {verse.reference}
            </div>
          </div>
        )}

      </div>

      {/* DOCK */}
      <div style={styles.dock}>
        <div style={styles.dockItemActive}>
          🏠
          <div style={styles.dockLabel}>Home</div>
        </div>
      </div>

    </div>
  );
}


// ===== STYLES =====
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

  header: {
    position: "absolute",
    top: "20px",
    left: "20px",
    right: "20px",
    display: "flex",
    justifyContent: "space-between",
    zIndex: 3,
  },

  logo: {
    width: "140px",
  },

  settings: {
    padding: "10px 14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    cursor: "pointer",
  },

  glassTile: {
    padding: "40px 60px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    textAlign: "center",
    zIndex: 2,
  },

  time: {
    fontSize: "110px",
    fontWeight: "700",
    color: "#fff",
  },

  date: {
    fontSize: "24px",
    color: "#e5e7eb",
    marginBottom: "15px",
  },

  weather: {
    color: "#e5e7eb",
  },

  verse: {
    marginTop: "15px",
    color: "#e5e7eb",
  },

  dock: {
    position: "absolute",
    bottom: "25px",
    padding: "12px 24px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    display: "flex",
    zIndex: 3,
  },

  dockItemActive: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
  },

  dockLabel: {
    fontSize: "12px",
    marginTop: "4px",
  },
};
