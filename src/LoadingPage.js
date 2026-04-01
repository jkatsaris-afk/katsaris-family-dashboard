import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import logo from "./assets/oikos-brand.png";

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        console.log("🔄 LOADING PAGE START");

        // 🔐 Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        console.log("👤 USER:", user, userError);

        if (userError || !user) {
          console.log("❌ No user → go to login");
          navigate("/");
          return;
        }

        // 🏠 Get memberships
        const { data: members, error } = await supabase
          .from("household_members")
          .select("*")
          .eq("user_id", user.id);

        console.log("📦 MEMBERS:", members, error);

        if (error) {
          console.log("❌ Membership error → onboarding");
          navigate("/onboarding");
          return;
        }

        // 🔥 FINAL DECISION
        if (!members || members.length === 0) {
          console.log("➡️ No household → onboarding");
          navigate("/onboarding");
        } else {
          console.log("➡️ Has household → app");
          navigate("/app");
        }

      } catch (err) {
        console.error("💥 CRASH:", err);
        navigate("/");
      }
    };

    run();
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        background: "#eef1f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* LOGO */}
      <img
        src={logo}
        alt="Oikos Display"
        style={{ width: "200px", marginBottom: "20px" }}
      />

      {/* TEXT */}
      <div style={{ fontSize: "18px", color: "#444" }}>
        Checking for your Oikos...
      </div>

      {/* SUBTEXT */}
      <div style={{ marginTop: "10px", fontSize: "14px", color: "#888" }}>
        Please wait...
      </div>
    </div>
  );
}
