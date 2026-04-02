// ===== BLOCK 1: IMPORTS =====
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Users, Plus, Pencil, Trash } from "lucide-react";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 2: MAIN COMPONENT =====
export default function MembersSettings() {

  // ===== BLOCK 3: STATE =====
  const [householdId, setHouseholdId] = useState(null);
  const [members, setMembers] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "Member",
  });

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Member",
  });


  // ===== BLOCK 4: LOAD DATA =====
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

        const { data } = await supabase
          .from("household_members")
          .select("*")
          .eq("household_id", member.household_id);

        if (data) setMembers(data);

      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    load();
  }, []);


  // ===== BLOCK 5: ADD MEMBER =====
  const addMember = async () => {
    if (!newMember.name) return;

    const { data, error } = await supabase
      .from("household_members")
      .insert({
        household_id: householdId,
        ...newMember,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setMembers((prev) => [...prev, data]);

    setNewMember({
      name: "",
      email: "",
      role: "Member",
    });
  };


  // ===== BLOCK 6: UPDATE MEMBER =====
  const updateMember = async () => {
    const { error } = await supabase
      .from("household_members")
      .update(editForm)
      .eq("id", editingId);

    if (error) {
      console.error(error);
      return;
    }

    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingId ? { ...m, ...editForm } : m
      )
    );

    setEditingId(null);
  };


  // ===== BLOCK 7: REMOVE MEMBER =====
  const removeMember = async (id) => {
    await supabase.from("household_members").delete().eq("id", id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };


  // ===== BLOCK 8: LOADING =====
  if (!householdId) return <div>Loading...</div>;


  // ===== BLOCK 9: MAIN UI =====
  return (
    <div>
      <h2>Members</h2>

      <div style={styles.cardBlock}>

        {/* ===== BLOCK 9A: HEADER ===== */}
        <div style={styles.cardHeader}>
          <Users size={20} />
          <span>Household Members</span>
        </div>

        {/* ===== BLOCK 9B: MEMBER CARDS ===== */}
        {members.map((m) => {
          const isEditing = editingId === m.id;

          return (
            <div key={m.id} style={styles.memberCard}>

              {isEditing ? (
                <>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    style={styles.input}
                  />

                  <input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    style={styles.input}
                  />

                  <div style={styles.actions}>
                    <button onClick={updateMember} style={styles.saveBtn}>
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div style={styles.name}>{m.name}</div>
                    <div style={styles.sub}>{m.email}</div>
                  </div>

                  <div style={styles.actions}>
                    <span style={styles.role}>{m.role}</span>

                    <Pencil
                      size={16}
                      style={styles.iconBtn}
                      onClick={() => {
                        setEditingId(m.id);
                        setEditForm({
                          name: m.name,
                          email: m.email,
                          role: m.role,
                        });
                      }}
                    />

                    <Trash
                      size={16}
                      style={styles.delete}
                      onClick={() => removeMember(m.id)}
                    />
                  </div>
                </>
              )}

            </div>
          );
        })}

        {/* ===== BLOCK 9C: ADD MEMBER ===== */}
        <div style={styles.addSection}>
          <input
            placeholder="Name"
            value={newMember.name}
            onChange={(e) =>
              setNewMember({ ...newMember, name: e.target.value })
            }
            style={styles.input}
          />

          <input
            placeholder="Email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            style={styles.input}
          />

          <button onClick={addMember} style={styles.addBtn}>
            <Plus size={16} /> Add Member
          </button>
        </div>

      </div>
    </div>
  );
}


// ===== BLOCK 10: STYLES =====
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
    marginBottom: "15px",
  },

  memberCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderRadius: "10px",
    background: "#f8fafc",
    marginBottom: "10px",
  },

  name: {
    fontWeight: "600",
  },

  sub: {
    fontSize: "12px",
    color: "#6b7280",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  role: {
    fontSize: "12px",
    background: "#e5e7eb",
    padding: "4px 8px",
    borderRadius: "6px",
  },

  iconBtn: {
    cursor: "pointer",
  },

  delete: {
    color: "#ef4444",
    cursor: "pointer",
  },

  addSection: {
    marginTop: "15px",
    display: "flex",
    gap: "10px",
  },

  input: {
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  addBtn: {
    background: PRIMARY,
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  saveBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
