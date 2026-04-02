// ===== BLOCK 1: IMPORTS =====
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  Users
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

// ✅ Profiles
import ProfilesPage from "./ProfilesPage";
import { User } from "lucide-react";
import { getProfile, setProfile, subscribeProfile } from "./profileStore";

import brand from "./assets/oikos-brand.png";

const PRIMARY = "#2f6ea6";


// ===== MAIN APP =====
function AppContent() {

  // ===== STATE =====
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [page, setPage] = useState("home");

  const [showProfiles, setShowProfiles] = useState(false); // ✅ FIX

  const [nightMode, setNightMode] = useState(false);
  const [autoNightEnabled, setAutoNightEnabled] = useState(false);

  const [displaySettings, setDisplaySettings] = useState(null);
  const [now, setNow] = useState(new Date());
  const [profile, setProfileState] = useState(null);

  // ===== CLOCK =====
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ===== PROFILE LOAD (WITH PERSIST) =====
  useEffect(() => {
    const saved = localStorage.getItem("activeProfile");

    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile(parsed);
      setProfileState(parsed);
    } else {
      const p = getProfile();
      setProfileState(p);
    }

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

  // ===== LOAD SETTINGS (PER PROFILE) =====
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

  // ===== AUTO NIGHT MODE =====
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

  // ===== APPS =====
  const apps = [
    { name: "Home", icon: <Home />, page: "home" },
    { name: "Calendar", icon: <Calendar />, page: "calendar" },
    { name: "Chores", icon: <ClipboardList />, page: "chores" },
    { name: "Weather", icon: <CloudSun />, page: "weather" },
    { name: "Lists", icon: <List />, page: "lists" },
    { name: "Family", icon: <Users />, page: "family" },
    { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls" },
  ];

  // ===== AUTH GUARD =====
  if (loadingUser) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!user) return <LoginPage />;

  // ===== UI =====
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div style={{ padding: "15px 20px", display: "flex", justifyContent: "space-between" }}>
        <img src={brand} style={{ height: "38px" }} />

        <div style={{ display: "flex", gap: "10px" }}>

          {/* PROFILE BUTTON */}
          <div onClick={() => setShowProfiles(true)} style={styles.profileBtn}>
            <User size={16} />
            <span>{profile?.first_name || "Profile"}</span>
          </div>

          <div onClick={() => setPage("settings")} style={styles.settingsBtn}>
            <Settings size={20} />
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "10px 20px", height: "100%" }}>
        {page === "home" && <HomePage displaySettings={displaySettings} />}
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "weather" && <WeatherPage />}
        {page === "lists" && <ShoppingPage />}
        {page === "settings" && <SettingsPage />}
        {page === "family" && <FamilyPage />}
        {page === "homeControls" && <HomeControlsPage />}
      </div>

      {/* ✅ OVERLAY FIX */}
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
  },
  settingsBtn: {
    background: "#fff",
    padding: 8,
    borderRadius: 10,
    cursor: "pointer",
  },
};
