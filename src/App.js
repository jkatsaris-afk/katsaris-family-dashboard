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

import { getProfile, subscribeProfile, setProfile } from "./profileStore";

import brand from "./assets/oikos-brand.png";

// ✅ ADDED: Sports Mode Homepage
import SportsHomePage from "./Sports Mode/homepage";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 2: MAIN COMPONENT =====
function AppContent() {

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [page, setPage] = useState("home");

  const [showProfiles, setShowProfiles] = useState(false);

  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);

  const [displaySettings, setDisplaySettings] = useState(null);
  const [now, setNow] = useState(new Date());
  const [profile, setProfileState] = useState(null);

  // ✅ ADDED: DOMAIN MODE DETECTION
  const domain = window.location.hostname;
  const isSportsMode = domain.includes("oikossports");

  // ===== CLOCK =====
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ===== RESTORE PROFILE =====
  useEffect(() => {
    const saved = localStorage.getItem("activeProfile");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfileState(parsed);
        setProfile(parsed);
      } catch (err) {
        console.error("PROFILE RESTORE ERROR:", err);
      }
    }
  }, []);

  // ===== FORCE PROFILE SELECT =====
  useEffect(() => {
    if (!profile) {
      console.log("⚠️ No profile selected → opening profile picker");
      setShowProfiles(true);
    }
  }, [profile]);

  // ===== LISTEN FOR PROFILE =====
  useEffect(() => {
    const unsub = subscribeProfile((newProfile) => {
      setProfileState(newProfile);
    });
    return () => unsub();
  }, []);

  // ===== AUTH =====
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

  // ===== LOAD SETTINGS =====
  useEffect(() => {
    if (!profile) return;

    const loadSettings = async () => {
      let { data } = await supabase
        .from("profile_settings")
        .select("*")
        .eq("profile_id", profile.id)
        .maybeSingle();

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

  // ===== LIVE SETTINGS UPDATE =====
  useEffect(() => {
    const handleUpdate = async () => {
      if (!profile) return;

      const { data } = await supabase
        .from("profile_settings")
        .select("*")
        .eq("profile_id", profile.id)
        .maybeSingle();

      if (data) {
        setAutoNightEnabled(data.auto_night_mode ?? false);
        setDisplaySettings(data);
      }
    };

    window.addEventListener("settingsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("settingsUpdated", handleUpdate);
    };
  }, [profile]);

  // ===== AUTO NIGHT =====
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

  // ===== INACTIVITY TIMER =====
  useEffect(() => {
    if (!displaySettings?.inactivity_enabled) return;

    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setPage("home");
      }, 10 * 60 * 1000);
    };

    const events = ["mousemove", "mousedown", "touchstart", "keydown"];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [displaySettings]);

  // ===== APP FILTER =====
  const apps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
    { name: "Weather", icon: <CloudSun />, page: "weather", color: "#0ea5e9" },
    { name: "Lists", icon: <List />, page: "lists", color: "#8b5cf6" },
    { name: "Family", icon: <Users />, page: "family", color: "#6366f1" },
    { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls", color: "#22c55e" },
  ];

  // ===== AUTH GUARD =====
  if (loadingUser) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <LoginPage />;

  // ✅ ADDED: FORCE SPORTS MODE
  if (isSportsMode) {
    return <SportsHomePage />;
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "15px 20px" }}>
        <img src={brand} style={{ height: "38px" }} />
      </div>

      <div style={{ padding: "10px 20px" }}>
        {page === "home" && <HomePage displaySettings={displaySettings} />}
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "weather" && <WeatherPage />}
        {page === "lists" && <ShoppingPage />}
        {page === "settings" && <SettingsPage />}
        {page === "family" && <FamilyPage />}
        {page === "homeControls" && <HomeControlsPage />}
      </div>

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
        {/* 🔥 OPTIONAL: make root go straight into app */}
        <Route path="/" element={<AppContent />} />
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
    gap: "8px",
    background: "#fff",
    padding: "6px 10px",
    borderRadius: "20px",
    cursor: "pointer",
  },
  profileAvatar: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    objectFit: "cover",
  },
};
