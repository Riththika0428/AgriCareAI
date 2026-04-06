// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
// import api from "@/lib/axios-proxy";

// const NAV = [
//   { icon:"🏠", label:"Overview",    href:"/dashboard/farmer" },
//   { icon:"🔬", label:"Crop Doctor", href:"/dashboard/farmer/crop-doctor" },
//   { icon:"🌾", label:"My Products", href:"/dashboard/farmer/products" },
//   { icon:"📦", label:"Orders",      href:"/dashboard/farmer/orders" },
//   { icon:"⛈️", label:"Weather",     href:"/dashboard/farmer/weather" },
// ];

// export default function EarningsPage() {
//   const router   = useRouter();
//   const pathname = usePathname();

//   const [user,     setUser]    = useState<any>(null);
//   const [orders,   setOrders]  = useState<any[]>([]);
//   const [sub,      setSub]     = useState<any>(null);
//   const [loading,  setLoading] = useState(true);
//   const [cancelling, setCanc]  = useState(false);
//   const [cancelMsg, setCancelMsg] = useState("");

//   useEffect(() => {
//     const stored = localStorage.getItem("agriai_user");
//     const token  = localStorage.getItem("agriai_token");
//     if (!stored || !token) { router.push("/"); return; }
//     const u = JSON.parse(stored);
//     if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
//     setUser(u);
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [ordersRes, subRes] = await Promise.allSettled([
//         api.get("/orders/farmer"),
//         api.get("/subscriptions/my"),
//       ]);
//       if (ordersRes.status === "fulfilled") setOrders(ordersRes.value.data || []);
//       if (subRes.status    === "fulfilled") setSub(subRes.value.data);
//     } catch {}
//     setLoading(false);
//   };

//   const handleCancelSubscription = async () => {
//     if (!confirm("Cancel subscription? You'll keep access until end of billing period.")) return;
//     setCanc(true); setCancelMsg("");
//     try {
//       await api.put("/subscriptions/cancel");
//       setCancelMsg("✅ Subscription will cancel at end of billing period.");
//       loadData();
//     } catch (err: any) {
//       setCancelMsg("❌ " + (err.response?.data?.message || "Failed."));
//     } finally { setCanc(false); }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("agriai_token");
//     localStorage.removeItem("agriai_user");
//     router.push("/");
//   };

//   const getInitial  = () => (user?.name || "F")[0].toUpperCase();

//   // ── Compute stats from orders ──────────────────────────
//   const delivered   = orders.filter(o => o.orderStatus === "Delivered");
//   const pending     = orders.filter(o => !["Delivered","Cancelled"].includes(o.orderStatus));
//   const totalEarned = delivered.reduce((s,o) => s + (o.totalPrice || 0), 0);
//   const thisMonth   = delivered.filter(o => {
//     const d = new Date(o.createdAt);
//     const n = new Date();
//     return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
//   }).reduce((s,o) => s + (o.totalPrice || 0), 0);

//   const fmt = (d: string) => new Date(d).toLocaleDateString("en-CA");

//   if (loading) return (
//     <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
//       justifyContent:"center", background:"#f4f0e8",
//       fontFamily:"'DM Sans',sans-serif" }}>
//       <div style={{ textAlign:"center" }}>
//         <div style={{ fontSize:32, marginBottom:12 }}>💰</div>
//         <div style={{ color:"#2d5a3d", fontWeight:600 }}>Loading earnings…</div>
//       </div>
//     </div>
//   );

//   return (
//     <div style={{ display:"flex", minHeight:"100vh",
//       fontFamily:"'DM Sans',sans-serif", background:"#f4f0e8" }}>

//       {/* ── SIDEBAR ── */}
//       <aside style={{ width:190,
//         background:"linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
//         display:"flex", flexDirection:"column",
//         position:"fixed", top:0, left:0, bottom:0, zIndex:50 }}>
//         <div style={{ padding:"22px 20px 16px",
//           borderBottom:"1px solid rgba(255,255,255,.08)" }}>
//           <div style={{ fontFamily:"'Playfair Display',serif",
//             fontWeight:900, fontSize:22, color:"#fff" }}>
//             Agri<span style={{ color:"#6aaa78" }}>AI</span>
//           </div>
//         </div>
//         <div style={{ padding:"16px 20px",
//           borderBottom:"1px solid rgba(255,255,255,.08)" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//             <div style={{ width:38, height:38, borderRadius:"50%",
//               background:"#6aaa78", display:"flex", alignItems:"center",
//               justifyContent:"center", fontSize:16, fontWeight:700, color:"#fff" }}>
//               {getInitial()}
//             </div>
//             <div>
//               <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>
//                 {user?.name || "Farmer"}
//               </div>
//               <div style={{ color:"rgba(255,255,255,.45)", fontSize:11 }}>My Farm</div>
//             </div>
//           </div>
//         </div>
//         <nav style={{ flex:1, padding:"12px 0" }}>
//           {NAV.map(item => {
//             const active = pathname === item.href;
//             return (
//               <button key={item.href} onClick={() => router.push(item.href)} style={{
//                 width:"100%", display:"flex", alignItems:"center", gap:10,
//                 padding:"10px 20px", border:"none",
//                 background: active ? "rgba(106,170,120,.2)" : "transparent",
//                 borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent",
//                 color: active ? "#fff" : "rgba(255,255,255,.55)",
//                 fontSize:13, fontWeight: active ? 600 : 400,
//                 cursor:"pointer", transition:"all .2s", textAlign:"left" }}>
//                 <span>{item.icon}</span>{item.label}
//               </button>
//             );
//           })}
//           {/* Earnings — active */}
//           <button onClick={() => router.push("/dashboard/farmer/earnings")} style={{
//             width:"100%", display:"flex", alignItems:"center", gap:10,
//             padding:"10px 20px", border:"none",
//             background:"rgba(106,170,120,.2)",
//             borderLeft:"3px solid #6aaa78",
//             color:"#fff", fontSize:13, fontWeight:600,
//             cursor:"pointer", textAlign:"left" }}>
//             <span>💰</span>Earnings
//           </button>
//         </nav>
//         <div style={{ padding:"12px 0", borderTop:"1px solid rgba(255,255,255,.08)" }}>
//           <button onClick={handleLogout} style={{
//             width:"100%", display:"flex", alignItems:"center", gap:10,
//             padding:"10px 20px", border:"none", background:"transparent",
//             color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600 }}>
//             🚪 Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* ── MAIN ── */}
//       <main style={{ marginLeft:190, flex:1, padding:"28px 32px" }}>

//         {/* Header */}
//         <div style={{ marginBottom:24 }}>
//           <h1 style={{ fontSize:24, fontWeight:700, color:"#1a3a2a",
//             margin:0, display:"flex", alignItems:"center", gap:10 }}>
//             💰 Earnings & Subscription
//           </h1>
//           <p style={{ fontSize:14, color:"#6b8070", marginTop:4 }}>
//             Track your income and manage your AgriAI subscription
//           </p>
//         </div>

//         {/* ── Subscription status card ── */}
//         <div style={{ background: sub?.isActive
//             ? "linear-gradient(135deg,#1a3a2a,#2d5a3d)"
//             : "linear-gradient(135deg,#7f1d1d,#991b1b)",
//           borderRadius:16, padding:"24px 28px", marginBottom:24,
//           color:"#fff", display:"flex",
//           justifyContent:"space-between", alignItems:"center",
//           flexWrap:"wrap", gap:16 }}>
//           <div>
//             <div style={{ fontSize:12, opacity:.6, fontWeight:700,
//               textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>
//               SUBSCRIPTION STATUS
//             </div>
//             <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>
//               {sub?.isActive ? "✅ Active" : "❌ Inactive"}
//               {sub?.status === "trialing" && " · Free Trial"}
//             </div>
//             {sub?.currentPeriodEnd && (
//               <div style={{ fontSize:13, opacity:.7 }}>
//                 {sub.cancelAtPeriodEnd
//                   ? `⚠ Cancels on ${fmt(sub.currentPeriodEnd)}`
//                   : `Renews on ${fmt(sub.currentPeriodEnd)}`}
//               </div>
//             )}
//           </div>
//           <div style={{ display:"flex", gap:10 }}>
//             {!sub?.isActive && (
//               <button onClick={() => router.push("/subscription")} style={{
//                 padding:"10px 20px",
//                 background:"#d4a853", color:"#1a3a2a",
//                 border:"none", borderRadius:10,
//                 fontSize:13, fontWeight:700, cursor:"pointer" }}>
//                 Subscribe Now
//               </button>
//             )}
//             {sub?.isActive && !sub?.cancelAtPeriodEnd && (
//               <button onClick={handleCancelSubscription} disabled={cancelling} style={{
//                 padding:"10px 20px",
//                 background:"rgba(255,255,255,.15)",
//                 color:"#fff", border:"1px solid rgba(255,255,255,.3)",
//                 borderRadius:10, fontSize:13, fontWeight:600,
//                 cursor:"pointer" }}>
//                 {cancelling ? "Cancelling…" : "Cancel Subscription"}
//               </button>
//             )}
//           </div>
//           {cancelMsg && (
//             <div style={{ width:"100%", padding:"8px 14px",
//               background:"rgba(255,255,255,.15)", borderRadius:8,
//               fontSize:13 }}>
//               {cancelMsg}
//             </div>
//           )}
//         </div>

//         {/* ── Earnings stat cards ── */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
//           gap:16, marginBottom:24 }}>
//           {[
//             { icon:"💰", num:`Rs. ${totalEarned.toLocaleString()}`, label:"Total Earned",      sub:"All time" },
//             { icon:"📅", num:`Rs. ${thisMonth.toLocaleString()}`,   label:"This Month",        sub:"Delivered orders" },
//             { icon:"📦", num:delivered.length,                      label:"Delivered Orders",   sub:"All time" },
//             { icon:"⏳", num:pending.length,                        label:"Pending Orders",     sub:"Need attention" },
//           ].map(s => (
//             <div key={s.label} style={{ background:"#fff", borderRadius:14,
//               padding:"20px 22px", boxShadow:"0 2px 10px rgba(0,0,0,.05)",
//               border:"1px solid #f0ede8" }}>
//               <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
//               <div style={{ fontSize:26, fontWeight:800, color:"#1c2b22",
//                 fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.num}</div>
//               <div style={{ fontSize:12, color:"#6b8070", margin:"4px 0" }}>{s.label}</div>
//               <div style={{ fontSize:11, color:"#6aaa78", fontWeight:600 }}>{s.sub}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── Order payment history ── */}
//         <div style={{ background:"#fff", borderRadius:16, padding:"24px",
//           border:"1px solid #e8e4dc", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
//           <div style={{ fontSize:16, fontWeight:700, color:"#1a3a2a", marginBottom:18 }}>
//             Order Payment History
//           </div>

//           {orders.length === 0 ? (
//             <div style={{ textAlign:"center", padding:"40px", color:"#c0bdb5" }}>
//               <div style={{ fontSize:36, marginBottom:10 }}>📦</div>
//               No orders yet. Once consumers buy your products, earnings appear here.
//             </div>
//           ) : (
//             <div>
//               {/* Header */}
//               <div style={{ display:"grid",
//                 gridTemplateColumns:"100px 1fr 120px 120px 100px",
//                 gap:12, padding:"8px 14px",
//                 fontSize:11, fontWeight:700, color:"#9b9b9b",
//                 textTransform:"uppercase", letterSpacing:".06em",
//                 borderBottom:"1px solid #f0ede8", marginBottom:4 }}>
//                 <span>Date</span>
//                 <span>Product</span>
//                 <span>Consumer</span>
//                 <span>Amount</span>
//                 <span>Status</span>
//               </div>

//               {orders.map((o:any) => {
//                 const isPaid   = o.orderStatus === "Delivered";
//                 const isPending= !["Delivered","Cancelled"].includes(o.orderStatus);
//                 return (
//                   <div key={o._id} style={{
//                     display:"grid",
//                     gridTemplateColumns:"100px 1fr 120px 120px 100px",
//                     gap:12, padding:"12px 14px",
//                     borderBottom:"1px solid #f9f7f3",
//                     alignItems:"center" }}>
//                     <span style={{ fontSize:12, color:"#9b9b9b" }}>
//                       {fmt(o.createdAt)}
//                     </span>
//                     <span style={{ fontSize:14, fontWeight:600, color:"#1a3a2a" }}>
//                       {o.cropName} · {o.quantity}kg
//                     </span>
//                     <span style={{ fontSize:13, color:"#6b8070" }}>
//                       {o.consumer?.name || "Consumer"}
//                     </span>
//                     <span style={{ fontSize:14, fontWeight:700,
//                       color: isPaid ? "#16a34a" : "#6b8070" }}>
//                       Rs. {o.totalPrice?.toLocaleString()}
//                     </span>
//                     <span style={{
//                       fontSize:11, fontWeight:700,
//                       padding:"3px 10px", borderRadius:99,
//                       display:"inline-block",
//                       background: isPaid    ? "#e8f5e9"
//                                 : isPending ? "#fff8e6" : "#f4f0e8",
//                       color:      isPaid    ? "#2d6a35"
//                                 : isPending ? "#a07000" : "#6b8070",
//                     }}>
//                       {isPaid ? "💰 Earned" : isPending ? "⏳ Pending" : "Cancelled"}
//                     </span>
//                   </div>
//                 );
//               })}

//               {/* Total */}
//               <div style={{ display:"flex", justifyContent:"flex-end",
//                 padding:"16px 14px 0",
//                 borderTop:"2px solid #f0ede8", marginTop:8 }}>
//                 <div style={{ textAlign:"right" }}>
//                   <div style={{ fontSize:12, color:"#6b8070", marginBottom:4 }}>
//                     Total Earned (Delivered Orders)
//                   </div>
//                   <div style={{ fontSize:22, fontWeight:800, color:"#1a3a2a",
//                     fontFamily:"'Playfair Display',serif" }}>
//                     Rs. {totalEarned.toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { orderAPI, profileAPI } from "@/lib/axios-proxy";
import api from "@/lib/axios-proxy";

interface User    { _id: string; name: string; email: string; role: string; }
interface Profile { farmName: string; district: string; }
interface Order   { _id: string; orderNumber: number; cropName: string; quantity: number; totalPrice: number; orderStatus: string; consumer: { name: string }; createdAt: string; }

const NAV = [
  { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const PACKAGES = [
  { id: "starter",    name: "Starter",    price: 1499, period: "month",  highlight: false, features: ["20 listings","30 scans/mo","Full weather","Order mgmt","Email support"] },
  { id: "pro",        name: "Pro Farmer", price: 2999, period: "month",  highlight: true,  features: ["Unlimited listings","Unlimited scans","Advanced weather","Priority orders","Revenue analytics","Priority support"] },
  { id: "enterprise", name: "Enterprise", price: 5999, period: "month",  highlight: false, features: ["Everything in Pro","Multi-farm","Account manager","Custom integrations","SLA guarantee"] },
];

const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);

// Simple bar chart
const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: d.value > 0 ? "linear-gradient(180deg,#6aaa78,#2d5a3d)" : "#f4f0e8", height: `${Math.max((d.value / max) * 100, 4)}%`, transition: "height .4s ease", minHeight: 4 }} />
          </div>
          <div style={{ fontSize: 10, color: "#9b9590", fontWeight: 600 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
};

export default function EarningsPage() {
  const router = useRouter();

  const [user,          setUser]          = useState<User | null>(null);
  const [profile,       setProfile]       = useState<Profile | null>(null);
  const [sub,           setSub]           = useState<any>(null);
  const [orders,        setOrders]        = useState<Order[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [showPlans,     setShowPlans]     = useState(false);

  const SBW = sideCollapsed ? 68 : 220;
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const getInitial = () => (user?.name || "F")[0].toUpperCase();

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored); setUser(u); loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profR, ordR, subR] = await Promise.allSettled([profileAPI.getMe(), orderAPI.getFarmerOrders("All"), api.get("/subscriptions/my")]);
      if (profR.status === "fulfilled") setProfile({ farmName: profR.value.data.farmName || "", district: profR.value.data.district || "" });
      if (ordR.status === "fulfilled")  setOrders(ordR.value.data.orders || []);
      if (subR.status === "fulfilled")  setSub(subR.value.data);
    } catch { }
    setLoading(false);
  };

  const handleLogout = () => { localStorage.removeItem("agriai_token"); localStorage.removeItem("agriai_user"); router.push("/"); };

  const delivered     = orders.filter(o => o.orderStatus === "Delivered");
  const totalEarnings = delivered.reduce((a, o) => a + o.totalPrice, 0);
  const totalOrders   = orders.length;
  const avgOrderVal   = totalOrders > 0 ? Math.round(delivered.reduce((a, o) => a + o.totalPrice, 0) / Math.max(delivered.length, 1)) : 0;

  // Monthly breakdown (last 6 months)
  const monthlyData = (() => {
    const months: { label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("en-US", { month: "short" });
      const value = delivered.filter(o => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      }).reduce((a, o) => a + o.totalPrice, 0);
      months.push({ label, value });
    }
    return months;
  })();

  // Top crops by earnings
  const cropEarnings = delivered.reduce((acc: Record<string, number>, o) => {
    acc[o.cropName] = (acc[o.cropName] || 0) + o.totalPrice;
    return acc;
  }, {});
  const topCrops = Object.entries(cropEarnings).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Sub expiry days
  const daysLeft = sub?.currentPeriodEnd ? Math.ceil((new Date(sub.currentPeriodEnd).getTime() - Date.now()) / 86400000) : null;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0e8", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#6aaa78)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={22} style={{ color: "#fff" }} />
        </div>
        <div style={{ color: "#2d5a3d", fontWeight: 700, fontSize: 15 }}>Loading earnings…</div>
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
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp .32s ease both;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}} .pulse{animation:pulse 2s infinite;}
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
                  {sub?.isActive && <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(106,170,120,.25)", borderRadius: 99, padding: "1px 8px", fontSize: 9, color: "#6aaa78", fontWeight: 700 }}><span className="pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#6aaa78", display: "inline-block" }} />{sub.status === "trialing" ? "Free Trial" : "Active"}</div>}
                </div>
              )}
            </div>
          </div>
          <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
            {!sideCollapsed && <div style={{ padding: "10px 16px 4px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em" }}>Navigation</div>}
            {NAV.map(item => {
              const active = item.href === "/dashboard/farmer/earnings";
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
              <button onClick={() => setShowPlans(true)} className="action-btn"
                style={{ padding: "8px 16px", background: "linear-gradient(135deg,#d4a853,#f0c96b)", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, color: "#1a3a2a", cursor: "pointer" }}>
                View Plans
              </button>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(45,90,61,.3)", cursor: "pointer" }}>{getInitial()}</div>
            </div>
          </header>

          <div style={{ padding: "28px 32px", flex: 1 }}>

            {/* Subscription banner */}
            {sub && (
              <div className="fade-up" style={{ marginBottom: 24, background: sub.isActive ? "linear-gradient(135deg,#1a3a2a,#2d5a3d)" : "linear-gradient(135deg,#7c2d12,#b45309)", borderRadius: 18, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 }}>Current Subscription</div>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Playfair Display',serif" }}>
                    {sub.planName || (sub.status === "trialing" ? "Free Trial" : "Active Plan")}
                  </div>
                  {daysLeft !== null && (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginTop: 4 }}>
                      {daysLeft > 0 ? `${daysLeft} days remaining` : "Expired"}
                      {sub.currentPeriodEnd && ` · Renews ${new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`}
                    </div>
                  )}
                </div>
                <button onClick={() => setShowPlans(true)} className="action-btn"
                  style={{ padding: "10px 20px", background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
                  {sub.isActive ? "Upgrade Plan" : "Renew Now"}
                </button>
              </div>
            )}

            {/* Stat cards */}
            <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 24 }}>
              {[
                { label: "Total Earnings",    value: `Rs.${totalEarnings.toLocaleString()}`, sub: "From delivered orders", accent: "#d4a853", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "Completed Orders",  value: delivered.length, sub: `${totalOrders} total orders`, accent: "#6aaa78", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "Avg. Order Value",  value: `Rs.${avgOrderVal.toLocaleString()}`, sub: "Per delivered order", accent: "#3b82f6", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 18, padding: "22px 24px", border: "1px solid #eeebe4", boxShadow: "0 2px 10px rgba(0,0,0,.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.accent}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={s.icon} size={18} style={{ color: s.accent }} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".07em" }}>{s.label}</div>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#1c2b22", fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#9b9590" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Two-column */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>

              {/* Monthly bar chart + transactions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="fade-up" style={{ background: "#fff", borderRadius: 20, border: "1px solid #eeebe4", boxShadow: "0 2px 10px rgba(0,0,0,.04)", padding: "24px 28px" }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22" }}>Monthly Revenue</div>
                    <div style={{ fontSize: 12, color: "#9b9590", marginTop: 3 }}>Earnings from delivered orders over the last 6 months</div>
                  </div>
                  <BarChart data={monthlyData} />
                </div>

                {/* Recent transactions */}
                <div className="fade-up" style={{ background: "#fff", borderRadius: 20, border: "1px solid #eeebe4", boxShadow: "0 2px 10px rgba(0,0,0,.04)", overflow: "hidden" }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid #f4f0ec", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1c2b22" }}>Recent Transactions</div>
                    <button onClick={() => router.push("/dashboard/farmer/orders")} className="action-btn"
                      style={{ fontSize: 12, fontWeight: 600, color: "#6aaa78", background: "none", border: "none", cursor: "pointer" }}>
                      View all orders →
                    </button>
                  </div>
                  {delivered.length === 0 ? (
                    <div style={{ padding: "40px 24px", textAlign: "center", color: "#9b9590", fontSize: 13 }}>No completed transactions yet.</div>
                  ) : delivered.slice(0, 8).map((o, i) => (
                    <div key={o._id} style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 14, borderBottom: i < Math.min(delivered.length, 8) - 1 ? "1px solid #f8f5f0" : "none" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: "#f0f8f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={17} style={{ color: "#6aaa78" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1c2b22" }}>{o.cropName} · {o.quantity}kg</div>
                        <div style={{ fontSize: 11, color: "#9b9590", marginTop: 1 }}>#{o.orderNumber} · {o.consumer?.name} · {new Date(o.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#1a3a2a" }}>+Rs.{o.totalPrice.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: top crops + plan card */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Top crops */}
                <div className="fade-up" style={{ background: "#fff", borderRadius: 18, border: "1px solid #eeebe4", boxShadow: "0 2px 10px rgba(0,0,0,.04)", overflow: "hidden" }}>
                  <div style={{ padding: "18px 20px", borderBottom: "1px solid #f4f0ec" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1c2b22" }}>Top Crops</div>
                    <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>By earnings</div>
                  </div>
                  {topCrops.length === 0 ? (
                    <div style={{ padding: "32px 20px", textAlign: "center", color: "#9b9590", fontSize: 12 }}>No data yet</div>
                  ) : topCrops.map(([crop, val], i) => {
                    const pct = Math.round((val / totalEarnings) * 100);
                    return (
                      <div key={crop} style={{ padding: "14px 20px", borderBottom: i < topCrops.length - 1 ? "1px solid #f8f5f0" : "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1c2b22" }}>{crop}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a3a2a" }}>Rs.{val.toLocaleString()}</div>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: "#f4f0e8", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#6aaa78,#2d5a3d)", borderRadius: 99, transition: "width .5s ease" }} />
                        </div>
                        <div style={{ fontSize: 11, color: "#9b9590", marginTop: 4 }}>{pct}% of total</div>
                      </div>
                    );
                  })}
                </div>

                {/* Upgrade CTA */}
                <div className="fade-up" onClick={() => setShowPlans(true)}
                  style={{ background: "linear-gradient(145deg,#1a3a2a,#2d5a3d)", borderRadius: 18, padding: "22px", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(106,170,120,.12)" }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Upgrade</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display',serif", marginBottom: 6 }}>Unlock Analytics</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.6, marginBottom: 16 }}>Get detailed revenue reports, crop performance insights and more.</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#6aaa78", borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                      View Plans <Icon d="M9 5l7 7-7 7" size={13} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Plans modal */}
      {showPlans && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowPlans(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(10,20,14,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#f9f7f3", borderRadius: 24, padding: "36px", width: "100%", maxWidth: 760, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a3a2a", fontFamily: "'Playfair Display',serif" }}>Choose Your Plan</h2>
                <p style={{ color: "#9b9590", fontSize: 13, marginTop: 6 }}>Start free. Upgrade anytime. No lock-in.</p>
              </div>
              <button onClick={() => setShowPlans(false)} style={{ background: "#f4f0e8", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b8070" }}>
                <Icon d="M6 18L18 6M6 6l12 12" size={16} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {PACKAGES.map(pkg => (
                <div key={pkg.id} style={{ background: pkg.highlight ? "linear-gradient(145deg,#1a3a2a,#2d5a3d)" : "#fff", borderRadius: 18, padding: "24px 20px", border: pkg.highlight ? "2px solid rgba(106,170,120,.3)" : "1.5px solid #e8e4dc", position: "relative" }}>
                  {pkg.highlight && (
                    <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#d4a853,#f0c96b)", color: "#1a3a2a", fontSize: 10, fontWeight: 800, padding: "4px 14px", borderRadius: 99, whiteSpace: "nowrap" }}>Most Popular</div>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 700, color: pkg.highlight ? "rgba(255,255,255,.5)" : "#9b9590", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>{pkg.name}</div>
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: pkg.highlight ? "#6aaa78" : "#1a3a2a", fontFamily: "'Playfair Display',serif" }}>Rs.{pkg.price.toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: pkg.highlight ? "rgba(255,255,255,.4)" : "#9b9590" }}>/{pkg.period}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
                    {pkg.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: pkg.highlight ? "rgba(255,255,255,.75)" : "#6b8070" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: pkg.highlight ? "rgba(106,170,120,.2)" : "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon d="M5 13l4 4L19 7" size={9} style={{ color: pkg.highlight ? "#6aaa78" : "#2d6a35" }} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => router.push("/subscription")} className="action-btn"
                    style={{ width: "100%", padding: "11px", background: pkg.highlight ? "#6aaa78" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "#b0ada8", marginTop: 20 }}>All plans include a 7-day free trial. Cancel anytime. Prices in LKR.</p>
          </div>
        </div>
      )}
    </>
  );
}