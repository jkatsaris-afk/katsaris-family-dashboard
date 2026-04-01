import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import logo from "../assets/oikos-brand.png";

export default function OnboardingPage() {
  const navigate = useNavigate();

  const [householdName, setHouseholdName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔐 Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    // 🏠 Create household
    const { data: household, error: householdError } = await supabase
      .from("households")
      .insert({
        name: householdName,
        created_by: user.id,
      })
      .select()
      .single();

    if (householdError) {
      alert(householdError.message);
      setLoading(false);
      return;
    }

    // 🔗 Link user to household
    const { error: memberError } = await supabase
      .from("household_members")
      .insert({
        user_id: user.id,
        household_id: household.id,
        role: "admin",
      });

    if (memberError) {
      alert(memberError.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    // 🚀 Go to app
    navigate("/home");
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center text-white">
      
      {/* CARD */}
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-xl w-[420px]">
        
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Oikos Display" className="w-52" />
        </div>

        {/* TITLE */}
        <h2 className="text-xl text-center mb-2">
          Create Your Household
        </h2>

        <p className="text-gray-400 text-center mb-6 text-sm">
          Let’s set up your Oikos
        </p>

        {/* FORM */}
        <form onSubmit={handleCreateHousehold} className="flex flex-col gap-4">
          
          <input
            type="text"
            placeholder="Household Name (ex: Katsaris Home)"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            className="bg-black border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold mt-2"
          >
            {loading ? "Creating..." : "Create Household"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-gray-500 text-xs text-center mt-6">
          You can add family members next
        </p>
      </div>
    </div>
  );
}
