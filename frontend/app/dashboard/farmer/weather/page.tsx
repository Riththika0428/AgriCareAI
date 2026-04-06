// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter, usePathname } from "next/navigation";
// // import api from "@/lib/axios-proxy";

// // // ── Types ──────────────────────────────────────────────
// // interface WeatherData {
// //   district:    string;
// //   temperature: number;
// //   humidity:    number;
// //   rainfall:    number;
// //   windSpeed:   number;
// //   condition:   string;
// //   description: string;
// //   alertLevel:  "Normal" | "Watch" | "Warning" | "Danger";
// //   cropAdvice:  string;
// //   forecast:    { date: string; condition: string; tempMin: number; tempMax: number; rainfall: number; humidity: number }[];
// //   fetchedAt:   string;
// // }

// // // ── Constants ──────────────────────────────────────────
// // const NAV = [
// //   { label: "Overview",    href: "/dashboard/farmer",              icon: "⌂" },
// //   { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor",  icon: "✦" },
// //   { label: "My Products", href: "/dashboard/farmer/products",     icon: "❧" },
// //   { label: "Orders",      href: "/dashboard/farmer/orders",       icon: "◈" },
// //   { label: "Weather",     href: "/dashboard/farmer/weather",      icon: "◎" },
// //   { label: "Earnings",    href: "/dashboard/farmer/earnings",     icon: "◇" },
// // ];

// // const SL_DISTRICTS = [
// //   "Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya",
// //   "Galle","Matara","Hambantota","Jaffna","Kilinochchi","Mannar",
// //   "Vavuniya","Mullaitivu","Batticaloa","Ampara","Trincomalee",
// //   "Kurunegala","Puttalam","Anuradhapura","Polonnaruwa","Badulla",
// //   "Moneragala","Ratnapura","Kegalle",
// // ];

// // const ALERT_CONFIG = {
// //   Normal:  { bg:"#f0fdf4", border:"#bbf7d0", color:"#166534", icon:"✅", label:"All Clear"  },
// //   Watch:   { bg:"#fffbeb", border:"#fde68a", color:"#92400e", icon:"👀", label:"Watch"      },
// //   Warning: { bg:"#fff7ed", border:"#fed7aa", color:"#9a3412", icon:"⚠️", label:"Warning"    },
// //   Danger:  { bg:"#fff1f2", border:"#fecdd3", color:"#9f1239", icon:"🚨", label:"Danger"     },
// // };

// // const CONDITION_EMOJI: Record<string, string> = {
// //   Clear:"☀️", Clouds:"⛅", Rain:"🌧️", Drizzle:"🌦️",
// //   Thunderstorm:"⛈️", Snow:"❄️", Mist:"🌫️", Fog:"🌫️",
// //   Haze:"🌫️", Smoke:"🌫️", Dust:"💨", Sand:"💨",
// // };

// // const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// // export default function WeatherPage() {
// //   const router   = useRouter();
// //   const pathname = usePathname();

// //   const [user,      setUser]      = useState<any>(null);
// //   const [district,  setDistrict]  = useState("Kandy");
// //   const [weather,   setWeather]   = useState<WeatherData | null>(null);
// //   const [loading,   setLoading]   = useState(false);
// //   const [error,     setError]     = useState("");
// //   const [saved,     setSaved]     = useState(false);
// //   const [saving,    setSaving]    = useState(false);
// //   const [lastFetch, setLastFetch] = useState<Date | null>(null);

// //   // ── Auth guard ─────────────────────────────────────
// //   useEffect(() => {
// //     const stored = localStorage.getItem("agriai_user");
// //     const token  = localStorage.getItem("agriai_token");
// //     if (!stored || !token) { router.push("/"); return; }
// //     const u = JSON.parse(stored);
// //     if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
// //     setUser(u);
// //     // Auto-load weather for farmer's district from profile
// //     const profileDistrict = u.district || "Kandy";
// //     setDistrict(profileDistrict);
// //     fetchWeather(profileDistrict);
// //   }, []);

// //   // ── Fetch weather from backend → OpenWeatherMap ────
// //   const fetchWeather = async (d?: string) => {
// //     const target = d || district;
// //     setLoading(true); setError(""); setSaved(false);
// //     try {
// //       const { data } = await api.get(`/weather/${encodeURIComponent(target)}`);
// //       setWeather(data);
// //       setLastFetch(new Date());
// //     } catch (err: any) {
// //       setError(err.response?.data?.message || "Failed to fetch weather. Check your OPENWEATHER_API_KEY.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ── Save alert to MongoDB ──────────────────────────
// //   const handleSave = async () => {
// //     if (!weather) return;
// //     setSaving(true);
// //     try {
// //       await api.post("/weather/save", weather);
// //       setSaved(true);
// //       setTimeout(() => setSaved(false), 3000);
// //     } catch (err: any) {
// //       setError(err.response?.data?.message || "Failed to save alert.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("agriai_token");
// //     localStorage.removeItem("agriai_user");
// //     router.push("/");
// //   };

