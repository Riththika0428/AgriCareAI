"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { orderAPI, profileAPI, validateSession, clearAuthAndRedirect } from "@/lib/axios-proxy";
import api from "@/lib/axios-proxy";

interface User    { _id: string; name: string; email: string; role: string; }
interface Profile { farmName: string; district: string; }
interface Order   {
  _id: string; orderNumber: number; cropName: string; quantity: number;
  totalPrice: number; orderStatus: string; paymentStatus: string;
  consumer: { name: string; email: string }; createdAt: string;
}

const NAV = [
  { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const TABS = ["All", "Placed", "Confirmed", "Packed", "Delivered", "Cancelled"];

const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);

const StatusBadge = ({ s }: { s: string }) => {
  const map: Record<string, [string, string]> = {
    Placed:    ["#e0e7ff","#3730a3"], Confirmed: ["#fef9c3","#a16207"],
    Packed:    ["#dbeafe","#1d4ed8"], Delivered: ["#dcfce7","#15803d"],
    Cancelled: ["#fee2e2","#dc2626"],
  };
  const [bg, col] = map[s] ?? ["#f3f4f6","#6b7280"];
  return <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 99, background: bg, color: col, whiteSpace: "nowrap" }}>{s}</span>;
};

export default function OrdersPage() {
  const router = useRouter();

  const [user,          setUser]          = useState<User | null>(null);
  const [profile,       setProfile]       = useState<Profile | null>(null);
  const [sub,           setSub]           = useState<any>(null);
  const [orders,        setOrders]        = useState<Order[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [tab,           setTab]           = useState("All");
  const [search,        setSearch]        = useState("");
  const [selected,      setSelected]      = useState<Order | null>(null);
  const [updating,      setUpdating]      = useState(false);
  const [toast,         setToast]         = useState("");

  const SBW = sideCollapsed ? 68 : 220;
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const getInitial = () => (user?.name || "F")[0].toUpperCase();

  useEffect(() => {
    async function check() {
      const u = await validateSession();
      if (!u) {
        clearAuthAndRedirect();
        return;
      }
      // Strictly allow ONLY farmer role
      if (u.role !== "farmer") {
        clearAuthAndRedirect();
        return;
      }
      setUser(u);
      loadData();
    }
    check();
  }, []);

  const loadData = async () => {
    try {
      const [profR, ordR, subR] = await Promise.allSettled([
        profileAPI.getMe(), orderAPI.getFarmerOrders("All"), api.get("/subscriptions/my"),
      ]);
      if (profR.status === "fulfilled") setProfile({ farmName: profR.value.data.farmName || "", district: profR.value.data.district || "" });
      if (ordR.status === "fulfilled")  setOrders(ordR.value.data.orders || []);
      if (subR.status === "fulfilled")  setSub(subR.value.data);
    } catch { }
    setLoading(false);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(true);
    try {
      await orderAPI.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
      if (selected?._id === orderId) setSelected(prev => prev ? { ...prev, orderStatus: status } : null);
      showToast(`Order marked as ${status}`);
    } catch { showToast("Failed to update order."); }
    setUpdating(false);
  };

  const handleLogout = () => { clearAuthAndRedirect(); };

  const filtered = orders.filter(o => {
    const matchTab    = tab === "All" || o.orderStatus === tab;
    const matchSearch = o.cropName.toLowerCase().includes(search.toLowerCase()) || o.consumer?.name?.toLowerCase().includes(search.toLowerCase()) || String(o.orderNumber).includes(search);
    return matchTab && matchSearch;
  });

  const counts = {
    pending:   orders.filter(o => o.orderStatus === "Placed").length,
    confirmed: orders.filter(o => o.orderStatus === "Confirmed").length,
    shipped:   orders.filter(o => o.orderStatus === "Packed").length,
    delivered: orders.filter(o => o.orderStatus === "Delivered").length,
  };

  const NEXT_STATUS: Record<string, string> = { Placed: "Confirmed", Confirmed: "Packed", Packed: "Delivered" };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0e8", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#6aaa78)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size={22} style={{ color: "#fff" }} />
        </div>
        <div style={{ color: "#2d5a3d", fontWeight: 700, fontSize: 15 }}>Loading orders…</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;background:#f2efe8;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#d0cdc6;border-radius:10px;}
        .nav-btn:hover{background:rgba(106,170,120,.15)!important;color:#fff!important;}
        .action-btn:hover{opacity:.88;}
        .order-row:hover{background:#fafaf8!important;}
        input:focus{outline:none;border-color:#6aaa78!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp .32s ease both;}
        @keyframes slideRight{from{opacity:0;transform:translateX(32px);}to{opacity:1;transform:translateX(0);}}
        .slide-right{animation:slideRight .3s ease both;}
        @keyframes toastIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .toast{animation:toastIn .25s ease both;}
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#f2efe8" }}>

        {/* ══ SIDEBAR ══ */}
        <aside style={{ width: SBW, background: "linear-gradient(185deg,#1a3a2a 0%,#122a1c 60%,#0a1e11 100%)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 60, transition: "width .28s cubic-bezier(.4,0,.2,1)", overflow: "hidden", boxShadow: "4px 0 24px rgba(0,0,0,.18)" }}>
          <div style={{ padding: sideCollapsed ? "18px 0" : "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: sideCollapsed ? "center" : "space-between" }}>
            {!sideCollapsed && (
              <div onClick={() => router.push("/")} style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff", cursor: "pointer", letterSpacing: "-0.5px" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Ag<span style={{ color: "#6aaa78" }}>real</span>
              </div>
            )}
            <button onClick={() => setSideCollapsed(p => !p)} className="action-btn" style={{ background: "rgba(255,255,255,.07)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,.5)", flexShrink: 0 }}>
              <Icon d={sideCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} size={14} />
            </button>
          </div>
          <div style={{ padding: sideCollapsed ? "14px 0" : "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: sideCollapsed ? "flex" : "block", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,.15)", flexShrink: 0 }}>{getInitial()}</div>
              {!sideCollapsed && (
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
                  <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>{profile?.farmName || "My Farm"}</div>
                  {sub?.isActive && <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(106,170,120,.25)", borderRadius: 99, padding: "1px 8px", fontSize: 9, color: "#6aaa78", fontWeight: 700 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6aaa78", display: "inline-block" }} />{sub.status === "trialing" ? "Free Trial" : "Active"}</div>}
                </div>
              )}
            </div>
          </div>
          <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
            {!sideCollapsed && <div style={{ padding: "10px 16px 4px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em" }}>Navigation</div>}
            {NAV.map(item => {
              const active = item.href === "/dashboard/farmer/orders";
              return (
                <button key={item.href} onClick={() => router.push(item.href)} className="nav-btn" title={sideCollapsed ? item.label : undefined}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sideCollapsed ? "12px 0" : "9px 16px", justifyContent: sideCollapsed ? "center" : "flex-start", border: "none", background: active ? "rgba(106,170,120,.18)" : "transparent", borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent", color: active ? "#fff" : "rgba(255,255,255,.5)", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all .18s", textAlign: "left" }}>
                  <Icon d={item.icon} size={17} style={{ flexShrink: 0 }} />
                  {!sideCollapsed && <span>{item.label}</span>}
                  {!sideCollapsed && active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6aaa78" }} />}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.07)" }}>
            <button onClick={() => router.push("/dashboard/farmer/settings")} className="nav-btn" title={sideCollapsed ? "Settings" : undefined} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "rgba(255,255,255,.4)", fontSize: 13, cursor: "pointer", transition: "all .18s" }}>
              <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={16} style={{ flexShrink: 0 }} />
              {!sideCollapsed && <span>Settings</span>}
            </button>
            <button onClick={handleLogout} className="nav-btn" title={sideCollapsed ? "Sign Out" : undefined} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "#f87171", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all .18s" }}>
              <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={16} style={{ flexShrink: 0 }} />
              {!sideCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main style={{ marginLeft: SBW, flex: 1, display: "flex", flexDirection: "column", transition: "margin-left .28s cubic-bezier(.4,0,.2,1)", minHeight: "100vh" }}>

          {/* Topbar */}
          <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => router.back()} className="action-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "#f4f0e8", border: "1px solid #e0ddd6", cursor: "pointer", flexShrink: 0 }}>
                <Icon d="M15 19l-7-7 7-7" size={16} style={{ color: "#1a3a2a" }} />
              </button>
              <div>
                <div style={{ fontSize: 19, fontWeight: 700, color: "#1c2b22", letterSpacing: "-.3px" }}>
                  {greeting()}, <span style={{ color: "#2d5a3d" }}>{user?.name?.split(" ")[0]}</span>
                </div>
                <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}{profile?.district ? ` · ${profile.district}` : ""}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9b9590" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…" style={{ paddingLeft: 34, paddingRight: 14, height: 36, border: "1px solid #e0ddd6", borderRadius: 9, background: "#f9f7f4", fontSize: 13, color: "#1a3a2a", width: 200, fontFamily: "'DM Sans',sans-serif" }} />
              </div>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(45,90,61,.3)", cursor: "pointer" }}>{getInitial()}</div>
            </div>
          </header>

          {/* Body */}
          <div style={{ padding: "28px 32px", flex: 1 }}>

            {/* Summary cards */}
            <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Pending",   value: counts.pending,   color: "#ef4444", bg: "#fee2e2" },
                { label: "Confirmed", value: counts.confirmed, color: "#a16207", bg: "#fef9c3" },
                { label: "Shipped",   value: counts.shipped,   color: "#1d4ed8", bg: "#dbeafe" },
                { label: "Delivered", value: counts.delivered, color: "#15803d", bg: "#dcfce7" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid #eeebe4", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: s.bg, marginBottom: 12 }}>
                    <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size={18} style={{ color: s.color }} />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#1c2b22", fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#9b9590", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Table card */}
            <div className="fade-up" style={{ background: "#fff", borderRadius: 20, border: "1px solid #eeebe4", boxShadow: "0 2px 12px rgba(0,0,0,.05)", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f4f0ec", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22" }}>All Orders</div>
                  <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>{orders.length} total orders</div>
                </div>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)} className="filter-chip"
                      style={{ padding: "7px 16px", borderRadius: 99, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .18s", background: tab === t ? "#1a3a2a" : "#fff", color: tab === t ? "#fff" : "#6b8070", borderColor: tab === t ? "#1a3a2a" : "#e0ddd6" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table head */}
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 160px 120px 100px", gap: 0, padding: "12px 24px", background: "#f9f7f4", borderBottom: "1px solid #f0ede8" }}>
                {["ORDER #", "PRODUCT & CUSTOMER", "DATE", "TOTAL", "STATUS"].map(h => (
                  <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".07em" }}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size={36} style={{ color: "#d0cdc6", display: "block", margin: "0 auto 12px" }} />
                  <div style={{ fontSize: 15, color: "#9b9590" }}>No orders found</div>
                </div>
              ) : filtered.map((o, i) => (
                <div key={o._id} className="order-row"
                  onClick={() => setSelected(o)}
                  style={{ display: "grid", gridTemplateColumns: "100px 1fr 160px 120px 100px", gap: 0, padding: "16px 24px", borderBottom: i < filtered.length - 1 ? "1px solid #f4f0ec" : "none", alignItems: "center", cursor: "pointer", transition: "background .15s" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#6aaa78" }}>#{o.orderNumber}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1c2b22" }}>{o.cropName} · {o.quantity}kg</div>
                    <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>{o.consumer?.name}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#6b8070" }}>{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a3a2a" }}>Rs.{o.totalPrice.toLocaleString()}</div>
                  <StatusBadge s={o.orderStatus} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ══ ORDER DETAIL DRAWER ══ */}
      {selected && (
        <div onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(10,20,14,.5)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
          <div className="slide-right" style={{ width: 420, background: "#fff", height: "100%", overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,.2)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #f4f0ec", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)" }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Order Details</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display',serif", marginTop: 4 }}>#{selected.orderNumber}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,.15)", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                <Icon d="M6 18L18 6M6 6l12 12" size={16} />
              </button>
            </div>
            <div style={{ padding: "24px 28px", flex: 1 }}>
              {/* Status */}
              <div style={{ marginBottom: 24 }}>
                <StatusBadge s={selected.orderStatus} />
              </div>
              {/* Info grid */}
              {[
                { label: "Crop",     value: `${selected.cropName} · ${selected.quantity}kg` },
                { label: "Customer", value: selected.consumer?.name },
                { label: "Email",    value: selected.consumer?.email },
                { label: "Total",    value: `Rs.${selected.totalPrice.toLocaleString()}` },
                { label: "Payment",  value: selected.paymentStatus },
                { label: "Date",     value: new Date(selected.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f4f0ec" }}>
                  <span style={{ fontSize: 13, color: "#9b9590", fontWeight: 500 }}>{r.label}</span>
                  <span style={{ fontSize: 14, color: "#1c2b22", fontWeight: 600 }}>{r.value}</span>
                </div>
              ))}
              {/* Update status */}
              {NEXT_STATUS[selected.orderStatus] && (
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>Update Status</div>
                  <button onClick={() => updateStatus(selected._id, NEXT_STATUS[selected.orderStatus])} disabled={updating} className="action-btn"
                    style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: updating ? 0.7 : 1 }}>
                    {updating ? "Updating…" : `Mark as ${NEXT_STATUS[selected.orderStatus]}`}
                  </button>
                </div>
              )}
              {selected.orderStatus === "Placed" && (
                <button onClick={() => updateStatus(selected._id, "Cancelled")} disabled={updating} className="action-btn"
                  style={{ width: "100%", marginTop: 10, padding: "12px", background: "#fff0f0", color: "#c0392b", border: "1px solid #fcd0d0", borderRadius: 11, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, background: "#1a3a2a", color: "#fff", padding: "13px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.2)", zIndex: 300 }}>{toast}</div>
      )}
    </>
  );
}