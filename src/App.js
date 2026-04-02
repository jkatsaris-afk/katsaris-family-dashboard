// =========================
// 📦 IMPORTS
// =========================
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


// =========================
// 🚀 MAIN APP CONTENT
// =========================
function AppContent() {

  // =========================
  // 🧠 STATE
  // =========================
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [page, setPage] = useState("home");

  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);

  const [displaySettings, setDisplaySettings] = useState(null);
  const [now, setNow] = useState(new Date());


  // =========================
  // 🕒 CLOCK (USED FOR NIGHT MODE)
  // =========================
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  // =========================
  // 🔐 AUTH HANDLING
  // =========================
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


  // =========================
  // ⚙️ LOAD SETTINGS FROM DB
  // =========================
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


  // =========================
  // 🌙 AUTO NIGHT MODE
  // =========================
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


  // =========================
  // 📱 APP LIST (USES visible_tiles FROM DB)
  // 🔥 THIS IS YOUR FIXED BLOCK
  // =========================
  const apps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
    { name: "Weather", icon: <CloudSun />, page: "weather", color: "#0ea5e9" },
    { name: "Lists", icon: <List />, page: "lists", color: "#8b5cf6" },
    { name: "Family", icon: <Users />, page: "family", color: "#6366f1" },
    { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls", color: "#22c55e" },
  ].filter(app => {
    // If settings not loaded yet → show all
    if (!displaySettings || !displaySettings.visible_tiles) return true;

    // Only show apps listed in DB
    return displaySettings.visible_tiles.includes(app.page);
  });


  // =========================
  // 🔒 OPTIONAL PAGE ACCESS GUARD
  // =========================
  const isVisible = (pageName) => {
    if (!displaySettings?.visible_tiles) return true;
    return displaySettings.visible_tiles.includes(pageName);
  };


  // =========================
  // ⛔ AUTH GATES
  // =========================
  if (loadingUser) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <LoginPage />;


  // =========================
  // 🕒 FORMAT TIME/DATE
  // =========================
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });


  // =========================
  // 🎨 MAIN UI
  // =========================
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

      {/* =========================
          🌙 NIGHT MODE OVERLAY
      ========================= */}
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
          <div style={{ fontSize: "120px", color: "#fff" }}>
            {formattedTime}
          </div>

          <div style={{ fontSize: "28px", color: "#ccc" }}>
            {formattedDate}
          </div>
        </div>
      )}


      {/* =========================
          🖥 MAIN APP AREA
      ========================= */}
      <div style={{ zIndex: 1 }}>

        {/* =========================
            🔝 HEADER
        ========================= */}
        <div style={{
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <img src={brand} style={{ height: "38px" }} />

          <div style={{ display: "flex", gap: "10px" }}>

            {/* 🌙 MANUAL NIGHT BUTTON */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setAutoNightEnabled(false);
                setNightMode(true);
              }}
              style={{ background: "#fff", padding: 8, borderRadius: 10 }}
            >
              <Moon size={18} />
            </div>

            {/* ⚙️ SETTINGS BUTTON */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setPage(prev => prev === "settings" ? "home" : "settings");
              }}
              style={{
                background: page === "settings" ? PRIMARY : "#fff",
                padding: 8,
                borderRadius: 10
              }}
            >
              <Settings size={20} />
            </div>
          </div>
        </div>


        {/* =========================
            📄 PAGE CONTENT
        ========================= */}
        <div style={{ padding: "10px 20px 120px" }}>
          {page === "home" && <HomePage displaySettings={displaySettings} />}
          {page === "calendar" && isVisible("calendar") && <UpcomingEvents />}
          {page === "chores" && isVisible("chores") && <ChoresPage />}
          {page === "weather" && isVisible("weather") && <WeatherPage />}
          {page === "lists" && isVisible("lists") && <ShoppingPage />}
          {page === "settings" && <SettingsPage />}
          {page === "family" && isVisible("family") && <FamilyPage />}
          {page === "homeControls" && isVisible("homeControls") && <HomeControlsPage />}
        </div>


        {/* =========================
            📱 DOCK (BOTTOM NAV)
        ========================= */}
        <div style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}>
          <div style={{
            width: "95%",
            background: "#eef1f5",
            padding: "12px",
            borderRadius: "20px",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${apps.length}, 1fr)`,
              gap: "12px",
            }}>
              {apps.map((app, i) => (
                <motion.div
                  key={i}
                  onClick={() => setPage(app.page)}
                  style={{
                    background: app.color,
                    color: "white",
                    padding: "14px",
                    borderRadius: "14px",
                    textAlign: "center",
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


// =========================
// 🌐 ROUTER WRAPPER
// =========================
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
