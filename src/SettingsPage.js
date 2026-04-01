import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Moon,
  Bell,
  Shield,
  ClipboardList,
  Info,
  Plug
} from "lucide-react";

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
    { name: "Integrations", icon: <Plug />, key: "integrations" },
    { name: "Chores", icon: <ClipboardList />, key: "chores" },
    { name: "About", icon: <Info />, key: "about" },
  ];

  const renderContent = () => {

    // 🖥️ DISPLAY
    if (section === "display") {
      return (
        <div>
          <h2>Display Settings</h2>

          {/* IMAGE */}
          <div style={styles.cardBlock}>
            <h3>Home Screen Image</h3>
            <div style={styles.row}>
              <span>Upload background</span>
              <button style={styles.btn}>Choose File</button>
            </div>
          </div>

          {/* NIGHT MODE */}
          <div style={styles.cardBlock}>
            <h3>Auto Night Mode</h3>
            <div style={styles.row}>
              <span>Enable automatic night mode</span>
              <div style={styles.toggle} />
            </div>
          </div>

          {/* TILES */}
          <div style={styles.cardBlock}>
            <h3>Show Tiles</h3>

            {[
              "Home",
              "Calendar",
              "Chores",
              "Weather",
              "Lists",
              "Family",
              "Home Controls",
            ].map((tile) => (
              <div key={tile} style={styles.row}>
                <span>{tile}</span>
                <div style={styles.toggle} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 🔌 INTEGRATIONS
    if (section === "integrations") {
      return (
        <div>
          <h2>Integrations</h2>

          <div style={styles.cardBlock}>Google Calendar</div>
          <div style={styles.cardBlock}>Smart Home</div>
        </div>
      );
    }

    // 📄 ABOUT
    if (section === "about") {
      return (
        <div>
          <h2>About</h2>
          <div style={styles.cardBlock}>
            App Version: 1.0.0
          </div>
        </div>
      );
    }

    // DEFAULT
    return (
      <div>
        <h2>{section} Settings</h2>
        <div style={styles.cardBlock}>Coming soon...</div>
      </div>
    );
  };

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.brandBox}>
          <img src={brand} alt="logo" style={styles.brand} />
        </div>

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
              {item.icon}
              <span style={{ marginLeft: "10px" }}>{item.name}</span>
            </motion.div>
          );
        })}
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        {renderContent()}
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "calc(100vh - 140px)",
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
  },

  brandBox: {
    padding: "10px",
  },

  brand: {
    width: "100%",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  content: {
    flex: 1,
    padding: "25px",
  },

  cardBlock: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "15px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  btn: {
    background: "#2f6ea6",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
  },

  toggle: {
    width: "40px",
    height: "20px",
    background: "#e5e7eb",
    borderRadius: "999px",
  },
};
