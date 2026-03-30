import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbzhcPTLS8wpLA-4OQEbqd-05p6cBRcL-RRbLDxf5qGSc3cC_Iz_Vfv0E0qwV3XkcXRx/exec";

export default function ShoppingPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // 🔄 LOAD SHOPPING DATA
  useEffect(() => {
    const loadData = () => {
      fetch(API_URL + "?type=shopping")
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.slice(1).map((row) => ({
            id: row[0],
            text: row[1],
            done: row[2] === true || row[2] === "TRUE",
          }));

          setItems(formatted);
        });
    };

    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  // ➕ ADD ITEM
  const addItem = () => {
    if (!newItem) return;

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        shopping: true,
        item: newItem,
        done: false,
      }),
    });

    setNewItem("");
  };

  // ✅ TOGGLE ITEM
  const toggleItem = (item) => {
    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        updateShopping: true,
        id: item.id,
        done: !item.done,
      }),
    });
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{ fontWeight: "600", marginBottom: "15px" }}>
        Shopping List
      </div>

      {/* ADD ITEM */}
      <div style={{
        background: "#fff",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "20px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Add item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ddd"
            }}
          />

          <button
            onClick={addItem}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* LIST */}
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
      }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              cursor: "pointer",
              borderBottom: "1px solid #eee"
            }}
          >
            <div style={{
              textDecoration: item.done ? "line-through" : "none",
              color: item.done ? "#999" : "#000"
            }}>
              {item.text}
            </div>

            <div>
              {item.done ? "✅" : "⬜"}
            </div>
          </div>
        ))}
      </div>

      {/* 🛒 WALMART BUTTON */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => window.open("https://www.walmart.com", "_blank")}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "15px",
            border: "none",
            background: "#10b981",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          🛒 Open Walmart
        </button>
      </div>
    </div>
  );
}
