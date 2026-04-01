import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const APP_VERSION = "1.0.0";

export default function AboutSettings() {
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

  // 🔌 DB CHECK
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
    getLocalIP().then((ip) => setInfo((p) => ({ ...p, ip })));
    getLocation();
  }, []);

  return (
    <div>
      <h2>About This Device</h2>

      <div style={styles.cardBlock}>
        <div style={styles.infoRow}>
          <strong>App Version:</strong> {APP_VERSION}
        </div>

        <div style={styles.infoRow}>
          <strong>Database:</strong>{" "}
          <span
            style={{
              color: dbStatus === "Connected" ? "#22c55e" : "#ef4444",
              fontWeight: "600",
            }}
          >
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

const styles = {
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
