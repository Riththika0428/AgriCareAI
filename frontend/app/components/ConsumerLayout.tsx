// ── Shared sidebar component for all consumer pages ───────
// Usage: import ConsumerLayout from "@/components/ConsumerLayout"
// Wrap page content: <ConsumerLayout><YourContent /></ConsumerLayout>

"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const NAV = [
  { icon:"🏠", label:"Overview",    href:"/dashboard/consumer",              section:"MY HEALTH" },
  { icon:"🛒", label:"Marketplace", href:"/dashboard/consumer/marketplace",  section:"" },
  { icon:"🥗", label:"Nutrition",   href:"/dashboard/consumer/nutrition",    section:"" },
  { icon:"📦", label:"My Orders",   href:"/dashboard/consumer/orders",       section:"" },
  { icon:"⚙️", label:"Settings",   href:"/dashboard/consumer/settings",     section:"ACCOUNT" },
];

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]         = useState<any>(null);
  const [healthScore, setScore] = useState(74);
  const [profile, setProfile]   = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    if (!stored) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "user" && u.role !== "consumer" && u.role !== "admin") { router.push("/"); return; }
    setUser(u);
  }, []);

  const getInitial = () => (user?.name || "C")[0].toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f8faf8" }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{
        width:185, background:"#fff",
        borderRight:"1px solid #e8ede8",
        display:"flex", flexDirection:"column",
        position:"fixed", top:0, left:0, bottom:0, zIndex:50,
        boxShadow:"2px 0 12px rgba(0,0,0,.04)",
      }}>
        {/* Logo */}
        <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid #f0f4f0" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:22, color:"#1a3a2a" }}>
            Agri<span style={{ color:"#22c55e" }}>AI</span>
          </div>
        </div>

        {/* User card */}
        <div style={{ padding:"14px 16px", borderBottom:"1px solid #f0f4f0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#16a34a)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:15, fontWeight:700, color:"#fff", flexShrink:0 }}>
              {getInitial()}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{user?.name || "Consumer"}</div>
              <div style={{ fontSize:11, color:"#6b7280" }}>Consumer · Colombo</div>
            </div>
          </div>
          {/* Health score */}
          <div style={{ background:"#f0fdf4", borderRadius:8, padding:"6px 10px",
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:11, color:"#166534", fontWeight:600 }}>Health Score</span>
            <span style={{ fontSize:13, fontWeight:800, color:"#16a34a" }}>{healthScore}/100</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <div key={item.href}>
                {item.section && (
                  <div style={{ padding:"10px 16px 4px", fontSize:10, fontWeight:700,
                    color:"#9ca3af", letterSpacing:".08em", textTransform:"uppercase" }}>
                    {item.section}
                  </div>
                )}
                <button onClick={() => router.push(item.href)} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:10,
                  padding:"9px 16px", border:"none",
                  background: active ? "#f0fdf4" : "transparent",
                  borderLeft: active ? "3px solid #22c55e" : "3px solid transparent",
                  color: active ? "#166534" : "#374151",
                  fontSize:13, fontWeight: active ? 700 : 400,
                  cursor:"pointer", transition:"all .15s", textAlign:"left",
                }}>
                  <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding:"12px 0", borderTop:"1px solid #f0f4f0" }}>
          <button onClick={handleLogout} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10,
            padding:"9px 16px", border:"none", background:"transparent",
            color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600,
          }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ══ CONTENT ══ */}
      <div style={{ marginLeft:185, flex:1, display:"flex", flexDirection:"column" }}>
        {/* Top bar */}
        <header style={{ background:"#fff", borderBottom:"1px solid #e8ede8",
          padding:"12px 28px", display:"flex", alignItems:"center",
          justifyContent:"space-between", position:"sticky", top:0, zIndex:40,
          boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:"#111827" }}>
              Good {new Date().getHours()<12?"Morning":new Date().getHours()<17?"Afternoon":"Evening"}, {user?.name?.split(" ")[0]} 
            </div>
            <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>
              {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} · You've logged 2 of 5 recommended veggies today
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }}>🔍</span>
              <input placeholder="Search..." style={{ padding:"8px 12px 8px 32px",
                border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13,
                fontFamily:"'DM Sans',sans-serif", outline:"none", width:160 }} />
            </div>
            <button onClick={() => router.push("/dashboard/consumer/nutrition")} style={{
              background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
              border:"none", borderRadius:9, padding:"8px 16px",
              fontSize:13, fontWeight:700, cursor:"pointer",
              display:"flex", alignItems:"center", gap:6,
            }}>+ Log Today's Meal</button>
            <div style={{ width:34, height:34, borderRadius:"50%",
              background:"linear-gradient(135deg,#22c55e,#16a34a)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              {getInitial()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, padding:"24px 28px", overflowY:"auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}