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

// ✅ NEW
import ProfilesPage from "./ProfilesPage";

import { User } from "lucide-react";
import { getProfile, subscribeProfile } from "./profileStore";

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
  const [profile, setProfileState] = useState(null);

  // ===== BLOCK 4: CLOCK =====
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ===== BLOCK 4B: PROFILE LOAD + SUBSCRIBE =====
  useEffect(() => {
    const p = getProfile();
    setProfileState(p);

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
      const { data } = await supabase
        .from("profile_settings")
        .select("*")
        .eq("profile_id", profile.id)
        .maybeSingle();

      if (data) {
        setAutoNightEnabled(data.auto_night_mode);
        setDisplaySettings(data);
      }
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


  // ===== BLOCK 8: APPS =====
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
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ===== HEADER ===== */}
      <div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between" }}>
        <img src={brand} style={{ height: "38px" }} />

        <div style={{ display: "flex", gap: "10px" }}>

          {/* 👤 PROFILE BUTTON */}
          <div onClick={() => setPage("profiles")} style={styles.profileBtn}>
            <User size={16} />
            <span>{profile?.first_name || "Profile"}</span>
          </div>

          <div onClick={() => setPage("settings")} style={{ background: "#fff", padding: 8, borderRadius: 10 }}>
            <Settings size={20} />
          </div>

        </div>
      </div>

      {/* ===== BLOCK 12C: PAGE CONTENT ===== */}
      <div style={{ padding: "10px 20px 120px", height: "100%" }}>
        {page === "home" && <HomePage displaySettings={displaySettings} />}
        {page === "calendar" && isVisible("calendar") && <UpcomingEvents />}
        {page === "chores" && isVisible("chores") && <ChoresPage />}
        {page === "weather" && isVisible("weather") && <WeatherPage />}
        {page === "lists" && isVisible("lists") && <ShoppingPage />}
        {page === "settings" && <SettingsPage />}
        {page === "family" && isVisible("family") && <FamilyPage />}
        {page === "homeControls" && isVisible("homeControls") && <HomeControlsPage />}

        {/* ✅ THIS IS THE KEY CHANGE */}
        {page === "profiles" && <ProfilesPage />}
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


// ===== BLOCK 14: STYLES =====
const styles = {
  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#fff",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