// //   const getInitial  = () => (user?.name || "F")[0].toUpperCase();
// //   const alertConfig = weather ? ALERT_CONFIG[weather.alertLevel] : ALERT_CONFIG.Normal;
// //   const condEmoji   = (cond: string) => CONDITION_EMOJI[cond] || "🌤️";
// //   const fmtDate     = (d: string) => {
// //     const dt = new Date(d);
// //     return WEEKDAYS[dt.getDay()];
// //   };

// //   return (
// //     <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f4f0e8" }}>

// //       {/* ══ SIDEBAR ══ */}
       
// //       <aside style={{
// //         width: 200, background: "linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
// //         display: "flex", flexDirection: "column",
// //         position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
// //       }}>
// //         {/* Logo */}
// //         <div style={{ padding: "24px 22px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
// //           <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 24, color: "#fff" }}>
// //             Ag<span style={{ color: "#6aaa78" }}>real</span>
// //           </div>
// //         </div>

// //         {/* User */}
// //         <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
// //           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //             <div style={{
// //               width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)",
// //               display: "flex", alignItems: "center", justifyContent: "center",
// //               fontSize: 15, fontWeight: 700, color: "#fff",
// //               boxShadow: "0 2px 8px rgba(106,170,120,.4)",
// //             }}>
// //               {getInitial()}
// //             </div>
// //             <div>
// //               <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
// //               <div style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>My Farm</div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Nav label */}
// //         <div style={{ padding: "16px 22px 6px", fontSize: "10px", fontWeight: 700,
// //           color: "rgba(255,255,255,.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
// //           Navigation
// //         </div>

// //         {/* Nav items */}
// //         <nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
// //           {NAV.map(item => {
// //             const isActive = pathname === item.href;
// //             return (
// //               <button key={item.href} onClick={() => router.push(item.href)} style={{
// //                 width: "100%", display: "flex", alignItems: "center", gap: 10,
// //                 padding: "9px 12px", border: "none", borderRadius: "10px",
// //                 marginBottom: "2px",
// //                 background: isActive ? "rgba(106,170,120,.18)" : "transparent",
// //                 color: isActive ? "#fff" : "rgba(255,255,255,.5)",
// //                 fontSize: 13, fontWeight: isActive ? 600 : 400,
// //                 cursor: "pointer", transition: "all .18s", textAlign: "left",
// //                 position: "relative",
// //               }}>
// //                 {isActive && (
// //                   <div style={{
// //                     position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
// //                     width: 3, height: 20, background: "#6aaa78", borderRadius: "0 3px 3px 0",
// //                   }} />
// //                 )}
// //                 <span style={{ fontSize: "15px", opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
// //                 {item.label}
// //               </button>
// //             );
// //           })}
// //         </nav>

// //         {/* Settings & Logout */}
// //         <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
// //           <button onClick={handleLogout} style={{
// //             width: "100%", display: "flex", alignItems: "center", gap: 10,
// //             padding: "9px 12px", border: "none", background: "transparent",
// //             color: "#ef4444", fontSize: 13, cursor: "pointer", fontWeight: 600,
// //             borderRadius: "10px",
// //           }}>
// //             <span>⎋</span> Sign Out
// //           </button>
// //         </div>
// //       </aside>

// //       {/* <aside style={{ width:190, background:"linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
// //         display:"flex", flexDirection:"column", position:"fixed",
// //         top:0, left:0, bottom:0, zIndex:50 }}>
// //         <div style={{ padding:"22px 20px 16px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
// //           <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:22, color:"#fff" }}>
// //             Agri<span style={{ color:"#6aaa78" }}>AI</span>
// //           </div>
// //         </div>
// //         <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
// //           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
// //             <div style={{ width:38, height:38, borderRadius:"50%", background:"#6aaa78",
// //               display:"flex", alignItems:"center", justifyContent:"center",
// //               fontSize:16, fontWeight:700, color:"#fff" }}>{getInitial()}</div>
// //             <div>
// //               <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{user?.name || "Farmer"}</div>
// //               <div style={{ color:"rgba(255,255,255,.45)", fontSize:11 }}>{district}</div>
// //             </div>
// //           </div>
// //         </div>
// //         <nav style={{ flex:1, padding:"12px 0" }}>
// //           {NAV.map(item => {
// //             const active = pathname === item.href;
// //             return (
// //               <button key={item.href} onClick={() => router.push(item.href)} style={{
// //                 width:"100%", display:"flex", alignItems:"center", gap:10,
// //                 padding:"10px 20px", border:"none",
// //                 background: active ? "rgba(106,170,120,.2)" : "transparent",
// //                 borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent",
// //                 color: active ? "#fff" : "rgba(255,255,255,.55)",
// //                 fontSize:13, fontWeight: active ? 600 : 400,
// //                 cursor:"pointer", transition:"all .2s", textAlign:"left" }}>
// //                 <span>{item.icon}</span>{item.label}
// //               </button>
// //             );
// //           })}
// //         </nav>
// //         <div style={{ padding:"12px 0", borderTop:"1px solid rgba(255,255,255,.08)" }}>
// //           <button onClick={() => router.push("/dashboard/farmer/settings")} style={{
// //             width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 20px",
// //             border:"none", background:"transparent", color:"rgba(255,255,255,.45)", fontSize:13, cursor:"pointer" }}>
// //             ⚙️ Settings
// //           </button>
// //           <button onClick={handleLogout} style={{
// //             width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 20px",
// //             border:"none", background:"transparent", color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600 }}>
// //             🚪 Sign Out
// //           </button>
// //         </div>
// //       </aside> */}

