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
  const [showSignup, setShowSignup] = useState(false);

  // ✅ AUTO LOGIN CHECK
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("sports_access")
          .eq("id", session.user.id)
          .maybeSingle();

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

    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("profiles")
      .select("sports_access")
      .eq("id", user.id)
      .maybeSingle();

    setLoading(false);

    if (!profile || !profile.sports_access) {
      setNoAccess(true);
      return;
    }

    navigate("/sports");
  };

  // 🆕 SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    // ✅ create profile
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
    });

    // ✅ create access request
    await supabase.from("sports_access_requests").insert({
      user_id: user.id,
      email: user.email,
    });

    setLoading(false);

    alert("Account created! Awaiting approval.");
    setShowSignup(false);
  };

  // ✅ REQUEST ACCESS (existing user)
  const handleRequestAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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
        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          {showSignup ? "Create Sports Account" : "Sign in to Oikos Sports"}
        </h2>

        {/* FORM */}
        <form
          onSubmit={showSignup ? handleSignup : handleLogin}
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
            style={{ padding: "12px", borderRadius: "10px" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "12px", borderRadius: "10px" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#7a1f1f",
              color: "#fff",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Please wait..."
              : showSignup
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        {/* TOGGLE BUTTON */}
        {!showSignup ? (
          <button
            onClick={() => setShowSignup(true)}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        ) : (
          <button
            onClick={() => setShowSignup(false)}
            style={{
              marginTop: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#555",
            }}
          >
            Back to Sign In
          </button>
        )}

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
