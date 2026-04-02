import React, { useState, useEffect } from "react";
import defaultLogo from "./assets/oikos-brand.png";
import { supabase } from "./lib/supabase";

export default function HomePage() {
  const [now, setNow] = useState(new Date());
  const [logo, setLogo] = useState(defaultLogo);

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

  // 🕒 CLOCK
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔥 LOAD LOGO (Supabase)
  useEffect(() => {
    const loadLogo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: member } = await supabase
        .from("household_members")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!member) return;

      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("household_id", member.household_id)
        .maybeSingle();

      if (data?.logo_url) {
        setLogo(data.logo_url);
      }
    };

    loadLogo();
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

        const tomorrow = forecast.list.find((item) =>
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
          tomorrowCondition: tomorrow
            ? tomorrow.weather[0].description
            : "",
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px",
        overflow: "hidden",
        backgroundImage: `url("/background.jpg")`, // optional
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🌙 NIGHT MODE OVERLAY */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.6)", // adjust 0.4–0.8
          backdropFilter: "blur(6px)",
          zIndex: 1,
        }}
      />

      {/* 🔲 CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 🔥 GLASS TILE */}
        <div
          style={{
            padding: "40px 60px",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            textAlign: "center",
          }}
        >
          {/* 🕒 TIME */}
          <div
            style={{
              fontSize: "110px",
              fontWeight: "700",
              color: "#ffffff",
              lineHeight: "1",
            }}
          >
            {formattedTime}
          </div>

          {/* 📅 DATE */}
          <div
            style={{
              fontSize: "24px",
              color: "rgba(255,255,255,0.85)",
              marginBottom: "20px",
            }}
          >
            {formattedDate}
          </div>

          {/* 🌤️ WEATHER */}
          <div style={{ color: "rgba(255,255,255,0.85)" }}>
            <div style={{ fontSize: "28px", fontWeight: "600" }}>
              {weather.temp}° • {weather.condition}
            </div>

            <div style={{ fontSize: "16px", opacity: 0.8 }}>
              Feels like {weather.feels}° • H {weather.high}° / L {weather.low}°
            </div>

            <div
              style={{
                marginTop: "12px",
                fontSize: "15px",
                opacity: 0.8,
              }}
            >
              Tomorrow: {weather.tomorrowHigh}° /{" "}
              {weather.tomorrowLow}° • {weather.tomorrowCondition}
            </div>
          </div>
        </div>

        {/* 🏠 LOGO */}
        <img
          src={logo}
          alt="Oikos Brand"
          style={{
            width: "200px",
            marginTop: "25px",
            opacity: 0.9,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
          }}
        />
      </div>
    </div>
  );
}
