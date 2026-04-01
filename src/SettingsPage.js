import React, { useState, useEffect } from "react";
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
  Award,
  Info
} from "lucide-react";

// ✅ BRAND
import brand from "./assets/oikos-brand.png";

const PRIMARY = "#2f6ea6";
const APP_VERSION = "1.0.0"; // 👈 update later

export default function SettingsPage() {
  const [section, setSection] = useState("household");

  const [info, setInfo] = useState({
    ip: "Loading...",
    online: navigator.onLine,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screen: `${window.innerWidth} x ${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connection: navigator.connection?.effectiveType || "Unknown",
  });

  // 🌐 LOCAL IP
  const getLocalIP = async () => {
    return new Promise((resolve) => {
      try {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel("");
        pc.createOffer().then((offer) => pc.setLocalDescription(offer));

        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate) return;

          const match = ice.candidate.candidate.match(
            /([0-9]{1,3}(\.[0-9]{1,3}){3})/
          );

          if (match) {
            resolve(match[1]);
            pc.close();
          }
        };

        setTimeout(() => resolve("Unavailable"), 1000);
      } catch {
        resolve("Unavailable");
      }
    });
  };

  useEffect(() => {
    getLocalIP().then((ip) => {
      setInfo((prev) => ({ ...prev, ip }));
    });
  }, []);

  const menu = [
    { name: "Household", icon: <Home />, key: "household" },
    { name: "Members", icon: <Users />, key: "members" },
    { name: "Display", icon: <Moon />, key: "display" },
    { name: "Notifications", icon: <Bell />, key: "notifications" },
    { name: "Security", icon: <Shield />, key: "security" },
    { name: "About", icon: <Info />, key: "about" }, // 👈 NEW
    { name: "Chores", icon: <ClipboardList />, key: "chores" },
  ];

  const choreMenu = [
    { name: "Recurring Chores", icon: <Repeat />, key: "recurring" },
    { name: "Store", icon: <Gift />, key: "store" },
    { name: "Goals", icon: <Trophy />, key: "goals" },
    { name: "Awards", icon: <Award />, key: "awards" },
  ];

  // 🔁 CONTENT
  const renderContent = () => {

    if (section === "chores") {
      return (
        <div>
          <h2>Chore Settings</h2>
          <div style={styles.subGrid}>
            {choreMenu.map((item, i) => (
              <div key={i} style={styles.subCard}>
                <div style={{ marginBottom: "10px" }}>{item.icon}</div>
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section === "about") {
      return (
        <div>
          <h2>About This Device</h2>

          <div style={styles.cardBlock}>
            <div style={styles.infoRow}><strong>App Version:</strong> {APP_VERSION}</div>
            <div style={styles.infoRow}><strong>Local IP:</strong> {info.ip}</div>
            <div style={styles.infoRow}><strong>Status:</strong> {info.online ? "Online" : "Offline"}</div>
            <div style={styles.infoRow}><strong>Connection:</strong> {info.connection}</div>
            <div style={styles.infoRow}><strong>Platform:</strong> {info.platform}</div>
            <div style={styles.infoRow}><strong>Language:</strong> {info.language}</div>
            <div style={styles.infoRow}><strong>Screen:</strong> {info.screen}</div>
            <div style={styles.infoRow}><strong>Timezone:</strong> {info.timezone}</div>
            <div style={styles.infoRow}><strong>Device Info:</strong> {info.userAgent}</div>
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

      {/* SIDEBAR */}
      <div style={styles.sidebar}>

        {/* BRAND */}
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
    borderRight: "1px solid #e5e7eb",
  },

  brandBox: {
    padding: "10px",
    marginBottom: "10px",
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
    fontWeight: "500",
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
    marginTop: "15px",
  },

  subCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },

  cardBlock: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "15px",
  },

  infoRow: {
    marginBottom: "10px",
    fontSize: "14px",
  },
};
