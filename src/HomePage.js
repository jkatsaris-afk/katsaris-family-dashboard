import React, { useState, useEffect } from "react";
import defaultLogo from "./assets/oikos-brand.png";
import { supabase } from "./lib/supabase";

export default function HomePage() {
  const [now, setNow] = useState(new Date());
  const [logo, setLogo] = useState(defaultLogo);

  const [nightMode, setNightMode] = useState(false);
  const [autoNightMode, setAutoNightMode] = useState(false);

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

  // 🌙 AUTO NIGHT MODE
  useEffect(() => {
    if (!autoNightMode) return;

    const checkNightMode = () => {
      const hour = new Date().getHours();
      const shouldBeNight = hour >= 20 || hour < 6;

      setNightMode((prev) =>
        prev !== shouldBeNight ? shouldBeNight : prev
      );
    };

    checkNightMode();
    const interval = setInterval(checkNightMode, 60000);
    return () => clearInterval(interval);
  }, [autoNightMode]);

  // 🔥 LOAD SETTINGS
  useEffect(() => {
    const loadData = async () => {
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

      if (data?.logo_url) setLogo(data.logo_url);
      if (data?.night_mode !== undefined) setNightMode(data.night_mode);
      if (data?.auto_night_mode !== undefined)
        setAutoNightMode(data.auto_night_mode);
    };

    loadData();
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
        position: "fixed", // 🔥 forces full screen
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: nightMode ? "center" : "flex-start",

        paddingTop: nightMode ? "0px" : "120px",

        backgroundColor: nightMode ? "#000" : undefined, // 🔥 hard black
        backgroundImage: nightMode ? "none" : `url("/background.jpg")`,

        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* CONTENT */}
      <div style={{ textAlign: "center" }}>
        {/* TILE */}
        <div
          style={{
            padding: "40px 60px",
            borderRadius: "24px",

            background: nightMode
              ? "transparent"
              : "rgba(255,255,255,0.15)",

            backdropFilter: nightMode ? "none" : "blur(12px)",

            boxShadow: nightMode
              ? "none"
              : "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          {/* TIME */}
          <div
            style={{
              fontSize: "110px",
              fontWeight: "700",
              color: nightMode ? "#fff" : "#111827",
            }}
          >
            {formattedTime}
          </div>

          {/* DATE */}
          <div
            style={{
              fontSize: "24px",
              color: nightMode
                ? "rgba(255,255,255,0.8)"
                : "#374151",
              marginBottom: "20px",
            }}
          >
            {formattedDate}
          </div>

          {/* WEATHER */}
          {!nightMode && (
            <div style={{ color: "#374151" }}>
              <div style={{ fontSize: "28px", fontWeight: "600" }}>
                {weather.temp}° • {weather.condition}
              </div>

              <div style={{ fontSize: "16px", opacity: 0.8 }}>
                Feels like {weather.feels}° • H {weather.high}° / L{" "}
                {weather.low}°
              </div>
            </div>
          )}
        </div>

        {/* LOGO */}
        {!nightMode && (
          <img
            src={logo}
            alt="Oikos Brand"
            style={{
              width: "200px",
              marginTop: "25px",
            }}
          />
        )}
      </div>
    </div>
  );
}
