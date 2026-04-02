// ===== BLOCK 1: IMPORTS =====
import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";


// ===== BLOCK 2: MAIN COMPONENT =====
export default function HomePage({ displaySettings }) {

  // ===== BLOCK 3: STATE =====
  const [now, setNow] = useState(new Date());
  const [logo, setLogo] = useState(null);

  const [settings, setSettings] = useState(null); // ✅ ADDED
  const [householdName, setHouseholdName] = useState(""); // ✅ ADDED

  const [weather, setWeather] = useState({
    temp: "--",
    feels: "--",
    high: "--",
    low: "--",
    condition: "Loading...",
    tomorrowHigh: "--",
    tomorrowLow: "--",
    tomorrowCondition: "",
  });

  const [verse, setVerse] = useState(null);


  // ===== BLOCK 4: CLOCK =====
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  // ===== BLOCK 5: LOAD SETTINGS + REALTIME =====
  useEffect(() => {

    let householdId = null;

    const loadSettings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data: member } = await supabase
          .from("household_members")
          .select("household_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!member) return;

        householdId = member.household_id;

        // ✅ GET HOUSEHOLD NAME
        const { data: household } = await supabase
          .from("households")
          .select("name")
          .eq("id", householdId)
          .maybeSingle();

        if (household?.name) {
          setHouseholdName(household.name);
        }

        // ✅ GET PROFILE SETTINGS (THIS IS YOUR TOGGLE)
        const { data: profileSettings } = await supabase
          .from("profile_settings")
          .select("home_show_household_name")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (profileSettings) {
          setSettings(profileSettings);
        }

        // EXISTING LOGO LOAD
        const { data } = await supabase
          .from("settings")
          .select("*")
          .eq("household_id", householdId)
          .maybeSingle();

        if (data) {
          if (data.logo_url) {
            setLogo(data.logo_url);
          } else {
            setLogo(null);
          }
        }

      } catch (err) {
        console.error("LOAD SETTINGS ERROR:", err);
      }
    };

    loadSettings();

    const channel = supabase
      .channel("settings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
        },
        (payload) => {
          const updated = payload.new;

          if (updated?.household_id === householdId) {
            if (updated.logo_url) {
              setLogo(updated.logo_url);
            } else {
              setLogo(null);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);


  // ===== BLOCK 7: FORMATTERS =====
  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });


  // ===== BLOCK 8: MAIN UI =====
  return (
    <div style={styles.container}>

      {/* ✅ HOUSEHOLD NAME (NEW — ABOVE TILE) */}
      {settings?.home_show_household_name && (
        <div style={styles.householdName}>
          {householdName}
        </div>
      )}

      {/* ===== BLOCK 8A: GLASS TILE ===== */}
      <div style={styles.glassTile}>
