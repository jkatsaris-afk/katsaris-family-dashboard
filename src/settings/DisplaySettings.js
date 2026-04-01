import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const PRIMARY = "#2f6ea6";

const defaultTiles = {
  home: true,
  calendar: true,
  chores: true,
  weather: true,
  lists: true,
  family: true,
  homeControls: true,
};

export default function DisplaySettings() {
  const [settings, setSettings] = useState(null);

  // 🔥 LOAD USER → HOUSEHOLD → SETTINGS
  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // 🔗 Get household
        const { data: member } = await supabase
          .from("household_members")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!member) return;

        // 🧠 Load settings for this household
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("household_id", member.household_id)
          .maybeSingle();

        console.log("SETTINGS LOAD:", data, error);

        if (data) {
          setSettings({
            ...data,
            visible_tiles: data.visible_tiles || defaultTiles,
          });
        } else {
          // 🆕 Create default settings
          const { data: newSettings, error: insertError } = await supabase
            .from("settings")
            .insert({
              household_id: member.household_id,
              auto_night_mode: false,
              visible_tiles: defaultTiles,
            })
            .select()
            .single();

          console.log("CREATED SETTINGS:", newSettings, insertError);

          if (newSettings) setSettings(newSettings);
        }
      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    load();
  }, []);

  // 🔥 UPDATE SETTINGS
  const updateSettings = async (updates) => {
    if (!settings) return;

    const { error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", settings.id);

    console.log("UPDATE:", updates, error);

    if (!error) {
      setSettings({ ...settings, ...updates });
    }
  };

  // 🔥 TOGGLE TILE
  const toggleTile = (key) => {
    if (!settings?.visible_tiles) return;

    const updated = {
      ...settings.visible_tiles,
      [key]: !settings.visible_tiles[key],
    };

    updateSettings({ visible_tiles: updated });
  };

  // ⛔ Prevent blank screen
  if (!settings) {
    return <div>Loading settings...</div>;
  }

  return (
    <div>
      <h2>Display Settings</h2>

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
              ...styles.toggle,
              background: settings.auto_night_mode
                ? PRIMARY
                : "#e5e7eb",
            }}
          >
            <div
              style={{
                ...styles.knob,
                left: settings.auto_night_mode ? "22px" : "2px",
              }}
            />
          </div>
        </div>
      </div>

      {/* 🧱 TILE VISIBILITY */}
      <div style={styles.cardBlock}>
        <h3>Show Tiles</h3>

        {[
          ["home", "Home"],
          ["calendar", "Calendar"],
          ["chores", "Chores"],
          ["weather", "Weather"],
          ["lists", "Lists"],
          ["family", "Family"],
          ["homeControls", "Home Controls"],
        ].map(([key, label]) => (
          <div key={key} style={styles.row}>
            <span>{label}</span>

            <div
              onClick={() => toggleTile(key)}
              style={{
                ...styles.toggle,
                background: settings.visible_tiles[key]
                  ? PRIMARY
                  : "#e5e7eb",
              }}
            >
              <div
                style={{
                  ...styles.knob,
                  left: settings.visible_tiles[key] ? "22px" : "2px",
                }}
              />
            </div>
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
    alignItems: "center",
  },
  toggle: {
    width: "40px",
    height: "20px",
    borderRadius: "999px",
    position: "relative",
    cursor: "pointer",
  },
  knob: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#fff",
    position: "absolute",
    top: "2px",
    transition: "all 0.2s ease",
  },
};
