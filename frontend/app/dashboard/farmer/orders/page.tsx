"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/axios-proxy"; 

interface Order {
  _id: string;
  orderNumber: number;
  cropName: string;
  quantity: number;
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  consumer: { name: string; email: string };
  createdAt: string;
  deliveryAddress: { street: string; city: string; district: string; phone: string };
  notes: string;
}

const API = "http://localhost:5000/api";

const STATUS_STYLE: Record<string,{bg:string;color:string;border:string}> = {
  Placed:    { bg:"#f4f0e8", color:"#6b8070",  border:"#e0ddd6" },
  Confirmed: { bg:"#fff8e6", color:"#a07000",  border:"#ffe09a" },
  Packed:    { bg:"#e3f2fd", color:"#1565c0",  border:"#bbdefb" },
  Shipped:   { bg:"#fff8e6", color:"#a07000",  border:"#ffe09a" },
  Delivered: { bg:"#e8f5e9", color:"#2d6a35",  border:"#c8e6c9" },
  Cancelled: { bg:"#fce4ec", color:"#c62828",  border:"#f48fb1" },
};

const STATUS_ICON: Record<string,string> = {
  Placed:"🕐", Confirmed:"✅", Packed:"📦",
  Shipped:"🚚", Delivered:"🎁", Cancelled:"❌",
};

const TABS = ["All","Placed","Confirmed","Shipped","Delivered"];

