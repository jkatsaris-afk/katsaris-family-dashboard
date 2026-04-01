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

  // 🔥 LOAD SETTINGS
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

        const { data } = await supabase
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

  // 🔥 UPDATE
  const updateSettings = async (updates) => {
    if (!settings) return;

    const { data, error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", settings.id)
      .select();

    if (!error && data) {
      setSettings({
        ...data[0],
        visible_tiles: data[0].visible_tiles || defaultTiles,
      });
    }
  };

  // 🔥 UPLOAD
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

  // 🔥 REMOVE IMAGE
  const handleRemove = async (type) => {
    if (!settings) return;

    const url =
      type === "background"
        ? settings.background_url
        : settings.logo_url;

    if (!url) return;

    try {
      const path = url.split("/oikos-assets/")[1];

      if (path) {
        await supabase.storage
          .from("oikos-assets")
          .remove([path]);
      }

      if (type === "background") {
        updateSettings({ background_url: null });
      } else {
        updateSettings({ logo_url: null });
      }
    } catch (err) {
      console.error("REMOVE ERROR:", err);
    }
  };

  // 🔥 TILE TOGGLE
  const toggleTile = (key) => {
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

      {/* 🎨 BACKGROUND + LOGO */}
      <div style={styles.cardBlock}>
        <h3>Background</h3>

        {/* BACKGROUND */}
        <div style={styles.uploadRow}>
          <div>
            <div style={styles.label}>Background Image</div>
            <div style={styles.sub}>
              Full screen background for your dashboard
            </div>
          </div>

          <label style={styles.uploadBtn}>
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "background")}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {settings.background_url && (
          <>
            <img src={settings.background_url} style={styles.previewLarge} />
            <button
              onClick={() => handleRemove("background")}
              style={styles.removeBtn}
            >
              Remove Background
            </button>
          </>
        )}

        {/* LOGO */}
        <div style={styles.uploadRow}>
          <div>
            <div style={styles.label}>Center Screen Logo</div>
            <div style={styles.sub}>
              Displays centered on the home screen
            </div>
          </div>

          <label style={styles.uploadBtn}>
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "logo")}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {settings.logo_url && (
          <>
            <img src={settings.logo_url} style={styles.previewLogo} />
            <button
              onClick={() => handleRemove("logo")}
              style={styles.removeBtn}
            >
              Remove Logo
            </button>
          </>
        )}
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

        {Object.entries(defaultTiles).map(([key]) => (
          <div key={key} style={styles.row}>
            <span>{key}</span>

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

  uploadRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },

  label: {
    fontWeight: "600",
    fontSize: "15px",
  },

  sub: {
    fontSize: "13px",
    color: "#6b7280",
  },

  uploadBtn: {
    background: PRIMARY,
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  removeBtn: {
    marginTop: "10px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  previewLarge: {
    width: "100%",
    borderRadius: "10px",
    marginTop: "10px",
  },

  previewLogo: {
    height: "60px",
    marginTop: "10px",
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
