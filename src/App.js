import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

import HomePage from "./HomePage";
import ChoresPage from "./ChoresPage";
import UpcomingEvents from "./UpcomingEvents";
import ShoppingPage from "./ShoppingPage";
import WeatherPage from "./WeatherPage";
import SettingsPage from "./SettingsPage";

import brand from "./assets/oikos-brand.png";

const PRIMARY = "#2f6ea6";

export default function App() {
  const [page, setPage] = useState("home");
  const [nightMode, setNightMode] = useState(false);

  // 🔥 TILE CONTROL STATE
  const [visibleTiles, setVisibleTiles] = useState([
    "home",
    "calendar",
    "chores",
    "weather",
    "lists",
    "family",
    "homeControls",
  ]);

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
      <div style={styles.header}>
        <img src={brand} style={{ height: "38px" }} />

        <div style={styles.headerRight}>
          <div onClick={() => setNightMode(!nightMode)} style={styles.iconBtn}>
            <Moon size={18} />
          </div>

          <div
            onClick={() =>
              setPage((prev) =>
                prev === "settings" ? "home" : "settings"
              )
            }
            style={{
              ...styles.iconBtn,
              background: page === "settings" ? PRIMARY : "#fff",
              color: page === "settings" ? "#fff" : "#000",
            }}
          >
            <Settings size={20} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "10px 20px 130px" }}>
        {page === "home" && <HomePage />}
        {page === "calendar" && <UpcomingEvents />}
        {page === "chores" && <ChoresPage />}
        {page === "weather" && <WeatherPage />}
        {page === "lists" && <ShoppingPage />}
        {page === "family" && <div style={styles.card}>Family Page</div>}
        {page === "settings" && (
          <SettingsPage
            visibleTiles={visibleTiles}
            setVisibleTiles={setVisibleTiles}
          />
        )}
      </div>

      {/* 🔥 FLOATING DOCK */}
      <div style={styles.dockWrap}>
        <div style={styles.dock}>
          <div style={styles.grid}>
            {apps
              .filter((app) => visibleTiles.includes(app.page))
              .map((app, i) => {
                const isActive = page === app.page;

                return (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPage(app.page)}
                    style={{
                      ...styles.tile,
                      background: app.color,
                      transform: isActive ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <div style={{ fontSize: "22px" }}>{app.icon}</div>
                    <div style={{ fontSize: "12px" }}>{app.name}</div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>

    </div>
  );
}

const styles = {
  header: {
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    gap: "10px",
  },
  iconBtn: {
    padding: "8px",
    borderRadius: "10px",
    background: "#fff",
    cursor: "pointer",
  },
  dockWrap: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  dock: {
    width: "95%",
    maxWidth: "1400px",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "20px",
    background: "#eef1f5",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "12px",
  },
  tile: {
    padding: "12px",
    borderRadius: "14px",
    color: "#fff",
    textAlign: "center",
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
};
