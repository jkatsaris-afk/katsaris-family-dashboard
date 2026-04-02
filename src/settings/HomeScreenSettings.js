// ===== BLOCK 1: IMPORTS =====
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Image, Palette, Settings2, LayoutGrid } from "lucide-react";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 2: DEFAULTS =====
const defaultTiles = {
  home: true,
  calendar: true,
  chores: true,
  weather: true,
  lists: true,
  family: true,
  homeControls: true,
};


// ===== BLOCK 3: MAIN COMPONENT =====
export default function HomeScreenSettings() {

  // ===== BLOCK 4: STATE =====
  const [settings, setSettings] = useState(null);


  // ===== BLOCK 5: LOAD SETTINGS =====
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
            show_logo: data.show_logo ?? true,
            visible_tiles: data.visible_tiles || defaultTiles,
          });
        } else {
          const { data: newSettings } = await supabase
            .from("settings")
            .insert({
              household_id: member.household_id,
              auto_night_mode: false,
              show_logo: true,
              visible_tiles: defaultTiles,
            })
            .select()
            .single();

          if (newSettings) {
            setSettings({
              ...newSettings,
              show_logo: newSettings.show_logo ?? true,
              visible_tiles: newSettings.visible_tiles || defaultTiles,
            });
          }
        }

      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    load();
  }, []);


  // ===== BLOCK 6: UPDATE SETTINGS =====
const updateSettings = async (updates) => {
  if (!settings) return;

  try {
    const { error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", settings.id);

    if (error) {
      console.error("UPDATE ERROR:", error);
      return;
    }

    // 🔥 update local UI immediately
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }));

    // 🔥 FORCE HOME PAGE TO REFRESH
    window.dispatchEvent(new Event("settingsUpdated"));

  } catch (err) {
    console.error("UPDATE ERROR:", err);
  }
};
  // ===== BLOCK 8: REMOVE IMAGE =====
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


  // ===== BLOCK 9: TILE TOGGLE =====
  const toggleTile = (key) => {
    const updated = {
      ...settings.visible_tiles,
      [key]: !settings.visible_tiles[key],
    };

    updateSettings({ visible_tiles: updated });
  };


  // ===== BLOCK 10: LOADING =====
  if (!settings) return <div>Loading settings...</div>;


  // ===== BLOCK 11: UI =====
  return (
    <div>
      <h2>Home Screen Settings</h2>

      {/* ===== BLOCK 11A: APPEARANCE ===== */}
      <div style={styles.cardBlock}>
        <div style={styles.cardHeader}>
          <Image size={20} />
          <span>Appearance</span>
        </div>

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
      </div>

      {/* ===== BLOCK 11B: BRANDING ===== */}
      <div style={styles.cardBlock}>
        <div style={styles.cardHeader}>
          <Palette size={20} />
          <span>Branding</span>
        </div>

        <div style={styles.row}>
          <span>Show Logo on Home Screen</span>

          <div
            onClick={() =>
              updateSettings({
                show_logo: !(settings.show_logo ?? true),
              })
            }
            style={{
              ...styles.toggle,
              background: (settings.show_logo ?? true)
                ? PRIMARY
                : "#e5e7eb",
            }}
          >
            <div
              style={{
                ...styles.knob,
                left: (settings.show_logo ?? true)
                  ? "22px"
                  : "2px",
              }}
            />
          </div>
        </div>

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

      {/* ===== BLOCK 11C: BEHAVIOR ===== */}
      <div style={styles.cardBlock}>
        <div style={styles.cardHeader}>
          <Settings2 size={20} />
          <span>Behavior</span>
        </div>

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
              background: settings.auto_night_mode ? PRIMARY : "#e5e7eb",
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

      {/* ===== BLOCK 11D: LAYOUT ===== */}
      <div style={styles.cardBlock}>
        <div style={styles.cardHeader}>
          <LayoutGrid size={20} />
          <span>Layout</span>
        </div>

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


// ===== BLOCK 12: STYLES =====
const styles = {
  cardBlock: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "15px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px",
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
    maxWidth: "400px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "12px",
    marginTop: "10px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
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
