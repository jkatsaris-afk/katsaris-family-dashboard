import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const PRIMARY = "#2f6ea6";

export default function DisplaySettings() {
  const [settings, setSettings] = useState(null);

  // 🔥 LOAD SETTINGS (FIXED)
  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*");

      console.log("SETTINGS DEBUG:", data, error);

      if (!error && data && data.length > 0) {
        setSettings(data[0]);
      }
    };

    loadSettings();
  }, []);

  // 🔥 UPDATE SETTINGS
  const updateSettings = async (updates) => {
    if (!settings) return;

    const { error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", settings.id);

    if (!error) {
      setSettings({ ...settings, ...updates });
    }

    console.log("UPDATE:", updates, error);
  };

  // ⛔ Prevent blank screen
  if (!settings) {
    return <div>Loading settings...</div>;
  }

  return (
    <div>
      <h2>Display Settings</h2>

      {/* 🖼️ IMAGE */}
      <div style={styles.cardBlock}>
        <h3>Home Screen Image</h3>
        <div style={styles.row}>
          <span>Upload background</span>
          <button style={styles.btn}>Choose File</button>
        </div>
      </div>

      {/* 🌙 AUTO NIGHT MODE */}
      <div style={styles.cardBlock}>
        <h3>Auto Night Mode</h3>

        <div style={styles.row}>
          <span>Enable automatic night mode</span>

          <div
            onClick={() =>
              updateSettings({
                auto_night_mode: !settings.auto_night_mode,
              })
            }
            style={{
              width: "40px",
              height: "20px",
              borderRadius: "999px",
              background: settings.auto_night_mode
                ? PRIMARY
                : "#e5e7eb",
              position: "relative",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: "2px",
                left: settings.auto_night_mode ? "22px" : "2px",
                transition: "all 0.2s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* 🧱 TILES */}
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

const styles = {
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
