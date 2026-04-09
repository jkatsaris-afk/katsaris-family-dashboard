import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/sports-logo.png";

export default function SportsLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // ✅ NEW STATE
  const [pendingApproval, setPendingApproval] = useState(false);

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
        } else {
          setPendingApproval(true); // ✅ SHOW SCREEN
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
      setPendingApproval(true); // ✅ SHOW SCREEN
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

    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
    });

    await supabase.from("sports_access_requests").insert({
      user_id: user.id,
      email: user.email,
    });

    setLoading(false);

    setPendingApproval(true); // ✅ SHOW SCREEN
  };

  // =========================
  // 🔥 PENDING APPROVAL SCREEN
  // =========================
  if (pendingApproval) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#eef1f5",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <img src={logo} style={{ width: "220px", marginBottom: "30px" }} />

        <h2 style={{ marginBottom: "10px" }}>
          Pending Approval
        </h2>

        <p style={{ color: "#666", maxWidth: "300px" }}>
          Your account has been created and is waiting for approval.
          You’ll gain access once an admin approves your request.
        </p>

        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "25px",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            background: "#7a1f1f",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Refresh
        </button>
      </div>
    );
  }

  // =========================
  // 🔐 NORMAL LOGIN SCREEN
  // =========================
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
      <div
        style={{
          background: "#fff",
          padding: "32px",
          borderRadius: "20px",
          width: "380px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <img src={logo} style={{ width: "100%", maxWidth: "260px" }} />
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
          {showSignup ? "Create Sports Account" : "Sign in to Oikos Sports"}
        </h2>

        <form
          onSubmit={showSignup ? handleSignup : handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
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
            }}
          >
            {loading
              ? "Please wait..."
              : showSignup
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

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
              color: "#555",
            }}
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
}