// //       {/* ══ MAIN ══ */}
// //       <main style={{ marginLeft:190, flex:1, padding:"28px 32px" }}>

// //         {/* Header */}
// //         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
// //           <div>
// //             <h1 style={{ fontSize:24, fontWeight:700, color:"#1a3a2a", margin:0,
// //               display:"flex", alignItems:"center", gap:10 }}>
// //               ⛈️ Weather Alerts
// //             </h1>
// //             <p style={{ fontSize:13, color:"#6b8070", marginTop:4 }}>
// //               Live weather data and crop-specific alerts for your farm
// //             </p>
// //           </div>
// //           {lastFetch && (
// //             <div style={{ fontSize:12, color:"#9ca3af" }}>
// //               Last updated: {lastFetch.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" })}
// //             </div>
// //           )}
// //         </div>

// //         {/* District selector + fetch */}
// //         <div style={{ background:"#fff", borderRadius:16, padding:"20px 24px",
// //           border:"1px solid #e8e4dc", marginBottom:22,
// //           display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
// //           <div style={{ flex:1, minWidth:200 }}>
// //             <label style={{ fontSize:11, fontWeight:700, color:"#6b8070",
// //               textTransform:"uppercase", letterSpacing:".06em",
// //               display:"block", marginBottom:6 }}>
// //               Select District
// //             </label>
// //             <select value={district} onChange={e => setDistrict(e.target.value)}
// //               style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e8e4dc",
// //               borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14,
// //               color:"#1a3a2a", background:"#f9f7f4", outline:"none" }}>
// //               {SL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
// //             </select>
// //           </div>
// //           <div style={{ display:"flex", gap:10, alignItems:"flex-end", paddingBottom:2 }}>
// //             <button onClick={() => fetchWeather()} disabled={loading} style={{
// //               padding:"10px 22px",
// //               background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
// //               color:"#fff", border:"none", borderRadius:10,
// //               fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer",
// //               display:"flex", alignItems:"center", gap:8 }}>
// //               {loading ? (
// //                 <><span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,.4)",
// //                   borderTopColor:"#fff", borderRadius:"50%", display:"inline-block",
// //                   animation:"spin .7s linear infinite" }} />Fetching…</>
// //               ) : "🔄 Get Weather"}
// //             </button>
// //             {weather && (
// //               <button onClick={handleSave} disabled={saving || saved} style={{
// //                 padding:"10px 22px",
// //                 background: saved ? "#e8f5e9" : saving ? "#f4f0e8" : "#f4f0e8",
// //                 color: saved ? "#166534" : "#1a3a2a",
// //                 border:"1.5px solid",
// //                 borderColor: saved ? "#bbf7d0" : "#e8e4dc",
// //                 borderRadius:10, fontSize:14, fontWeight:700,
// //                 cursor: saving || saved ? "default" : "pointer" }}>
// //                 {saved ? "✅ Saved!" : saving ? "Saving…" : "💾 Save Alert"}
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {/* Error */}
// //         {error && (
// //           <div style={{ background:"#fff1f1", border:"1px solid #fcd0d0", borderRadius:12,
// //             padding:"14px 18px", marginBottom:22, color:"#c0392b", fontSize:13 }}>
// //             ⚠️ {error}
// //           </div>
// //         )}

// //         {/* Empty state */}
// //         {!weather && !loading && !error && (
// //           <div style={{ background:"#fff", borderRadius:16, padding:"60px",
// //             border:"1px solid #e8e4dc", textAlign:"center" }}>
// //             <div style={{ fontSize:48, marginBottom:16 }}>⛈️</div>
// //             <div style={{ fontSize:16, fontWeight:700, color:"#1a3a2a", marginBottom:8 }}>
// //               Select a district and click "Get Weather"
// //             </div>
// //             <div style={{ fontSize:13, color:"#6b8070" }}>
// //               Get live weather data and crop advice for any Sri Lanka district
// //             </div>
// //           </div>
// //         )}

// //         {weather && (
// //           <>
// //             {/* ── Main weather card ── */}
// //             <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
// //               borderRadius:20, padding:"28px 32px", marginBottom:22, color:"#fff",
// //               display:"flex", justifyContent:"space-between", alignItems:"center",
// //               flexWrap:"wrap", gap:20 }}>

