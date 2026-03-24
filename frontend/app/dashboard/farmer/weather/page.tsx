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
  { icon:"🏠", label:"Overview",    href:"/dashboard/farmer" },
  { icon:"🔬", label:"Crop Doctor", href:"/dashboard/farmer/crop-doctor" },
  { icon:"🌾", label:"My Products", href:"/dashboard/farmer/products" },
  { icon:"📦", label:"Orders",      href:"/dashboard/farmer/orders" },
  { icon:"⛈️", label:"Weather",     href:"/dashboard/farmer/weather" },
  { icon:"💰", label:"Earnings",    href:"/dashboard/farmer/earnings" },
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

export default function WeatherPage() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,      setUser]      = useState<any>(null);
  const [district,  setDistrict]  = useState("Kandy");
  const [weather,   setWeather]   = useState<WeatherData | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // ── Auth guard ─────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
    setUser(u);
    // Auto-load weather for farmer's district from profile
    const profileDistrict = u.district || "Kandy";
    setDistrict(profileDistrict);
    fetchWeather(profileDistrict);
  }, []);

  // ── Fetch weather from backend → OpenWeatherMap ────
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

  const getInitial  = () => (user?.name || "F")[0].toUpperCase();
  const alertConfig = weather ? ALERT_CONFIG[weather.alertLevel] : ALERT_CONFIG.Normal;
  const condEmoji   = (cond: string) => CONDITION_EMOJI[cond] || "🌤️";
  const fmtDate     = (d: string) => {
    const dt = new Date(d);
    return WEEKDAYS[dt.getDay()];
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f4f0e8" }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{ width:190, background:"linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
        display:"flex", flexDirection:"column", position:"fixed",
        top:0, left:0, bottom:0, zIndex:50 }}>
        <div style={{ padding:"22px 20px 16px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:22, color:"#fff" }}>
            Agri<span style={{ color:"#6aaa78" }}>AI</span>
          </div>
        </div>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:"#6aaa78",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, fontWeight:700, color:"#fff" }}>{getInitial()}</div>
            <div>
              <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{user?.name || "Farmer"}</div>
              <div style={{ color:"rgba(255,255,255,.45)", fontSize:11 }}>{district}</div>
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
        </nav>
        <div style={{ padding:"12px 0", borderTop:"1px solid rgba(255,255,255,.08)" }}>
          <button onClick={() => router.push("/dashboard/farmer/settings")} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 20px",
            border:"none", background:"transparent", color:"rgba(255,255,255,.45)", fontSize:13, cursor:"pointer" }}>
            ⚙️ Settings
          </button>
          <button onClick={handleLogout} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 20px",
            border:"none", background:"transparent", color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600 }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main style={{ marginLeft:190, flex:1, padding:"28px 32px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:"#1a3a2a", margin:0,
              display:"flex", alignItems:"center", gap:10 }}>
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
        <div style={{ background:"#fff", borderRadius:16, padding:"20px 24px",
          border:"1px solid #e8e4dc", marginBottom:22,
          display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:200 }}>
            <label style={{ fontSize:11, fontWeight:700, color:"#6b8070",
              textTransform:"uppercase", letterSpacing:".06em",
              display:"block", marginBottom:6 }}>
              Select District
            </label>
            <select value={district} onChange={e => setDistrict(e.target.value)}
              style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e8e4dc",
              borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14,
              color:"#1a3a2a", background:"#f9f7f4", outline:"none" }}>
              {SL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"flex-end", paddingBottom:2 }}>
            <button onClick={() => fetchWeather()} disabled={loading} style={{
              padding:"10px 22px",
              background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
              color:"#fff", border:"none", borderRadius:10,
              fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", gap:8 }}>
              {loading ? (
                <><span style={{ width:14, height:14, border:"2px solid rgba(255,255,255,.4)",
                  borderTopColor:"#fff", borderRadius:"50%", display:"inline-block",
                  animation:"spin .7s linear infinite" }} />Fetching…</>
              ) : "🔄 Get Weather"}
            </button>
            {weather && (
              <button onClick={handleSave} disabled={saving || saved} style={{
                padding:"10px 22px",
                background: saved ? "#e8f5e9" : saving ? "#f4f0e8" : "#f4f0e8",
                color: saved ? "#166534" : "#1a3a2a",
                border:"1.5px solid",
                borderColor: saved ? "#bbf7d0" : "#e8e4dc",
                borderRadius:10, fontSize:14, fontWeight:700,
                cursor: saving || saved ? "default" : "pointer" }}>
                {saved ? "✅ Saved!" : saving ? "Saving…" : "💾 Save Alert"}
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:"#fff1f1", border:"1px solid #fcd0d0", borderRadius:12,
            padding:"14px 18px", marginBottom:22, color:"#c0392b", fontSize:13 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Empty state */}
        {!weather && !loading && !error && (
          <div style={{ background:"#fff", borderRadius:16, padding:"60px",
            border:"1px solid #e8e4dc", textAlign:"center" }}>
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
            <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
              borderRadius:20, padding:"28px 32px", marginBottom:22, color:"#fff",
              display:"flex", justifyContent:"space-between", alignItems:"center",
              flexWrap:"wrap", gap:20 }}>

              {/* Left: temp + condition */}
              <div>
                <div style={{ fontSize:12, opacity:.6, marginBottom:6,
                  textTransform:"uppercase", letterSpacing:".06em" }}>
                  📍 {weather.district}, Sri Lanka
                </div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:12, marginBottom:6 }}>
                  <div style={{ fontSize:72, fontWeight:900,
                    fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
                    {weather.temperature}°
                  </div>
                  <div style={{ paddingBottom:12 }}>
                    <div style={{ fontSize:28 }}>{condEmoji(weather.condition)}</div>
                    <div style={{ fontSize:14, opacity:.7, textTransform:"capitalize" }}>
                      {weather.description}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:20, fontSize:13, opacity:.7 }}>
                  <span>💧 {weather.humidity}% humidity</span>
                  <span>💨 {weather.windSpeed} km/h</span>
                  <span>🌧️ {weather.rainfall}mm rain</span>
                </div>
              </div>

              {/* Center: alert level */}
              <div style={{ background:"rgba(255,255,255,.1)", borderRadius:16,
                padding:"20px 24px", textAlign:"center", minWidth:160 }}>
                <div style={{ fontSize:32, marginBottom:8 }}>
                  {alertConfig.icon}
                </div>
                <div style={{ fontSize:11, opacity:.6, textTransform:"uppercase",
                  letterSpacing:".08em", marginBottom:4 }}>
                  Alert Level
                </div>
                <div style={{ fontSize:22, fontWeight:800,
                  fontFamily:"'Playfair Display',serif" }}>
                  {weather.alertLevel}
                </div>
              </div>

              {/* Right: 3-day forecast */}
              <div style={{ display:"flex", gap:16 }}>
                {weather.forecast.map((f, i) => (
                  <div key={i} style={{ textAlign:"center",
                    background:"rgba(255,255,255,.08)", borderRadius:12,
                    padding:"14px 16px", minWidth:70 }}>
                    <div style={{ fontSize:11, opacity:.5, marginBottom:6 }}>
                      {i === 0 ? "Today" : fmtDate(f.date)}
                    </div>
                    <div style={{ fontSize:24, marginBottom:6 }}>{condEmoji(f.condition)}</div>
                    <div style={{ fontSize:14, fontWeight:700 }}>{f.tempMax}°</div>
                    <div style={{ fontSize:11, opacity:.5 }}>{f.tempMin}°</div>
                    {f.rainfall > 0 && (
                      <div style={{ fontSize:10, opacity:.6, marginTop:4 }}>
                        🌧️ {f.rainfall}mm
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Crop advice banner ── */}
            <div style={{
              background: alertConfig.bg, border:`1px solid ${alertConfig.border}`,
              borderRadius:16, padding:"20px 24px", marginBottom:22,
              display:"flex", alignItems:"flex-start", gap:16 }}>
              <div style={{ fontSize:28, flexShrink:0 }}>{alertConfig.icon}</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700,
                  color: alertConfig.color, marginBottom:6 }}>
                  Crop Advisory — {weather.alertLevel}
                </div>
                <div style={{ fontSize:14, color:"#374151", lineHeight:1.6 }}>
                  {weather.cropAdvice}
                </div>
              </div>
            </div>

            {/* ── 5-day detail grid ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
              gap:16, marginBottom:22 }}>

              {/* Temperature */}
              <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
                border:"1px solid #e8e4dc" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#6b8070",
                  textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>
                  🌡️ Temperature
                </div>
                <div style={{ fontSize:36, fontWeight:800, color:"#1a3a2a",
                  fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
                  {weather.temperature}°C
                </div>
                <div style={{ fontSize:12, color:"#6b8070", marginTop:8 }}>
                  {weather.temperature > 32 ? "⚠️ High — water crops early morning" :
                   weather.temperature < 18 ? "❄️ Cool — good for leafy greens" :
                   "✅ Optimal growing temperature"}
                </div>
                {/* Thermometer bar */}
                <div style={{ marginTop:12, background:"#f0ede8",
                  borderRadius:4, height:8, overflow:"hidden" }}>
                  <div style={{ height:"100%",
                    width:`${Math.min(100, (weather.temperature / 45) * 100)}%`,
                    background: weather.temperature > 35 ? "#ef4444" :
                                weather.temperature > 28 ? "#f59e0b" : "#22c55e",
                    borderRadius:4 }} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between",
                  fontSize:10, color:"#9ca3af", marginTop:4 }}>
                  <span>0°C</span><span>45°C</span>
                </div>
              </div>

              {/* Humidity */}
              <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
                border:"1px solid #e8e4dc" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#6b8070",
                  textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>
                  💧 Humidity
                </div>
                <div style={{ fontSize:36, fontWeight:800, color:"#1a3a2a",
                  fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
                  {weather.humidity}%
                </div>
                <div style={{ fontSize:12, color:"#6b8070", marginTop:8 }}>
                  {weather.humidity > 80 ? "⚠️ High — risk of fungal disease" :
                   weather.humidity < 30 ? "🌵 Low — increase irrigation" :
                   "✅ Good humidity for crops"}
                </div>
                {/* Humidity bar */}
                <div style={{ marginTop:12, background:"#f0ede8",
                  borderRadius:4, height:8, overflow:"hidden" }}>
                  <div style={{ height:"100%",
                    width:`${weather.humidity}%`,
                    background: weather.humidity > 80 ? "#f59e0b" :
                                weather.humidity < 30 ? "#ef4444" : "#22c55e",
                    borderRadius:4 }} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between",
                  fontSize:10, color:"#9ca3af", marginTop:4 }}>
                  <span>0%</span><span>100%</span>
                </div>
              </div>

              {/* Wind */}
              <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
                border:"1px solid #e8e4dc" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#6b8070",
                  textTransform:"uppercase", letterSpacing:".06em", marginBottom:12 }}>
                  💨 Wind Speed
                </div>
                <div style={{ fontSize:36, fontWeight:800, color:"#1a3a2a",
                  fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
                  {weather.windSpeed}
                  <span style={{ fontSize:16, fontWeight:400, color:"#6b8070" }}> km/h</span>
                </div>
                <div style={{ fontSize:12, color:"#6b8070", marginTop:8 }}>
                  {weather.windSpeed > 60 ? "🚨 Dangerous — secure all structures" :
                   weather.windSpeed > 40 ? "⚠️ Strong — protect tall crops" :
                   weather.windSpeed > 20 ? "🌬️ Moderate — support plants if needed" :
                   "✅ Calm — ideal conditions"}
                </div>
                {/* Wind bar */}
                <div style={{ marginTop:12, background:"#f0ede8",
                  borderRadius:4, height:8, overflow:"hidden" }}>
                  <div style={{ height:"100%",
                    width:`${Math.min(100, (weather.windSpeed / 80) * 100)}%`,
                    background: weather.windSpeed > 60 ? "#ef4444" :
                                weather.windSpeed > 40 ? "#f59e0b" : "#22c55e",
                    borderRadius:4 }} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between",
                  fontSize:10, color:"#9ca3af", marginTop:4 }}>
                  <span>0</span><span>80 km/h</span>
                </div>
              </div>
            </div>

            {/* ── Extended forecast table ── */}
            {weather.forecast.length > 0 && (
              <div style={{ background:"#fff", borderRadius:16, padding:"22px 24px",
                border:"1px solid #e8e4dc" }}>
                <div style={{ fontSize:16, fontWeight:700, color:"#1a3a2a", marginBottom:18 }}>
                  📅 3-Day Forecast
                </div>
                <div style={{ display:"grid",
                  gridTemplateColumns:`repeat(${weather.forecast.length}, 1fr)`, gap:14 }}>
                  {weather.forecast.map((f, i) => {
                    const alertLv = f.rainfall > 50 ? "Warning" :
                                    f.rainfall > 20 ? "Watch" : "Normal";
                    const ac = ALERT_CONFIG[alertLv];
                    return (
                      <div key={i} style={{ background:"#f9f7f4", borderRadius:14,
                        padding:"18px 16px", textAlign:"center",
                        border:`1px solid ${ac.border}` }}>
                        <div style={{ fontSize:13, fontWeight:700, color:"#1a3a2a",
                          marginBottom:10 }}>
                          {i === 0 ? "Tomorrow" : fmtDate(f.date)}
                        </div>
                        <div style={{ fontSize:36, marginBottom:10 }}>
                          {condEmoji(f.condition)}
                        </div>
                        <div style={{ fontSize:20, fontWeight:800, color:"#1a3a2a",
                          marginBottom:4 }}>
                          {f.tempMax}°C
                        </div>
                        <div style={{ fontSize:12, color:"#6b8070", marginBottom:10 }}>
                          Low: {f.tempMin}°C
                        </div>
                        <div style={{ fontSize:12, color:"#6b8070", marginBottom:8 }}>
                          💧 {f.humidity}% humidity
                        </div>
                        {f.rainfall > 0 && (
                          <div style={{ fontSize:12, fontWeight:600,
                            color: ac.color }}>
                            🌧️ {f.rainfall}mm rain
                          </div>
                        )}
                        <div style={{ marginTop:10, display:"inline-block",
                          padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700,
                          background: ac.bg, color: ac.color, border:`1px solid ${ac.border}` }}>
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
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}