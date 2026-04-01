import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import logo from "./assets/oikos-brand.png";

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      // 🔐 Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // ❌ Not logged in → go to login
      if (!user) {
        navigate("/");
        return;
      }

      // 🏠 Check if user has a household
      const { data: member } = await supabase
        .from("household_members")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // 👉 No household → onboarding
      if (!member) {
        navigate("/onboarding");
      } else {
        // 👉 Has household → main app
        navigate("/app");
      }
    };

    checkUser();
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
        style={{
          width: "200px",
          marginBottom: "20px",
        }}
      />

      {/* TEXT */}
      <div
        style={{
          fontSize: "18px",
          color: "#444",
          fontWeight: "500",
        }}
      >
        Checking for your Oikos...
      </div>

      {/* SIMPLE LOADING DOTS */}
      <div style={{ marginTop: "12px", color: "#999" }}>
        Please wait...
      </div>
    </div>
  );
}