// //               {/* Left: temp + condition */}
// //               <div>
// //                 <div style={{ fontSize:12, opacity:.6, marginBottom:6,
// //                   textTransform:"uppercase", letterSpacing:".06em" }}>
// //                   📍 {weather.district}, Sri Lanka
// //                 </div>
// //                 <div style={{ display:"flex", alignItems:"flex-end", gap:12, marginBottom:6 }}>
// //                   <div style={{ fontSize:72, fontWeight:900,
// //                     fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
// //                     {weather.temperature}°
// //                   </div>
// //                   <div style={{ paddingBottom:12 }}>
// //                     <div style={{ fontSize:28 }}>{condEmoji(weather.condition)}</div>
// //                     <div style={{ fontSize:14, opacity:.7, textTransform:"capitalize" }}>
// //                       {weather.description}
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div style={{ display:"flex", gap:20, fontSize:13, opacity:.7 }}>
// //                   <span>💧 {weather.humidity}% humidity</span>
// //                   <span>💨 {weather.windSpeed} km/h</span>
// //                   <span>🌧️ {weather.rainfall}mm rain</span>
// //                 </div>
// //               </div>

// //               {/* Center: alert level */}
// //               <div style={{ background:"rgba(255,255,255,.1)", borderRadius:16,
// //                 padding:"20px 24px", textAlign:"center", minWidth:160 }}>
// //                 <div style={{ fontSize:32, marginBottom:8 }}>
// //                   {alertConfig.icon}
// //                 </div>
// //                 <div style={{ fontSize:11, opacity:.6, textTransform:"uppercase",
// //                   letterSpacing:".08em", marginBottom:4 }}>
// //                   Alert Level
// //                 </div>
// //                 <div style={{ fontSize:22, fontWeight:800,
// //                   fontFamily:"'Playfair Display',serif" }}>
// //                   {weather.alertLevel}
// //                 </div>
// //               </div>

// //               {/* Right: 3-day forecast */}
// //               <div style={{ display:"flex", gap:16 }}>
// //                 {weather.forecast.map((f, i) => (
// //                   <div key={i} style={{ textAlign:"center",
// //                     background:"rgba(255,255,255,.08)", borderRadius:12,
// //                     padding:"14px 16px", minWidth:70 }}>
// //                     <div style={{ fontSize:11, opacity:.5, marginBottom:6 }}>
// //                       {i === 0 ? "Today" : fmtDate(f.date)}
// //                     </div>
// //                     <div style={{ fontSize:24, marginBottom:6 }}>{condEmoji(f.condition)}</div>
// //                     <div style={{ fontSize:14, fontWeight:700 }}>{f.tempMax}°</div>
// //                     <div style={{ fontSize:11, opacity:.5 }}>{f.tempMin}°</div>
// //                     {f.rainfall > 0 && (
// //                       <div style={{ fontSize:10, opacity:.6, marginTop:4 }}>
// //                         🌧️ {f.rainfall}mm
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* ── Crop advice banner ── */}
// //             <div style={{
// //               background: alertConfig.bg, border:`1px solid ${alertConfig.border}`,
// //               borderRadius:16, padding:"20px 24px", marginBottom:22,
// //               display:"flex", alignItems:"flex-start", gap:16 }}>
// //               <div style={{ fontSize:28, flexShrink:0 }}>{alertConfig.icon}</div>
// //               <div>
// //                 <div style={{ fontSize:14, fontWeight:700,
// //                   color: alertConfig.color, marginBottom:6 }}>
// //                   Crop Advisory — {weather.alertLevel}
// //                 </div>
// //                 <div style={{ fontSize:14, color:"#374151", lineHeight:1.6 }}>
// //                   {weather.cropAdvice}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* ── 5-day detail grid ── */}
// //             <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
// //               gap:16, marginBottom:22 }}>

// //               {/* Temperature */}
// //               <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
// //                 border:"1px solid #e8e4dc" }}>
// //                 <div style={{ fontSize:12, fontWeight:700, color:"#6b8070",
// //                   textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>
// //                   🌡️ Temperature
// //                 </div>
// //                 <div style={{ fontSize:36, fontWeight:800, color:"#1a3a2a",
// //                   fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
// //                   {weather.temperature}°C
// //                 </div>
// //                 <div style={{ fontSize:12, color:"#6b8070", marginTop:8 }}>
// //                   {weather.temperature > 32 ? "⚠️ High — water crops early morning" :
// //                    weather.temperature < 18 ? "❄️ Cool — good for leafy greens" :
// //                    "✅ Optimal growing temperature"}
// //                 </div>
// //                 {/* Thermometer bar */}
// //                 <div style={{ marginTop:12, background:"#f0ede8",
// //                   borderRadius:4, height:8, overflow:"hidden" }}>
// //                   <div style={{ height:"100%",
// //                     width:`${Math.min(100, (weather.temperature / 45) * 100)}%`,
// //                     background: weather.temperature > 35 ? "#ef4444" :
// //                                 weather.temperature > 28 ? "#f59e0b" : "#22c55e",
// //                     borderRadius:4 }} />
// //                 </div>
// //                 <div style={{ display:"flex", justifyContent:"space-between",
// //                   fontSize:10, color:"#9ca3af", marginTop:4 }}>
// //                   <span>0°C</span><span>45°C</span>
// //                 </div>
// //               </div>

