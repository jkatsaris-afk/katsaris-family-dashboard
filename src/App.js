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

  const apps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
    { name: "Weather", icon: <CloudSun />, page: "weather", color: "#0ea5e9" },
    { name: "Shopping", icon: <ShoppingCart />, page: "shopping", color: "#8b5cf6" },
    { name: "Media", icon: <Tv />, page: "media", color: "#6366f1" },
    { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls", color: "#22c55e" },
    { name: "Settings", icon: <Settings />, page: "settings", color: "#64748b" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#eef1f5" }}>

      {/* HEADER */}
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

      {/* 🔥 ONE ROW AUTO-FIT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${apps.length}, 1fr)`,
          gap: "18px",
          padding: "0 20px 20px",
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
                padding: "clamp(12px, 2vw, 24px)", // 🔥 responsive padding
                borderRadius: "18px",
                textAlign: "center",
                cursor: "pointer",
                opacity: isActive ? 1 : 0.9,
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive
                  ? "0 10px 20px rgba(0,0,0,0.25)"
                  : "0 5px 12px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(20px, 2vw, 32px)", // 🔥 responsive icon
                  marginBottom: "8px",
                }}
              >
                {app.icon}
              </div>

              <div
                style={{
                  fontWeight: "600",
                  fontSize: "clamp(10px, 1vw, 14px)", // 🔥 responsive text
                }}
              >
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
              borderRadius: "20px",
            }}
          >
            Home Controls coming soon...
          </div>
        )}
      </div>

    </div>
  );
}
