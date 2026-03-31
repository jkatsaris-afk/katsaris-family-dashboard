import React, { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbwu26ABWTuw9xG_u5DpT0-Ql-CZeiOw9qfB7ewDVN_zrsD3CiaX0_0XL__VyrASgdee/exec";

export default function ShoppingPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // 🔄 LOAD SHOPPING
  useEffect(() => {
    const loadData = () => {
      fetch(API_URL + "?type=shopping")
        .then(res => res.json())
        .then(data => {
          const formatted = data.slice(1).map(row => ({
            id: row[0],
            text: row[1],
            done: row[2] === true || row[2] === "TRUE"
          }));
          setItems(formatted);
        })
        .catch(err => console.error("Shopping load error:", err));
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
        done: false
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
        done: !item.done
      }),
    });
  };

  // 🛒 STORE LINKS
  const stores = [
    {
      name: "Amazon",
      color: "#111827",
      url: "https://www.amazon.com"
    },
    {
      name: "Walmart",
      color: "#2563eb",
      url: "https://www.walmart.com"
    },
    {
      name: "Lowes",
      color: "#1d4ed8",
      url: "https://www.lowes.com"
    }
  ];

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{ fontWeight: "700", marginBottom: "15px" }}>
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
              fontWeight: "600",
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
        marginBottom: "20px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)"
      }}>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => toggleItem(item)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
              cursor: "pointer"
            }}
          >
            <div style={{
              textDecoration: item.done ? "line-through" : "none",
              color: item.done ? "#999" : "#111827",
              fontWeight: "500"
            }}>
              {item.text}
            </div>

            <div>{item.done ? "✅" : ""}</div>
          </div>
        ))}
      </div>

      {/* 🛒 STORE TILES */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "15px"
      }}>
        {stores.map((store, i) => (
          <div
            key={i}
            onClick={() => window.open(store.url, "_blank")}
            style={{
              background: store.color,
              color: "#fff",
              height: "100px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {store.name}
          </div>
        ))}
      </div>

    </div>
  );
}