// //               {/* Humidity */}
// //               <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
// //                 border:"1px solid #e8e4dc" }}>
// //                 <div style={{ fontSize:12, fontWeight:700, color:"#6b8070",
// //                   textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>
// //                   💧 Humidity
// //                 </div>
// //                 <div style={{ fontSize:36, fontWeight:800, color:"#1a3a2a",
// //                   fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
// //                   {weather.humidity}%
// //                 </div>
// //                 <div style={{ fontSize:12, color:"#6b8070", marginTop:8 }}>
// //                   {weather.humidity > 80 ? "⚠️ High — risk of fungal disease" :
// //                    weather.humidity < 30 ? "🌵 Low — increase irrigation" :
// //                    "✅ Good humidity for crops"}
// //                 </div>
// //                 {/* Humidity bar */}
// //                 <div style={{ marginTop:12, background:"#f0ede8",
// //                   borderRadius:4, height:8, overflow:"hidden" }}>
// //                   <div style={{ height:"100%",
// //                     width:`${weather.humidity}%`,
// //                     background: weather.humidity > 80 ? "#f59e0b" :
// //                                 weather.humidity < 30 ? "#ef4444" : "#22c55e",
// //                     borderRadius:4 }} />
// //                 </div>
// //                 <div style={{ display:"flex", justifyContent:"space-between",
// //                   fontSize:10, color:"#9ca3af", marginTop:4 }}>
// //                   <span>0%</span><span>100%</span>
// //                 </div>
// //               </div>

// //               {/* Wind */}
// //               <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
// //                 border:"1px solid #e8e4dc" }}>
// //                 <div style={{ fontSize:12, fontWeight:700, color:"#6b8070",
// //                   textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>
// //                   💨 Wind Speed
// //                 </div>
// //                 <div style={{ fontSize:36, fontWeight:800, color:"#1a3a2a",
// //                   fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
// //                   {weather.windSpeed}
// //                   <span style={{ fontSize:16, fontWeight:400, color:"#6b8070" }}> km/h</span>
// //                 </div>
// //                 <div style={{ fontSize:12, color:"#6b8070", marginTop:8 }}>
// //                   {weather.windSpeed > 60 ? "🚨 Dangerous — secure all structures" :
// //                    weather.windSpeed > 40 ? "⚠️ Strong — protect tall crops" :
// //                    weather.windSpeed > 20 ? "🌬️ Moderate — support plants if needed" :
// //                    "✅ Calm — ideal conditions"}
// //                 </div>
// //                 {/* Wind bar */}
// //                 <div style={{ marginTop:12, background:"#f0ede8",
// //                   borderRadius:4, height:8, overflow:"hidden" }}>
// //                   <div style={{ height:"100%",
// //                     width:`${Math.min(100, (weather.windSpeed / 80) * 100)}%`,
// //                     background: weather.windSpeed > 60 ? "#ef4444" :
// //                                 weather.windSpeed > 40 ? "#f59e0b" : "#22c55e",
// //                     borderRadius:4 }} />
// //                 </div>
// //                 <div style={{ display:"flex", justifyContent:"space-between",
// //                   fontSize:10, color:"#9ca3af", marginTop:4 }}>
// //                   <span>0</span><span>80 km/h</span>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* ── Extended forecast table ── */}
// //             {weather.forecast.length > 0 && (
// //               <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px",
// //                 border:"1px solid #e8e4dc" }}>
// //                 <div style={{ fontSize:16, fontWeight:700, color:"#1a3a2a", marginBottom:18 }}>
// //                   📅 3-Day Forecast
// //                 </div>
// //                 <div style={{ display:"grid",
// //                   gridTemplateColumns:`repeat(${weather.forecast.length}, 1fr)`, gap:14 }}>
// //                   {weather.forecast.map((f, i) => {
// //                     const alertLv = f.rainfall > 50 ? "Warning" :
// //                                     f.rainfall > 20 ? "Watch" : "Normal";
// //                     const ac = ALERT_CONFIG[alertLv];
// //                     return (
// //                       <div key={i} style={{ background:"#f9f7f4", borderRadius:14,
// //                         padding:"18px 16px", textAlign:"center",
// //                         border:`1px solid ${ac.border}` }}>
// //                         <div style={{ fontSize:13, fontWeight:700, color:"#1a3a2a",
// //                           marginBottom:10 }}>
// //                           {i === 0 ? "Tomorrow" : fmtDate(f.date)}
// //                         </div>
// //                         <div style={{ fontSize:36, marginBottom:10 }}>
// //                           {condEmoji(f.condition)}
// //                         </div>
// //                         <div style={{ fontSize:20, fontWeight:800, color:"#1a3a2a",
// //                           marginBottom:4 }}>
// //                           {f.tempMax}°C
// //                         </div>
// //                         <div style={{ fontSize:12, color:"#6b8070", marginBottom:10 }}>
// //                           Low: {f.tempMin}°C
// //                         </div>
// //                         <div style={{ fontSize:12, color:"#6b8070", marginBottom:8 }}>
// //                           💧 {f.humidity}% humidity
// //                         </div>
// //                         {f.rainfall > 0 && (
// //                           <div style={{ fontSize:12, fontWeight:600,
// //                             color: ac.color }}>
// //                             🌧️ {f.rainfall}mm rain
// //                           </div>
// //                         )}
// //                         <div style={{ marginTop:10, display:"inline-block",
// //                           padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700,
// //                           background: ac.bg, color: ac.color, border:`1px solid ${ac.border}` }}>
// //                           {ac.icon} {alertLv}
// //                         </div>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </main>

