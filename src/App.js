import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import OnboardingPage from "./OnboardingPage";
import LoadingPage from "./LoadingPage";
import LoginPage from "./LoginPage";

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

import HomePage from "./HomePage";
import ChoresPage from "./ChoresPage";
import UpcomingEvents from "./UpcomingEvents";
import ShoppingPage from "./ShoppingPage";
import WeatherPage from "./WeatherPage";
import SettingsPage from "./SettingsPage";
import FamilyPage from "./FamilyPage";
import HomeControlsPage from "./HomeControlsPage";

import brand from "./assets/oikos-brand.png";

const PRIMARY = "#2f6ea6";

function AppContent() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [page, setPage] = useState("home");

  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);

  const [displaySettings, setDisplaySettings] = useState(null);
  const [now, setNow] = useState(new Date());

  // 🧠 CLOCK
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔐 AUTH
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

  // ⚙️ LOAD SETTINGS
  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
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

      if (data) {
        setAutoNightEnabled(data.auto_night_mode);
        setDisplaySettings(data);
      }
    };

    loadSettings();
  }, [user]);

  // 🌙 AUTO NIGHT MODE
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

  // 📱 APP LIST (WITH SHOW/HIDE FILTER)
  const apps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6", key: "show_home" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981", key: "show_calendar" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316", key: "show_chores" },
    { name: "Weather", icon: <CloudSun />, page: "weather", color: "#0ea5e9", key: "show_weather" },
    { name: "Lists", icon: <List />, page: "lists", color: "#8b5cf6", key: "show_lists" },
    { name: "Family", icon: <Users />, page: "family", color: "#6366f1", key: "show_family" },
    { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls", color: "#22c55e", key: "show_home_controls" },
  ].filter(app => {
    if (!displaySettings) return true;
    return displaySettings[app.key] !== false;
  });

  if (loadingUser) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <LoginPage />;

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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: displaySettings?.background_url
          ? `url(${displaySettings.background_url}) center/cover no-repeat`
          : "#eef1f5",
      }}
    >

      {/* 🌙 NIGHT MODE */}
      {nightMode && (
        <div
          onClick={() => {
            if (!autoNightEnabled) setNightMode(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: "120px",
              fontWeight: "700",
              color: "#ffffff",
              textShadow: "0 0 25px rgba(255,255,255,0.4)",
            }}
          >
            {formattedTime}
          </div>

          <div
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.8)",
              marginTop: "10px",
            }}
          >
            {formattedDate}
          </div>
        </div>
      )}

      {/* APP */}
      <div style={{ zIndex: 1 }}>
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
            <div
              onClick={(e) => {
                e.stopPropagation();
                setAutoNightEnabled(false);
                setNightMode(true);
              }}
              style={{
                cursor: "pointer",
                padding: "8px",
                borderRadius: "10px",
                background: "#fff",
              }}
            >
              <Moon size={18} />
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                setPage(prev => (prev === "settings" ? "home" : "settings"));
              }}
              style={{
                cursor: "pointer",
                padding: "8px",
                borderRadius: "10px",
                background: page === "settings" ? PRIMARY : "#fff",
              }}
            >
              <Settings size={20} />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: "10px 20px 120px" }}>
          {page === "home" && <HomePage displaySettings={displaySettings} />}
          {page === "calendar" && <UpcomingEvents />}
          {page === "chores" && <ChoresPage />}
          {page === "weather" && <WeatherPage />}
          {page === "lists" && <ShoppingPage />}
          {page === "settings" && <SettingsPage />}
          {page === "family" && <FamilyPage />}
          {page === "homeControls" && <HomeControlsPage />}
        </div>

        {/* DOCK */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
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
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${apps.length}, 1fr)`,
                gap: "12px",
              }}
            >
              {apps.map((app, i) => (
                <motion.div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage(app.page);
                  }}
                  style={{
                    background: app.color,
                    color: "white",
                    padding: "14px",
                    borderRadius: "14px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  {app.icon}
                  <div>{app.name}</div>
                </motion.div>
              ))}
            </div>
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
