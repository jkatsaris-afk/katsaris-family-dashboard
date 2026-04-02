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

import ProfilesPage from "./ProfilesPage";

import { User } from "lucide-react";
import { getProfile, subscribeProfile, setProfile } from "./profileStore"; // ✅ added setProfile

import brand from "./assets/oikos-brand.png";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 2: MAIN COMPONENT =====
function AppContent() {

  // ===== BLOCK 3: STATE =====
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [page, setPage] = useState("home");

  const [showProfiles, setShowProfiles] = useState(false);

  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);

  const [displaySettings, setDisplaySettings] = useState(null);
  const [now, setNow] = useState(new Date());
  const [profile, setProfileState] = useState(null);

  // ===== BLOCK 4: CLOCK =====
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ===== BLOCK 4A: RESTORE PROFILE =====
  useEffect(() => {
    const saved = localStorage.getItem("activeProfile");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfileState(parsed);
        setProfile(parsed); // 🔥 push into global store
      } catch (err) {
        console.error("PROFILE RESTORE ERROR:", err);
      }
    }
  }, []);

  // ===== BLOCK 4B: LISTEN FOR PROFILE CHANGES =====
  useEffect(() => {
    const unsub = subscribeProfile((newProfile) => {
      setProfileState(newProfile);
    });

    return () => unsub();
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

  // ===== BLOCK 6: LOAD SETTINGS (PROFILE BASED) =====
  useEffect(() => {
    if (!profile) return;

    const loadSettings = async () => {
      let { data } = await supabase
        .from("profile_settings")
        .select("*")
        .eq("profile_id", profile.id)
        .maybeSingle();

      // ✅ CREATE SETTINGS IF MISSING
      if (!data) {
        const { data: newData } = await supabase
          .from("profile_settings")
          .insert({
            profile_id: profile.id,
            auto_night_mode: false,
            visible_tiles: {},
            background_url: null,
          })
          .select()
          .single();

        data = newData;
      }

      setAutoNightEnabled(data.auto_night_mode ?? false);
      setDisplaySettings(data || {});
    };

    loadSettings();
  }, [profile]);

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

  // ===== BLOCK 8: APP FILTER =====
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
    if (!tiles) return true;
    if (typeof tiles === "object") return tiles[app.page] !== false;
    return true;
  });

  // ===== BLOCK 9: VISIBILITY =====
  const isVisible = (pageName) => {
    const tiles = displaySettings?.visible_tiles;
    if (!tiles) return true;
    if (typeof tiles === "object") return tiles[pageName] !== false;
    return true;
  };

  // ===== BLOCK 10: AUTH GUARD =====
  if (loadingUser) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <LoginPage />;

  // ===== BLOCK 11: TIME =====
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  // ===== BLOCK 12: MAIN UI =====
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

      {/* ===== HEADER ===== */}
      <div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src={brand} style={{ height: "38px" }} />

        <div style={{ display: "flex", gap: "10px" }}>

          {/* 👤 PROFILE BUTTON */}
          <div onClick={() => setShowProfiles(true)} style={styles.profileBtn}>
            <User size={16} />
            <span>{profile?.first_name || "Profile"}</span>
          </div>

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

      {/* ===== CONTENT ===== */}
      <div style={{ padding: "10px 20px 120px", height: "100%" }}>
        {page === "home" && <HomePage displaySettings={displaySettings} />}
        {page === "calendar" && isVisible("calendar") && <UpcomingEvents />}
        {page === "chores" && isVisible("chores") && <ChoresPage />}
        {page === "weather" && isVisible("weather") && <WeatherPage />}
        {page === "lists" && isVisible("lists") && <ShoppingPage />}
        {page === "settings" && <SettingsPage />}
        {page === "family" && isVisible("family") && <FamilyPage />}
        {page === "homeControls" && isVisible("homeControls") && <HomeControlsPage />}
      </div>

      {/* ===== DOCK ===== */}
      <div style={{ position: "fixed", bottom: 0, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "95%", maxWidth: "1400px", background: "#eef1f5", padding: "12px", marginBottom: "10px", borderRadius: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${apps.length}, 1fr)`, gap: "12px" }}>
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

      {/* PROFILE OVERLAY */}
      {showProfiles && (
        <ProfilesPage onClose={() => setShowProfiles(false)} />
      )}

    </div>
  );
}


// ===== ROUTER =====
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


// ===== STYLES =====
const styles = {
  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#fff",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};