// //       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { profileAPI } from "@/lib/axios-proxy";
// import api from "@/lib/axios-proxy";

// interface User    { _id: string; name: string; email: string; role: string; }
// interface Profile { farmName: string; district: string; }
// interface WeatherAlert { _id: string; district: string; message: string; severity: string; createdAt: string; }

// const NAV = [
//   { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
//   { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
//   { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
//   { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
//   { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
//   { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
// ];

// const SEVERITY_MAP: Record<string, { bg: string; text: string; border: string; dot: string }> = {
//   low:      { bg: "#f0faf2", text: "#15803d", border: "#bbf7d0", dot: "#22c55e" },
//   medium:   { bg: "#fefce8", text: "#a16207", border: "#fde68a", dot: "#f59e0b" },
//   high:     { bg: "#fff1f2", text: "#be123c", border: "#fecdd3", dot: "#f43f5e" },
//   critical: { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8", dot: "#ec4899" },
// };

// const FARMING_TIPS = [
//   { icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z", tip: "Water crops early morning to reduce evaporation during warm days.", label: "Irrigation" },
//   { icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", tip: "Monitor humidity levels — high moisture can lead to fungal diseases.", label: "Humidity" },
//   { icon: "M13 10V3L4 14h7v7l9-11h-7z", tip: "Strong winds can damage crops. Consider windbreaks if alerts are frequent.", label: "Wind" },
//   { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", tip: "Harvest before heavy rain forecasts to protect crop quality.", label: "Harvest" },
// ];

// const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
//     strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
//     <path d={d} />
//   </svg>
// );

// export default function WeatherPage() {
//   const router = useRouter();

//   const [user,          setUser]          = useState<User | null>(null);
//   const [profile,       setProfile]       = useState<Profile | null>(null);
//   const [sub,           setSub]           = useState<any>(null);
//   const [alerts,        setAlerts]        = useState<WeatherAlert[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [sideCollapsed, setSideCollapsed] = useState(false);

//   const SBW = sideCollapsed ? 68 : 220;
//   const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
//   const getInitial = () => (user?.name || "F")[0].toUpperCase();

//   useEffect(() => {
//     const stored = localStorage.getItem("agriai_user");
//     const token  = localStorage.getItem("agriai_token");
//     if (!stored || !token) { router.push("/"); return; }
//     const u = JSON.parse(stored); setUser(u); loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [profR, wR, subR] = await Promise.allSettled([profileAPI.getMe(), api.get("/weather/my"), api.get("/subscriptions/my")]);
//       if (profR.status === "fulfilled") setProfile({ farmName: profR.value.data.farmName || "", district: profR.value.data.district || "" });
//       if (wR.status === "fulfilled")   setAlerts(wR.value.data?.alerts || wR.value.data || []);
//       if (subR.status === "fulfilled") setSub(subR.value.data);
//     } catch { }
//     setLoading(false);
//   };

//   const handleLogout = () => { localStorage.removeItem("agriai_token"); localStorage.removeItem("agriai_user"); router.push("/"); };

//   const activeAlerts = alerts.filter(a => a.severity !== "info");
//   const allClear     = activeAlerts.length === 0;

//   if (loading) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0e8", fontFamily: "'DM Sans',sans-serif" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#6aaa78)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <Icon d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" size={22} style={{ color: "#fff" }} />
//         </div>
//         <div style={{ color: "#2d5a3d", fontWeight: 700, fontSize: 15 }}>Loading weather…</div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
//         *{box-sizing:border-box;margin:0;padding:0;}
//         body{font-family:'DM Sans',sans-serif;background:#f2efe8;}
//         ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#d0cdc6;border-radius:10px;}
//         .nav-btn:hover{background:rgba(106,170,120,.15)!important;color:#fff!important;}
//         .action-btn:hover{opacity:.88;}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
//         .fade-up{animation:fadeUp .32s ease both;}
//         @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}} .pulse{animation:pulse 2s infinite;}
//       `}</style>

//       <div style={{ display: "flex", minHeight: "100vh", background: "#f2efe8" }}>

