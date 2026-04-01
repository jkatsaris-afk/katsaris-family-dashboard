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

        const { data: member } = await supabase
          .from("household_members")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!member) return;

        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("household_id", member.household_id)
          .maybeSingle();

        if (data) {
          setSettings({
            ...data,
            visible_tiles: data.visible_tiles || defaultTiles,
          });
        } else {
          const { data: newSettings } = await supabase
            .from("settings")
            .insert({
              household_id: member.household_id,
              auto_night_mode: false,
              visible_tiles: defaultTiles,
            })
            .select()
            .single();

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

    if (!error) {
      setSettings({ ...settings, ...updates });
    }
  };

  // 🔥 FILE UPLOAD (NEW)
  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !settings) return;

    const filePath = `${settings.household_id}/${type}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("oikos-assets")
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error("UPLOAD ERROR:", error);
      return;
    }

    const { data } = supabase.storage
      .from("oikos-assets")
      .getPublicUrl(filePath);

    const url = data.publicUrl;

    if (type === "background") {
      updateSettings({ background_url: url });
    } else {
      updateSettings({ logo_url: url });
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

  if (!settings) return <div>Loading settings...</div>;

  return (
    <div>
      <h2>Display Settings</h2>

      {/* 🖼️ BACKGROUND */}
      <div style={styles.cardBlock}>
        <h3>Background Image</h3>

        {settings.background_url && (
          <img
            src={settings.background_url}
            alt="Background"
            style={{
              width: "100%",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "background")}
        />
      </div>

      {/* 🏠 LOGO */}
      <div style={styles.cardBlock}>
        <h3>Logo</h3>

        {settings.logo_url && (
          <img
            src={settings.logo_url}
            alt="Logo"
            style={{
              height: "60px",
              marginBottom: "10px",
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "logo")}
        />
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
