// ===== BLOCK 1: IMPORTS =====
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Plus, Pencil, X } from "lucide-react";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 2: MAIN COMPONENT =====
export default function MembersSettings() {

  // ===== BLOCK 3: STATE =====
  const [householdId, setHouseholdId] = useState(null);
  const [profiles, setProfiles] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    avatar_url: "",
  });

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    avatar_url: "",
  });


  // ===== BLOCK 4: LOAD DATA (AUTO PROFILE FIX) =====
  useEffect(() => {
    const load = async () => {
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

        setHouseholdId(member.household_id);

        // 🔥 LOAD PROFILES
        let { data: profilesData } = await supabase
          .from("profiles")
          .select("*")
          .eq("household_id", member.household_id);

        // 🔥 AUTO CREATE PROFILE IF NONE EXIST
        if (!profilesData || profilesData.length === 0) {
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              household_id: member.household_id,
              first_name: user.email?.split("@")[0] || "Owner",
              last_name: "",
            })
            .select()
            .single();

          profilesData = [newProfile];
        }

        setProfiles(profilesData);

      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    load();
  }, []);


  // ===== BLOCK 5: UPLOAD AVATAR =====
  const uploadAvatar = async (file, isEdit = false) => {
    const path = `${householdId}/avatar-${Date.now()}`;

    const { error } = await supabase.storage
      .from("oikos-assets")
      .upload(path, file, { upsert: true });

    if (error) {
      console.error(error);
      return;
    }

    const { data } = supabase.storage
      .from("oikos-assets")
      .getPublicUrl(path);

    if (isEdit) {
      setEditForm((prev) => ({
        ...prev,
        avatar_url: data.publicUrl,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        avatar_url: data.publicUrl,
      }));
    }
  };


  // ===== BLOCK 6: ADD PROFILE =====
  const addProfile = async () => {
    if (!form.first_name) return;

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        household_id: householdId,
        ...form,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProfiles((prev) => [...prev, data]);

    setForm({
      first_name: "",
      last_name: "",
      avatar_url: "",
    });

    setShowAdd(false);
  };


  // ===== BLOCK 7: UPDATE PROFILE =====
  const updateProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .update(editForm)
      .eq("id", editingId);

    if (error) {
      console.error(error);
      return;
    }

    setProfiles((prev) =>
      prev.map((p) =>
        String(p.id) === String(editingId)
          ? { ...p, ...editForm }
          : p
      )
    );

    setEditingId(null);
  };


  // ===== BLOCK 7.5: START EDIT =====
  const startEdit = (profile) => {
    setEditingId(profile.id);

    setEditForm({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      avatar_url: profile.avatar_url || "",
    });
  };


  // ===== BLOCK 8: MAIN UI =====
  return (
    <div>
      <h2>Profiles</h2>

      <div style={styles.cardBlock}>

        {/* ===== BLOCK 8A: ADD TILE ===== */}
        <div style={styles.addTile} onClick={() => setShowAdd(!showAdd)}>
          <Plus size={18} />
          <span>Add Profile</span>
        </div>

        {/* ===== BLOCK 8B: ADD FORM ===== */}
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

        {/* ===== BLOCK 8C: PROFILE GRID ===== */}
        <div style={styles.grid}>
          {profiles.map((p) => {
            const isEditing = String(editingId) === String(p.id);

            return (
              <div key={p.id} style={styles.profileTile}>

                {isEditing ? (
                  <>
                    <input
                      value={editForm.first_name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          first_name: e.target.value,
                        })
                      }
                      style={styles.input}
                    />

                    <input
                      value={editForm.last_name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          last_name: e.target.value,
                        })
                      }
                      style={styles.input}
                    />

                    <label style={styles.uploadBtn}>
                      Change Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          uploadAvatar(e.target.files[0], true)
                        }
                        style={{ display: "none" }}
                      />
                    </label>

                    {editForm.avatar_url && (
                      <img src={editForm.avatar_url} style={styles.preview} />
                    )}

                    <button onClick={updateProfile} style={styles.saveBtn}>
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      style={styles.cancelBtn}
                    >
                      <X size={14} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <img
                      src={p.avatar_url || "/default-avatar.png"}
                      style={styles.avatar}
                    />

                    <div style={styles.name}>
                      {p.first_name} {p.last_name}
                    </div>

                    <button
                      style={styles.editBtn}
                      onClick={() => startEdit(p)}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  </>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}


// ===== BLOCK 9: STYLES =====
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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
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

  preview: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    objectFit: "cover",
    margin: "auto",
  },

  name: {
    fontWeight: "600",
    marginBottom: "8px",
  },

  input: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  uploadBtn: {
    background: PRIMARY,
    color: "#fff",
    padding: "6px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
  },

  editBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },

  saveBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
