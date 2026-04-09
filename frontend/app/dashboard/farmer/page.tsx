"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { profileAPI, orderAPI, productAPI, diseaseAPI, validateSession, clearAuthAndRedirect } from "@/lib/axios-proxy";
import api from "@/lib/axios-proxy";

// ─── Types ────────────────────────────────────────────────────────────────────
interface User    { _id: string; name: string; email: string; role: string; }
interface Profile {
  phone: string; state: string; district: string; village: string; bio: string;
  farmName: string; farmSize: number; farmSizeUnit: string;
  farmingType: string; irrigationType: string; soilType: string; experience: number;
  crops: string[];
  user?: { name: string; email: string; role: string };
}
interface Order {
  _id: string; orderNumber: number; cropName: string; quantity: number;
  totalPrice: number; orderStatus: string; paymentStatus: string;
  consumer: { name: string; email: string }; createdAt: string;
}
interface Product { _id: string; cropName: string; category: string; price: number; stock: number; status: string; imageUrl?: string; }
interface Disease { _id: string; cropName: string; diagnosis: string; severity: string; createdAt: string; status: string; }
interface WeatherAlert { _id: string; district: string; message: string; severity: string; createdAt: string; }

// ─── Constants ────────────────────────────────────────────────────────────────
const NAV = [
  { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const SL_DISTRICTS = ["Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya","Galle","Matara","Hambantota","Jaffna","Trincomalee","Kurunegala","Anuradhapura","Polonnaruwa","Badulla","Ratnapura","Kegalle"];

const PACKAGES = [
  { id:"free",       name:"Free Trial",  price:0,    period:"7 days", highlight:false, features:["3 product listings","Crop scanning (5/month)","Weather alerts","Basic order management"] },
  { id:"starter",    name:"Starter",     price:1499, period:"month",  highlight:false, features:["20 product listings","Crop scanning (30/month)","Full weather dashboard","Order management","Email support"] },
  { id:"pro",        name:"Pro Farmer",  price:2999, period:"month",  highlight:true,  features:["Unlimited listings","Unlimited scanning","Advanced weather","Priority orders","Revenue analytics","Priority support"] },
  { id:"enterprise", name:"Enterprise",  price:5999, period:"month",  highlight:false, features:["Everything in Pro","Multi-farm management","Account manager","Custom integrations","SLA guarantee"] },
];

// ─── SVG Icon component ───────────────────────────────────────────────────────
const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
const Sparkline = ({ values, color = "#6aaa78", h = 40 }: { values: number[]; color?: string; h?: number }) => {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const W = 80;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${h - (v / max) * (h - 2) - 1}`).join(" L ");
  const area = `M${pts} L${W},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} style={{ width: "100%", height: h }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#","")})`} />
      <path d={`M${pts}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── Pill badge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ s }: { s: string }) => {
  const map: Record<string, [string, string]> = {
    Active:        ["#e8f5e9","#2d6a35"], "Out of Stock": ["#f4f0e8","#6b8070"],
    Inactive:      ["#fce4ec","#c62828"], Placed:         ["#f0f4ff","#3b5bdb"],
    Confirmed:     ["#fff8e6","#a07000"], Packed:         ["#e3f2fd","#1565c0"],
    Delivered:     ["#e8f5e9","#2d6a35"], Cancelled:      ["#fce4ec","#c62828"],
    Active0:       ["#e8f5e9","#2d6a35"], approved:       ["#e8f5e9","#2d6a35"],
    resolved:      ["#e8f5e9","#2d6a35"],
  };
  const [bg, col] = map[s] ?? ["#f4f0e8","#6b8070"];
  return (
    <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:99, background:bg, color:col, whiteSpace:"nowrap" }}>
      {s}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent, spark, onClick }:
  { label:string; value:string|number; sub:string; accent:string; spark?:number[]; onClick?:()=>void }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:"#fff", borderRadius:16, padding:"20px 22px", border:"1px solid #eeebe4",
        boxShadow: hov ? "0 8px 28px rgba(26,58,42,.10)" : "0 2px 8px rgba(0,0,0,.04)",
        cursor: onClick ? "pointer" : "default", transition:"all .22s",
        transform: hov && onClick ? "translateY(-2px)" : "none",
        position:"relative", overflow:"hidden",
      }}>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, opacity:.6 }}>
        {spark && <Sparkline values={spark} color={accent} h={42} />}
      </div>
      <div style={{ position:"relative" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#a09a90", textTransform:"uppercase", letterSpacing:".07em", marginBottom:8 }}>{label}</div>
        <div style={{ fontSize:30, fontWeight:800, color:"#1c2b22", fontFamily:"'Playfair Display',serif", lineHeight:1, marginBottom:4 }}>{value}</div>
        <div style={{ fontSize:11, color:"#9b9590" }}>{sub}</div>
        <div style={{ position:"absolute", top:0, right:0, width:6, height:6, borderRadius:"50%", background:accent }} />
      </div>
    </div>
  );
};

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function FarmerDashboard() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,          setUser]          = useState<User|null>(null);
  const [profile,       setProfile]       = useState<Profile|null>(null);
  const [showProfile,   setShowProfile]   = useState(false);
  const [showPackages,  setShowPackages]  = useState(false);
  const [editMode,      setEditMode]      = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [saveMsg,       setSaveMsg]       = useState("");
  const [sub,           setSub]           = useState<any>(null);
  const [sideCollapsed, setSideCollapsed] = useState(false);

  const [recentOrders,   setRecentOrders]   = useState<Order[]>([]);
  const [products,       setProducts]       = useState<Product[]>([]);
  const [diseases,       setDiseases]       = useState<Disease[]>([]);
  const [weatherAlerts,  setWeatherAlerts]  = useState<WeatherAlert[]>([]);
  const [totalEarnings,  setTotalEarnings]  = useState(0);
  const [pendingCount,   setPendingCount]   = useState(0);

  const [editForm, setEditForm] = useState({
    name:"", farmName:"", phone:"", district:"Colombo", state:"", village:"", bio:"",
    farmSize:"", farmSizeUnit:"acres", farmingType:"", experience:0,
  });

  // ── Auth + data ───────────────────────────────────────────
  useEffect(() => {
    async function check() {
      const u = await validateSession();
      if (!u) {
        clearAuthAndRedirect();
        return;
      }
      // Strictly allow ONLY farmer role (admin can be allowed if explicitly needed, but for now strict is safer)
      if (u.role !== "farmer") {
        clearAuthAndRedirect();
        return;
      }
      setUser(u);
      checkSub(u);
    }
    check();
  }, []);

  const checkSub = async (u: User) => {
    try {
      const justPaid = new URLSearchParams(window.location.search).get("subscription")==="success";
      const { data } = await api.get("/subscriptions/my");
      setSub(data);
      if (!justPaid && !data.isActive) { router.push("/subscription"); return; }
    } catch { /* allow */ }
    loadAll();
  };

  const loadAll = async () => {
    try {
      const [profR,ordR,prodR,disR,wR] = await Promise.allSettled([
        profileAPI.getMe(),
        orderAPI.getFarmerOrders("All"),
        productAPI.getMyProducts(),
        diseaseAPI.getMy(),
        api.get("/weather/my"),
      ]);
      if (profR.status==="fulfilled") {
        const p = profR.value.data;
        setProfile(p);
        setEditForm({ name:p.user?.name||"", farmName:p.farmName||"", phone:p.phone||"",
          district:p.district||"Colombo", state:p.state||"", village:p.village||"",
          bio:p.bio||"", farmSize:p.farmSize?.toString()||"",
          farmSizeUnit:p.farmSizeUnit||"acres", farmingType:p.farmingType||"", experience:p.experience||0 });
      }
      if (ordR.status==="fulfilled") {
        const ords:Order[] = ordR.value.data.orders||[];
        setRecentOrders(ords.slice(0,6));
        setPendingCount(ords.filter(o=>o.orderStatus==="Placed"||o.orderStatus==="Confirmed").length);
        setTotalEarnings(ords.filter(o=>o.orderStatus==="Delivered").reduce((a,o)=>a+o.totalPrice,0));
      }
      if (prodR.status==="fulfilled") {
        const raw = prodR.value.data?.products||prodR.value.data||[];
        setProducts(Array.isArray(raw)?raw:[]);
      }
      if (disR.status==="fulfilled") setDiseases(disR.value.data?.diseases||disR.value.data||[]);
      if (wR.status==="fulfilled")   setWeatherAlerts(wR.value.data?.alerts||wR.value.data||[]);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    setSaving(true); setSaveMsg("");
    try {
      const { data } = await profileAPI.save({
        farmName:editForm.farmName, phone:editForm.phone, district:editForm.district,
        state:editForm.state, village:editForm.village, bio:editForm.bio,
        farmSize:editForm.farmSize?Number(editForm.farmSize):undefined,
        farmSizeUnit:editForm.farmSizeUnit, farmingType:editForm.farmingType,
        experience:editForm.experience,
      });
      setProfile(data.profile);
      const u = JSON.parse(localStorage.getItem("agriai_user")||"{}");
      u.name = editForm.name;
      localStorage.setItem("agriai_user",JSON.stringify(u));
      setUser(prev=>prev?{...prev,name:editForm.name}:prev);
      setSaveMsg("Profile saved!"); setEditMode(false);
    } catch (err:any) {
      setSaveMsg(err.response?.data?.message||"Save failed.");
    } finally { setSaving(false); }
  };

  const handleLogout = () => {
    clearAuthAndRedirect();
  };

  const greeting = () => { const h=new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening"; };
  const getInitial = () => (user?.name||"F")[0].toUpperCase();

  const showSubWarn = sub?.isActive && sub?.currentPeriodEnd &&
    Math.ceil((new Date(sub.currentPeriodEnd).getTime()-Date.now())/86400000)<=3;

  const activeProds   = products.filter(p=>p.status==="Active"||p.status==="approved").length;
  const activeAlerts  = diseases.filter(d=>d.status!=="resolved").length;
  const latestAlert   = weatherAlerts[0];
  const latestDisease = diseases[0];

  // Fake sparklines (replace with real time-series if you have it)
  const earningsSpark = [40,55,35,70,60,80,totalEarnings/1000||50].map(v=>Math.max(v,0));
  const ordersSpark   = [2,5,3,8,6,pendingCount+4,pendingCount+2];

  // ── Input / label styles ──────────────────────────────────
  const labelCss:React.CSSProperties = { fontSize:10, fontWeight:700, color:"#9b9086", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 };
  const inputCss:React.CSSProperties = { width:"100%", padding:"9px 12px", border:"1.5px solid #e0ddd6", borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#1a3a2a", background:"#f9f7f4", outline:"none", boxSizing:"border-box" };

  const SBW = sideCollapsed ? 68 : 220; // sidebar width

  // ── Loading screen ────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#f4f0e8,#eef5ec)", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#1a3a2a,#6aaa78)", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={22} style={{color:"#fff"}} />
        </div>
        <div style={{ color:"#2d5a3d", fontWeight:700, fontSize:15 }}>Loading your farm…</div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Global CSS injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;background:#f2efe8;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#d0cdc6;border-radius:10px;}
        .nav-btn:hover{background:rgba(106,170,120,.12)!important;color:rgba(255,255,255,.9)!important;}
        .card-hover:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(26,58,42,.12)!important;}
        .hover-btn:hover{opacity:.85;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp .35s ease both;}
        .fade-up-1{animation-delay:.05s;} .fade-up-2{animation-delay:.1s;}
        .fade-up-3{animation-delay:.15s;} .fade-up-4{animation-delay:.2s;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}
        .pulse{animation:pulse 2s infinite;}
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:"#f2efe8" }}>

        {/* ════════════ SIDEBAR ════════════ */}
        <aside style={{
          width:SBW, background:"linear-gradient(185deg,#1a3a2a 0%,#122a1c 60%,#0a1e11 100%)",
          display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, bottom:0, zIndex:60,
          transition:"width .28s cubic-bezier(.4,0,.2,1)", overflow:"hidden",
          boxShadow:"4px 0 24px rgba(0,0,0,.18)",
        }}>
          {/* Logo row */}
          <div style={{ padding:sideCollapsed?"18px 0":"20px 20px 16px", borderBottom:"1px solid rgba(255,255,255,.07)",
            display:"flex", alignItems:"center", justifyContent:sideCollapsed?"center":"space-between" }}>
            {!sideCollapsed && (
              <div
                onClick={()=>router.push("/")}
                style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:22, color:"#fff", letterSpacing:"-0.5px", cursor:"pointer", userSelect:"none" }}>
                Ag<span style={{ color:"#6aaa78" }}>real</span>
              </div>
            )}
            <button onClick={()=>setSideCollapsed(p=>!p)}
              style={{ background:"rgba(255,255,255,.07)", border:"none", borderRadius:8,
                width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", color:"rgba(255,255,255,.5)", flexShrink:0, transition:"all .2s" }}
              className="hover-btn">
              <Icon d={sideCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} size={14} />
            </button>
          </div>

          {/* User card */}
          <div style={{ padding:sideCollapsed?"14px 0":"14px 16px", borderBottom:"1px solid rgba(255,255,255,.07)",
            cursor:"pointer", transition:"background .2s", display:sideCollapsed?"flex":"block",
            justifyContent:"center" }}
            onClick={()=>setShowProfile(true)}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,.05)")}
            onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
            <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:sideCollapsed?"center":"flex-start" }}>
              <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0,
                background:"linear-gradient(135deg,#6aaa78,#2d5a3d)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, fontWeight:700, color:"#fff", border:"2px solid rgba(255,255,255,.15)" }}>
                {getInitial()}
              </div>
              {!sideCollapsed && (
                <div style={{ overflow:"hidden" }}>
                  <div style={{ color:"#fff", fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.name||"Farmer"}</div>
                  <div style={{ color:"rgba(255,255,255,.4)", fontSize:10, marginTop:1 }}>{profile?.farmName||profile?.district||"My Farm"}</div>
                  {sub?.isActive && (
                    <div style={{ marginTop:4, display:"inline-flex", alignItems:"center", gap:3,
                      background:"rgba(106,170,120,.25)", borderRadius:99,
                      padding:"1px 8px", fontSize:9, color:"#6aaa78", fontWeight:700 }}>
                      <span className="pulse" style={{ width:5, height:5, borderRadius:"50%", background:"#6aaa78", display:"inline-block" }} />
                      {sub.status==="trialing"?"Free Trial":"Active"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
            {!sideCollapsed && <div style={{ padding:"10px 16px 4px", fontSize:9, fontWeight:700, color:"rgba(255,255,255,.25)", textTransform:"uppercase", letterSpacing:".1em" }}>Navigation</div>}
            {NAV.map(item=>{
              const active = pathname===item.href;
              return (
                <button key={item.href} onClick={()=>router.push(item.href)}
                  className="nav-btn"
                  title={sideCollapsed?item.label:undefined}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:10,
                    padding:sideCollapsed?"12px 0":"9px 16px",
                    justifyContent:sideCollapsed?"center":"flex-start",
                    border:"none",
                    background:active?"rgba(106,170,120,.18)":"transparent",
                    borderLeft:active?"3px solid #6aaa78":"3px solid transparent",
                    color:active?"#fff":"rgba(255,255,255,.5)",
                    fontSize:13, fontWeight:active?600:400,
                    cursor:"pointer", transition:"all .18s", textAlign:"left",
                  }}>
                  <Icon d={item.icon} size={17} style={{ flexShrink:0 }} />
                  {!sideCollapsed && <span>{item.label}</span>}
                  {!sideCollapsed && active && (
                    <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:"#6aaa78" }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{ padding:"10px 0", borderTop:"1px solid rgba(255,255,255,.07)" }}>
            {[
              { label:"Settings", href:"/dashboard/farmer/settings", d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map(i=>(
              <button key={i.href} onClick={()=>router.push(i.href)} className="nav-btn"
                title={sideCollapsed?i.label:undefined}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:10, justifyContent:sideCollapsed?"center":"flex-start",
                  padding:sideCollapsed?"11px 0":"9px 16px", border:"none", background:"transparent",
                  color:"rgba(255,255,255,.4)", fontSize:13, cursor:"pointer", transition:"all .18s" }}>
                <Icon d={i.d} size={16} style={{ flexShrink:0 }} />
                {!sideCollapsed && <span>{i.label}</span>}
              </button>
            ))}
            <button onClick={handleLogout} className="nav-btn"
              title={sideCollapsed?"Sign Out":undefined}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, justifyContent:sideCollapsed?"center":"flex-start",
                padding:sideCollapsed?"11px 0":"9px 16px", border:"none", background:"transparent",
                color:"#f87171", fontSize:13, cursor:"pointer", fontWeight:600, transition:"all .18s" }}>
              <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={16} style={{ flexShrink:0 }} />
              {!sideCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* ════════════ MAIN ════════════ */}
        <main style={{ marginLeft:SBW, flex:1, display:"flex", flexDirection:"column", transition:"margin-left .28s cubic-bezier(.4,0,.2,1)" }}>

          {/* Sub warning */}
          {showSubWarn && (
            <div style={{ background:"linear-gradient(90deg,#fef3c7,#fde68a)", borderBottom:"1px solid #fbbf24",
              padding:"10px 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:13, color:"#78350f", fontWeight:600 }}>
                Subscription expires {new Date(sub.currentPeriodEnd).toLocaleDateString("en-US",{month:"long",day:"numeric"})}
              </span>
              <button onClick={()=>router.push("/dashboard/farmer/earnings")} className="hover-btn"
                style={{ background:"#d97706", color:"#fff", border:"none", borderRadius:7, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                Renew Now
              </button>
            </div>
          )}

          {/* ── Topbar ── */}
          <header style={{ background:"rgba(255,255,255,.9)", backdropFilter:"blur(12px)",
            borderBottom:"1px solid rgba(0,0,0,.07)", padding:"14px 32px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            position:"sticky", top:0, zIndex:40 }}>

            {/* Left: back button + page title */}
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              {/* Back button — only shown on sub-pages, not on overview */}
              {pathname !== "/dashboard/farmer" && (
                <button onClick={()=>router.back()} className="hover-btn"
                  title="Go back"
                  style={{ display:"flex", alignItems:"center", justifyContent:"center",
                    width:36, height:36, borderRadius:10, background:"#f4f0e8",
                    border:"1px solid #e0ddd6", cursor:"pointer", flexShrink:0 }}>
                  <Icon d="M15 19l-7-7 7-7" size={16} style={{color:"#1a3a2a"}} />
                </button>
              )}
              <div>
                {pathname === "/dashboard/farmer" ? (
                  <>
                    <div style={{ fontSize:19, fontWeight:700, color:"#1c2b22", letterSpacing:"-.3px" }}>
                      {greeting()}, <span style={{ color:"#2d5a3d" }}>{user?.name?.split(" ")[0]}</span>
                    </div>
                    <div style={{ fontSize:12, color:"#9b9590", marginTop:2 }}>
                      {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
                      {profile?.district ? ` · ${profile.district}` : ""}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize:18, fontWeight:700, color:"#1c2b22", letterSpacing:"-.3px" }}>
                      {NAV.find(n=>pathname.startsWith(n.href) && n.href !== "/dashboard/farmer")?.label
                        || (pathname.includes("settings") ? "Settings" : "Dashboard")}
                    </div>
                    <div style={{ fontSize:12, color:"#9b9590", marginTop:2 }}>
                      {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
                      {profile?.district ? ` · ${profile.district}` : ""}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: actions + avatar */}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {/* Quick action buttons — only on overview */}
              {pathname === "/dashboard/farmer" && (
                <>
                  <button onClick={()=>router.push("/dashboard/farmer/products")} className="hover-btn"
                    style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:"#f4f0e8",
                      border:"1px solid #e0ddd6", borderRadius:99, fontSize:12, fontWeight:600, color:"#1a3a2a", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, width:"auto", height:"auto" }}>
                    <Icon d="M12 4v16m8-8H4" size={14} />
                    Add Product
                  </button>
                  <button onClick={()=>router.push("/dashboard/farmer/crop-doctor")} className="hover-btn"
                    style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
                      background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", border:"none",
                      borderRadius:99, fontSize:12, fontWeight:600, color:"#fff", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, width:"auto", height:"auto" }}>
                    <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={14} />
                    Scan Crop
                  </button>
                </>
              )}
              {pendingCount > 0 && (
                <button onClick={()=>router.push("/dashboard/farmer/orders")} className="hover-btn"
                  style={{ position:"relative", width:38, height:38, borderRadius:"50%",
                    background:"#fff", border:"1px solid #e0ddd6", display:"flex", alignItems:"center",
                    justifyContent:"center", cursor:"pointer" }}>
                  <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size={16} style={{color:"#1a3a2a"}} />
                  <span style={{ position:"absolute", top:-3, right:-3, width:16, height:16, borderRadius:"50%",
                    background:"#ef4444", fontSize:9, fontWeight:700, color:"#fff",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>{pendingCount}</span>
                </button>
              )}
              <div onClick={()=>setShowProfile(true)}
                style={{ width:38, height:38, borderRadius:"50%",
                  background:"linear-gradient(135deg,#6aaa78,#2d5a3d)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer",
                  border:"2px solid rgba(255,255,255,.8)", boxShadow:"0 2px 8px rgba(45,90,61,.3)" }}>
                {getInitial()}
              </div>
            </div>
          </header>

          {/* ── Dashboard body ── */}
          <div style={{ padding:"28px 32px", flex:1, overflowY:"auto" }}>

            {/* ── Hero banner ── */}
            <div className="fade-up" style={{ position:"relative", overflow:"hidden",
              background:"linear-gradient(135deg,#1a3a2a 0%,#2d5a3d 55%,#3a7a50 100%)",
              borderRadius:20, padding:"28px 32px", marginBottom:24, color:"#fff" }}>
              {/* Decorative circles */}
              <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(106,170,120,.12)" }} />
              <div style={{ position:"absolute", bottom:-30, right:80, width:120, height:120, borderRadius:"50%", background:"rgba(106,170,120,.08)" }} />

              <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
                <div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.55)", marginBottom:6, fontWeight:600, letterSpacing:".08em", textTransform:"uppercase" }}>
                    {profile?.district||"Your district"}, Sri Lanka
                  </div>
                  {latestAlert ? (
                    <>
                      <div style={{ fontSize:20, fontWeight:700, marginBottom:6 }}>
                        Weather alert: {latestAlert.district}
                      </div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", maxWidth:380, lineHeight:1.6 }}>
                        {latestAlert.message}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize:20, fontWeight:700, marginBottom:6 }}>
                        All clear for your region
                      </div>
                      <div style={{ fontSize:13, color:"rgba(255,255,255,.7)" }}>
                        No weather alerts. Good day to work your farm.
                      </div>
                    </>
                  )}
                  {latestDisease && latestDisease.status !== "resolved" && (
                    <div style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:8,
                      background:"rgba(251,191,36,.15)", border:"1px solid rgba(251,191,36,.3)",
                      borderRadius:9, padding:"7px 14px" }}>
                      <div className="pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#fbbf24", flexShrink:0 }} />
                      <span style={{ fontSize:12, fontWeight:600, color:"#fde68a" }}>
                        Disease alert: {latestDisease.cropName} — {latestDisease.diagnosis}
                      </span>
                      <button onClick={()=>router.push("/dashboard/farmer/crop-doctor")} className="hover-btn"
                        style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff",
                          borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                        Treat
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"flex-end" }}>
                  <button onClick={()=>router.push("/dashboard/farmer/weather")} className="hover-btn"
                    style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)",
                      color:"#fff", borderRadius:10, padding:"9px 18px", fontSize:12,
                      fontWeight:600, cursor:"pointer" }}>
                    View Weather
                  </button>
                  <button onClick={()=>setShowPackages(true)} className="hover-btn"
                    style={{ background:"#6aaa78", border:"none",
                      color:"#fff", borderRadius:10, padding:"9px 18px", fontSize:12,
                      fontWeight:700, cursor:"pointer" }}>
                    View Plans
                  </button>
                </div>
              </div>
            </div>

            {/* ── Stat cards ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
              {[
                { label:"Active Listings",  value:activeProds,                              sub:`${products.length} total products`,          accent:"#6aaa78", spark:[3,5,4,7,6,activeProds+1,activeProds], cls:"fade-up fade-up-1", href:"/dashboard/farmer/products" },
                { label:"Total Earnings",   value:`Rs.${(totalEarnings/1000).toFixed(1)}K`, sub:"From delivered orders",                      accent:"#d4a853", spark:earningsSpark, cls:"fade-up fade-up-2", href:"/dashboard/farmer/earnings" },
                { label:"Pending Orders",   value:pendingCount,                             sub:pendingCount>0?"Needs attention":"All clear",   accent:pendingCount>0?"#ef4444":"#6aaa78", spark:ordersSpark, cls:"fade-up fade-up-3", href:"/dashboard/farmer/orders" },
                { label:"Disease Alerts",   value:activeAlerts,                             sub:latestDisease?latestDisease.cropName:"No issues", accent:activeAlerts>0?"#f59e0b":"#6aaa78", spark:[1,0,2,1,3,activeAlerts,activeAlerts], cls:"fade-up fade-up-4", href:"/dashboard/farmer/crop-doctor" },
              ].map(s=>(
                <div key={s.label} className={s.cls}>
                  <StatCard label={s.label} value={s.value} sub={s.sub} accent={s.accent}
                    spark={s.spark} onClick={()=>router.push(s.href)} />
                </div>
              ))}
            </div>

            {/* ── Middle row: Orders + Disease ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:20, marginBottom:20 }}>

              {/* Recent Orders */}
              <div className="fade-up" style={{ background:"#fff", borderRadius:18, border:"1px solid #eeebe4",
                boxShadow:"0 2px 10px rgba(0,0,0,.04)", overflow:"hidden" }}>
                <div style={{ padding:"18px 22px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #f4f0ec" }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:"#1c2b22" }}>Recent Orders</div>
                    <div style={{ fontSize:11, color:"#9b9590", marginTop:2 }}>{recentOrders.length} orders shown</div>
                  </div>
                  <button onClick={()=>router.push("/dashboard/farmer/orders")} className="hover-btn"
                    style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px",
                      background:"#f4f0e8", border:"none", borderRadius:8, fontSize:12,
                      fontWeight:600, color:"#1a3a2a", cursor:"pointer" }}>
                    View all
                    <Icon d="M9 5l7 7-7 7" size={12} />
                  </button>
                </div>
                {recentOrders.length === 0 ? (
                  <div style={{ padding:"48px 24px", textAlign:"center" }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:"#f4f0e8",
                      display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                      <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size={22} style={{color:"#c0bdb5"}} />
                    </div>
                    <div style={{ fontSize:13, color:"#9b9590" }}>No orders yet</div>
                  </div>
                ) : recentOrders.map((o,i)=>(
                  <div key={o._id}
                    style={{ padding:"13px 22px", display:"flex", alignItems:"center", gap:14,
                      borderBottom:i<recentOrders.length-1?"1px solid #f8f5f0":"none",
                      transition:"background .15s", cursor:"pointer" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="#fafaf8")}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                    onClick={()=>router.push("/dashboard/farmer/orders")}>
                    <div style={{ width:38, height:38, borderRadius:10, background:"#f0f8f2",
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={16} style={{color:"#6aaa78"}} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#1c2b22", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {o.cropName} · {o.quantity}kg
                      </div>
                      <div style={{ fontSize:11, color:"#9b9590", marginTop:1 }}>
                        #{o.orderNumber} · {o.consumer?.name}
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#1a3a2a" }}>Rs.{o.totalPrice.toLocaleString()}</div>
                      <div style={{ marginTop:3 }}><StatusBadge s={o.orderStatus} /></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disease + Scan CTA */}
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {/* Scan CTA */}
                <div className="fade-up"
                  onClick={()=>router.push("/dashboard/farmer/crop-doctor")}
                  style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", borderRadius:18,
                    padding:"20px 22px", cursor:"pointer", position:"relative", overflow:"hidden",
                    border:"1px solid rgba(106,170,120,.2)" }}>
                  <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(106,170,120,.1)" }} />
                  <div style={{ position:"relative" }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:"rgba(106,170,120,.25)",
                      display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
                      <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={20} style={{color:"#6aaa78"}} />
                    </div>
                    <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:4 }}>AI Crop Scanner</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.6)", marginBottom:14 }}>
                      Upload a photo for instant disease diagnosis
                    </div>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                      background:"#6aaa78", borderRadius:8, padding:"8px 14px",
                      fontSize:12, fontWeight:700, color:"#fff" }}>
                      Scan Now
                      <Icon d="M9 5l7 7-7 7" size={12} />
                    </div>
                  </div>
                </div>

                {/* Disease list */}
                <div className="fade-up" style={{ background:"#fff", borderRadius:18, border:"1px solid #eeebe4",
                  boxShadow:"0 2px 10px rgba(0,0,0,.04)", flex:1, overflow:"hidden" }}>
                  <div style={{ padding:"16px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #f4f0ec" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#1c2b22" }}>Disease History</div>
                    <button onClick={()=>router.push("/dashboard/farmer/crop-doctor")} className="hover-btn"
                      style={{ background:"none", border:"none", fontSize:11, color:"#6aaa78", cursor:"pointer", fontWeight:600 }}>
                      See all
                    </button>
                  </div>
                  {diseases.length===0 ? (
                    <div style={{ padding:"24px", textAlign:"center", color:"#b0ada8", fontSize:12 }}>No scans yet</div>
                  ) : diseases.slice(0,3).map(d=>(
                    <div key={d._id} style={{ padding:"11px 20px", display:"flex", alignItems:"center", gap:12,
                      borderBottom:"1px solid #f8f5f0", transition:"background .12s" }}
                      onMouseEnter={e=>(e.currentTarget.style.background="#fafaf8")}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
                        background:d.status==="resolved"?"#6aaa78":"#f59e0b" }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:"#1c2b22", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.cropName}</div>
                        <div style={{ fontSize:11, color:"#9b9590" }}>{d.diagnosis}</div>
                      </div>
                      <StatusBadge s={d.status||"Active"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Bottom row: Products + Subscription ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>

              {/* Products */}
              <div className="fade-up" style={{ background:"#fff", borderRadius:18, border:"1px solid #eeebe4",
                boxShadow:"0 2px 10px rgba(0,0,0,.04)", overflow:"hidden" }}>
                <div style={{ padding:"18px 22px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #f4f0ec" }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:"#1c2b22" }}>My Products</div>
                    <div style={{ fontSize:11, color:"#9b9590", marginTop:2 }}>{activeProds} active · {products.length} total</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>router.push("/dashboard/farmer/products")} className="hover-btn"
                      style={{ padding:"6px 12px", background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
                        border:"none", borderRadius:8, fontSize:12, fontWeight:600,
                        color:"#fff", cursor:"pointer" }}>
                      + Add
                    </button>
                    <button onClick={()=>router.push("/dashboard/farmer/products")} className="hover-btn"
                      style={{ padding:"6px 12px", background:"#f4f0e8",
                        border:"none", borderRadius:8, fontSize:12, fontWeight:600,
                        color:"#1a3a2a", cursor:"pointer" }}>
                      Manage
                    </button>
                  </div>
                </div>
                {products.length===0 ? (
                  <div style={{ padding:"48px 24px", textAlign:"center" }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:"#f4f0e8",
                      display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                      <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={22} style={{color:"#c0bdb5"}} />
                    </div>
                    <div style={{ fontSize:13, color:"#9b9590", marginBottom:12 }}>No products listed</div>
                    <button onClick={()=>router.push("/dashboard/farmer/products")} className="hover-btn"
                      style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", color:"#fff",
                        border:"none", borderRadius:9, padding:"9px 20px", fontSize:12,
                        fontWeight:700, cursor:"pointer" }}>
                      List your first product
                    </button>
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14, padding:"18px 22px" }}>
                    {products.slice(0,6).map(p=>(
                      <div key={p._id} className="card-hover"
                        onClick={()=>router.push("/dashboard/farmer/products")}
                        style={{ borderRadius:12, border:"1px solid #f0ede8", overflow:"hidden",
                          cursor:"pointer", transition:"all .22s", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                        <div style={{ height:90, background:p.imageUrl?"#f0f8f2":"linear-gradient(135deg,#f0f8f2,#e8f5e9)",
                          display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                          {p.imageUrl ? (
                            <img src={`http://localhost:5000${p.imageUrl}`} alt={p.cropName}
                              style={{ width:"100%", height:"100%", objectFit:"cover" }}
                              onError={e=>{(e.target as HTMLImageElement).style.display="none";}} />
                          ) : (
                            <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={28} style={{color:"#a8d5b5"}} />
                          )}
                        </div>
                        <div style={{ padding:"10px 12px" }}>
                          <div style={{ fontSize:12, fontWeight:700, color:"#1c2b22", marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.cropName}</div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <span style={{ fontSize:12, fontWeight:700, color:"#2d5a3d" }}>Rs.{p.price}<span style={{fontSize:10,fontWeight:400,color:"#9b9590"}}>/kg</span></span>
                            <StatusBadge s={p.status} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subscription card */}
              <div className="fade-up" style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ background:"linear-gradient(145deg,#1a3a2a,#2d5a3d,#1a3a2a)", borderRadius:18,
                  padding:"24px", border:"1px solid rgba(106,170,120,.2)",
                  position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-30, right:-30, width:140, height:140, borderRadius:"50%", background:"rgba(106,170,120,.08)" }} />
                  <div style={{ position:"absolute", bottom:-20, left:-20, width:80, height:80, borderRadius:"50%", background:"rgba(212,168,83,.06)" }} />
                  <div style={{ position:"relative" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.4)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:8 }}>Current Plan</div>
                    <div style={{ fontSize:20, fontWeight:700, color:"#fff", marginBottom:4 }}>
                      {sub?.status==="trialing"?"Free Trial":sub?.isActive?"Pro Farmer":"No Plan"}
                    </div>
                    {sub?.currentPeriodEnd && (
                      <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", marginBottom:16 }}>
                        {sub.cancelAtPeriodEnd?"Cancels":"Renews"}{" "}
                        {new Date(sub.currentPeriodEnd).toLocaleDateString("en-US",{month:"long",day:"numeric"})}
                      </div>
                    )}
                    {sub?.isActive && (
                      <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:18 }}>
                        {["Unlimited listings","Unlimited scanning","Priority support"].map(f=>(
                          <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"rgba(255,255,255,.7)" }}>
                            <div style={{ width:16, height:16, borderRadius:"50%", background:"rgba(106,170,120,.25)",
                              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <Icon d="M5 13l4 4L19 7" size={9} style={{color:"#6aaa78"}} />
                            </div>
                            {f}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      <button onClick={()=>setShowPackages(true)} className="hover-btn"
                        style={{ background:"#6aaa78", color:"#fff", border:"none",
                          borderRadius:9, padding:"10px 8px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                        View Plans
                      </button>
                      <button onClick={()=>router.push("/dashboard/farmer/earnings")} className="hover-btn"
                        style={{ background:"rgba(255,255,255,.1)", color:"#fff",
                          border:"1px solid rgba(255,255,255,.15)", borderRadius:9,
                          padding:"10px 8px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                        Manage
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick links */}
                <div style={{ background:"#fff", borderRadius:18, border:"1px solid #eeebe4",
                  boxShadow:"0 2px 10px rgba(0,0,0,.04)", padding:"16px 20px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1c2b22", marginBottom:12 }}>Quick Actions</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[
                      { label:"View all orders",   href:"/dashboard/farmer/orders",      d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                      { label:"Check weather",      href:"/dashboard/farmer/weather",     d:"M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
                      { label:"View earnings",      href:"/dashboard/farmer/earnings",    d:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                      { label:"Edit my profile",    href:"#",                             d:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", action:()=>setShowProfile(true) },
                    ].map(q=>(
                      <button key={q.label} className="hover-btn"
                        onClick={q.action || (()=>router.push(q.href))}
                        style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                          background:"#f9f7f4", border:"1px solid #f0ede8", borderRadius:9,
                          cursor:"pointer", fontSize:12, fontWeight:600, color:"#1a3a2a",
                          textAlign:"left", width:"100%", transition:"all .15s" }}>
                        <div style={{ width:28, height:28, borderRadius:8, background:"#e8f5e9",
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Icon d={q.d} size={14} style={{color:"#2d5a3d"}} />
                        </div>
                        {q.label}
                        <Icon d="M9 5l7 7-7 7" size={12} style={{marginLeft:"auto",color:"#9b9590"}} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ════════════ PROFILE SLIDE PANEL ════════════ */}
        {showProfile && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:100,
            display:"flex", justifyContent:"flex-end" }}
            onClick={e=>{ if(e.target===e.currentTarget) setShowProfile(false); }}>
            <div style={{ width:420, background:"#fff", height:"100%", overflowY:"auto",
              boxShadow:"-12px 0 40px rgba(0,0,0,.18)", animation:"fadeUp .25s ease" }}>

              <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", padding:"28px 24px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>My Profile</div>
                  <button onClick={()=>setShowProfile(false)}
                    style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff",
                      width:30, height:30, borderRadius:"50%", cursor:"pointer", fontSize:14,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon d="M6 18L18 6M6 6l12 12" size={14} />
                  </button>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:60, height:60, borderRadius:"50%",
                    background:"linear-gradient(135deg,#6aaa78,#2d5a3d)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:24, fontWeight:700, color:"#fff", border:"3px solid rgba(255,255,255,.25)" }}>
                    {getInitial()}
                  </div>
                  <div>
                    <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>{user?.name}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,.55)", marginTop:2 }}>{user?.email}</div>
                  </div>
                </div>
              </div>

              {sub && (
                <div style={{ padding:"12px 22px", borderBottom:"1px solid #f0ede8",
                  background:sub.isActive?"#f0fdf4":"#fff1f1",
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:sub.isActive?"#166534":"#dc2626" }}>
                      {sub.isActive?"Subscription Active":"No Active Subscription"}
                    </div>
                    {sub.currentPeriodEnd && (
                      <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>
                        {sub.cancelAtPeriodEnd?"Cancels":"Renews"} {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <button onClick={()=>router.push("/dashboard/farmer/earnings")} className="hover-btn"
                    style={{ background:sub.isActive?"#1a3a2a":"#dc2626",
                      color:"#fff", border:"none", borderRadius:8,
                      padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                    {sub.isActive?"Manage":"Subscribe"}
                  </button>
                </div>
              )}

              <div style={{ padding:"20px 22px" }}>
                <div style={{ display:"flex", gap:8, marginBottom:18, background:"#f4f0e8", padding:4, borderRadius:10 }}>
                  {[["View",false],["Edit",true]].map(([label,mode])=>(
                    <button key={String(label)} onClick={()=>setEditMode(mode as boolean)}
                      style={{ flex:1, padding:"8px", borderRadius:8, border:"none",
                        background:editMode===mode?"#fff":"transparent",
                        color:editMode===mode?"#1a3a2a":"#6b8070",
                        fontSize:13, fontWeight:600, cursor:"pointer",
                        boxShadow:editMode===mode?"0 1px 4px rgba(0,0,0,.08)":"none" }}>
                      {label}
                    </button>
                  ))}
                </div>

                {!editMode ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {[
                      ["Farm Name",    profile?.farmName    ||"Not set"],
                      ["District",     profile?.district    ||"Not set"],
                      ["Village",      profile?.village     ||"Not set"],
                      ["Phone",        profile?.phone       ||"Not set"],
                      ["Farm Size",    profile?.farmSize?`${profile.farmSize} ${profile.farmSizeUnit||"acres"}`:"Not set"],
                      ["Farming Type", profile?.farmingType ||"Not set"],
                      ["Experience",   profile?.experience?`${profile.experience} years`:"Not set"],
                      ["Bio",          profile?.bio         ||"Not set"],
                    ].map(([label,value])=>(
                      <div key={label} style={{ padding:"11px 14px", background:"#f9f7f4", borderRadius:10,
                        display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:"#a09a90", textTransform:"uppercase", letterSpacing:".06em", flexShrink:0 }}>{label}</span>
                        <span style={{ fontSize:13, color:"#1c2b22", fontWeight:500, textAlign:"right" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {saveMsg && (
                      <div style={{ padding:"10px 14px", borderRadius:9,
                        background:saveMsg.includes("saved")?"#e8f5e9":"#fff0f0",
                        color:saveMsg.includes("saved")?"#16a34a":"#c0392b", fontSize:13, fontWeight:600 }}>
                        {saveMsg}
                      </div>
                    )}
                    {([
                      ["Farm Name","farmName","text","Perera Farm"],
                      ["Phone","phone","tel","+94 77 123 4567"],
                      ["Village","village","text","Peradeniya"],
                      ["Farm Size","farmSize","number","2.5"],
                      ["Experience (years)","experience","number","5"],
                    ] as [string,string,string,string][]).map(([label,field,type,ph])=>(
                      <div key={field}>
                        <label style={{ fontSize:10, fontWeight:700, color:"#9b9086", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>{label}</label>
                        <input type={type} value={(editForm as any)[field]}
                          onChange={e=>setEditForm(prev=>({...prev,[field]:type==="number"?Number(e.target.value):e.target.value}))}
                          placeholder={ph}
                          style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e0ddd6", borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#1a3a2a", background:"#f9f7f4", outline:"none", boxSizing:"border-box" }} />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize:10, fontWeight:700, color:"#9b9086", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>District</label>
                      <select value={editForm.district}
                        onChange={e=>setEditForm(prev=>({...prev,district:e.target.value}))}
                        style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e0ddd6", borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#1a3a2a", background:"#f9f7f4", outline:"none" }}>
                        {SL_DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:10, fontWeight:700, color:"#9b9086", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>Farming Type</label>
                      <select value={editForm.farmingType}
                        onChange={e=>setEditForm(prev=>({...prev,farmingType:e.target.value}))}
                        style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e0ddd6", borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#1a3a2a", background:"#f9f7f4", outline:"none" }}>
                        <option value="">Select</option>
                        {["Organic","Conventional","Mixed","Hydroponic","Permaculture"].map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:10, fontWeight:700, color:"#9b9086", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>Bio</label>
                      <textarea value={editForm.bio}
                        onChange={e=>setEditForm(prev=>({...prev,bio:e.target.value}))}
                        placeholder="Tell consumers about your farm..." rows={3}
                        style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e0ddd6", borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#1a3a2a", background:"#f9f7f4", outline:"none", resize:"vertical", boxSizing:"border-box" }} />
                    </div>
                    <button onClick={handleSaveProfile} disabled={saving} className="hover-btn"
                      style={{ padding:"11px", background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
                        color:"#fff", border:"none", borderRadius:9, fontSize:14,
                        fontWeight:700, cursor:"pointer", opacity:saving?0.7:1 }}>
                      {saving?"Saving…":"Save Profile"}
                    </button>
                  </div>
                )}

                <button onClick={handleLogout} className="hover-btn"
                  style={{ width:"100%", marginTop:20, padding:"11px", background:"#fff0f0",
                    color:"#c0392b", border:"1px solid #fcd0d0", borderRadius:9,
                    fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════ PACKAGES MODAL ════════════ */}
        {showPackages && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:200,
            display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
            onClick={e=>{ if(e.target===e.currentTarget) setShowPackages(false); }}>
            <div style={{ background:"#f9f7f3", borderRadius:24, padding:"36px",
              width:"100%", maxWidth:800, maxHeight:"90vh", overflowY:"auto",
              boxShadow:"0 32px 80px rgba(0,0,0,.25)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                <div>
                  <h2 style={{ fontSize:24, fontWeight:800, color:"#1a3a2a", margin:0, fontFamily:"'Playfair Display',serif" }}>Choose Your Plan</h2>
                  <p style={{ color:"#9b9590", fontSize:13, marginTop:6 }}>Start free. Upgrade anytime. No lock-in.</p>
                </div>
                <button onClick={()=>setShowPackages(false)}
                  style={{ background:"#f4f0e8", border:"none", width:36, height:36, borderRadius:"50%",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", color:"#6b8070", flexShrink:0 }}>
                  <Icon d="M6 18L18 6M6 6l12 12" size={16} />
                </button>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginTop:24 }}>
                {PACKAGES.map(pkg=>(
                  <div key={pkg.id} style={{
                    background:pkg.highlight?"linear-gradient(145deg,#1a3a2a,#2d5a3d)":"#fff",
                    borderRadius:18, padding:"24px 20px",
                    border:pkg.highlight?"2px solid rgba(106,170,120,.3)":"1.5px solid #e8e4dc",
                    position:"relative", transition:"all .22s",
                  }}
                  className="card-hover">
                    {pkg.highlight && (
                      <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
                        background:"linear-gradient(90deg,#d4a853,#f0c96b)",
                        color:"#1a3a2a", fontSize:10, fontWeight:800,
                        padding:"4px 14px", borderRadius:99, whiteSpace:"nowrap",
                        boxShadow:"0 2px 8px rgba(212,168,83,.4)" }}>
                        Most Popular
                      </div>
                    )}
                    <div style={{ fontSize:12, fontWeight:700, color:pkg.highlight?"rgba(255,255,255,.5)":"#9b9590",
                      textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>
                      {pkg.name}
                    </div>
                    <div style={{ marginBottom:16 }}>
                      <span style={{ fontSize:30, fontWeight:800, color:pkg.highlight?"#6aaa78":"#1a3a2a",
                        fontFamily:"'Playfair Display',serif" }}>
                        {pkg.price===0?"Free":`Rs.${pkg.price.toLocaleString()}`}
                      </span>
                      {pkg.price>0 && (
                        <span style={{ fontSize:12, color:pkg.highlight?"rgba(255,255,255,.45)":"#9b9590" }}>
                          /{pkg.period}
                        </span>
                      )}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
                      {pkg.features.map(f=>(
                        <div key={f} style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:12,
                          color:pkg.highlight?"rgba(255,255,255,.75)":"#6b8070" }}>
                          <div style={{ width:16, height:16, borderRadius:"50%", flexShrink:0, marginTop:1,
                            background:pkg.highlight?"rgba(106,170,120,.2)":"#e8f5e9",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Icon d="M5 13l4 4L19 7" size={9} style={{color:pkg.highlight?"#6aaa78":"#2d6a35"}} />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>router.push(pkg.price===0?"/dashboard/farmer":"/subscription")}
                      className="hover-btn"
                      style={{
                        width:"100%", padding:"11px",
                        background:pkg.highlight?"#6aaa78":pkg.id==="free"?"#f4f0e8":"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
                        color:pkg.id==="free"&&!pkg.highlight?"#1a3a2a":"#fff",
                        border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer",
                      }}>
                      {pkg.price===0?"Start Free Trial":"Get Started"}
                    </button>
                  </div>
                ))}
              </div>

              <p style={{ textAlign:"center", fontSize:11, color:"#b0ada8", marginTop:20 }}>
                All plans include a 7-day free trial. Cancel anytime. Prices in LKR (Sri Lanka).
              </p>
            </div>
          </div>
        )}

      </div>
    </>
  );
}