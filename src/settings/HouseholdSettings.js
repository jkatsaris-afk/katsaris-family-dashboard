// ===== BLOCK 1: IMPORTS =====
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Home } from "lucide-react";

const PRIMARY = "#2f6ea6";


// ===== BLOCK 2: MAIN COMPONENT =====
export default function HouseholdSettings() {

  // ===== BLOCK 3: STATE =====
  const [householdId, setHouseholdId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
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
          .from("households")
          .select("*")
          .eq("id", member.household_id)
          .maybeSingle();

        if (data) {
          setForm({
            name: data.name || "",
            street: data.street || "",
            city: data.city || "",
            state: data.state || "",
          });
        }

      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    load();
  }, []);


  // ===== BLOCK 5: UPDATE FIELD =====
  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  // ===== BLOCK 6: SAVE =====
  const save = async () => {
    if (!householdId) return;

    try {
      const { error } = await supabase
        .from("households")
        .update({
          name: form.name,
          street: form.street,
          city: form.city,
          state: form.state,
        })
        .eq("id", householdId);

      if (error) {
        console.error("SAVE ERROR:", error);
        return;
      }

      alert("Saved!");

    } catch (err) {
      console.error("SAVE ERROR:", err);
    }
  };


  // ===== BLOCK 7: LOADING =====
  if (!householdId) return <div>Loading...</div>;


  // ===== BLOCK 8: MAIN UI =====
  return (
    <div style={styles.pageWrap}>
      <h2 style={styles.pageTitle}>Household Settings</h2>

      <div style={styles.cardBlock}>

        {/* ===== BLOCK 8A: HEADER ===== */}
        <div style={styles.cardHeader}>
          <Home size={20} />
          <span>Household Information</span>
        </div>

        {/* ===== BLOCK 8B: HOUSEHOLD ID ===== */}
        <div style={styles.gridRow}>
          <div>
            <div style={styles.label}>Household ID</div>
            <div style={styles.sub}>Unique system identifier</div>
          </div>
          <div style={styles.valueBox}>
            {householdId}
          </div>
        </div>

        <div style={styles.divider} />

        {/* ===== BLOCK 8C: NAME ===== */}
        <div style={styles.gridRow}>
          <div>
            <div style={styles.label}>Household Name</div>
            <div style={styles.sub}>Used across the app</div>
          </div>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            style={styles.input}
            placeholder="Katsaris Family"
          />
        </div>

        <div style={styles.divider} />

        {/* ===== BLOCK 8D: STREET ===== */}
        <div style={styles.gridRow}>
          <div>
            <div style={styles.label}>Street Address</div>
          </div>
          <input
            value={form.street}
            onChange={(e) => updateField("street", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.divider} />

        {/* ===== BLOCK 8E: CITY ===== */}
        <div style={styles.gridRow}>
          <div>
            <div style={styles.label}>City</div>
          </div>
          <input
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.divider} />

        {/* ===== BLOCK 8F: STATE ===== */}
        <div style={styles.gridRow}>
          <div>
            <div style={styles.label}>State</div>
          </div>
          <input
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
            style={styles.input}
            placeholder="NV"
          />
        </div>

        {/* ===== BLOCK 8G: SAVE BUTTON ===== */}
        <div style={styles.saveRow}>
          <button onClick={save} style={styles.saveBtn}>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}


// ===== BLOCK 9: STYLES =====
const styles = {
  pageWrap: {
    maxWidth: "700px",
  },

  pageTitle: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  cardBlock: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "15px",
  },

  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 260px",
    alignItems: "center",
    padding: "14px 0",
    gap: "20px",
  },

  divider: {
    height: "1px",
    background: "#f1f5f9",
  },

  label: {
    fontWeight: "600",
    fontSize: "14px",
  },

  sub: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "2px",
  },

  valueBox: {
    background: "#f8fafc",
    padding: "8px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#64748b",
    textAlign: "right",
  },

  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    background: "#fff",
  },

  saveRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
  },

  saveBtn: {
    background: PRIMARY,
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
