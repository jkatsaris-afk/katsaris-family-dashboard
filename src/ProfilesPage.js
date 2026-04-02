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

        const { data: member, error: memberError } = await supabase
          .from("household_members")
          .select("household_id")
          .eq("user_id", user.id)
          .single();

        if (memberError || !member) return;

        const hid = member.household_id;
        setHouseholdId(hid);

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("household_id", hid);

        if (error) return;

        const list = profileData || [];
        setProfiles(list);

        const saved = localStorage.getItem("activeProfile");

        if (!saved && list.length > 0) {
          const first = list[0];
          setProfile(first);
          localStorage.setItem("activeProfile", JSON.stringify(first));
        }

      } catch (err) {
        console.error(err);
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
    localStorage.setItem("activeProfile", JSON.stringify(profile));

    setTimeout(() => {
      onClose && onClose();
    }, 50);
  };

  // ===== UI =====
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        <h2 style={styles.title}>Who’s watching?</h2>

        {loading && <div style={styles.message}>Loading profiles...</div>}

        {!loading && profiles.length === 0 && (
          <div style={styles.message}>No profiles found</div>
        )}

        {/* ===== NETFLIX STYLE GRID ===== */}
        <div style={styles.grid}>
          {profiles.map((p) => (
            <div
              key={p.id}
              style={styles.card}
              onClick={() => selectProfile(p)}
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
    background: "rgba(0,0,0,0.9)",
    backdropFilter: "blur(25px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  modal: {
    width: "100%",
    maxWidth: "900px",
    padding: "40px",
    textAlign: "center",
    color: "#fff",
  },

  title: {
    marginBottom: "40px",
    fontSize: "32px",
    fontWeight: "600",
  },

  grid: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "0.25s",
  },

  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "12px",
    border: "3px solid transparent",
    transition: "0.25s",
  },

  name: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#ddd",
  },

  message: {
    marginBottom: "15px",
    color: "#ccc",
  },
};
