import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/sports-logo.png";

export default function SportsLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
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
          setPendingApproval(true);
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
      setPendingApproval(true);
      return;
    }

    navigate("/sports");
  };

  // 🆕 SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!reason || reason.length < 5) {
      alert("Please tell us why you want access.");
      return;
    }

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
      reason: reason,
    });

    setLoading(false);
    setPendingApproval(true);
  };

  // =========================
  // 🔥 PENDING SCREEN
  // =========================
  if (pendingApproval) {
    return (
      <div style={pendingContainer}>
        <img src={logo} style={{ width: "220px", marginBottom: "30px" }} />

        <h2>Pending Approval</h2>

        <p style={{ color: "#666", maxWidth: "320px" }}>
          Your account has been created and is waiting for approval.
          You’ll gain access once an admin approves your request.
        </p>

        <button onClick={() => window.location.reload()} style={primaryBtn}>
          Refresh
        </button>
      </div>
    );
  }

  // =========================
  // 🔐 LOGIN / SIGNUP
  // =========================
  return (
    <div style={page}>
      <div style={card}>
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
            style={input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={input}
          />

          {showSignup && (
            <textarea
              placeholder="Why do you want access?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              style={textarea}
            />
          )}

          <button type="submit" disabled={loading} style={primaryBtn}>
            {loading
              ? "Please wait..."
              : showSignup
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        {/* ✅ CLEAN BUTTONS */}
        {!showSignup ? (
          <button onClick={() => setShowSignup(true)} style={secondaryBtn}>
            Create Account
          </button>
        ) : (
          <button onClick={() => setShowSignup(false)} style={secondaryBtn}>
            ← Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================
   🎨 STYLES
========================= */

const page = {
  position: "fixed",
  inset: 0,
  background: "#eef1f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const card = {
  background: "#fff",
  padding: "32px",
  borderRadius: "20px",
  width: "380px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
};

const textarea = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  minHeight: "80px",
  resize: "none",
};

const primaryBtn = {
  background: "#7a1f1f",
  color: "#fff",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  fontWeight: "600",
  marginTop: "5px",
  cursor: "pointer",
};

const secondaryBtn = {
  marginTop: "10px",
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  background: "#fff",
  fontWeight: "600",
  cursor: "pointer",
};

const pendingContainer = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#eef1f5",
  textAlign: "center",
  padding: "20px",
};
