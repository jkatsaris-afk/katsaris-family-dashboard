import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import OnboardingPage from "./OnboardingPage";
import LoadingPage from "./LoadingPage";

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

function AppContent() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [page, setPage] = useState("home");

  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);
  const [settings, setSettings] = useState(null);
  const [now, setNow] = useState(new Date());

  // AUTH
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoadingUser(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoadingUser(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // CLOCK
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // SETTINGS
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

  // NIGHT MODE
  useEffect(() => {
    if (!autoNightEnabled) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      setNightMode(hour >= 20 || hour < 6);
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

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // LOADING FIX
  if (loadingUser) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!user) return <LoginPage />;

  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#eef1f5", display: "flex", flexDirection: "column" }}>
      
      {/* NIGHT MODE OVERLAY */}
      {nightMode && (
        <div
          onClick={() => setNightMode(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,20,20,0.75)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div style={{ fontSize: "120px", fontWeight: "700" }}>{time}</div>
          <div style={{ fontSize: "28px", opacity: 0.85 }}>{date}</div>
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

        {/* RIGHT CONTROLS */}
        <div style={{ display: "flex", gap: "10px" }}>
          
          {/* NIGHT MODE BUTTON */}
          <div
            onClick={() => setNightMode(!nightMode)}
            style={{
              cursor: "pointer",
              padding: "8px",
              borderRadius: "10px",
              background: nightMode ? "#111" : "#fff",
            }}
          >
            <Moon size={18} />
          </div>

          {/* SETTINGS BUTTON */}
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
            }}
          >
            <Settings size={20} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px 120px" }}>
        {page === "home" && <HomePage />}
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "weather" && <WeatherPage />}
        {page === "lists" && <ShoppingPage />}
        {page === "settings" && <SettingsPage />}
      </div>

      {/* DOCK */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
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
                    padding: "14px",
                    borderRadius: "14px",
                    textAlign: "center",
                    cursor: "pointer",
                    opacity: isActive ? 1 : 0.85,
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/app" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}
