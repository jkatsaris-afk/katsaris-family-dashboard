import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom"; // ✅ ADD THIS
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

function AppContent() {  // ✅ WRAP YOUR EXISTING APP
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);
  const [settings, setSettings] = useState(null);
  const [now, setNow] = useState(new Date());

  // 🧠 AUTH STATE
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

  // 🔥 SETTINGS
  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettings(data);
        setAutoNightEnabled(data.auto_night_mode);
      }
    };

    loadSettings();
  }, [user]);

  // 🌙 NIGHT MODE
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
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#eef1f5" }}>

      {/* 🌙 NIGHT MODE */}
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
      <div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between" }}>
        <img src={brand} alt="Oikos Display" style={{ height: "38px" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div onClick={() => setNightMode(!nightMode)} style={{ cursor: "pointer" }}>
            <Moon size={18} />
          </div>

          <div onClick={() => setPage(prev => prev === "settings" ? "home" : "settings")} style={{ cursor: "pointer" }}>
            <Settings size={20} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "10px 20px 130px" }}>
        {page === "home" && <HomePage />}
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "weather" && <WeatherPage />}
        {page === "lists" && <ShoppingPage />}
        {page === "settings" && <SettingsPage />}
      </div>

      {/* DOCK */}
      <div style={{ position: "fixed", bottom: 0, width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${apps.length}, 1fr)` }}>
          {apps.map((app, i) => (
            <motion.div key={i} onClick={() => setPage(app.page)}>
              {app.icon}
              {app.name}
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter> {/* ✅ THIS FIXES YOUR ERROR */}
      <AppContent />
    </BrowserRouter>
  );
}
