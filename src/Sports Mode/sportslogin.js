import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/sports-logo.png";

export default function SportsLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [noAccess, setNoAccess] = useState(false);

  // ✅ AUTO LOGIN CHECK
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        console.log("AUTO LOGIN USER:", session.user);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("sports_access")
          .eq("id", session.user.id)
          .maybeSingle();

        console.log("AUTO LOGIN PROFILE:", profile, error);

        if (profile && profile.sports_access) {
          navigate("/sports");
        }
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

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    // ✅ GET USER
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("LOGIN USER:", user);

    // ✅ CHECK PROFILE
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("sports_access")
      .eq("id", user.id)
      .maybeSingle();

    console.log("LOGIN PROFILE:", profile, profileError);

    setLoading(false);

    // 🚫 BLOCK
    if (!profile || !profile.sports_access) {
      setNoAccess(true);
      return;
    }

    // ✅ ALLOW
    navigate("/sports");
  };

  // ✅ REQUEST ACCESS
  const handleRequestAccess = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("sports_access_requests").insert({
      user_id: user.id,
      email: user.email,
    });

    alert("Request sent! Admin will review your access.");
    setNoAccess(false);
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
            required
            style={{
              border: "1px solid #e5e7eb",
              padding: "12px",
              borderRadius: "10px",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              border: "1px solid #e5e7eb",
              padding: "12px",
              borderRadius: "10px",
            }}
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
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          Welcome to Oikos Sports
        </p>
      </div>

      {/* NO ACCESS MODAL */}
      {noAccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "28px",
              borderRadius: "16px",
              width: "320px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#7a1f1f" }}>Access Restricted</h3>

            <p style={{ margin: "15px 0" }}>
              You don’t have access to Oikos Sports.
            </p>

            <button
              onClick={handleRequestAccess}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "10px",
                background: "#7a1f1f",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
              }}
            >
              Request Access
            </button>

            <button
              onClick={() => setNoAccess(false)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
