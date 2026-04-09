"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { validateSession, clearAuthAndRedirect } from "@/lib/axios-proxy";
import api from "@/lib/axios-proxy";

// ── Types ──────────────────────────────────────────────
interface WeatherData {
  district:    string;
  temperature: number;
  humidity:    number;
  rainfall:    number;
  windSpeed:   number;
  condition:   string;
  description: string;
  alertLevel:  "Normal" | "Watch" | "Warning" | "Danger";
  cropAdvice:  string;
  forecast:    { date: string; condition: string; tempMin: number; tempMax: number; rainfall: number; humidity: number }[];
  fetchedAt:   string;
}

// ── Constants ──────────────────────────────────────────
const NAV = [
  { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const SL_DISTRICTS = [
  "Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya",
  "Galle","Matara","Hambantota","Jaffna","Kilinochchi","Mannar",
  "Vavuniya","Mullaitivu","Batticaloa","Ampara","Trincomalee",
  "Kurunegala","Puttalam","Anuradhapura","Polonnaruwa","Badulla",
  "Moneragala","Ratnapura","Kegalle",
];

const ALERT_CONFIG = {
  Normal:  { bg:"#f0fdf4", border:"#bbf7d0", color:"#166534", icon:"✅", label:"All Clear"  },
  Watch:   { bg:"#fffbeb", border:"#fde68a", color:"#92400e", icon:"👀", label:"Watch"      },
  Warning: { bg:"#fff7ed", border:"#fed7aa", color:"#9a3412", icon:"⚠️", label:"Warning"    },
  Danger:  { bg:"#fff1f2", border:"#fecdd3", color:"#9f1239", icon:"🚨", label:"Danger"     },
};

const CONDITION_EMOJI: Record<string, string> = {
  Clear:"☀️", Clouds:"⛅", Rain:"🌧️", Drizzle:"🌦️",
  Thunderstorm:"⛈️", Snow:"❄️", Mist:"🌫️", Fog:"🌫️",
  Haze:"🌫️", Smoke:"🌫️", Dust:"💨", Sand:"💨",
};

const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ── SVG Icon ──────────────────────────────────────────
const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);

export default function WeatherPage() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,          setUser]          = useState<any>(null);
  const [district,      setDistrict]      = useState("Kandy");
  const [weather,       setWeather]       = useState<WeatherData | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [saved,         setSaved]         = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [lastFetch,     setLastFetch]     = useState<Date | null>(null);
  const [sideCollapsed, setSideCollapsed] = useState(false);

  const SBW = sideCollapsed ? 68 : 220;

  const greeting   = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const getInitial = () => (user?.name || "F")[0].toUpperCase();
  const alertConfig = weather ? ALERT_CONFIG[weather.alertLevel] : ALERT_CONFIG.Normal;
  const condEmoji   = (cond: string) => CONDITION_EMOJI[cond] || "🌤️";
  const fmtDate     = (d: string) => { const dt = new Date(d); return WEEKDAYS[dt.getDay()]; };

  // ── Auth guard ─────────────────────────────────────
  useEffect(() => {
    async function check() {
      const u = await validateSession() as any;
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
      const profileDistrict = u.district || "Kandy";
      setDistrict(profileDistrict);
      fetchWeather(profileDistrict);
    }
    check();
  }, []);

  // ── Fetch weather from backend ─────────────────────
  const fetchWeather = async (d?: string) => {
    const target = d || district;
    setLoading(true); setError(""); setSaved(false);
    try {
      const { data } = await api.get(`/weather/${encodeURIComponent(target)}`);
      setWeather(data);
      setLastFetch(new Date());
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch weather. Check your OPENWEATHER_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  // ── Save alert to MongoDB ──────────────────────────
  const handleSave = async () => {
    if (!weather) return;
    setSaving(true);
    try {
      await api.post("/weather/save", weather);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save alert.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { clearAuthAndRedirect(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f4f0e8; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d0cdc6; border-radius: 10px; }
        .nav-btn:hover { background: rgba(106,170,120,.15) !important; color: #fff !important; }
        .action-btn:hover { opacity: .88; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f4f0e8" }}>

        {/* ══ SIDEBAR ══ */}
        <aside style={{
          width: SBW,
          background: "linear-gradient(185deg,#1a3a2a 0%,#122a1c 60%,#0a1e11 100%)",
          display: "flex", flexDirection: "column",
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 60,
          transition: "width .28s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden", boxShadow: "4px 0 24px rgba(0,0,0,.18)",
        }}>

          {/* Logo — click goes to landing page */}
          <div style={{ padding: sideCollapsed ? "18px 0" : "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: sideCollapsed ? "center" : "space-between" }}>
            {!sideCollapsed && (
              <div
                onClick={() => router.push("/")}
                style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff", cursor: "pointer", letterSpacing: "-0.5px", userSelect: "none" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Ag<span style={{ color: "#6aaa78" }}>real</span>
              </div>
            )}
            <button onClick={() => setSideCollapsed(p => !p)} className="action-btn"
              style={{ background: "rgba(255,255,255,.07)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,.5)", flexShrink: 0 }}>
              <Icon d={sideCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} size={14} />
            </button>
          </div>

          {/* User */}
          <div style={{ padding: sideCollapsed ? "14px 0" : "16px 20px", borderBottom: "1px solid rgba(255,255,255,.08)", display: sideCollapsed ? "flex" : "block", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", boxShadow: "0 2px 8px rgba(106,170,120,.4)", flexShrink: 0 }}>
                {getInitial()}
              </div>
              {!sideCollapsed && (
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
                  <div style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>My Farm</div>
                </div>
              )}
            </div>
          </div>

          {/* Nav label */}
          {!sideCollapsed && (
            <div style={{ padding: "16px 20px 6px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Navigation
            </div>
          )}

          {/* Nav items */}
          <nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
            {NAV.map(item => {
              const isActive = pathname === item.href;
              return (
                <button key={item.href} onClick={() => router.push(item.href)} className="nav-btn"
                  title={sideCollapsed ? item.label : undefined}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: sideCollapsed ? "12px 0" : "9px 12px",
                    justifyContent: sideCollapsed ? "center" : "flex-start",
                    border: "none", borderRadius: 10, marginBottom: 2,
                    background: isActive ? "rgba(106,170,120,.18)" : "transparent",
                    borderLeft: isActive ? "3px solid #6aaa78" : "3px solid transparent",
                    color: isActive ? "#fff" : "rgba(255,255,255,.5)",
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    cursor: "pointer", transition: "all .18s", textAlign: "left",
                  }}>
                  <Icon d={item.icon} size={17} style={{ flexShrink: 0 }} />
                  {!sideCollapsed && <span>{item.label}</span>}
                  {!sideCollapsed && isActive && (
                    <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6aaa78" }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Settings & Logout */}
          <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
            <button onClick={() => router.push("/dashboard/farmer/settings")} className="nav-btn"
              title={sideCollapsed ? "Settings" : undefined}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 12px", border: "none", background: "transparent", color: "rgba(255,255,255,.4)", fontSize: 13, cursor: "pointer", transition: "all .18s", borderRadius: 10 }}>
              <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={16} style={{ flexShrink: 0 }} />
              {!sideCollapsed && <span>Settings</span>}
            </button>
            <button onClick={handleLogout} className="nav-btn"
              title={sideCollapsed ? "Sign Out" : undefined}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 12px", border: "none", background: "transparent", color: "#f87171", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all .18s", borderRadius: 10 }}>
              <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={16} style={{ flexShrink: 0 }} />
              {!sideCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main style={{ marginLeft: SBW, flex: 1, transition: "margin-left .28s cubic-bezier(.4,0,.2,1)", minHeight: "100vh" }}>

          {/* ── Topbar ── */}
          <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Back button */}
              <button onClick={() => router.back()} className="action-btn"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "#f4f0e8", border: "1px solid #e0ddd6", cursor: "pointer", flexShrink: 0 }}>
                <Icon d="M15 19l-7-7 7-7" size={16} style={{ color: "#1a3a2a" }} />
              </button>
              {/* Greeting */}
              <div>
                <div style={{ fontSize: 19, fontWeight: 700, color: "#1c2b22", letterSpacing: "-.3px" }}>
                  {greeting()}, <span style={{ color: "#2d5a3d" }}>{user?.name?.split(" ")[0]}</span>
                </div>
                <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  {district ? ` · ${district}` : ""}
                </div>
              </div>
            </div>
            {/* Avatar */}
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(45,90,61,.3)", cursor: "pointer" }}>
              {getInitial()}
            </div>
          </header>

          {/* ── YOUR ORIGINAL PAGE CONTENT ── */}
          <div style={{ padding:"28px 32px" }}>

            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
              <div>
                <h1 style={{ fontSize:24, fontWeight:700, color:"#1a3a2a", margin:0, display:"flex", alignItems:"center", gap:10 }}>
                  ⛈️ Weather Alerts
                </h1>
                <p style={{ fontSize:13, color:"#6b8070", marginTop:4 }}>
                  Live weather data and crop-specific alerts for your farm
                </p>
              </div>
              {lastFetch && (
                <div style={{ fontSize:12, color:"#9ca3af" }}>
                  Last updated: {lastFetch.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" })}
                </div>
              )}
            </div>

            {/* District selector + fetch */}
            <div style={{ background:"#fff", borderRadius:16, padding:"20px 24px", border:"1px solid #e8e4dc", marginBottom:22, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:200 }}>
                <label style={{ fontSize:11, fontWeight:700, color:"#6b8070", textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
                  Select District
                </label>
                <select value={district} onChange={e => setDistrict(e.target.value)}
                  style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e8e4dc", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:"#1a3a2a", background:"#f9f7f4", outline:"none" }}>
                  {SL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ display:"flex", gap:10, alignItems:"flex-end", paddingBottom:2 }}>
                <button onClick={() => fetchWeather()} disabled={loading}
                  style={{ padding:"10px 22px", background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", gap:8 }}>
                  {loading ? (
                    <><span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />Fetching…</>
                  ) : "🔄 Get Weather"}
                </button>
                {weather && (
                  <button onClick={handleSave} disabled={saving || saved}
                    style={{ padding:"10px 22px", background: saved ? "#e8f5e9" : saving ? "#f4f0e8" : "#f4f0e8", color: saved ? "#166534" : "#1a3a2a", border:"1.5px solid", borderColor: saved ? "#bbf7d0" : "#e8e4dc", borderRadius:10, fontSize:14, fontWeight:700, cursor: saving || saved ? "default" : "pointer" }}>
                    {saved ? "✅ Saved!" : saving ? "Saving…" : "💾 Save Alert"}
                  </button>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background:"#fff1f1", border:"1px solid #fcd0d0", borderRadius:12, padding:"14px 18px", marginBottom:22, color:"#c0392b", fontSize:13 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Empty state */}
            {!weather && !loading && !error && (
              <div style={{ background:"#fff", borderRadius:16, padding:"60px", border:"1px solid #e8e4dc", textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>⛈️</div>
                <div style={{ fontSize:16, fontWeight:700, color:"#1a3a2a", marginBottom:8 }}>
                  Select a district and click "Get Weather"
                </div>
                <div style={{ fontSize:13, color:"#6b8070" }}>
                  Get live weather data and crop advice for any Sri Lanka district
                </div>
              </div>
            )}

            {weather && (
              <>
                {/* ── Main weather card ── */}
                <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", borderRadius:20, padding:"28px 32px", marginBottom:22, color:"#fff", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
                  <div>
                    <div style={{ fontSize:12, opacity:.6, marginBottom:6, textTransform:"uppercase", letterSpacing:".06em" }}>
                      📍 {weather.district}, Sri Lanka
                    </div>
                    <div style={{ display:"flex", alignItems:"flex-end", gap:12, marginBottom:6 }}>
                      <div style={{ fontSize:72, fontWeight:900, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
                        {weather.temperature}°
                      </div>
                      <div style={{ paddingBottom:12 }}>
                        <div style={{ fontSize:28 }}>{condEmoji(weather.condition)}</div>
                        <div style={{ fontSize:14, opacity:.7, textTransform:"capitalize" }}>{weather.description}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:20, fontSize:13, opacity:.7 }}>
                      <span>💧 {weather.humidity}% humidity</span>
                      <span>💨 {weather.windSpeed} km/h</span>
                      <span>🌧️ {weather.rainfall}mm rain</span>
                    </div>
                  </div>

                  <div style={{ background:"rgba(255,255,255,.1)", borderRadius:16, padding:"20px 24px", textAlign:"center", minWidth:160 }}>
                    <div style={{ fontSize:32, marginBottom:8 }}>{alertConfig.icon}</div>
                    <div style={{ fontSize:11, opacity:.6, textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>Alert Level</div>
                    <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Playfair Display',serif" }}>{weather.alertLevel}</div>
                  </div>

                  <div style={{ display:"flex", gap:16 }}>
                    {weather.forecast.map((f, i) => (
                      <div key={i} style={{ textAlign:"center", background:"rgba(255,255,255,.08)", borderRadius:12, padding:"14px 16px", minWidth:70 }}>
                        <div style={{ fontSize:11, opacity:.5, marginBottom:6 }}>{i === 0 ? "Today" : fmtDate(f.date)}</div>
                        <div style={{ fontSize:24, marginBottom:6 }}>{condEmoji(f.condition)}</div>
                        <div style={{ fontSize:14, fontWeight:700 }}>{f.tempMax}°</div>
                        <div style={{ fontSize:11, opacity:.5 }}>{f.tempMin}°</div>
                        {f.rainfall > 0 && <div style={{ fontSize:10, opacity:.6, marginTop:4 }}>🌧️ {f.rainfall}mm</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Crop advice banner ── */}
                <div style={{ background:alertConfig.bg, border:`1px solid ${alertConfig.border}`, borderRadius:16, padding:"20px 24px", marginBottom:22, display:"flex", alignItems:"flex-start", gap:16 }}>
                  <div style={{ fontSize:28, flexShrink:0 }}>{alertConfig.icon}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:alertConfig.color, marginBottom:6 }}>
                      Crop Advisory — {weather.alertLevel}
                    </div>
                    <div style={{ fontSize:14, color:"#374151", lineHeight:1.6 }}>{weather.cropAdvice}</div>
                  </div>
                </div>

                {/* ── 3 stat cards ── */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:22 }}>
                  <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px", border:"1px solid #e8e4dc" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#6b8070", textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>🌡️ Temperature</div>
                    <div style={{ fontSize:36, fontWeight:800, color:"#1a3a2a", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{weather.temperature}°C</div>
                    <div style={{ fontSize:12, color:"#6b8070", marginTop:8 }}>
                      {weather.temperature > 32 ? "⚠️ High — water crops early morning" : weather.temperature < 18 ? "❄️ Cool — good for leafy greens" : "✅ Optimal growing temperature"}
                    </div>
                    <div style={{ marginTop:12, background:"#f0ede8", borderRadius:4, height:8, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${Math.min(100,(weather.temperature/45)*100)}%`, background: weather.temperature > 35 ? "#ef4444" : weather.temperature > 28 ? "#f59e0b" : "#22c55e", borderRadius:4 }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#9ca3af", marginTop:4 }}><span>0°C</span><span>45°C</span></div>
                  </div>

                  <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px", border:"1px solid #e8e4dc" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#6b8070", textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>💧 Humidity</div>
                    <div style={{ fontSize:36, fontWeight:800, color:"#1a3a2a", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{weather.humidity}%</div>
                    <div style={{ fontSize:12, color:"#6b8070", marginTop:8 }}>
                      {weather.humidity > 80 ? "⚠️ High — risk of fungal disease" : weather.humidity < 30 ? "🌵 Low — increase irrigation" : "✅ Good humidity for crops"}
                    </div>
                    <div style={{ marginTop:12, background:"#f0ede8", borderRadius:4, height:8, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${weather.humidity}%`, background: weather.humidity > 80 ? "#f59e0b" : weather.humidity < 30 ? "#ef4444" : "#22c55e", borderRadius:4 }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#9ca3af", marginTop:4 }}><span>0%</span><span>100%</span></div>
                  </div>

                  <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px", border:"1px solid #e8e4dc" }}>
                    <div style={{ fontSize:12, fontWeight:700, color:"#6b8070", textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>💨 Wind Speed</div>
                    <div style={{ fontSize:36, fontWeight:800, color:"#1a3a2a", fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
                      {weather.windSpeed}<span style={{ fontSize:16, fontWeight:400, color:"#6b8070" }}> km/h</span>
                    </div>
                    <div style={{ fontSize:12, color:"#6b8070", marginTop:8 }}>
                      {weather.windSpeed > 60 ? "🚨 Dangerous — secure all structures" : weather.windSpeed > 40 ? "⚠️ Strong — protect tall crops" : weather.windSpeed > 20 ? "🌬️ Moderate — support plants if needed" : "✅ Calm — ideal conditions"}
                    </div>
                    <div style={{ marginTop:12, background:"#f0ede8", borderRadius:4, height:8, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${Math.min(100,(weather.windSpeed/80)*100)}%`, background: weather.windSpeed > 60 ? "#ef4444" : weather.windSpeed > 40 ? "#f59e0b" : "#22c55e", borderRadius:4 }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#9ca3af", marginTop:4 }}><span>0</span><span>80 km/h</span></div>
                  </div>
                </div>

                {/* ── Extended forecast table ── */}
                {weather.forecast.length > 0 && (
                  <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px", border:"1px solid #e8e4dc" }}>
                    <div style={{ fontSize:16, fontWeight:700, color:"#1a3a2a", marginBottom:18 }}>📅 3-Day Forecast</div>
                    <div style={{ display:"grid", gridTemplateColumns:`repeat(${weather.forecast.length}, 1fr)`, gap:14 }}>
                      {weather.forecast.map((f, i) => {
                        const alertLv = f.rainfall > 50 ? "Warning" : f.rainfall > 20 ? "Watch" : "Normal";
                        const ac = ALERT_CONFIG[alertLv];
                        return (
                          <div key={i} style={{ background:"#f9f7f4", borderRadius:14, padding:"18px 16px", textAlign:"center", border:`1px solid ${ac.border}` }}>
                            <div style={{ fontSize:13, fontWeight:700, color:"#1a3a2a", marginBottom:10 }}>{i === 0 ? "Today" : i === 1 ? "Tomorrow" : fmtDate(f.date)}</div>
                            <div style={{ fontSize:36, marginBottom:10 }}>{condEmoji(f.condition)}</div>
                            <div style={{ fontSize:20, fontWeight:800, color:"#1a3a2a", marginBottom:4 }}>{f.tempMax}°C</div>
                            <div style={{ fontSize:12, color:"#6b8070", marginBottom:10 }}>Low: {f.tempMin}°C</div>
                            <div style={{ fontSize:12, color:"#6b8070", marginBottom:8 }}>💧 {f.humidity}% humidity</div>
                            {f.rainfall > 0 && <div style={{ fontSize:12, fontWeight:600, color:ac.color }}>🌧️ {f.rainfall}mm rain</div>}
                            <div style={{ marginTop:10, display:"inline-block", padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, background:ac.bg, color:ac.color, border:`1px solid ${ac.border}` }}>
                              {ac.icon} {alertLv}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}