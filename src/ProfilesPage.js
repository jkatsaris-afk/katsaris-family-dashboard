import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { setProfile } from "./profileStore";
import { Plus } from "lucide-react";

const PRIMARY = "#2f6ea6";

export default function ProfilesPage({ onClose }) {
  const [profiles, setProfiles] = useState([]);
  const [householdId, setHouseholdId] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

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

      // ✅ AUTO LOAD FIRST PROFILE IF NONE
      const saved = localStorage.getItem("activeProfile");
      if (!saved && data?.length > 0) {
        setProfile(data[0]);
      }
    };

    load();
  }, []);

  const selectProfile = (profile) => {
    setProfile(profile);
    localStorage.setItem("activeProfile", JSON.stringify(profile)); // ✅ persist
    onClose && onClose();
  };

  const addProfile = async () => {
    if (!newName || !householdId) return;

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

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        <h2 style={styles.title}>Select Profile</h2>

        {profiles.length === 0 && (
          <div style={{ marginBottom: 20 }}>No profiles yet</div>
        )}

        <div style={styles.grid}>
          {profiles.map((p) => (
            <div
              key={p.id}
              style={styles.tile}
              onClick={() => selectProfile(p)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={p.avatar_url || "/default-avatar.png"}
                style={styles.avatar}
              />
              <div>{p.first_name}</div>
            </div>
          ))}
        </div>

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
    maxWidth: "700px",
    padding: "30px",
    textAlign: "center",
    color: "#fff",
  },
  title: {
    marginBottom: "25px",
    fontSize: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },
  tile: {
    background: "rgba(255,255,255,0.12)",
    padding: "20px",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "0.2s",
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    marginBottom: "10px",
    objectFit: "cover",
  },
  addRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },
  addBtn: {
    background: PRIMARY,
    border: "none",
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff",
  },
};
