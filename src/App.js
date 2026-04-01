import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  ClipboardList,
  SlidersHorizontal,
  CloudSun,
  Settings,
  List,
  Users,
  Moon
} from "lucide-react";

import { supabase } from "./lib/supabase";

import LoginPage from "./LoginPage";

import HomePage from "./HomePage";
import ChoresPage from "./ChoresPage";
import UpcomingEvents from "./UpcomingEvents";
import ShoppingPage from "./ShoppingPage";
import WeatherPage from "./WeatherPage";
import SettingsPage from "./SettingsPage";

import brand from "./assets/oikos-brand.png";

const PRIMARY = "#2f6ea6";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);
  const [settings, setSettings] = useState(null);
  const [now, setNow] = useState(new Date());

  // 🧠 AUTH STATE (persistent login)
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🕒 CLOCK
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔥 LOAD SETTINGS (household will come next)
  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      console.log("SETTINGS:", data, error);

      if (data) {
        setSettings(data);
        setAutoNightEnabled(data.auto_night_mode);
      }
    };

    loadSettings();
  }, [user]);

  // 🌙 AUTO NIGHT MODE (8PM–6AM)
  useEffect(() => {
    if (!autoNightEnabled) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 20 || hour < 6;
      setNightMode(isNight);
    };

    checkTime();

    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [autoNightEnabled]);

  const apps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
    { name: "Weather", icon: <CloudSun />, page: "weather", color: "#0ea5e9" },
    { name: "Lists", icon: <List />, page: "lists", color: "#8b5cf6" },
    { name: "Family", icon: <Users />, page: "family", color: "#6366f1" },
    { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls", color: "#22c55e" },
  ];

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // 🔒 LOGIN GUARD
  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#eef1f5" }}>

      {/* 🌙 NIGHT MODE OVERLAY */}
      {nightMode && (
        <div
          onClick={() => setNightMode(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20, 20, 20, 0.75)",
            backdropFilter: "blur(4px)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ fontSize: "120px", fontWeight: "700" }}>
            {time}
          </div>
          <div style={{ fontSize: "28px", opacity: 0.85 }}>
            {date}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src={brand} alt="Oikos Display" style={{ height: "38px" }} />

        <div style={{ display: "flex", gap: "10px" }}>

          {/* 🌙 MANUAL TOGGLE */}
          <div
            onClick={() => setNightMode(!nightMode)}
            style={{
              cursor: "pointer",
              padding: "8px",
              borderRadius: "10px",
              background: nightMode ? "#111" : "#fff",
              color: nightMode ? "#fff" : "#000",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Moon size={18} />
          </div>

          {/* ⚙️ SETTINGS */}
          <div
            onClick={() =>
              setPage((prev) =>
                prev === "settings" ? "home" : "settings"
              )
            }
            style={{
              cursor: "pointer",
              padding: "8px",
              borderRadius: "10px",
              background: page === "settings" ? PRIMARY : "#fff",
              color: page === "settings" ? "#fff" : "#000",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Settings size={20} />
          </div>

        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ padding: "10px 20px 130px" }}>
        {page === "home" && <HomePage />}
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "weather" && <WeatherPage />}
        {page === "lists" && <ShoppingPage />}

        {page === "family" && (
          <div style={{ background: "#fff", padding: "20px", borderRadius: "20px" }}>
            Family Page (coming next)
          </div>
        )}

        {page === "settings" && <SettingsPage />}

        {page === "homeControls" && (
          <div style={{ background: "#fff", padding: "20px", borderRadius: "20px" }}>
            Home Controls coming soon...
          </div>
        )}
      </div>

      {/* DOCK */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: "95%",
            maxWidth: "1400px",
            background: "#eef1f5",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "20px",
            boxShadow: "0 -5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${apps.length}, 1fr)`,
              gap: "12px",
            }}
          >
            {apps.map((app, i) => {
              const isActive = page === app.page;

              return (
                <motion.div
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(app.page)}
                  style={{
                    background: app.color,
                    color: "white",
                    padding: "clamp(10px, 1.5vw, 18px)",
                    borderRadius: "14px",
                    textAlign: "center",
                    cursor: "pointer",
                    opacity: isActive ? 1 : 0.9,
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    boxShadow: isActive
                      ? "0 8px 16px rgba(0,0,0,0.25)"
                      : "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ fontSize: "22px", marginBottom: "6px" }}>
                    {app.icon}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "600" }}>
                    {app.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
