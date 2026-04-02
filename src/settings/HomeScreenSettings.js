// ===== BLOCK 1: IMPORTS =====
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Image, Palette, Settings2, LayoutGrid } from "lucide-react";
import { getProfile } from "../profileStore"; // ✅ NEW

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

  const [settings, setSettings] = useState(null);
  const [profile, setProfile] = useState(null); // ✅ NEW


  // ===== BLOCK 5: LOAD SETTINGS =====
  useEffect(() => {
    const load = async () => {
      try {
        const p = getProfile(); // ✅ get selected profile
        if (!p) return;

        setProfile(p);

        let { data } = await supabase
          .from("profile_settings")
          .select("*")
          .eq("profile_id", p.id)
          .maybeSingle();

        // ✅ CREATE SETTINGS IF NONE EXIST
        if (!data) {
          const { data: newSettings } = await supabase
            .from("profile_settings")
            .insert({
              profile_id: p.id,
              auto_night_mode: false,
              visible_tiles: defaultTiles,
              background_url: null,
              logo_url: null,
            })
            .select()
            .single();

          data = newSettings;
        }

        setSettings({
          ...data,
          visible_tiles: data.visible_tiles || defaultTiles,
        });

      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    load();
  }, []);


  // ===== BLOCK 6: UPDATE SETTINGS =====
  const updateSettings = async (updates) => {
    if (!settings || !profile) return;

    try {
      await supabase
        .from("profile_settings")
        .upsert(
          {
            profile_id: profile.id,
            ...updates,
          },
          { onConflict: "profile_id" }
        );

      setSettings((prev) => ({
        ...prev,
        ...updates,
      }));

      window.dispatchEvent(new Event("settingsUpdated"));

    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };


  // ===== BLOCK 7: FILE UPLOAD =====
  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !settings) return;

    const filePath = `${profile.id}/${type}-${Date.now()}`; // ✅ FIXED

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

      updateSettings({
        [type === "background" ? "background_url" : "logo_url"]: null,
      });

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

      {/* APPEARANCE */}
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

      {/* BEHAVIOR */}
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

      {/* LAYOUT */}
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
