import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Moon,
  Bell,
  Shield,
  ClipboardList,
  Repeat,
  Gift,
  Trophy,
  Award
} from "lucide-react";

// ✅ BRAND
import brand from "./assets/oikos-brand.png";

const PRIMARY = "#2f6ea6";

export default function SettingsPage() {
  const [section, setSection] = useState("household");

  const menu = [
    { name: "Household", icon: <Home />, key: "household" },
    { name: "Members", icon: <Users />, key: "members" },
    { name: "Display", icon: <Moon />, key: "display" },
    { name: "Notifications", icon: <Bell />, key: "notifications" },
    { name: "Security", icon: <Shield />, key: "security" },
    { name: "Chores", icon: <ClipboardList />, key: "chores" },
  ];

  const choreMenu = [
    { name: "Recurring Chores", icon: <Repeat />, key: "recurring" },
    { name: "Store", icon: <Gift />, key: "store" },
    { name: "Goals", icon: <Trophy />, key: "goals" },
    { name: "Awards", icon: <Award />, key: "awards" },
  ];

  // 🔁 RIGHT PANEL CONTENT
  const renderContent = () => {
    if (section === "chores") {
      return (
        <div>
          <h2>Chore Settings</h2>
          <div style={styles.subGrid}>
            {choreMenu.map((item, i) => (
              <div key={i} style={styles.subCard}>
                {item.icon}
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 style={{ marginBottom: "20px" }}>
          {section.charAt(0).toUpperCase() + section.slice(1)} Settings
        </h2>
        <div style={styles.placeholder}>
          Settings content goes here
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>

      {/* 🔵 LEFT SIDEBAR */}
      <div style={styles.sidebar}>

        {/* 🏷️ BRAND */}
        <div style={styles.brandBox}>
          <img src={brand} alt="Oikos Display" style={styles.brand} />
        </div>

        {/* MENU */}
        {menu.map((item, i) => {
          const active = section === item.key;

          return (
            <motion.div
              key={i}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSection(item.key)}
              style={{
                ...styles.menuItem,
                background: active ? PRIMARY : "transparent",
                color: active ? "#fff" : "#333",
              }}
            >
              <div style={{ marginRight: "10px" }}>{item.icon}</div>
              {item.name}
            </motion.div>
          );
        })}
      </div>

      {/* ⚙️ RIGHT CONTENT */}
      <div style={styles.content}>
        {renderContent()}
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "calc(100vh - 140px)", // leaves room for header + dock
    background: "#f8fafc",
    borderRadius: "20px",
    overflow: "hidden",
  },

  sidebar: {
    width: "260px",
    background: "#fff",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderRight: "1px solid #e5e7eb",
  },

  brandBox: {
    padding: "10px",
    marginBottom: "10px",
  },

  brand: {
    width: "100%",
    objectFit: "contain",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },

  content: {
    flex: 1,
    padding: "25px",
    overflowY: "auto",
  },

  placeholder: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },

  subGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },

  subCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },
};
