"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  type: "Order" | "Disease" | "Weather" | "Payment" | "Review" | "System";
  title: string;
  message: string;
  isRead: boolean;
  link: string;
  createdAt: string;
}

const API = "http://localhost:5000/api";

const TYPE_ICON: Record<string, string> = {
  Order:   "📦",
  Disease: "🔬",
  Weather: "⛈️",
  Payment: "💰",
  Review:  "⭐",
  System:  "🔔",
};

const TYPE_COLOR: Record<string, { bg: string; color: string }> = {
  Order:   { bg: "#e3f2fd", color: "#1565c0" },
  Disease: { bg: "#fce4ec", color: "#c62828" },
  Weather: { bg: "#fff8e6", color: "#a07000" },
  Payment: { bg: "#e8f5e9", color: "#2d6a35" },
  Review:  { bg: "#fff8e6", color: "#a07000" },
  System:  { bg: "#f4f0e8", color: "#6b8070" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [token, setToken]           = useState("");
  const [notifications, setNotifs]  = useState<Notification[]>([]);
  const [unreadCount, setUnread]    = useState(0);
  const [loading, setLoad]          = useState(true);
  const [filter, setFilter]         = useState("All");

  const FILTERS = ["All","Order","Payment","Disease","Weather","Review"];

  useEffect(() => {
    const t = localStorage.getItem("agriai_token");
    if (!t) { router.push("/"); return; }
    setToken(t);
    fetchNotifications(t);
  }, []);

  const fetchNotifications = async (t: string) => {
    setLoad(true);
    try {
      const res  = await fetch(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotifs(data.notifications || []);
        setUnread(data.unreadCount   || 0);
      }
    } catch {}
    setLoad(false);
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API}/notifications/read/all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {}
  };

  const deleteOne = async (id: string) => {
    try {
      await fetch(`${API}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs(prev => prev.filter(n => n._id !== id));
    } catch {}
  };

  const clearAll = async () => {
    if (!confirm("Clear all notifications?")) return;
    try {
      await fetch(`${API}/notifications/clear/all`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifs([]);
      setUnread(0);
    } catch {}
  };

  const filtered = notifications.filter(n =>
    filter === "All" ? true : n.type === filter
  );

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f4f0e8", fontFamily:"'DM Sans',sans-serif", padding:"28px 32px" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" }}>
        <div>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#1a3a2a", display:"flex", alignItems:"center", gap:"10px" }}>
            🔔 Notifications
            {unreadCount > 0 && (
              <span style={{ fontSize:"13px", fontWeight:700, background:"#e05252", color:"white", padding:"2px 10px", borderRadius:"100px" }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ fontSize:"14px", color:"#6b8070", marginTop:"4px" }}>
            Stay updated on orders, disease alerts, and payments
          </p>
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ padding:"9px 18px", border:"1.5px solid #1a3a2a", borderRadius:"100px", background:"transparent", color:"#1a3a2a", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
              ✓ Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} style={{ padding:"9px 18px", border:"1.5px solid #fcd0d0", borderRadius:"100px", background:"transparent", color:"#c0392b", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
              🗑️ Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"7px 16px", borderRadius:"100px",
            border:"1.5px solid", cursor:"pointer",
            borderColor: filter === f ? "#1a3a2a" : "#e0ddd6",
            background:  filter === f ? "#1a3a2a" : "white",
            color:       filter === f ? "white"   : "#6b8070",
            fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600,
            display:"flex", alignItems:"center", gap:"6px",
          }}>
            {f !== "All" && TYPE_ICON[f]} {f}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div style={{ background:"white", borderRadius:"16px", border:"1px solid #e8e4dc", overflow:"hidden" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px", color:"#6b8070" }}>Loading notifications…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px" }}>
            <div style={{ fontSize:"48px", marginBottom:"12px" }}>🔔</div>
            <div style={{ fontSize:"16px", color:"#c0bdb5" }}>No notifications yet</div>
          </div>
        ) : (
          filtered.map((n, i) => (
            <div
              key={n._id}
              onClick={() => { if (!n.isRead) markAsRead(n._id); }}
              style={{
                display:"flex", alignItems:"flex-start", gap:"16px",
                padding:"18px 24px", cursor:"pointer",
                background: n.isRead ? "white" : "#f9faf7",
                borderBottom: i < filtered.length-1 ? "1px solid #f0ede8" : "none",
                transition:"background 0.15s",
                borderLeft: n.isRead ? "none" : "3px solid #2d6a35",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f9f7f3")}
              onMouseLeave={e => (e.currentTarget.style.background = n.isRead ? "white" : "#f9faf7")}
            >
              {/* Icon */}
              <div style={{
                width:"44px", height:"44px", borderRadius:"12px", flexShrink:0,
                background: TYPE_COLOR[n.type]?.bg || "#f4f0e8",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"20px",
              }}>
                {TYPE_ICON[n.type]}
              </div>

              {/* Content */}
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"4px" }}>
                  <div style={{ fontSize:"14px", fontWeight: n.isRead ? 500 : 700, color:"#1a3a2a" }}>
                    {n.title}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
                    <span style={{ fontSize:"11px", color:"#9b9b9b" }}>{timeAgo(n.createdAt)}</span>
                    <button
                      onClick={e => { e.stopPropagation(); deleteOne(n._id); }}
                      style={{ background:"none", border:"none", cursor:"pointer", fontSize:"14px", color:"#c0bdb5", padding:"2px 4px" }}
                    >✕</button>
                  </div>
                </div>
                <div style={{ fontSize:"13px", color:"#6b8070", lineHeight:1.5 }}>
                  {n.message}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"6px" }}>
                  <span style={{
                    fontSize:"10px", fontWeight:700, padding:"2px 8px", borderRadius:"100px",
                    background: TYPE_COLOR[n.type]?.bg,
                    color:      TYPE_COLOR[n.type]?.color,
                  }}>
                    {n.type}
                  </span>
                  {!n.isRead && (
                    <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#2d6a35", display:"inline-block" }} />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}