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

// ✅ Sports page
import SportsHomePage from "./Sports Mode/sportshomepage";

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

  // ✅ NEW: MODE STATE
  const [activeMode, setActiveMode] = useState("home");

  // ===== FORCE HOME MODE (RESET) =====
  useEffect(() => {
    localStorage.setItem("active_mode", "home"); // 👈 forces you out of sports
    setActiveMode("home");
  }, []);

  // ===== LOAD SAVED MODE =====
  useEffect(() => {
    const savedMode = localStorage.getItem("active_mode");
    if (savedMode) {
      setActiveMode(savedMode);
    }
  }, []);

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

  // ===== AUTO NIGHT =====
  useEffect(() => {
    if (!autoNightEnabled) return;

    const checkTime = () => {
      const hour = new Date().getHours();
      setNightMode(hour >= 20 || hour < 6);
    };

    checkTime();
  }, [autoNightEnabled]);

  // ===== AUTH GUARD =====
  if (loadingUser) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <LoginPage />;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src={brand} style={{ height: "38px" }} />

        <div style={{ display: "flex", gap: "10px" }}>
          <div onClick={() => setShowProfiles(true)} style={styles.profileBtn}>
            <img src={profile?.avatar_url || "/default-avatar.png"} style={styles.profileAvatar} />
            <span>{profile?.first_name || "Profile"}</span>
          </div>

          <div onClick={() => setNightMode(true)} style={{ background: "#fff", padding: 8, borderRadius: 10 }}>
            <Moon size={18} />
          </div>

          <div onClick={() => setPage(p => p === "settings" ? "home" : "settings")} style={{ background: page === "settings" ? PRIMARY : "#fff", padding: 8, borderRadius: 10 }}>
            <Settings size={20} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "10px 20px 120px", height: "100%" }}>
        {page === "home" && (
          activeMode === "sports"
            ? <SportsHomePage displaySettings={displaySettings} />
            : <HomePage displaySettings={displaySettings} />
        )}
      </div>

      {showProfiles && <ProfilesPage onClose={() => setShowProfiles(false)} />}

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
