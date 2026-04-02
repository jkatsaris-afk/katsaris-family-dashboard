// ===== BLOCK 1: IMPORTS =====
import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { setProfile } from "./profileStore";
import { User, Plus } from "lucide-react";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 2: MAIN COMPONENT =====
export default function ProfilesPage({ onClose }) {

  // ===== BLOCK 3: STATE =====
  const [profiles, setProfiles] = useState([]);
  const [householdId, setHouseholdId] = useState(null);

  const [newName, setNewName] = useState("");


  // ===== BLOCK 4: LOAD =====
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // GET HOUSEHOLD
      const { data: member } = await supabase
        .from("household_members")
        .select("household_id")
        .eq("user_id", user.id)
        .single();

      if (!member) return;

      setHouseholdId(member.household_id);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("household_id", member.household_id);

      setProfiles(data || []);
    };

    load();
  }, []);


  // ===== BLOCK 5: SELECT PROFILE =====
  const selectProfile = (profile) => {
    setProfile(profile);
    onClose && onClose();
  };


  // ===== BLOCK 6: ADD PROFILE =====
  const addProfile = async () => {
    if (!newName) return;

    const { data } = await supabase
      .from("profiles")
      .insert({
        household_id: householdId,
        first_name: newName,
      })
      .select()
      .single();

    setProfiles((prev) => [...prev, data]);
    setNewName("");
  };


  // ===== BLOCK 7: UI =====
  return (
    <div style={styles.overlay} onClick={onClose}>

      {/* STOP CLICK PROPAGATION */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        <h2 style={styles.title}>Select Profile</h2>

        {/* ===== PROFILE GRID ===== */}
        <div style={styles.grid}>
          {profiles.map((p) => (
            <div
              key={p.id}
              style={styles.tile}
              onClick={() => selectProfile(p)}
            >
              <img
                src={p.avatar_url || "/default-avatar.png"}
                style={styles.avatar}
              />

              <div style={styles.name}>
                {p.first_name}
              </div>
            </div>
          ))}
        </div>

        {/* ===== ADD PROFILE ===== */}
        <div style={styles.addRow}>
          <input
            placeholder="New profile"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={styles.input}
          />

          <button onClick={addProfile} style={styles.addBtn}>
            <Plus size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}


// ===== BLOCK 8: STYLES =====
const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)", // 🔥 90% glass
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  modal: {
    background: "transparent",
    textAlign: "center",
    color: "#fff",
  },

  title: {
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 140px)",
    gap: "20px",
    justifyContent: "center",
    marginBottom: "20px",
  },

  tile: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
    padding: "20px",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "0.2s",
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  },

  name: {
    fontWeight: "600",
  },

  addRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },

  input: {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
  },

  addBtn: {
    background: PRIMARY,
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff",
  },
};
