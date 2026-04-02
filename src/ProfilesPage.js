import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { setProfile } from "./profileStore";

export default function ProfilesPage({ onClose }) {

  const [profiles, setProfiles] = useState([]);
  const [householdId, setHouseholdId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== LOAD PROFILES =====
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // GET HOUSEHOLD
        const { data: member, error: memberError } = await supabase
          .from("household_members")
          .select("household_id")
          .eq("user_id", user.id)
          .single();

        if (memberError || !member) {
          console.error("No household found");
          return;
        }

        setHouseholdId(member.household_id);

        // GET PROFILES
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("household_id", member.household_id);

        if (error) {
          console.error("Profile load error:", error);
          return;
        }

        setProfiles(profileData || []);

      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ===== SELECT PROFILE =====
  const selectProfile = (profile) => {
    if (!profile) return;

    setProfile(profile);

    // persist selected profile
    localStorage.setItem("activeProfile", JSON.stringify(profile));

    onClose && onClose();
  };

  // ===== UI =====
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        <h2 style={styles.title}>Select Profile</h2>

        {/* LOADING */}
        {loading && <div style={styles.message}>Loading profiles...</div>}

        {/* EMPTY */}
        {!loading && profiles.length === 0 && (
          <div style={styles.message}>No profiles yet</div>
        )}

        {/* ===== VERTICAL LIST ===== */}
        <div style={styles.list}>
          {profiles.map((p) => (
            <div
              key={p.id}
              style={styles.row}
              onClick={() => selectProfile(p)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
            >
              <img
                src={p.avatar_url || "/default-avatar.png"}
                style={styles.avatar}
              />

              <div style={styles.name}>{p.first_name}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}


// ===== STYLES =====
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(20px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  modal: {
    width: "100%",
    maxWidth: "500px",
    padding: "30px",
    textAlign: "center",
    color: "#fff",
  },

  title: {
    marginBottom: "25px",
    fontSize: "26px",
    fontWeight: "600",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "14px 16px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "0.2s",
  },

  avatar: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  name: {
    fontSize: "18px",
    fontWeight: "500",
  },

  message: {
    marginBottom: "15px",
    color: "#ccc",
  },
};
