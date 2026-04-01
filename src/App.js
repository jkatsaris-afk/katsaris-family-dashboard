import React, { useState } from "react";
import { motion } from "framer-motion";
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

// ✅ IMPORT PAGES
import HomePage from "./HomePage";
import ChoresPage from "./ChoresPage";
import UpcomingEvents from "./UpcomingEvents";
import ShoppingPage from "./ShoppingPage"; // Lists
import WeatherPage from "./WeatherPage";
import SettingsPage from "./SettingsPage";

// ✅ IMPORT BRAND
import brand from "./assets/oikos-brand.png";

export default function App() {
  const [page, setPage] = useState("home");

  const apps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
    { name: "Weather", icon: <CloudSun />, page: "weather", color: "#0ea5e9" },
    { name: "Lists", icon: <List />, page: "lists", color: "#8b5cf6" },
    { name: "Family", icon: <Users />, page: "family", color: "#6366f1" },
    { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls", color: "#22c55e" },
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
        {/* 🏷️ BRAND */}
        <img
          src={brand}
          alt="Oikos Display"
          style={{
            height: "38px",
            objectFit: "contain",
          }}
        />

        {/* ⚙️ SETTINGS */}
        <div
          onClick={() => setPage("settings")}
          style={{
            cursor: "pointer",
            padding: "8px",
            borderRadius: "10px",
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Settings size={20} />
        </div>
      </div>

      {/* 🔥 PAGE CONTENT */}
      <div
        style={{
          padding: "10px 20px 130px", // space for dock
        }}
      >
        {page === "home" && <HomePage />}
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "weather" && <WeatherPage />}
        {page === "lists" && <ShoppingPage />}
        {page === "family" && (
          <div style={{ background: "#fff", padding: "20px", borderRadius: "20px" }}>
            Family Page (coming next)
          </div>
        )}
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

      {/* 🔥 FLOATING BOTTOM DOCK */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 1000,
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
            boxShadow: "0 -5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${apps.length}, 1fr)`,
              gap: "12px",
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
                    padding: "clamp(10px, 1.5vw, 18px)",
                    borderRadius: "14px",
                    textAlign: "center",
                    cursor: "pointer",
                    opacity: isActive ? 1 : 0.9,
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                    boxShadow: isActive
                      ? "0 8px 16px rgba(0,0,0,0.25)"
                      : "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(18px, 2vw, 26px)",
                      marginBottom: "6px",
                    }}
                  >
                    {app.icon}
                  </div>

                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "clamp(9px, 1vw, 12px)",
                    }}
                  >
                    {app.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
