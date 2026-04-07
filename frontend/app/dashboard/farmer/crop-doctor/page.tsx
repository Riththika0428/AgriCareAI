"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { diseaseAPI, profileAPI } from "@/lib/axios-proxy";
import api from "@/lib/axios-proxy";

interface User    { _id: string; name: string; email: string; role: string; }
interface Profile { farmName: string; district: string; }
interface Disease { _id: string; cropName: string; diagnosis: string; severity: string; treatment?: string; createdAt: string; status: string; imageUrl?: string; }

const NAV = [
  { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const SEVERITY_COLOR: Record<string, [string, string]> = {
  low:      ["#dcfce7","#15803d"],
  medium:   ["#fef9c3","#a16207"],
  high:     ["#fee2e2","#dc2626"],
  critical: ["#fce7f3","#9d174d"],
};

const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);

export default function CropDoctorPage() {
  const router  = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user,          setUser]          = useState<User | null>(null);
  const [profile,       setProfile]       = useState<Profile | null>(null);
  const [sub,           setSub]           = useState<any>(null);
  const [diseases,      setDiseases]      = useState<Disease[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [analyzing,     setAnalyzing]     = useState(false);
  const [result,        setResult]        = useState<Disease | null>(null);
  const [preview,       setPreview]       = useState<string | null>(null);
  const [imageFile,     setImageFile]     = useState<File | null>(null);
  const [cropName,      setCropName]      = useState("");
  const [symptoms,      setSymptoms]      = useState("");
  const [toast,         setToast]         = useState("");
  const [drag,          setDrag]          = useState(false);

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
      const [profR, disR, subR] = await Promise.allSettled([profileAPI.getMe(), diseaseAPI.getMy(), api.get("/subscriptions/my")]);
      if (profR.status === "fulfilled") setProfile({ farmName: profR.value.data.farmName || "", district: profR.value.data.district || "" });
      if (disR.status === "fulfilled")  setDiseases(disR.value.data?.diseases || disR.value.data || []);
      if (subR.status === "fulfilled")  setSub(subR.value.data);
    } catch { }
    setLoading(false);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { showToast("File too large. Max 5MB."); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!cropName.trim() || !symptoms.trim()) { showToast("Please fill in crop name and symptoms."); return; }
    setAnalyzing(true); setResult(null);
    try {
      const formData = new FormData();
      formData.append("cropName", cropName);
      formData.append("symptoms", symptoms);
      if (imageFile) formData.append("image", imageFile);
      const { data } = await diseaseAPI.scan(formData);
      const d = data.disease || data;
      setResult(d);
      setDiseases(prev => [d, ...prev]);
      showToast("Analysis complete!");
    } catch (e: any) {
      showToast(e.response?.data?.message || "Analysis failed. Please try again.");
    }
    setAnalyzing(false);
  };

  const handleResolve = async (id: string) => {
    try {
      await diseaseAPI.updateStatus(id, "resolved");
      setDiseases(prev => prev.map(d => d._id === id ? { ...d, status: "resolved" } : d));
      if (result?._id === id) setResult(prev => prev ? { ...prev, status: "resolved" } : null);
      showToast("Marked as resolved.");
    } catch { showToast("Failed to update."); }
  };

  const handleLogout = () => { localStorage.removeItem("agriai_token"); localStorage.removeItem("agriai_user"); router.push("/"); };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0e8", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#6aaa78)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={22} style={{ color: "#fff" }} />
        </div>
        <div style={{ color: "#2d5a3d", fontWeight: 700, fontSize: 15 }}>Loading Crop Doctor…</div>
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
        .hover-btn:hover{opacity:.88;}
        input:focus,textarea:focus{outline:none;border-color:#6aaa78!important;box-shadow:0 0 0 3px rgba(106,170,120,.15);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp .32s ease both;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}} .pulse{animation:pulse 1.4s infinite;}
        @keyframes toastIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .toast{animation:toastIn .25s ease both;}
        @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        .spin{animation:spin 1s linear infinite;}
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
              const active = item.href === "/dashboard/farmer/crop-doctor";
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
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#15803d" }}>
                <span className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                Cerebras AI Active
              </div>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(45,90,61,.3)", cursor: "pointer" }}>{getInitial()}</div>
            </div>
          </header>

          {/* Body */}
          <div style={{ padding: "28px 32px", flex: 1 }}>

            {/* Page title */}
            <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(26,58,42,.25)" }}>
                <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={24} style={{ color: "#6aaa78" }} />
              </div>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1c2b22", fontFamily: "'Playfair Display',serif" }}>Crop Doctor</h1>
                <p style={{ fontSize: 13, color: "#9b9590", marginTop: 3 }}>Upload a photo of your crop for instant AI diagnosis · Powered by Cerebras AI</p>
              </div>
            </div>

            {/* Two-column layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>

              {/* Left: Scan form */}
              <div className="fade-up" style={{ background: "#fff", borderRadius: 20, border: "1px solid #eeebe4", boxShadow: "0 2px 12px rgba(0,0,0,.05)", overflow: "hidden" }}>
                <div style={{ padding: "22px 28px", borderBottom: "1px solid #f4f0ec", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "#f0f8f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={16} style={{ color: "#6aaa78" }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22" }}>Scan Your Crop</div>
                </div>
                <div style={{ padding: "28px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {/* Crop name */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 7 }}>Crop Name <span style={{ color: "#ef4444" }}>*</span></label>
                      <input value={cropName} onChange={e => setCropName(e.target.value)} placeholder="e.g. Tomato, Chili, Broccoli, Spinach…"
                        style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e0ddd6", borderRadius: 11, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }} />
                    </div>
                    {/* Symptoms */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 7 }}>Symptoms Description <span style={{ color: "#ef4444" }}>*</span></label>
                      <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={4}
                        placeholder="e.g. Yellow spots on leaves, brown edges, wilting stems, white powder on surface…"
                        style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e0ddd6", borderRadius: 11, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4", resize: "vertical" }} />
                      <div style={{ fontSize: 11, color: "#9b9590", marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                        <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={13} style={{ color: "#9b9590", flexShrink: 0 }} />
                        Cerebras AI uses this — be as specific as possible for better accuracy
                      </div>
                    </div>
                    {/* Image upload */}
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 7 }}>Crop Photo (optional)</label>
                      <div
                        onDragOver={e => { e.preventDefault(); setDrag(true); }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                        onClick={() => fileRef.current?.click()}
                        style={{ border: `2px dashed ${drag ? "#6aaa78" : "#d0ddd6"}`, borderRadius: 14, padding: preview ? "0" : "36px 20px", textAlign: "center", cursor: "pointer", background: drag ? "#f0faf2" : preview ? "transparent" : "#fafaf8", transition: "all .2s", overflow: "hidden" }}>
                        {preview ? (
                          <div style={{ position: "relative" }}>
                            <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />
                            <button onClick={e => { e.stopPropagation(); setPreview(null); setImageFile(null); }}
                              style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.6)", border: "none", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                              <Icon d="M6 18L18 6M6 6l12 12" size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                              <Icon d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" size={22} style={{ color: "#6aaa78" }} />
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#1c2b22", marginBottom: 4 }}>Upload Crop Photo</div>
                            <div style={{ fontSize: 12, color: "#9b9590" }}>Click or drag & drop — JPG, PNG, WebP · Max 5MB</div>
                          </>
                        )}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                      {!preview && (
                        <button onClick={() => fileRef.current?.click()} className="hover-btn"
                          style={{ width: "100%", marginTop: 12, padding: "12px", background: "#f4f0e8", border: "1px solid #e0ddd6", borderRadius: 11, fontSize: 14, fontWeight: 600, color: "#1a3a2a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <Icon d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" size={16} />
                          Choose Photo
                        </button>
                      )}
                    </div>
                    {/* Analyze button */}
                    <button onClick={handleAnalyze} disabled={analyzing || !cropName || !symptoms} className="hover-btn"
                      style={{ padding: "14px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: (!cropName || !symptoms) ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 6px 20px rgba(26,58,42,.25)" }}>
                      {analyzing ? (
                        <>
                          <svg className="spin" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          Analyzing with AI…
                        </>
                      ) : (
                        <>
                          <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={18} />
                          Analyze Crop
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: AI Diagnosis result */}
              <div className="fade-up" style={{ background: "#fff", borderRadius: 20, border: "1px solid #eeebe4", boxShadow: "0 2px 12px rgba(0,0,0,.05)", overflow: "hidden" }}>
                <div style={{ padding: "22px 28px", borderBottom: "1px solid #f4f0ec", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "#f0f8f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={16} style={{ color: "#6aaa78" }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22" }}>AI Diagnosis</div>
                </div>
                <div style={{ padding: "28px" }}>
                  {analyzing ? (
                    <div style={{ textAlign: "center", padding: "48px 20px" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#e8f5e9,#f0f8f2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <svg className="spin" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#6aaa78" strokeWidth={2}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1c2b22", marginBottom: 6 }}>Analyzing your crop…</div>
                      <div style={{ fontSize: 13, color: "#9b9590" }}>Cerebras AI is processing your request</div>
                    </div>
                  ) : result ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {/* Crop + severity */}
                      <div style={{ background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", borderRadius: 14, padding: "18px 20px", color: "#fff" }}>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Crop Detected</div>
                        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Playfair Display',serif" }}>{result.cropName}</div>
                        {result.severity && (
                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: (SEVERITY_COLOR[result.severity.toLowerCase()] || SEVERITY_COLOR.medium)[0], color: (SEVERITY_COLOR[result.severity.toLowerCase()] || SEVERITY_COLOR.medium)[1] }}>
                              {result.severity.toUpperCase()} SEVERITY
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Diagnosis */}
                      <div style={{ background: "#f9f7f4", borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Diagnosis</div>
                        <div style={{ fontSize: 14, color: "#1c2b22", lineHeight: 1.6, fontWeight: 500 }}>{result.diagnosis}</div>
                      </div>
                      {/* Treatment */}
                      {result.treatment && (
                        <div style={{ background: "#f0faf2", border: "1px solid #bbf7d0", borderRadius: 12, padding: "16px 18px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            <Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" size={14} />
                            Recommended Treatment
                          </div>
                          <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{result.treatment}</div>
                        </div>
                      )}
                      {/* Status + resolve */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 99, background: result.status === "resolved" ? "#dcfce7" : "#fef9c3", color: result.status === "resolved" ? "#15803d" : "#a16207" }}>
                          {result.status === "resolved" ? "✓ Resolved" : "Active"}
                        </span>
                        {result.status !== "resolved" && (
                          <button onClick={() => handleResolve(result._id)} className="hover-btn"
                            style={{ padding: "7px 14px", background: "#f0faf2", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#15803d", cursor: "pointer" }}>
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "48px 20px" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f4f0e8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={28} style={{ color: "#c0bdb5" }} />
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#9b9590", marginBottom: 6 }}>No diagnosis yet</div>
                      <div style={{ fontSize: 13, color: "#b0ada8" }}>Fill in crop name, describe symptoms,<br />upload a photo, then click Analyze</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scan History */}
            <div className="fade-up" style={{ marginTop: 24, background: "#fff", borderRadius: 20, border: "1px solid #eeebe4", boxShadow: "0 2px 12px rgba(0,0,0,.05)", overflow: "hidden" }}>
              <div style={{ padding: "20px 28px", borderBottom: "1px solid #f4f0ec", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22" }}>Scan History</div>
                  <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>{diseases.length} total scans</div>
                </div>
              </div>
              {diseases.length === 0 ? (
                <div style={{ padding: "48px 20px", textAlign: "center", color: "#b0ada8", fontSize: 13 }}>No scans yet. Use the form above to get started.</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 1, background: "#f4f0ec" }}>
                  {diseases.slice(0, 9).map((d, i) => (
                    <div key={d._id || `scan-${i}`} style={{ background: "#fff", padding: "18px 22px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.status === "resolved" ? "#6aaa78" : "#f59e0b", flexShrink: 0 }} />
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1c2b22" }}>{d.cropName}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: d.status === "resolved" ? "#dcfce7" : "#fef9c3", color: d.status === "resolved" ? "#15803d" : "#a16207" }}>
                          {d.status === "resolved" ? "Resolved" : "Active"}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: "#6b8070", marginBottom: 8, lineHeight: 1.5 }}>{d.diagnosis}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 11, color: "#b0ada8" }}>{new Date(d.createdAt).toLocaleDateString()}</div>
                        {d.status !== "resolved" && (
                          <button onClick={() => handleResolve(d._id)} className="hover-btn"
                            style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: "#dcfce7", color: "#15803d", border: "none", cursor: "pointer", transition: "all .2s" }}>
                            Resolve →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, background: "#1a3a2a", color: "#fff", padding: "13px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.2)", zIndex: 300 }}>{toast}</div>
      )}
    </>
  );
}