//         {/* ══ SIDEBAR ══ */}
//         <aside style={{ width: SBW, background: "linear-gradient(185deg,#1a3a2a 0%,#122a1c 60%,#0a1e11 100%)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 60, transition: "width .28s cubic-bezier(.4,0,.2,1)", overflow: "hidden", boxShadow: "4px 0 24px rgba(0,0,0,.18)" }}>
//           <div style={{ padding: sideCollapsed ? "18px 0" : "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: sideCollapsed ? "center" : "space-between" }}>
//             {!sideCollapsed && (
//               <div onClick={() => router.push("/")} style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff", cursor: "pointer", letterSpacing: "-0.5px" }}
//                 onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
//                 Ag<span style={{ color: "#6aaa78" }}>real</span>
//               </div>
//             )}
//             <button onClick={() => setSideCollapsed(p => !p)} className="action-btn" style={{ background: "rgba(255,255,255,.07)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,.5)", flexShrink: 0 }}>
//               <Icon d={sideCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} size={14} />
//             </button>
//           </div>
//           <div style={{ padding: sideCollapsed ? "14px 0" : "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: sideCollapsed ? "flex" : "block", justifyContent: "center" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start" }}>
//               <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,.15)", flexShrink: 0 }}>{getInitial()}</div>
//               {!sideCollapsed && (
//                 <div>
//                   <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
//                   <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>{profile?.farmName || "My Farm"}</div>
//                   {sub?.isActive && <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(106,170,120,.25)", borderRadius: 99, padding: "1px 8px", fontSize: 9, color: "#6aaa78", fontWeight: 700 }}><span className="pulse" style={{ width: 5, height: 5, borderRadius: "50%", background: "#6aaa78", display: "inline-block" }} />{sub.status === "trialing" ? "Free Trial" : "Active"}</div>}
//                 </div>
//               )}
//             </div>
//           </div>
//           <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
//             {!sideCollapsed && <div style={{ padding: "10px 16px 4px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em" }}>Navigation</div>}
//             {NAV.map(item => {
//               const active = item.href === "/dashboard/farmer/weather";
//               return (
//                 <button key={item.href} onClick={() => router.push(item.href)} className="nav-btn" title={sideCollapsed ? item.label : undefined}
//                   style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sideCollapsed ? "12px 0" : "9px 16px", justifyContent: sideCollapsed ? "center" : "flex-start", border: "none", background: active ? "rgba(106,170,120,.18)" : "transparent", borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent", color: active ? "#fff" : "rgba(255,255,255,.5)", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all .18s", textAlign: "left" }}>
//                   <Icon d={item.icon} size={17} style={{ flexShrink: 0 }} />
//                   {!sideCollapsed && <span>{item.label}</span>}
//                   {!sideCollapsed && active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6aaa78" }} />}
//                 </button>
//               );
//             })}
//           </nav>
//           <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.07)" }}>
//             <button onClick={() => router.push("/dashboard/farmer/settings")} className="nav-btn" title={sideCollapsed ? "Settings" : undefined} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "rgba(255,255,255,.4)", fontSize: 13, cursor: "pointer", transition: "all .18s" }}>
//               <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={16} style={{ flexShrink: 0 }} />
//               {!sideCollapsed && <span>Settings</span>}
//             </button>
//             <button onClick={handleLogout} className="nav-btn" title={sideCollapsed ? "Sign Out" : undefined} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "#f87171", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all .18s" }}>
//               <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={16} style={{ flexShrink: 0 }} />
//               {!sideCollapsed && <span>Sign Out</span>}
//             </button>
//           </div>
//         </aside>

//         {/* ══ MAIN ══ */}
//         <main style={{ marginLeft: SBW, flex: 1, display: "flex", flexDirection: "column", transition: "margin-left .28s cubic-bezier(.4,0,.2,1)", minHeight: "100vh" }}>
//           <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//               <button onClick={() => router.back()} className="action-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "#f4f0e8", border: "1px solid #e0ddd6", cursor: "pointer", flexShrink: 0 }}>
//                 <Icon d="M15 19l-7-7 7-7" size={16} style={{ color: "#1a3a2a" }} />
//               </button>
//               <div>
//                 <div style={{ fontSize: 19, fontWeight: 700, color: "#1c2b22", letterSpacing: "-.3px" }}>
//                   {greeting()}, <span style={{ color: "#2d5a3d" }}>{user?.name?.split(" ")[0]}</span>
//                 </div>
//                 <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>
//                   {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}{profile?.district ? ` · ${profile.district}` : ""}
//                 </div>
//               </div>
//             </div>
//             <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(45,90,61,.3)", cursor: "pointer" }}>{getInitial()}</div>
//           </header>

//           <div style={{ padding: "28px 32px", flex: 1 }}>

