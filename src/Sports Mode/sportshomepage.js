// ===== BLOCK 1: IMPORTS =====
import React, { useState, useEffect } from "react";
import background from "../assets/sports-background.png"; // ✅ ADDED


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


  // ===== BLOCK 4: CLOCK =====
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  // ===== BLOCK 6: WEATHER =====
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

      } catch {
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


  // ===== BIBLE VERSE =====
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


  // ===== FORMATTERS =====
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });


  // ===== MAIN UI =====
  return (
    <div style={styles.container}>

      {/* ✅ BACKGROUND LAYER */}
      <div style={styles.background} />

      <div style={styles.glassTile}>

        {displaySettings?.visible_widgets?.clock !== false && (
          <div style={styles.time}>{formattedTime}</div>
        )}

        {displaySettings?.visible_widgets?.date !== false && (
          <div style={styles.date}>{formattedDate}</div>
        )}

        {displaySettings?.visible_widgets?.weather !== false && (
          <div style={styles.weather}>
            <div style={styles.weatherMain}>
              {weather.temp}° • {weather.condition}
            </div>

            <div style={styles.weatherSub}>
              Feels like {weather.feels}° • H {weather.high}° / L {weather.low}°
            </div>

            <div style={styles.weatherTomorrow}>
              Tomorrow: {weather.tomorrowHigh}° / {weather.tomorrowLow}° • {weather.tomorrowCondition}
            </div>
          </div>
        )}

        {displaySettings?.visible_widgets?.events && (
          <div style={{ marginTop: "15px", color: "#6b7280" }}>
            📅 No events today
          </div>
        )}

        {displaySettings?.visible_widgets?.countdown && (
          <div style={{ marginTop: "10px", color: "#6b7280" }}>
            ⏳ Countdown not set
          </div>
        )}

        {displaySettings?.visible_widgets?.bible && verse && (
          <div style={{ marginTop: "15px", color: "#374151" }}>
            <div style={{ fontStyle: "italic" }}>
              "{verse.text}"
            </div>
            <div style={{ marginTop: "5px", fontWeight: "600" }}>
              {verse.reference}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}


// ===== STYLES =====
const styles = {
  container: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "80px",
    position: "relative", // ✅ ADDED
    overflow: "hidden",   // ✅ ADDED
  },

  // ✅ BACKGROUND STYLE
  background: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },

  glassTile: {
    padding: "40px 60px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
    zIndex: 1, // ✅ ensures it's above background
  },

  time: {
    fontSize: "110px",
    fontWeight: "700",
    color: "#fff", // 🔥 changed for dark background
  },

  date: {
    fontSize: "24px",
    color: "#e5e7eb",
    marginBottom: "20px",
  },

  weather: {
    color: "#e5e7eb",
  },

  weatherMain: {
    fontSize: "28px",
    fontWeight: "600",
  },

  weatherSub: {
    fontSize: "16px",
    color: "#cbd5e1",
  },

  weatherTomorrow: {
    marginTop: "12px",
    fontSize: "15px",
    color: "#cbd5e1",
  },
};