export default function OrdersPage() {
  const router = useRouter();
  const [token, setToken]   = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState({ all:0, pending:0, confirmed:0, shipped:0, delivered:0 });
  const [loading, setLoad]  = useState(true);
  const [tab, setTab]       = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSel]  = useState<Order | null>(null);
  const [updating, setUpd]  = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("agriai_token");
    if (!t) { router.push("/"); return; }
    setToken(t);
    fetchOrders(t, "All");
  }, []);

  const fetchOrders = async (t: string, status: string) => {
    setLoad(true);
    try {
      const q   = status !== "All" ? `?status=${status}` : "";
      const res = await fetch(`${API}/orders/farmer${q}`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
        setCounts(data.counts || {});
      }
    } catch {}
    setLoad(false);
  };

  const handleTab = (t: string) => {
    setTab(t);
    fetchOrders(token, t);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpd(true);
    try {
      const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        if (selected?._id === orderId) setSel(prev => prev ? { ...prev, orderStatus: newStatus } : prev);
      }
    } catch {}
    setUpd(false);
  };

  const filtered = orders.filter(o =>
    o.cropName.toLowerCase().includes(search.toLowerCase()) ||
    o.consumer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.orderNumber).includes(search)
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-CA");

  const NEXT_STATUS: Record<string,string> = {
    Placed: "Confirmed", Confirmed: "Packed",
    Packed: "Shipped",   Shipped: "Delivered",
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f4f0e8", fontFamily:"'DM Sans',sans-serif", padding:"28px 32px" }}>

      {/* Header */}
      <div style={{ marginBottom:"24px" }}>
        <h1 style={{ fontSize:"24px", fontWeight:700, color:"#1a3a2a" }}>Orders</h1>
        <p style={{ fontSize:"14px", color:"#6b8070", marginTop:"4px" }}>
          Track and manage your incoming orders
        </p>
      </div>

      {/* Stats cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"24px" }}>
        {[
          { icon:"🕐", num:counts.pending,   label:"Pending",   color:"#f5a623" },
          { icon:"✅", num:counts.confirmed,  label:"Confirmed", color:"#2d6a35" },
          { icon:"🚚", num:counts.shipped,    label:"Shipped",   color:"#f5a623" },
          { icon:"🎁", num:counts.delivered,  label:"Delivered", color:"#2d6a35" },
        ].map(c => (
          <div key={c.label} style={{ background:"white", borderRadius:"14px", padding:"20px", border:"1px solid #e8e4dc", display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"#f4f0e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px" }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize:"28px", fontWeight:900, color:"#1a3a2a", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
                {c.num ?? 0}
              </div>
              <div style={{ fontSize:"12px", color:"#6b8070", marginTop:"2px" }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div style={{ background:"white", borderRadius:"16px", border:"1px solid #e8e4dc", overflow:"hidden" }}>
        {/* Table header */}
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #f0ede8", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{ fontSize:"16px", fontWeight:700, color:"#1a3a2a" }}>All Orders</h2>
          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", fontSize:"14px" }}>🔍</span>
              <input
                type="text" placeholder="Search orders..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding:"9px 14px 9px 36px", border:"1.5px solid #e0ddd6", borderRadius:"10px", fontFamily:"'DM Sans',sans-serif", fontSize:"13px", outline:"none", width:"200px" }}
              />
            </div>
            <button style={{ padding:"9px 12px", background:"white", border:"1.5px solid #e0ddd6", borderRadius:"10px", cursor:"pointer", fontSize:"16px" }}>⚗️</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"4px", padding:"12px 24px", borderBottom:"1px solid #f0ede8" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => handleTab(t)} style={{
              padding:"7px 16px", borderRadius:"100px", border:"1.5px solid",
              borderColor: tab === t ? "#1a3a2a" : "#e0ddd6",
              background: tab === t ? "#1a3a2a" : "transparent",
              color: tab === t ? "white" : "#6b8070",
              fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600,
              cursor:"pointer", transition:"all 0.2s",
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px", color:"#6b8070" }}>Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px", color:"#c0bdb5" }}>
            <div style={{ fontSize:"40px", marginBottom:"10px" }}>📦</div>
            No orders found.
          </div>
        ) : (
          <div>
            {filtered.map((o, i) => (
              <div
                key={o._id}
                onClick={() => setSel(o)}
                style={{
                  display:"grid", gridTemplateColumns:"80px 1fr 120px 100px",
                  gap:"12px", padding:"16px 24px", cursor:"pointer",
                  borderBottom: i < filtered.length-1 ? "1px solid #f9f7f3" : "none",
                  transition:"background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f9f7f3")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {/* Order number */}
                <div style={{ fontSize:"13px", fontWeight:700, color:"#6b8070" }}>
                  #{o.orderNumber}
                </div>

                {/* Product + consumer */}
                <div>
                  <div style={{ fontSize:"14px", fontWeight:700, color:"#1a3a2a", marginBottom:"2px" }}>
                    {o.cropName} · {o.quantity} kg
                  </div>
                  <div style={{ fontSize:"12px", color:"#9b9b9b" }}>
                    {o.consumer?.name} · {formatDate(o.createdAt)}
                  </div>
                </div>

                {/* Price */}
                <div style={{ fontSize:"15px", fontWeight:700, color:"#1a3a2a", textAlign:"right" }}>
                  Rs. {o.totalPrice.toLocaleString()}
                </div>

                {/* Status badge */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end" }}>
                  <span style={{
                    fontSize:"12px", fontWeight:700,
                    padding:"4px 12px", borderRadius:"100px",
                    background: STATUS_STYLE[o.orderStatus]?.bg || "#f4f0e8",
                    color:      STATUS_STYLE[o.orderStatus]?.color || "#6b8070",
                    border:     `1px solid ${STATUS_STYLE[o.orderStatus]?.border || "#e0ddd6"}`,
                    display:"flex", alignItems:"center", gap:"4px",
                  }}>
                    {STATUS_ICON[o.orderStatus]} {o.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Side Panel */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:100, display:"flex", justifyContent:"flex-end" }}
          onClick={e => { if (e.target === e.currentTarget) setSel(null); }}>
          <div style={{ width:"400px", background:"white", height:"100vh", overflowY:"auto", padding:"28px", boxShadow:"-4px 0 24px rgba(0,0,0,0.1)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
              <h2 style={{ fontSize:"18px", fontWeight:700, color:"#1a3a2a" }}>
                Order #{selected.orderNumber}
              </h2>
              <button onClick={() => setSel(null)} style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer", color:"#6b8070" }}>✕</button>
            </div>

            {/* Status badge */}
            <div style={{ marginBottom:"20px" }}>
              <span style={{
                fontSize:"13px", fontWeight:700, padding:"5px 16px", borderRadius:"100px",
                background: STATUS_STYLE[selected.orderStatus]?.bg,
                color:      STATUS_STYLE[selected.orderStatus]?.color,
                border:     `1px solid ${STATUS_STYLE[selected.orderStatus]?.border}`,
              }}>
                {STATUS_ICON[selected.orderStatus]} {selected.orderStatus}
              </span>
            </div>

            {/* Details */}
            {[
              ["Product",  `${selected.cropName} · ${selected.quantity} kg`],
              ["Customer", selected.consumer?.name],
              ["Email",    selected.consumer?.email],
              ["Total",    `Rs. ${selected.totalPrice.toLocaleString()}`],
              ["Date",     formatDate(selected.createdAt)],
              ["Address",  `${selected.deliveryAddress?.street}, ${selected.deliveryAddress?.city}, ${selected.deliveryAddress?.district}`],
              ["Phone",    selected.deliveryAddress?.phone],
            ].map(([label, value]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #f0ede8" }}>
                <span style={{ fontSize:"13px", color:"#9b9b9b" }}>{label}</span>
                <span style={{ fontSize:"13px", fontWeight:600, color:"#1a3a2a", textAlign:"right", maxWidth:"200px" }}>{value}</span>
              </div>
            ))}

            {/* Update status */}
            {NEXT_STATUS[selected.orderStatus] && (
              <button
                onClick={() => handleUpdateStatus(selected._id, NEXT_STATUS[selected.orderStatus])}
                disabled={updating}
                style={{ width:"100%", marginTop:"24px", padding:"13px", background: updating ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d6a35)", color:"white", border:"none", borderRadius:"10px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:700, cursor: updating ? "not-allowed" : "pointer" }}
              >
                {updating ? "Updating…" : `Mark as ${NEXT_STATUS[selected.orderStatus]} →`}
              </button>
            )}

            {selected.orderStatus === "Placed" && (
              <button
                onClick={() => handleUpdateStatus(selected._id, "Cancelled")}
                style={{ width:"100%", marginTop:"10px", padding:"11px", background:"transparent", border:"1.5px solid #fcd0d0", borderRadius:"10px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, color:"#c0392b", cursor:"pointer" }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}