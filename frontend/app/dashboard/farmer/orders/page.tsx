"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { orderAPI } from "@/lib/axios-proxy";
import { usePathname } from "next/navigation";

// ── Types ──────────────────────────────────────────────────
interface Order {
  _id: string;
  orderNumber: number;
  cropName: string;
  quantity: number;
  totalPrice: number;
  pricePerKg: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  consumer: { name: string; email: string };
  createdAt: string;
  deliveryAddress: { street: string; city: string; district: string; phone: string };
  notes?: string;
}

interface Counts {
  all: number; pending: number; confirmed: number;
  shipped: number; delivered: number;
}

// const NAV = [
//   { icon: "🏠", label: "Overview",    href: "/dashboard/farmer",             section: "FARMING" },
//   { icon: "🔬", label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", section: ""        },
//   { icon: "🌾", label: "My Products", href: "/dashboard/farmer/products",    section: ""        },
//   { icon: "📦", label: "Orders",      href: "/dashboard/farmer/orders",      section: ""        },
//   { icon: "⛈️", label: "Weather",     href: "/dashboard/farmer/weather",     section: ""        },
// ];
const NAV = [
  { icon: "🏠", label: "Overview",    href: "/dashboard/farmer" },
  { icon: "🔬", label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor" },
  { icon: "🌾", label: "My Products", href: "/dashboard/farmer/products" },
  { icon: "📦", label: "Orders",      href: "/dashboard/farmer/orders" },
  { icon: "⛈️", label: "Weather",     href: "/dashboard/farmer/weather" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  Placed:    { bg: "#f4f0e8", color: "#6b8070", border: "#e0ddd6" },
  Confirmed: { bg: "#fff8e6", color: "#a07000", border: "#ffe09a" },
  Packed:    { bg: "#e3f2fd", color: "#1565c0", border: "#bbdefb" },
  // Shipped:   { bg: "#fff8e6", color: "#a07000", border: "#ffe09a" },
  Delivered: { bg: "#e8f5e9", color: "#2d6a35", border: "#c8e6c9" },
  Cancelled: { bg: "#fce4ec", color: "#c62828", border: "#f48fb1" },
};

const STATUS_ICON: Record<string, string> = {
  Placed: "🕐", Confirmed: "✅", Packed: "📦",
  // Shipped: "🚚", Delivered: "🎁", Cancelled: "❌",
};

const NEXT_STATUS: Record<string, string> = {
  Placed: "Confirmed", Confirmed: "Packed",
  // Packed: "Shipped",   Shipped: "Delivered",
};

const TABS = ["All", "Placed", "Confirmed", "Delivered"];//"Shipped", "Delivered" ""];

// ── Main Page ──────────────────────────────────────────────
export default function OrdersPage() {
  const router  = useRouter();
  const [user, setUser]     = useState<{ name: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<Counts>({ all: 0, pending: 0, confirmed: 0, shipped: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("All");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError]       = useState("");
  const pathname = usePathname()
//   const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  // ── Auth guard ─────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
    setUser(u);
    fetchOrders("All");
  }, []);

  // ── Fetch orders via orderAPI ──────────────────────────
  const fetchOrders = async (status: string) => {
    setLoading(true); setError("");
    try {
      const { data } = await orderAPI.getFarmerOrders(status);
      setOrders(data.orders || []);
      setCounts(data.counts || { all: 0, pending: 0, confirmed: 0, shipped: 0, delivered: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load orders. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleTab = (t: string) => {
    setTab(t);
    fetchOrders(t);
  };

  // ── Update order status via orderAPI ──────────────────
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      // Update locally — no need to refetch
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o)
      );
      setSelected(prev =>
        prev?._id === orderId ? { ...prev, orderStatus: newStatus } : prev
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Status update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

  const filtered = orders.filter(o =>
    o.cropName.toLowerCase().includes(search.toLowerCase()) ||
    o.consumer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.orderNumber).includes(search)
  );

  const fmt  = (d: string) => new Date(d).toLocaleDateString("en-CA");
  const init = () => (user?.name || "F")[0].toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#f4f0e8" }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{ width: 190, background: "linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
        display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>

        <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>
            Agri<span style={{ color: "#6aaa78" }}>AI</span>
          </div>
        </div>

        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#6aaa78",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>
              {init()}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
              <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11 }}>My Farm</div>
            </div>
          </div>
        </div>

        {/* <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {NAV.map(item => {
            const active = currentPath === item.href;
            return (
              <div key={item.href}>
                {item.section && (
                  <div style={{ padding: "12px 20px 4px", fontSize: 10, fontWeight: 700,
                    color: "rgba(255,255,255,.3)", letterSpacing: ".08em", textTransform: "uppercase" }}>
                    {item.section}
                  </div>
                )}
                <a href={item.href} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 20px",
                  textDecoration: "none",
                  background: active ? "rgba(106,170,120,.2)" : "transparent",
                  borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent",
                  color: active ? "#fff" : "rgba(255,255,255,.55)",
                  fontSize: 13, fontWeight: active ? 600 : 400, transition: "all .2s",
                }}>
                  <span>{item.icon}</span>{item.label}
                </a>
              </div>
            );
          })}
        </nav> */}
          <nav style={{ flex:1, padding:"12px 0", overflowY:"auto" }}>
  {NAV.map((item, i) => {
    const isActive = pathname === item.href;

    return (
      <div key={item.href}>
        <button
          onClick={() => router.push(item.href)}
          style={{
            width:"100%", display:"flex", alignItems:"center", gap:10,
            padding:"10px 20px", border:"none",
            background: isActive ? "rgba(106,170,120,.2)" : "transparent",
            borderLeft: isActive ? "3px solid #6aaa78" : "3px solid transparent",
            color: isActive ? "#fff" : "rgba(255,255,255,.55)",
            fontSize:13, fontWeight: isActive ? 600 : 400,
            cursor:"pointer", transition:"all .2s", textAlign:"left",
          }}
        >
          <span>{item.icon}</span>{item.label}
        </button>
      </div>
    );
  })}
</nav>

        <div style={{ padding: "12px 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <a href="/dashboard/farmer/settings" style={{ display: "flex", alignItems: "center", gap: 10,
            padding: "10px 20px", textDecoration: "none", color: "rgba(255,255,255,.45)", fontSize: 13 }}>
            ⚙️ Settings
          </a>
          <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 20px", border: "none", background: "transparent",
            color: "#ef4444", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main style={{ marginLeft: 190, flex: 1, padding: "28px 32px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>Orders</h1>
          <p style={{ fontSize: "14px", color: "#6b8070", marginTop: "4px" }}>
            Track and manage incoming orders · {counts.all} total
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "12px",
            padding: "14px 18px", color: "#c0392b", fontSize: "14px", marginBottom: "20px",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>⚠️ {error}</span>
            <button onClick={() => fetchOrders(tab)} style={{ background: "#1a3a2a", color: "#fff",
              border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px",
              fontWeight: 600, cursor: "pointer" }}>Retry</button>
          </div>
        )}

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { icon: "🕐", num: counts.pending,   label: "Pending"   },
            { icon: "✅", num: counts.confirmed,  label: "Confirmed" },
            { icon: "🚚", num: counts.shipped,    label: "Shipped"   },
            { icon: "🎁", num: counts.delivered,  label: "Delivered" },
          ].map(c => (
            <div key={c.label} style={{ background: "white", borderRadius: "14px", padding: "20px",
              border: "1px solid #e8e4dc", display: "flex", alignItems: "center", gap: "14px",
              boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f4f0e8",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#1a3a2a",
                  fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>
                  {c.num ?? 0}
                </div>
                <div style={{ fontSize: "12px", color: "#6b8070", marginTop: "2px" }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders table card */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e8e4dc",
          overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>

          {/* Card header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0ede8",
            display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>All Orders</h2>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
              <input type="text" placeholder="Search orders…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: "9px 14px 9px 36px", border: "1.5px solid #e0ddd6",
                  borderRadius: "10px", fontFamily: "'DM Sans',sans-serif",
                  fontSize: "13px", outline: "none", width: "220px" }}
              />
            </div>
          </div>

          {/* Status tabs */}
          <div style={{ display: "flex", gap: "6px", padding: "12px 24px", borderBottom: "1px solid #f0ede8" }}>
            {TABS.map(t => (
              <button key={t} onClick={() => handleTab(t)} style={{
                padding: "7px 16px", borderRadius: "100px", border: "1.5px solid",
                borderColor: tab === t ? "#1a3a2a" : "#e0ddd6",
                background:  tab === t ? "#1a3a2a" : "transparent",
                color:       tab === t ? "white" : "#6b8070",
                fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", transition: "all .2s",
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#6b8070" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
              <div style={{ fontWeight: 600 }}>Loading orders…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#c0bdb5" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>📦</div>
              No orders found.
            </div>
          ) : (
            <>
              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr 130px 140px",
                gap: "12px", padding: "10px 24px", background: "#f9f7f4" }}>
                {["Order #", "Product & Customer", "Total", "Status"].map(h => (
                  <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#9b9b9b",
                    textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</div>
                ))}
              </div>

              {filtered.map(o => (
                <div
                  key={o._id}
                  onClick={() => setSelected(o)}
                  style={{ display: "grid", gridTemplateColumns: "72px 1fr 130px 140px",
                    gap: "12px", padding: "16px 24px", cursor: "pointer",
                    borderTop: "1px solid #f4f0e8", transition: "background .15s", alignItems: "center" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9f7f4")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#6b8070" }}>
                    #{o.orderNumber}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a3a2a", marginBottom: "2px" }}>
                      {o.cropName} · {o.quantity} kg
                    </div>
                    <div style={{ fontSize: "12px", color: "#9b9b9b" }}>
                      {o.consumer?.name} · {fmt(o.createdAt)}
                    </div>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a3a2a" }}>
                    Rs. {o.totalPrice.toLocaleString()}
                  </div>
                  <div>
                    <span style={{
                      fontSize: "12px", fontWeight: 700, padding: "5px 12px", borderRadius: "100px",
                      background: STATUS_STYLE[o.orderStatus]?.bg || "#f4f0e8",
                      color:      STATUS_STYLE[o.orderStatus]?.color || "#6b8070",
                      border:     `1px solid ${STATUS_STYLE[o.orderStatus]?.border || "#e0ddd6"}`,
                      display: "inline-flex", alignItems: "center", gap: "4px",
                    }}>
                      {STATUS_ICON[o.orderStatus]} {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      {/* ══ ORDER DETAIL SIDE PANEL ══ */}
      {selected && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 100,
            display: "flex", justifyContent: "flex-end" }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div style={{ width: "420px", background: "white", height: "100vh",
            overflowY: "auto", boxShadow: "-4px 0 24px rgba(0,0,0,.12)" }}>

            {/* Panel header */}
            <div style={{ background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
              padding: "24px 28px", color: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
                  Order #{selected.orderNumber}
                </h2>
                <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,.15)",
                  border: "none", color: "#fff", width: 30, height: 30, borderRadius: "50%",
                  cursor: "pointer", fontSize: "14px" }}>✕</button>
              </div>
              <span style={{
                fontSize: "13px", fontWeight: 700, padding: "5px 16px", borderRadius: "100px",
                background: STATUS_STYLE[selected.orderStatus]?.bg,
                color:      STATUS_STYLE[selected.orderStatus]?.color,
                border:     `1px solid ${STATUS_STYLE[selected.orderStatus]?.border}`,
              }}>
                {STATUS_ICON[selected.orderStatus]} {selected.orderStatus}
              </span>
            </div>

            {/* Order details */}
            <div style={{ padding: "24px 28px" }}>
              {([
                ["Product",     `${selected.cropName} · ${selected.quantity} kg`],
                ["Price/kg",    `Rs. ${selected.pricePerKg ?? "—"}`],
                ["Total",       `Rs. ${selected.totalPrice.toLocaleString()}`],
                ["Payment",     `${selected.paymentMethod} · ${selected.paymentStatus}`],
                ["Customer",    selected.consumer?.name],
                ["Email",       selected.consumer?.email],
                ["Date",        fmt(selected.createdAt)],
                ["Address",     selected.deliveryAddress
                  ? `${selected.deliveryAddress.street}, ${selected.deliveryAddress.city}, ${selected.deliveryAddress.district}`
                  : "—"],
                ["Phone",       selected.deliveryAddress?.phone || "—"],
                ["Notes",       selected.notes || "None"],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: "1px solid #f0ede8" }}>
                  <span style={{ fontSize: "13px", color: "#9b9b9b", flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a3a2a",
                    textAlign: "right", maxWidth: "230px", wordBreak: "break-word" }}>{value}</span>
                </div>
              ))}

              {/* Advance status button */}
              {NEXT_STATUS[selected.orderStatus] && (
                <button
                  onClick={() => handleUpdateStatus(selected._id, NEXT_STATUS[selected.orderStatus])}
                  disabled={updating}
                  style={{ width: "100%", marginTop: "24px", padding: "13px",
                    background: updating ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
                    color: "white", border: "none", borderRadius: "10px",
                    fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 700,
                    cursor: updating ? "not-allowed" : "pointer" }}
                >
                  {updating ? "Updating…" : `Mark as ${NEXT_STATUS[selected.orderStatus]} →`}
                </button>
              )}

              {/* Cancel — only on Placed */}
              {selected.orderStatus === "Placed" && (
                <button
                  onClick={() => handleUpdateStatus(selected._id, "Cancelled")}
                  disabled={updating}
                  style={{ width: "100%", marginTop: "10px", padding: "11px",
                    background: "transparent", border: "1.5px solid #fcd0d0",
                    borderRadius: "10px", fontFamily: "'DM Sans',sans-serif",
                    fontSize: "14px", fontWeight: 600, color: "#c0392b", cursor: "pointer" }}
                >
                  Cancel Order
                </button>
              )}

              {/* Completed state */}
              {selected.orderStatus === "Delivered" && (
                <div style={{ marginTop: "20px", background: "#e8f5e9", borderRadius: "10px",
                  padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>🎉</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#2d6a35" }}>Order Delivered!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}