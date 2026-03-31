import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  ClipboardList,
  ShoppingCart,
  SlidersHorizontal,
  Tv,
  CloudSun,
  Settings
} from "lucide-react";

// ✅ IMPORT PAGES
import HomePage from "./HomePage";
import ChoresPage from "./ChoresPage";
import UpcomingEvents from "./UpcomingEvents";
import ShoppingPage from "./ShoppingPage";
import MediaPage from "./MediaPage";
import WeatherPage from "./WeatherPage";
import SettingsPage from "./SettingsPage";

export default function App() {
  const [page, setPage] = useState("home");

  // 📱 APP TILES
  const apps = [
    { name: "Home", icon: <Home size={32} />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar size={32} />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList size={32} />, page: "chores", color: "#f97316" },

    // 🌤 WEATHER
    { name: "Weather", icon: <CloudSun size={32} />, page: "weather", color: "#0ea5e9" },

    { name: "Shopping", icon: <ShoppingCart size={32} />, page: "shopping", color: "#8b5cf6" },
    { name: "Media", icon: <Tv size={32} />, page: "media", color: "#6366f1" },
    { name: "Home Controls", icon: <SlidersHorizontal size={32} />, page: "homeControls", color: "#22c55e" },

    // ⚙️ SETTINGS
    { name: "Settings", icon: <Settings size={32} />, page: "settings", color: "#64748b" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#eef1f5" }}>

      {/* 🔥 HEADER */}
      <div
        style={{
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: "600", fontSize: "20px" }}>
          Katsaris Home
        </div>
      </div>

      {/* 🔥 SINGLE ROW TILE BAR */}
      <div
        style={{
          display: "flex",
          gap: "18px",
          padding: "0 20px 20px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none", // Firefox
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
                minWidth: "140px",
                flexShrink: 0,
                background: app.color,
                color: "white",
                padding: "24px",
                borderRadius: "20px",
                textAlign: "center",
                cursor: "pointer",
                opacity: isActive ? 1 : 0.9,
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive
                  ? "0 12px 24px rgba(0,0,0,0.25)"
                  : "0 6px 14px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                {app.icon}
              </div>

              <div style={{ fontWeight: "600", fontSize: "14px" }}>
                {app.name}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 🔥 PAGE CONTENT */}
      <div style={{ padding: "10px 20px 20px" }}>

        {page === "home" && <HomePage />}
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "weather" && <WeatherPage />}
        {page === "shopping" && <ShoppingPage />}
        {page === "media" && <MediaPage />}
        {page === "settings" && <SettingsPage />}

        {page === "homeControls" && (
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "20px"
            }}
          >
            Home Controls coming soon...
          </div>
        )}

      </div>

      {/* 🔥 HIDE SCROLLBAR (Chrome/Safari) */}
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

    </div>
  );
}
