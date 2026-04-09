import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // ✅ FIXED PATH
import logo from "../assets/sports-logo.png"; // ✅ YOUR SPORTS LOGO

export default function SportsLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ If already logged in → go to sports
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/sports"); // ✅ SPORTS ONLY
      }
    };

    checkSession();
  }, [navigate]);

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/sports"); // ✅ SPORTS ONLY
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
          <img src={logo} alt="Oikos Sports" style={{ width: "180px" }} />
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
              background: "#7a1f1f", // 🔥 sports color (burgundy)
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
    </div>
  );
}
