"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

// ── Types ──────────────────────────────────────────────────
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface Profile {
  farmName: string;
  district: string;
  avatar: string;
  phone: string;
  address: string;
  bio: string;
  farmSize: string;
  cropTypes: string[];
  experience: number;
  totalSales: number;
  totalOrders: number;
  rating: number;
}

// ── Sidebar nav items ──────────────────────────────────────
// const NAV = [
//   { icon: "🏠", label: "Overview",     key: "overview",  section: "FARMING"  },
//   { icon: "🔬", label: "Crop Doctor",  key: "doctor",    section: ""         },
//   { icon: "🌾", label: "My Products",  key: "products",  section: ""         },
//   { icon: "📦", label: "Orders",       key: "orders",    section: ""         },
//   { icon: "⛈️", label: "Weather",      key: "weather",   section: ""         },
// ];
const NAV = [
  { icon: "🏠", label: "Overview",    href: "/dashboard/farmer" },
  { icon: "🔬", label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor" },
  { icon: "🌾", label: "My Products", href: "/dashboard/farmer/products" },
  { icon: "📦", label: "Orders",      href: "/dashboard/farmer/orders" },
  { icon: "⛈️", label: "Weather",     href: "/dashboard/farmer/weather" },
];
// ── Mock crop data ─────────────────────────────────────────
const CROPS = [
  { name:"Tomato",   field:"Field A (0.5 ac)", planted:"Feb 12", harvest:"Apr 20", progress:65, status:"Growing",     color:"#22c55e", icon:"🍅" },
  { name:"Chili",    field:"Field B (0.3 ac)", planted:"Jan 28", harvest:"Mar 28", progress:88, status:"Near Harvest", color:"#f59e0b", icon:"🌶️" },
  { name:"Broccoli", field:"Field C (0.2 ac)", planted:"Mar 2",  harvest:"May 10", progress:18, status:"Seedling",    color:"#22c55e", icon:"🥦" },
];

const STATUS_COLORS: Record<string, string> = {
  "Growing":     "#dcfce7",
  "Near Harvest":"#fef9c3",
  "Seedling":    "#dbeafe",
};
const STATUS_TEXT: Record<string, string> = {
  "Growing":     "#16a34a",
  "Near Harvest":"#ca8a04",
  "Seedling":    "#1d4ed8",
};

const ACTIVITY = [
  { icon:"🔬", title:"Disease Detected — Tomato",     sub:"Late Blight found in Field A. Tap to view treatment.", time:"2h ago" },
  { icon:"📦", title:"New Order — Broccoli 2kg",      sub:"Amaya De Silva ordered. Confirm to proceed.",          time:"5h ago" },
  { icon:"⛈️", title:"Weather Alert Received",        sub:"Heavy rain warning for Kandy district — tomorrow.",    time:"8h ago" },
  { icon:"💰", title:"Payment Received — Rs. 1,200",  sub:"Chili 1kg × 3 order payment confirmed.",               time:"3d ago" },
];

// ── Main Dashboard ─────────────────────────────────────────
export default function FarmerDashboard() {
  const router = useRouter();
   const pathname = usePathname()
  const [user, setUser]         = useState<User | null>(null);
  const [profile, setProfile]   = useState<Profile | null>(null);
  const [activeNav, setActiveNav] = useState("overview");
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading]   = useState(true);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "", farmName: "", phone: "", district: "",
    address: "", bio: "", farmSize: "", experience: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
    setUser(u);
    fetchProfile(token);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${BASE}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
      setEditForm({
        name:       data.user?.name  || "",
        farmName:   data.farmName    || "",
        phone:      data.phone       || "",
        district:   data.district    || "Colombo",
        address:    data.address     || "",
        bio:        data.bio         || "",
        farmSize:   data.farmSize    || "",
        experience: data.experience  || 0,
      });
    } catch (e) {
      console.error("Profile fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const token = localStorage.getItem("agriai_token");
      const res = await fetch(`${BASE}/profile/me`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) { setSaveMsg(data.message || "Save failed."); return; }
      setProfile(data.profile);
      // Update localStorage name
      const u = JSON.parse(localStorage.getItem("agriai_user") || "{}");
      u.name = editForm.name;
      localStorage.setItem("agriai_user", JSON.stringify(u));
      setUser(u);
      setSaveMsg("✅ Profile saved successfully!");
      setEditMode(false);
    } catch {
      setSaveMsg("❌ Cannot connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitial = () => (user?.name || "F")[0].toUpperCase();

  if (loading) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f4f0e8", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>🌾</div>
          <div style={{ color:"#2d5a3d", fontWeight:600 }}>Loading your farm dashboard…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f4f0e8" }}>

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside style={{
        width:190, background:"linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
        display:"flex", flexDirection:"column", position:"fixed",
        top:0, left:0, bottom:0, zIndex:50,
      }}>
        {/* Logo */}
        <div style={{ padding:"22px 20px 16px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:22, color:"#fff" }}>
            Agri<span style={{ color:"#6aaa78" }}>AI</span>
          </div>
        </div>

        {/* Profile summary */}
        <div
          style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,.08)", cursor:"pointer", transition:"background .2s" }}
          onClick={() => setShowProfile(true)}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.05)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:"#6aaa78", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#fff", flexShrink:0 }}>
              {profile?.avatar ? <img src={profile.avatar} style={{ width:"100%", height:"100%", borderRadius:"50%", objectFit:"cover" }} alt="avatar" /> : getInitial()}
            </div>
            <div>
              <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{user?.name || "Farmer"}</div>
              <div style={{ color:"rgba(255,255,255,.45)", fontSize:11 }}>{profile?.farmName || profile?.district || "My Farm"}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        {/* <nav style={{ flex:1, padding:"12px 0", overflowY:"auto" }}>
          {NAV.map((item, i) => (
            <div key={item.key}>
              {item.section && (
                <div style={{ padding:"12px 20px 4px", fontSize:10, fontWeight:700, color:"rgba(255,255,255,.3)", letterSpacing:".08em", textTransform:"uppercase" }}>
                  {item.section}
                </div>
              )}
              <button
                onClick={() => setActiveNav(item.key)}
                style={{
                  width:"100%", display:"flex", alignItems:"center", gap:10,
                  padding:"10px 20px", border:"none", background:activeNav===item.key ? "rgba(106,170,120,.2)" : "transparent",
                  borderLeft: activeNav===item.key ? "3px solid #6aaa78" : "3px solid transparent",
                  color: activeNav===item.key ? "#fff" : "rgba(255,255,255,.55)",
                  fontSize:13, fontWeight:activeNav===item.key ? 600 : 400,
                  cursor:"pointer", transition:"all .2s", textAlign:"left",
                }}
              >
                <span>{item.icon}</span>{item.label}
              </button>
            </div>
          ))}
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

        {/* Bottom */}
        <div style={{ padding:"12px 0", borderTop:"1px solid rgba(255,255,255,.08)" }}>
          <button style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 20px", border:"none", background:"transparent", color:"rgba(255,255,255,.45)", fontSize:13, cursor:"pointer" }}
            onClick={() => setActiveNav("settings")}>
            ⚙️ Settings
          </button>
          <button style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 20px", border:"none", background:"transparent", color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600 }}
            onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main style={{ marginLeft:190, flex:1, display:"flex", flexDirection:"column" }}>

        {/* Top bar */}
        <header style={{ background:"#fff", borderBottom:"1px solid #e8e4dc", padding:"14px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:40 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:700, color:"#1c2b22" }}>
              {greeting()}, {user?.name?.split(" ")[0]} 🌤️
            </div>
            <div style={{ fontSize:12, color:"#6b8070", marginTop:2 }}>
              {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} · Your farm has {CROPS.length} crops growing
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button style={{ background:"#f4f0e8", border:"1px solid #e0dcd4", borderRadius:9, padding:"8px 16px", fontSize:13, fontWeight:600, color:"#1a3a2a", cursor:"pointer" }}>
              + Add Crop
            </button>
            <button style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", border:"none", borderRadius:9, padding:"8px 16px", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
              🔬 Scan Disease
            </button>
            <div
              style={{ width:36, height:36, borderRadius:"50%", background:"#6aaa78", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer" }}
              onClick={() => setShowProfile(true)}
            >
              {getInitial()}
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div style={{ padding:"28px 32px", flex:1, overflowY:"auto" }}>

          {/* Weather banner */}
          <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", borderRadius:16, padding:"22px 28px", marginBottom:24, color:"#fff", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontSize:12, opacity:.6, marginBottom:4 }}>📍 {profile?.district || "Kandy"}, Sri Lanka</div>
              <div style={{ fontSize:42, fontWeight:900, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>29°C</div>
              <div style={{ fontSize:13, opacity:.7, marginTop:4 }}>Partly Cloudy · Humidity 72%</div>
            </div>
            <div style={{ background:"rgba(255,255,255,.1)", borderRadius:12, padding:"14px 18px", maxWidth:260 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#f0c96b", marginBottom:6 }}>⚠ Alert for Your Crops</div>
              <div style={{ fontSize:13, opacity:.85, lineHeight:1.5 }}>Heavy rain expected tomorrow. Protect your tomato field from waterlogging.</div>
            </div>
            <div style={{ display:"flex", gap:16 }}>
              {[["☀️","29°","Today"],["🌧️","24°","Fri"],["⛅","26°","Sat"],["☀️","31°","Sun"]].map(([icon,temp,day]) => (
                <div key={day} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20 }}>{icon}</div>
                  <div style={{ fontSize:14, fontWeight:600, marginTop:4 }}>{temp}</div>
                  <div style={{ fontSize:11, opacity:.55 }}>{day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
            {[
              { icon:"🌾", num:"3",        label:"Active Crops",       sub:"↑ 1 new this week",       subColor:"#16a34a" },
              { icon:"💰", num:"Rs. 42K",  label:"This Month Earnings", sub:"↑ 18% vs last month",    subColor:"#16a34a" },
              { icon:"📦", num:"7",        label:"Pending Orders",      sub:"↓ 2 need action",         subColor:"#ef4444" },
              { icon:"🔬", num:"1",        label:"Disease Alert",       sub:"⚠ Needs attention",       subColor:"#f59e0b" },
            ].map(s => (
              <div key={s.label} style={{ background:"#fff", borderRadius:14, padding:"20px 22px", boxShadow:"0 2px 10px rgba(0,0,0,.05)", border:"1px solid #f0ede8" }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:28, fontWeight:800, color:"#1c2b22", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.num}</div>
                <div style={{ fontSize:12, color:"#6b8070", margin:"4px 0" }}>{s.label}</div>
                <div style={{ fontSize:11, color:s.subColor, fontWeight:600 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* My Crops + Recent Activity */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>

            {/* My Crops */}
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                <div style={{ fontSize:16, fontWeight:700, color:"#1c2b22" }}>My Crops</div>
                <button style={{ background:"none", border:"none", fontSize:12, color:"#6aaa78", cursor:"pointer", fontWeight:600 }}>+ Add Crop →</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {CROPS.map(crop => (
                  <div key={crop.name}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:20 }}>{crop.icon}</span>
                        <div>
                          <span style={{ fontSize:14, fontWeight:700, color:"#1c2b22" }}>{crop.name}</span>
                          <span style={{ fontSize:11, color:"#6b8070", marginLeft:6 }}>{crop.field}</span>
                        </div>
                      </div>
                      <div style={{ background:STATUS_COLORS[crop.status], color:STATUS_TEXT[crop.status], fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:99 }}>
                        {crop.status}
                      </div>
                    </div>
                    <div style={{ background:"#f0ede8", borderRadius:4, height:7, overflow:"hidden", marginBottom:4 }}>
                      <div style={{ height:"100%", width:`${crop.progress}%`, background:crop.color, borderRadius:4, transition:"width .5s" }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#6b8070" }}>
                      <span>Planted {crop.planted} · Est. harvest {crop.harvest}</span>
                      <span style={{ fontWeight:600, color:"#1c2b22" }}>{crop.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                <div style={{ fontSize:16, fontWeight:700, color:"#1c2b22" }}>Recent Activity</div>
                <button style={{ background:"none", border:"none", fontSize:12, color:"#6aaa78", cursor:"pointer", fontWeight:600 }}>View All →</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {ACTIVITY.map((a, i) => (
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", paddingBottom:14, borderBottom: i < ACTIVITY.length-1 ? "1px solid #f4f0e8" : "none" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:"#f4f0e8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                      {a.icon}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#1c2b22", marginBottom:2 }}>{a.title}</div>
                      <div style={{ fontSize:11, color:"#6b8070" }}>{a.sub}</div>
                    </div>
                    <div style={{ fontSize:11, color:"#a0998e", flexShrink:0 }}>{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disease Scanner */}
          <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ fontSize:16, fontWeight:700, color:"#1c2b22" }}>Disease Scanner</div>
              <button style={{ background:"none", border:"none", fontSize:12, color:"#6aaa78", cursor:"pointer", fontWeight:600 }}>History →</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ border:"2px dashed #d4cfca", borderRadius:14, padding:"32px 24px", textAlign:"center", cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#6aaa78"; (e.currentTarget as HTMLElement).style.background="#f4faf5"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="#d4cfca"; (e.currentTarget as HTMLElement).style.background="transparent"; }}>
                <div style={{ fontSize:36, marginBottom:10 }}>📸</div>
                <div style={{ fontSize:14, fontWeight:600, color:"#1c2b22", marginBottom:4 }}>Upload Crop Photo</div>
                <div style={{ fontSize:12, color:"#6b8070" }}>Get instant AI diagnosis</div>
              </div>
              <div style={{ background:"#fff8ec", border:"1px solid #f5e0b0", borderRadius:14, padding:"18px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#92400e" }}>Late Blight — 94%</span>
                  <button style={{ background:"#1a3a2a", color:"#fff", border:"none", borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                    Treat →
                  </button>
                </div>
                <div style={{ fontSize:12, color:"#a16207", marginBottom:6 }}>🍅 Tomato Field A · Detected today</div>
                <div style={{ fontSize:11, color:"#78350f" }}>Apply Neem Oil Spray immediately. See treatment options.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════ PROFILE PANEL ══════════════ */}
      {showProfile && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:100, display:"flex", justifyContent:"flex-end" }}
          onClick={e => { if (e.target === e.currentTarget) setShowProfile(false); }}>
          <div style={{ width:420, background:"#fff", height:"100%", overflowY:"auto", boxShadow:"-8px 0 32px rgba(0,0,0,.15)" }}>

            {/* Header */}
            <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", padding:"28px 24px", color:"#fff" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                <div style={{ fontSize:16, fontWeight:700 }}>My Profile</div>
                <button onClick={() => setShowProfile(false)}
                  style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:30, height:30, borderRadius:"50%", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  ✕
                </button>
              </div>
              {/* Avatar */}
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:64, height:64, borderRadius:"50%", background:"#6aaa78", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:700, color:"#fff", border:"3px solid rgba(255,255,255,.3)" }}>
                  {profile?.avatar ? <img src={profile.avatar} style={{ width:"100%", height:"100%", borderRadius:"50%", objectFit:"cover" }} alt="" /> : getInitial()}
                </div>
                <div>
                  <div style={{ fontSize:18, fontWeight:700 }}>{user?.name}</div>
                  <div style={{ fontSize:12, opacity:.65 }}>{user?.email}</div>
                  <div style={{ display:"inline-block", background:"rgba(106,170,120,.3)", color:"#a8d5b5", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:99, marginTop:6, textTransform:"uppercase", letterSpacing:".06em" }}>
                    🌾 Farmer
                  </div>
                </div>
              </div>
            </div>

            {/* Profile body */}
            <div style={{ padding:"24px" }}>

              {/* Edit / View toggle */}
              <div style={{ display:"flex", gap:8, marginBottom:20 }}>
                <button
                  onClick={() => setEditMode(false)}
                  style={{ flex:1, padding:"9px", borderRadius:9, border:"1px solid #e0dcd4", background:!editMode?"#1a3a2a":"#f4f0e8", color:!editMode?"#fff":"#6b8070", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  View Profile
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  style={{ flex:1, padding:"9px", borderRadius:9, border:"1px solid #e0dcd4", background:editMode?"#1a3a2a":"#f4f0e8", color:editMode?"#fff":"#6b8070", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  ✏️ Edit Profile
                </button>
              </div>

              {/* VIEW MODE */}
              {!editMode && (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {[
                    ["🏡", "Farm Name",   profile?.farmName   || "Not set"],
                    ["📍", "District",    profile?.district   || "Not set"],
                    ["📞", "Phone",       profile?.phone      || "Not set"],
                    ["📐", "Farm Size",   profile?.farmSize   || "Not set"],
                    ["⏳", "Experience",  profile?.experience ? `${profile.experience} years` : "Not set"],
                    ["📝", "Bio",         profile?.bio        || "Not set"],
                  ].map(([icon, label, value]) => (
                    <div key={label} style={{ display:"flex", gap:12, padding:"12px 14px", background:"#f9f7f4", borderRadius:10 }}>
                      <span style={{ fontSize:18 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:"#a09a90", textTransform:"uppercase", letterSpacing:".06em", marginBottom:2 }}>{label}</div>
                        <div style={{ fontSize:13, color:"#1c2b22", fontWeight:500 }}>{value}</div>
                      </div>
                    </div>
                  ))}
                  {profile?.cropTypes && profile.cropTypes.length > 0 && (
                    <div style={{ padding:"12px 14px", background:"#f9f7f4", borderRadius:10 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:"#a09a90", textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>🌱 Crop Types</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {profile.cropTypes.map(c => (
                          <span key={c} style={{ background:"#e8f5e9", color:"#2d5a3d", fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:99 }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* EDIT MODE */}
              {editMode && (
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {saveMsg && (
                    <div style={{ padding:"10px 14px", borderRadius:10, background: saveMsg.startsWith("✅") ? "#e8f5e9" : "#fff0f0", color: saveMsg.startsWith("✅") ? "#16a34a" : "#c0392b", fontSize:13, fontWeight:600 }}>
                      {saveMsg}
                    </div>
                  )}
                  {[
                    ["Full Name",   "name",       "text",   "Nimal Perera"],
                    ["Farm Name",   "farmName",   "text",   "Perera Farm"],
                    ["Phone",       "phone",      "tel",    "+94 77 123 4567"],
                    ["Address",     "address",    "text",   "123 Farm Road, Kandy"],
                    ["Farm Size",   "farmSize",   "text",   "2.5 acres"],
                    ["Experience",  "experience", "number", "5"],
                  ].map(([label, field, type, ph]) => (
                    <div key={field}>
                      <label style={{ fontSize:10, fontWeight:700, color:"#a09a90", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>{label}</label>
                      <input
                        type={type}
                        value={(editForm as any)[field]}
                        onChange={e => setEditForm(prev => ({ ...prev, [field]: type==="number" ? Number(e.target.value) : e.target.value }))}
                        placeholder={ph}
                        style={{ width:"100%", padding:"10px 13px", border:"1.5px solid #e0dcd4", borderRadius:9, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#f9f7f4" }}
                      />
                    </div>
                  ))}

                  {/* District dropdown */}
                  <div>
                    <label style={{ fontSize:10, fontWeight:700, color:"#a09a90", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>District</label>
                    <select
                      value={editForm.district}
                      onChange={e => setEditForm(prev => ({ ...prev, district: e.target.value }))}
                      style={{ width:"100%", padding:"10px 13px", border:"1.5px solid #e0dcd4", borderRadius:9, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#f9f7f4" }}
                    >
                      {["Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya","Galle","Matara","Hambantota","Jaffna","Trincomalee","Kurunegala","Anuradhapura","Polonnaruwa","Badulla","Ratnapura","Kegalle"].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Bio */}
                  <div>
                    <label style={{ fontSize:10, fontWeight:700, color:"#a09a90", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell consumers about your farm..."
                      rows={3}
                      style={{ width:"100%", padding:"10px 13px", border:"1.5px solid #e0dcd4", borderRadius:9, fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", background:"#f9f7f4", resize:"vertical" }}
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{ padding:"12px", background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", opacity:saving?0.7:1 }}
                  >
                    {saving ? "⏳ Saving…" : "💾 Save Profile"}
                  </button>
                </div>
              )}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                style={{ width:"100%", marginTop:24, padding:"12px", background:"#fff0f0", color:"#c0392b", border:"1px solid #fcd0d0", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}