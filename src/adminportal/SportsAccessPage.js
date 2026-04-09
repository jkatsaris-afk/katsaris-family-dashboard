
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // ✅ FIXED PATH

export default function SportsAccessPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ LOAD REQUESTS
  const loadRequests = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("sports_access_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading requests:", error);
    }

    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ✅ APPROVE USER
  const approveUser = async (req) => {
    // 1. grant access
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ sports_access: true })
      .eq("id", req.user_id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return;
    }

    // 2. mark request approved
    const { error: requestError } = await supabase
      .from("sports_access_requests")
      .update({ status: "approved" })
      .eq("id", req.id);

    if (requestError) {
      console.error("Error updating request:", requestError);
      return;
    }

    // 3. refresh list
    loadRequests();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Sports Access Requests</h2>

      {loading && <p>Loading...</p>}

      {!loading && requests.length === 0 && (
        <p>No pending requests 👍</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {requests.map((req) => (
          <div
            key={req.id}
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <div style={{ fontWeight: "600" }}>{req.email}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {new Date(req.created_at).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => approveUser(req)}
              style={{
                background: "#16a34a",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