//             {/* Hero weather banner */}
//             <div className="fade-up" style={{ position: "relative", overflow: "hidden", background: allClear ? "linear-gradient(135deg,#1a3a2a 0%,#2d5a3d 55%,#3a7a50 100%)" : "linear-gradient(135deg,#7c2d12,#b45309)", borderRadius: 22, padding: "32px 36px", marginBottom: 28, color: "#fff" }}>
//               <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
//               <div style={{ position: "absolute", bottom: -30, right: 100, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
//               <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
//                 <div>
//                   <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>
//                     {profile?.district?.toUpperCase() || "YOUR DISTRICT"}, SRI LANKA
//                   </div>
//                   <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>
//                     {allClear ? "All clear for your region" : `${activeAlerts.length} active weather alert${activeAlerts.length > 1 ? "s" : ""}`}
//                   </div>
//                   <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)", maxWidth: 420, lineHeight: 1.6 }}>
//                     {allClear ? "No weather alerts for your area. Great conditions to tend your farm today." : alerts[0]?.message || "Stay safe and monitor conditions closely."}
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
//                   <div style={{ fontSize: 48, lineHeight: 1 }}>{allClear ? "☀️" : "⚠️"}</div>
//                   <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>
//                     Last updated: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Two-column */}
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

//               {/* Alerts list */}
//               <div>
//                 <div className="fade-up" style={{ background: "#fff", borderRadius: 20, border: "1px solid #eeebe4", boxShadow: "0 2px 12px rgba(0,0,0,.05)", overflow: "hidden" }}>
//                   <div style={{ padding: "20px 24px", borderBottom: "1px solid #f4f0ec" }}>
//                     <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22" }}>Weather Alerts</div>
//                     <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>{alerts.length} alerts for your region</div>
//                   </div>
//                   {alerts.length === 0 ? (
//                     <div style={{ padding: "56px 24px", textAlign: "center" }}>
//                       <div style={{ fontSize: 48, marginBottom: 14 }}>🌿</div>
//                       <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22", marginBottom: 6 }}>All clear!</div>
//                       <div style={{ fontSize: 13, color: "#9b9590" }}>No weather alerts for your district. Perfect farming conditions.</div>
//                     </div>
//                   ) : alerts.map((a, i) => {
//                     const sev = SEVERITY_MAP[a.severity?.toLowerCase()] || SEVERITY_MAP.medium;
//                     return (
//                       <div key={a._id} style={{ padding: "18px 24px", borderBottom: i < alerts.length - 1 ? "1px solid #f4f0ec" : "none", display: "flex", gap: 16, alignItems: "flex-start" }}>
//                         <div style={{ width: 44, height: 44, borderRadius: 12, background: sev.bg, border: `1px solid ${sev.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                           <Icon d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" size={20} style={{ color: sev.text }} />
//                         </div>
//                         <div style={{ flex: 1 }}>
//                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
//                             <div style={{ fontSize: 14, fontWeight: 700, color: "#1c2b22" }}>{a.district}</div>
//                             <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: sev.bg, color: sev.text }}>{a.severity?.toUpperCase()}</span>
//                           </div>
//                           <div style={{ fontSize: 13, color: "#6b8070", lineHeight: 1.6, marginBottom: 8 }}>{a.message}</div>
//                           <div style={{ fontSize: 11, color: "#b0ada8" }}>{new Date(a.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Right: tips */}
//               <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//                 <div className="fade-up" style={{ background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", borderRadius: 18, padding: "22px", color: "#fff" }}>
//                   <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Your District</div>
//                   <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Playfair Display',serif" }}>{profile?.district || "—"}</div>
//                   <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 6 }}>Sri Lanka</div>
//                   <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.1)", fontSize: 12, color: "rgba(255,255,255,.6)" }}>
//                     Alerts are refreshed in real-time based on your registered district.
//                   </div>
//                 </div>

//                 <div className="fade-up" style={{ background: "#fff", borderRadius: 18, border: "1px solid #eeebe4", boxShadow: "0 2px 10px rgba(0,0,0,.04)", overflow: "hidden" }}>
//                   <div style={{ padding: "18px 20px", borderBottom: "1px solid #f4f0ec" }}>
//                     <div style={{ fontSize: 15, fontWeight: 700, color: "#1c2b22" }}>Farming Tips</div>
//                     <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>Based on current conditions</div>
//                   </div>
//                   <div style={{ padding: "4px 0" }}>
//                     {FARMING_TIPS.map((t, i) => (
//                       <div key={i} style={{ padding: "14px 20px", display: "flex", gap: 12, alignItems: "flex-start", borderBottom: i < FARMING_TIPS.length - 1 ? "1px solid #f8f5f0" : "none" }}>
//                         <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f0f8f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                           <Icon d={t.icon} size={16} style={{ color: "#6aaa78" }} />
//                         </div>
//                         <div>
//                           <div style={{ fontSize: 11, fontWeight: 700, color: "#6aaa78", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{t.label}</div>
//                           <div style={{ fontSize: 12, color: "#6b8070", lineHeight: 1.6 }}>{t.tip}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
    setUser(u);
    const profileDistrict = u.district || "Kandy";
    setDistrict(profileDistrict);
    fetchWeather(profileDistrict);
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

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

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
                            <div style={{ fontSize:13, fontWeight:700, color:"#1a3a2a", marginBottom:10 }}>{i === 0 ? "Tomorrow" : fmtDate(f.date)}</div>
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