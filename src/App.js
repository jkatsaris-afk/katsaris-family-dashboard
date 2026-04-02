// ===== BLOCK 1: IMPORTS =====
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


// ===== BLOCK 2: MAIN COMPONENT =====
function AppContent() {

  // ===== BLOCK 3: STATE =====
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [page, setPage] = useState("home");

  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);

  const [displaySettings, setDisplaySettings] = useState(null);
  const [now, setNow] = useState(new Date());


  // ===== BLOCK 4: CLOCK =====
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  // ===== BLOCK 5: AUTH =====
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


  // ===== BLOCK 6: LOAD SETTINGS =====
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
        console.log("VISIBLE TILES RAW:", data.visible_tiles); // DEBUG
        setAutoNightEnabled(data.auto_night_mode);
        setDisplaySettings(data);
      }
    };

    loadSettings();
  }, [user]);


  // ===== BLOCK 7: AUTO NIGHT MODE =====
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


  // ===== BLOCK 8: APP FILTER (OBJECT-BASED) =====
const apps = [
  { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
  { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
  { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
  { name: "Weather", icon: <CloudSun />, page: "weather", color: "#0ea5e9" },
  { name: "Lists", icon: <List />, page: "lists", color: "#8b5cf6" },
  { name: "Family", icon: <Users />, page: "family", color: "#6366f1" },
  { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls", color: "#22c55e" },
].filter(app => {
  const tiles = displaySettings?.visible_tiles;

  // show everything until settings load
  if (!tiles) return true;

  // ✅ HANDLE OBJECT FORMAT (YOUR CASE)
  if (typeof tiles === "object") {
    return tiles[app.page] !== false; 
  }

  // fallback safety
  return true;
});

  // ===== BLOCK 9: PAGE VISIBILITY (OBJECT-BASED) =====
const isVisible = (pageName) => {
  const tiles = displaySettings?.visible_tiles;

  if (!tiles) return true;

  if (typeof tiles === "object") {
    return tiles[pageName] !== false;
  }

  return true;
};

  // ===== BLOCK 10: AUTH GUARD =====
  if (loadingUser) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <LoginPage />;


  // ===== BLOCK 11: TIME FORMAT =====
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });


  // ===== BLOCK 12: MAIN UI (YOUR ORIGINAL STYLE PRESERVED) =====
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

      {/* ===== BLOCK 12A: NIGHT MODE ===== */}
      {nightMode && (
        <div
          onClick={() => setNightMode(false)}
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

      {/* ===== BLOCK 12B: HEADER ===== */}
      <div
        style={{
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src={brand} style={{ height: "38px" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div
            onClick={() => {
              setAutoNightEnabled(false);
              setNightMode(true);
            }}
            style={{ background: "#fff", padding: 8, borderRadius: 10 }}
          >
            <Moon size={18} />
          </div>

          <div
            onClick={() => setPage(p => p === "settings" ? "home" : "settings")}
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

      {/* ===== BLOCK 12C: PAGE CONTENT ===== */}
      <div
  style={{
    padding: "10px 20px",
    height: "calc(100vh - 100px)", // 👈 THIS is the fix
    overflow: "hidden",
  }}
>
        {page === "home" && <HomePage displaySettings={displaySettings} />}
        {page === "calendar" && isVisible("calendar") && <UpcomingEvents />}
        {page === "chores" && isVisible("chores") && <ChoresPage />}
        {page === "weather" && isVisible("weather") && <WeatherPage />}
        {page === "lists" && isVisible("lists") && <ShoppingPage />}
        {page === "settings" && <SettingsPage />}
        {page === "family" && isVisible("family") && <FamilyPage />}
        {page === "homeControls" && isVisible("homeControls") && <HomeControlsPage />}
      </div>

      {/* ===== BLOCK 12D: DOCK ===== */}
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
                onClick={() => setPage(app.page)}
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
  );
}


// ===== BLOCK 13: ROUTER =====
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
