import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/sports-logo.png";

export default function SportsLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ NEW STATE
  const [noAccess, setNoAccess] = useState(false);

  // ✅ AUTO LOGIN CHECK (WITH ACCESS CONTROL)
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("sports_access")
          .eq("id", session.user.id)
          .single();

        if (profile?.sports_access) {
          navigate("/sports");
        }
      }
    };

    checkSession();
  }, [navigate]);

  // 🔐 LOGIN WITH ACCESS CHECK
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    // ✅ GET USER
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ✅ CHECK SPORTS ACCESS
    const { data: profile } = await supabase
      .from("profiles")
      .select("sports_access")
      .eq("id", user.id)
      .single();

    setLoading(false);

    // 🚫 BLOCK
    if (!profile?.sports_access) {
      setNoAccess(true);
      return;
    }

    // ✅ ALLOW
    navigate("/sports");
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
          padding: "32px",
          borderRadius: "20px",
          width: "380px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* LOGO */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <img
            src={logo}
            alt="Oikos Sports"
            style={{ width: "100%", maxWidth: "260px" }}
          />
        </div>

        {/* TITLE */}
        <h2 style={{ color: "#000", textAlign: "center", marginBottom: "24px" }}>
          Sign in to Oikos Sports
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              padding: "12px",
              borderRadius: "10px",
            }}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              padding: "12px",
              borderRadius: "10px",
            }}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#7a1f1f",
              color: "#fff",
              padding: "12px",
              borderRadius: "10px",
              fontWeight: "600",
              marginTop: "10px",
              cursor: "pointer",
              border: "none",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <p
          style={{
            color: "#666",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Welcome to Oikos Sports
        </p>
      </div>

      {/* ✅ NO ACCESS MODAL */}
      {noAccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "16px",
              width: "320px",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "12px", color: "#7a1f1f" }}>
              Access Restricted
            </h3>

            <p style={{ marginBottom: "20px", color: "#555" }}>
              Your account does not have access to Oikos Sports.
            </p>

            <button
              onClick={() => setNoAccess(false)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "#7a1f1f",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
