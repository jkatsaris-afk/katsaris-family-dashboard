// ===== BLOCK 1: IMPORTS =====
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Users, Plus, Pencil } from "lucide-react";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 2: MAIN COMPONENT =====
export default function MembersSettings() {

  // ===== BLOCK 3: STATE =====
  const [householdId, setHouseholdId] = useState(null);
  const [profiles, setProfiles] = useState([]);

  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    avatar_url: "",
  });


  // ===== BLOCK 4: LOAD DATA =====
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: member } = await supabase
        .from("household_members")
        .select("household_id")
        .eq("user_id", user.id)
        .maybeSingle();

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


  // ===== BLOCK 5: UPLOAD AVATAR =====
  const uploadAvatar = async (file) => {
    const path = `${householdId}/avatar-${Date.now()}`;

    const { error } = await supabase.storage
      .from("oikos-assets")
      .upload(path, file, { upsert: true });

    if (error) return;

    const { data } = supabase.storage
      .from("oikos-assets")
      .getPublicUrl(path);

    setForm((prev) => ({
      ...prev,
      avatar_url: data.publicUrl,
    }));
  };


  // ===== BLOCK 6: ADD PROFILE =====
  const addProfile = async () => {
    if (!form.first_name) return;

    const { data } = await supabase
      .from("profiles")
      .insert({
        household_id: householdId,
        ...form,
      })
      .select()
      .single();

    setProfiles((prev) => [...prev, data]);

    setForm({
      first_name: "",
      last_name: "",
      avatar_url: "",
    });

    setShowAdd(false);
  };


  // ===== BLOCK 7: UI =====
  return (
    <div>
      <h2>Profiles</h2>

      <div style={styles.cardBlock}>

        {/* ===== BLOCK 7A: ADD TILE ===== */}
        <div
          style={styles.addTile}
          onClick={() => setShowAdd(!showAdd)}
        >
          <Plus size={18} />
          <span>Add Profile</span>
        </div>

        {/* ===== BLOCK 7B: ADD FORM ===== */}
        {showAdd && (
          <div style={styles.formBlock}>

            <input
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
              style={styles.input}
            />

            <input
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
              style={styles.input}
            />

            <label style={styles.uploadBtn}>
              Upload Picture
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadAvatar(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>

            {form.avatar_url && (
              <img src={form.avatar_url} style={styles.preview} />
            )}

            <button onClick={addProfile} style={styles.saveBtn}>
              Create Profile
            </button>

          </div>
        )}

        {/* ===== BLOCK 7C: PROFILE GRID ===== */}
        <div style={styles.grid}>
          {profiles.map((p) => (
            <div key={p.id} style={styles.profileTile}>

              <img
                src={p.avatar_url || "/default-avatar.png"}
                style={styles.avatar}
              />

              <div style={styles.name}>
                {p.first_name} {p.last_name}
              </div>

              <button style={styles.editBtn}>
                <Pencil size={14} /> Edit
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}


// ===== BLOCK 8: STYLES =====
const styles = {
  cardBlock: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "15px",
  },

  addTile: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f1f5f9",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "15px",
    fontWeight: "600",
  },

  formBlock: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  input: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  uploadBtn: {
    background: PRIMARY,
    color: "#fff",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "center",
  },

  preview: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  saveBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: "15px",
  },

  profileTile: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  },

  name: {
    fontWeight: "600",
    marginBottom: "8px",
  },

  editBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
};
