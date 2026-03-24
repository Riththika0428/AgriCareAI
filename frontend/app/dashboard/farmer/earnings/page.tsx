"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import api from "@/lib/axios-proxy";

const NAV = [
  { icon:"🏠", label:"Overview",    href:"/dashboard/farmer" },
  { icon:"🔬", label:"Crop Doctor", href:"/dashboard/farmer/crop-doctor" },
  { icon:"🌾", label:"My Products", href:"/dashboard/farmer/products" },
  { icon:"📦", label:"Orders",      href:"/dashboard/farmer/orders" },
  { icon:"⛈️", label:"Weather",     href:"/dashboard/farmer/weather" },
];

export default function EarningsPage() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,     setUser]    = useState<any>(null);
  const [orders,   setOrders]  = useState<any[]>([]);
  const [sub,      setSub]     = useState<any>(null);
  const [loading,  setLoading] = useState(true);
  const [cancelling, setCanc]  = useState(false);
  const [cancelMsg, setCancelMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
    setUser(u);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersRes, subRes] = await Promise.allSettled([
        api.get("/orders/farmer"),
        api.get("/subscriptions/my"),
      ]);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value.data || []);
      if (subRes.status    === "fulfilled") setSub(subRes.value.data);
    } catch {}
    setLoading(false);
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Cancel subscription? You'll keep access until end of billing period.")) return;
    setCanc(true); setCancelMsg("");
    try {
      await api.put("/subscriptions/cancel");
      setCancelMsg("✅ Subscription will cancel at end of billing period.");
      loadData();
    } catch (err: any) {
      setCancelMsg("❌ " + (err.response?.data?.message || "Failed."));
    } finally { setCanc(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

  const getInitial  = () => (user?.name || "F")[0].toUpperCase();

  // ── Compute stats from orders ──────────────────────────
  const delivered   = orders.filter(o => o.orderStatus === "Delivered");
  const pending     = orders.filter(o => !["Delivered","Cancelled"].includes(o.orderStatus));
  const totalEarned = delivered.reduce((s,o) => s + (o.totalPrice || 0), 0);
  const thisMonth   = delivered.filter(o => {
    const d = new Date(o.createdAt);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).reduce((s,o) => s + (o.totalPrice || 0), 0);

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-CA");

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", background:"#f4f0e8",
      fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>💰</div>
        <div style={{ color:"#2d5a3d", fontWeight:600 }}>Loading earnings…</div>
      </div>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh",
      fontFamily:"'DM Sans',sans-serif", background:"#f4f0e8" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:190,
        background:"linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
        display:"flex", flexDirection:"column",
        position:"fixed", top:0, left:0, bottom:0, zIndex:50 }}>
        <div style={{ padding:"22px 20px 16px",
          borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontFamily:"'Playfair Display',serif",
            fontWeight:900, fontSize:22, color:"#fff" }}>
            Agri<span style={{ color:"#6aaa78" }}>AI</span>
          </div>
        </div>
        <div style={{ padding:"16px 20px",
          borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:"50%",
              background:"#6aaa78", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:16, fontWeight:700, color:"#fff" }}>
              {getInitial()}
            </div>
            <div>
              <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>
                {user?.name || "Farmer"}
              </div>
              <div style={{ color:"rgba(255,255,255,.45)", fontSize:11 }}>My Farm</div>
            </div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"12px 0" }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <button key={item.href} onClick={() => router.push(item.href)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"10px 20px", border:"none",
                background: active ? "rgba(106,170,120,.2)" : "transparent",
                borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent",
                color: active ? "#fff" : "rgba(255,255,255,.55)",
                fontSize:13, fontWeight: active ? 600 : 400,
                cursor:"pointer", transition:"all .2s", textAlign:"left" }}>
                <span>{item.icon}</span>{item.label}
              </button>
            );
          })}
          {/* Earnings — active */}
          <button onClick={() => router.push("/dashboard/farmer/earnings")} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10,
            padding:"10px 20px", border:"none",
            background:"rgba(106,170,120,.2)",
            borderLeft:"3px solid #6aaa78",
            color:"#fff", fontSize:13, fontWeight:600,
            cursor:"pointer", textAlign:"left" }}>
            <span>💰</span>Earnings
          </button>
        </nav>
        <div style={{ padding:"12px 0", borderTop:"1px solid rgba(255,255,255,.08)" }}>
          <button onClick={handleLogout} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10,
            padding:"10px 20px", border:"none", background:"transparent",
            color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600 }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft:190, flex:1, padding:"28px 32px" }}>

        {/* Header */}
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:"#1a3a2a",
            margin:0, display:"flex", alignItems:"center", gap:10 }}>
            💰 Earnings & Subscription
          </h1>
          <p style={{ fontSize:14, color:"#6b8070", marginTop:4 }}>
            Track your income and manage your AgriAI subscription
          </p>
        </div>

        {/* ── Subscription status card ── */}
        <div style={{ background: sub?.isActive
            ? "linear-gradient(135deg,#1a3a2a,#2d5a3d)"
            : "linear-gradient(135deg,#7f1d1d,#991b1b)",
          borderRadius:16, padding:"24px 28px", marginBottom:24,
          color:"#fff", display:"flex",
          justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontSize:12, opacity:.6, fontWeight:700,
              textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>
              SUBSCRIPTION STATUS
            </div>
            <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>
              {sub?.isActive ? "✅ Active" : "❌ Inactive"}
              {sub?.status === "trialing" && " · Free Trial"}
            </div>
            {sub?.currentPeriodEnd && (
              <div style={{ fontSize:13, opacity:.7 }}>
                {sub.cancelAtPeriodEnd
                  ? `⚠ Cancels on ${fmt(sub.currentPeriodEnd)}`
                  : `Renews on ${fmt(sub.currentPeriodEnd)}`}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {!sub?.isActive && (
              <button onClick={() => router.push("/subscription")} style={{
                padding:"10px 20px",
                background:"#d4a853", color:"#1a3a2a",
                border:"none", borderRadius:10,
                fontSize:13, fontWeight:700, cursor:"pointer" }}>
                Subscribe Now
              </button>
            )}
            {sub?.isActive && !sub?.cancelAtPeriodEnd && (
              <button onClick={handleCancelSubscription} disabled={cancelling} style={{
                padding:"10px 20px",
                background:"rgba(255,255,255,.15)",
                color:"#fff", border:"1px solid rgba(255,255,255,.3)",
                borderRadius:10, fontSize:13, fontWeight:600,
                cursor:"pointer" }}>
                {cancelling ? "Cancelling…" : "Cancel Subscription"}
              </button>
            )}
          </div>
          {cancelMsg && (
            <div style={{ width:"100%", padding:"8px 14px",
              background:"rgba(255,255,255,.15)", borderRadius:8,
              fontSize:13 }}>
              {cancelMsg}
            </div>
          )}
        </div>

        {/* ── Earnings stat cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          gap:16, marginBottom:24 }}>
          {[
            { icon:"💰", num:`Rs. ${totalEarned.toLocaleString()}`, label:"Total Earned",      sub:"All time" },
            { icon:"📅", num:`Rs. ${thisMonth.toLocaleString()}`,   label:"This Month",        sub:"Delivered orders" },
            { icon:"📦", num:delivered.length,                      label:"Delivered Orders",   sub:"All time" },
            { icon:"⏳", num:pending.length,                        label:"Pending Orders",     sub:"Need attention" },
          ].map(s => (
            <div key={s.label} style={{ background:"#fff", borderRadius:14,
              padding:"20px 22px", boxShadow:"0 2px 10px rgba(0,0,0,.05)",
              border:"1px solid #f0ede8" }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:26, fontWeight:800, color:"#1c2b22",
                fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:12, color:"#6b8070", margin:"4px 0" }}>{s.label}</div>
              <div style={{ fontSize:11, color:"#6aaa78", fontWeight:600 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Order payment history ── */}
        <div style={{ background:"#fff", borderRadius:16, padding:"24px",
          border:"1px solid #e8e4dc", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#1a3a2a", marginBottom:18 }}>
            Order Payment History
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px", color:"#c0bdb5" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📦</div>
              No orders yet. Once consumers buy your products, earnings appear here.
            </div>
          ) : (
            <div>
              {/* Header */}
              <div style={{ display:"grid",
                gridTemplateColumns:"100px 1fr 120px 120px 100px",
                gap:12, padding:"8px 14px",
                fontSize:11, fontWeight:700, color:"#9b9b9b",
                textTransform:"uppercase", letterSpacing:".06em",
                borderBottom:"1px solid #f0ede8", marginBottom:4 }}>
                <span>Date</span>
                <span>Product</span>
                <span>Consumer</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              {orders.map((o:any) => {
                const isPaid   = o.orderStatus === "Delivered";
                const isPending= !["Delivered","Cancelled"].includes(o.orderStatus);
                return (
                  <div key={o._id} style={{
                    display:"grid",
                    gridTemplateColumns:"100px 1fr 120px 120px 100px",
                    gap:12, padding:"12px 14px",
                    borderBottom:"1px solid #f9f7f3",
                    alignItems:"center" }}>
                    <span style={{ fontSize:12, color:"#9b9b9b" }}>
                      {fmt(o.createdAt)}
                    </span>
                    <span style={{ fontSize:14, fontWeight:600, color:"#1a3a2a" }}>
                      {o.cropName} · {o.quantity}kg
                    </span>
                    <span style={{ fontSize:13, color:"#6b8070" }}>
                      {o.consumer?.name || "Consumer"}
                    </span>
                    <span style={{ fontSize:14, fontWeight:700,
                      color: isPaid ? "#16a34a" : "#6b8070" }}>
                      Rs. {o.totalPrice?.toLocaleString()}
                    </span>
                    <span style={{
                      fontSize:11, fontWeight:700,
                      padding:"3px 10px", borderRadius:99,
                      display:"inline-block",
                      background: isPaid    ? "#e8f5e9"
                                : isPending ? "#fff8e6" : "#f4f0e8",
                      color:      isPaid    ? "#2d6a35"
                                : isPending ? "#a07000" : "#6b8070",
                    }}>
                      {isPaid ? "💰 Earned" : isPending ? "⏳ Pending" : "Cancelled"}
                    </span>
                  </div>
                );
              })}

              {/* Total */}
              <div style={{ display:"flex", justifyContent:"flex-end",
                padding:"16px 14px 0",
                borderTop:"2px solid #f0ede8", marginTop:8 }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:12, color:"#6b8070", marginBottom:4 }}>
                    Total Earned (Delivered Orders)
                  </div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#1a3a2a",
                    fontFamily:"'Playfair Display',serif" }}>
                    Rs. {totalEarned.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}