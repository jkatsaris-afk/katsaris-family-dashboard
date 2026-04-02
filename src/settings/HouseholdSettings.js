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
  <div>
    <h2 style={styles.pageTitle}>Household Settings</h2>

    <div style={styles.cardBlock}>

      {/* ===== BLOCK 8A: HEADER ===== */}
      <div style={styles.cardHeader}>
        <Home size={20} />
        <span>Household Information</span>
      </div>

      {/* ===== BLOCK 8B: HOUSEHOLD ID ===== */}
      <div style={styles.settingRow}>
        <div>
          <div style={styles.label}>Household ID</div>
          <div style={styles.sub}>Unique ID for this household</div>
        </div>

        <div style={styles.readonly}>
          {householdId}
        </div>
      </div>

      <div style={styles.divider} />

      {/* ===== BLOCK 8C: NAME ===== */}
      <div style={styles.settingRow}>
        <div>
          <div style={styles.label}>Household Name</div>
          <div style={styles.sub}>Displayed across the app</div>
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
      <div style={styles.settingRow}>
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
      <div style={styles.settingRow}>
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
      <div style={styles.settingRow}>
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

      {/* ===== BLOCK 8G: SAVE ===== */}
      <div style={styles.saveRow}>
        <button onClick={save} style={styles.saveBtn}>
          Save Changes
        </button>
      </div>

    </div>
  </div>
);
        {/* ===== BLOCK 8B: HOUSEHOLD ID ===== */}
        <div style={styles.row}>
          <span>Household ID</span>
          <span style={styles.readonly}>
            {householdId}
          </span>
        </div>

        {/* ===== BLOCK 8C: NAME ===== */}
        <div style={styles.inputGroup}>
          <label>Household Name</label>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            style={styles.input}
            placeholder="Katsaris Family"
          />
        </div>

        {/* ===== BLOCK 8D: STREET ===== */}
        <div style={styles.inputGroup}>
          <label>Street Address</label>
          <input
            value={form.street}
            onChange={(e) => updateField("street", e.target.value)}
            style={styles.input}
          />
        </div>

        {/* ===== BLOCK 8E: CITY ===== */}
        <div style={styles.inputGroup}>
          <label>City</label>
          <input
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            style={styles.input}
          />
        </div>

        {/* ===== BLOCK 8F: STATE ===== */}
        <div style={styles.inputGroup}>
          <label>State</label>
          <input
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
            style={styles.input}
          />
        </div>

        {/* ===== BLOCK 8G: SAVE BUTTON ===== */}
        <button onClick={save} style={styles.saveBtn}>
          Save Changes
        </button>

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

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "15px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  readonly: {
    fontSize: "13px",
    color: "#6b7280",
  },

  inputGroup: {
    marginBottom: "15px",
  },

  input: {
    width: "25%",        // 👈 smaller width
    minWidth: "180px",   // 👈 keeps usable size
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  saveBtn: {
    marginTop: "10px",
    background: "#2f6ea6",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
