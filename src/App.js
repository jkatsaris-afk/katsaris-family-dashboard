import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  ClipboardList,
  ShoppingCart,
  SlidersHorizontal,
  Tv
} from "lucide-react";

// ✅ IMPORT PAGES
import HomePage from "./HomePage";
import ChoresPage from "./ChoresPage";
import UpcomingEvents from "./UpcomingEvents";
import ShoppingPage from "./ShoppingPage";
import MediaPage from "./MediaPage";

export default function App() {
  const [page, setPage] = useState("home");

  // 📱 APP TILES
  const apps = [
    { name: "Home", icon: <Home />, page: "home", color: "#3b82f6" },
    { name: "Calendar", icon: <Calendar />, page: "calendar", color: "#10b981" },
    { name: "Chores", icon: <ClipboardList />, page: "chores", color: "#f97316" },
    { name: "Shopping", icon: <ShoppingCart />, page: "shopping", color: "#8b5cf6" },
    { name: "Media", icon: <Tv />, page: "media", color: "#6366f1" },
    { name: "Home Controls", icon: <SlidersHorizontal />, page: "homeControls", color: "#0ea5e9" },
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

      {/* 🔥 TILE GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
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
                padding: "24px",
                borderRadius: "20px",
                textAlign: "center",
                cursor: "pointer",
                opacity: isActive ? 1 : 0.85,
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive
                  ? "0 12px 24px rgba(0,0,0,0.25)"
                  : "0 6px 14px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>
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
        {page === "shopping" && <ShoppingPage />}
        {page === "media" && <MediaPage />}

        {page === "homeControls" && (
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "20px"
          }}>
            Home Controls coming soon...
          </div>
        )}

      </div>

    </div>
  );
}
