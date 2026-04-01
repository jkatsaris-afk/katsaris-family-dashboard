import React, { useState, useEffect } from "react";
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

import { supabase } from "./lib/supabase";
import brand from "./assets/oikos-brand.png";

const PRIMARY = "#2f6ea6";
const APP_VERSION = "1.0.0";

// ✅ ADDED props
export default function SettingsPage({ settings, updateSettings }) {
  const [section, setSection] = useState("household");

  const [dbStatus, setDbStatus] = useState("Checking...");

  const [info, setInfo] = useState({
    ip: "Loading...",
    online: navigator.onLine,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screen: `${window.innerWidth} x ${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connection: navigator.connection?.effectiveType || "Unknown",
    location: "Fetching...",
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

  // 📍 LOCATION
  const getLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setInfo((prev) => ({
          ...prev,
          location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        }));
      },
      () => {
        setInfo((prev) => ({
          ...prev,
          location: "Denied",
        }));
      }
    );
  };

  // 🔌 DB CONNECTION CHECK
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from("households")
          .select("id")
          .limit(1);

        setDbStatus(error ? "Disconnected" : "Connected");
      } catch {
        setDbStatus("Disconnected");
      }
    };

    checkConnection();
    getLocalIP().then((ip) => {
      setInfo((prev) => ({ ...prev, ip }));
    });
    getLocation();
  }, []);

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

          <div style={styles.cardBlock}>
            <h3>Home Screen Image</h3>
            <div style={styles.row}>
              <span>Upload background</span>
              <button style={styles.btn}>Choose File</button>
            </div>
          </div>

          {/* ✅ FIXED (keeps UI, adds DB) */}
          <div style={styles.cardBlock}>
            <h3>Auto Night Mode</h3>
            <div style={styles.row}>
              <span>Enable automatic night mode</span>

              <div
                onClick={() => {
                  if (!settings) return;

                  updateSettings({
                    auto_night_mode: !settings.auto_night_mode,
                  });
                }}
                style={{
                  ...styles.toggle,
                  background: settings?.auto_night_mode
                    ? PRIMARY
                    : "#e5e7eb",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

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

    // 🧹 CHORES
    if (section === "chores") {
      return (
        <div>
          <h2>Chore Settings</h2>

          <div style={styles.subGrid}>
            {[
              "Recurring Chores",
              "Store",
              "Goals",
              "Awards",
            ].map((item, i) => (
              <div key={i} style={styles.subCard}>
                {item}
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
          <h2>About This Device</h2>

          <div style={styles.cardBlock}>
            <div style={styles.infoRow}><strong>App Version:</strong> {APP_VERSION}</div>

            <div style={styles.infoRow}>
              <strong>Database:</strong>{" "}
              <span style={{
                color: dbStatus === "Connected" ? "#22c55e" : "#ef4444",
                fontWeight: "600"
              }}>
                {dbStatus}
              </span>
            </div>

            <div style={styles.infoRow}><strong>Local IP:</strong> {info.ip}</div>
            <div style={styles.infoRow}><strong>Status:</strong> {info.online ? "Online" : "Offline"}</div>
            <div style={styles.infoRow}><strong>Connection:</strong> {info.connection}</div>
            <div style={styles.infoRow}><strong>Platform:</strong> {info.platform}</div>
            <div style={styles.infoRow}><strong>Language:</strong> {info.language}</div>
            <div style={styles.infoRow}><strong>Screen:</strong> {info.screen}</div>
            <div style={styles.infoRow}><strong>Timezone:</strong> {info.timezone}</div>
            <div style={styles.infoRow}><strong>Location:</strong> {info.location}</div>
            <div style={styles.infoRow}><strong>Device Info:</strong> {info.userAgent}</div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2>{section} Settings</h2>
        <div style={styles.cardBlock}>Coming soon...</div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div>
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

        <div
          onClick={() => alert("Logout coming soon")}
          style={styles.logout}
        >
          Logout
        </div>
      </div>

      <div style={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
}

const styles = { /* unchanged */ };
