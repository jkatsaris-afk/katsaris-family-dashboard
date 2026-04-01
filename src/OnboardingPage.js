import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import logo from "./assets/oikos-brand.png";

export default function OnboardingPage() {
  const navigate = useNavigate();

  const [householdName, setHouseholdName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      // Create household
      const { data, error } = await supabase
        .from("households")
        .insert({
          name: householdName,
          created_by: user.id,
        })
        .select();

      if (error) throw error;

      const household = data[0];

      // Link user
      await supabase.from("household_members").insert({
        user_id: user.id,
        household_id: household.id,
        role: "admin",
      });

      navigate("/app");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#eef1f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* CARD */}
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "22px",
          width: "420px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        {/* LOGO */}
        <img
          src={logo}
          alt="Oikos"
          style={{
            width: "180px",
            marginBottom: "20px",
          }}
        />

        {/* TITLE */}
        <h1 style={{ fontSize: "22px", marginBottom: "6px" }}>
          Create Your Home
        </h1>

        {/* SUBTITLE */}
        <p style={{ color: "#666", marginBottom: "24px" }}>
          Let’s set up your Oikos household
        </p>

        {/* FORM */}
        <form
          onSubmit={handleCreateHousehold}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <input
            type="text"
            placeholder="Household Name (ex: Katsaris Home)"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            required
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              fontSize: "15px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#2f6ea6",
              color: "#fff",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {loading ? "Creating..." : "Create Household"}
          </button>
        </form>

        {/* FOOTER */}
        <p style={{ marginTop: "18px", fontSize: "13px", color: "#888" }}>
          You can add family members next
        </p>
      </div>
    </div>
  );
}
