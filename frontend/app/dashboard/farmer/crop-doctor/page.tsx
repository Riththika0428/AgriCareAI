"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { diseaseAPI } from "@/lib/axios-proxy";

interface Treatment {
  name: string; dosage: string; instruction?: string; warning?: string;
}
interface ScanResult {
  _id: string; cropName: string; imageUrl: string;
  diseaseName: string; scientificName: string;
  confidence: number; severity: "None"|"Low"|"Medium"|"High";
  isHealthy: boolean;
  organicTreatments: Treatment[]; chemicalTreatments: Treatment[];
  status: string; createdAt: string;
}

const SEVERITY_COLOR: Record<string,string> = { None:"#2d6a35",Low:"#2d6a35",Medium:"#f5a623",High:"#e05252" };
const SEVERITY_WIDTH: Record<string,string> = { None:"10%",Low:"30%",Medium:"65%",High:"90%" };
const STATUS_STYLE: Record<string,{bg:string;color:string}> = {
  Pending:{bg:"#fff8e6",color:"#a07000"}, Treated:{bg:"#fff8e6",color:"#a07000"},
  Resolved:{bg:"#e8f5e9",color:"#2d6a35"}, Monitoring:{bg:"#e3f2fd",color:"#1565c0"},
};

const NAV = [
  { icon:"🏠", label:"Overview",    href:"/dashboard/farmer" },
  { icon:"🔬", label:"Crop Doctor", href:"/dashboard/farmer/crop-doctor" },
  { icon:"🌾", label:"My Products", href:"/dashboard/farmer/products" },
  { icon:"📦", label:"Orders",      href:"/dashboard/farmer/orders" },
  { icon:"⛈️", label:"Weather",     href:"/dashboard/farmer/weather" },
];

export default function CropDoctorPage() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user, setUser]           = useState<{name:string}|null>(null);
  const [cropName, setCropName]   = useState("");
  const [file, setFile]           = useState<File|null>(null);
  const [preview, setPreview]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [result, setResult]       = useState<ScanResult|null>(null);
  const [activeTab, setActiveTab] = useState<"organic"|"chemical">("organic");
  const [history, setHistory]     = useState<ScanResult[]>([]);
  const [histLoading, setHistLoad]= useState(false);
  const [logOpen, setLogOpen]     = useState(false);
  const [logNote, setLogNote]     = useState("");
  const [logStatus, setLogStatus] = useState("Treated");
  const [logSaving, setLogSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
    setUser(u);
    fetchHistory();
  }, []);

  // ✅ Uses diseaseAPI.getMy() — axios with auto-token, no manual header
  const fetchHistory = async () => {
    setHistLoad(true);
    try {
      const { data } = await diseaseAPI.getMy();
      setHistory(Array.isArray(data) ? data : []);
    } catch {}
    setHistLoad(false);
  };

  const handleFile = (f: File) => {
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setError("");
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  };

  // ✅ Uses diseaseAPI.scan() — sends FormData via axios
  const handleScan = async () => {
    if (!file)            { setError("Please choose a crop photo first."); return; }
    if (!cropName.trim()) { setError("Please enter the crop name."); return; }
    setLoading(true); setError("");
    try {
      const formData = new FormData();
      formData.append("image",    file);
      formData.append("cropName", cropName.trim());
      const { data } = await diseaseAPI.scan(formData);
      setResult(data.scan);
      setHistory(prev => [data.scan, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Scan failed. Make sure backend is running.");
    } finally { setLoading(false); }
  };

  // ✅ Uses diseaseAPI.updateStatus() — axios PUT
  const handleLogTreatment = async () => {
    if (!result) return;
    setLogSaving(true);
    try {
      await diseaseAPI.updateStatus(result._id, logStatus, logNote);
      setResult(prev => prev ? { ...prev, status: logStatus } : prev);
      setHistory(prev => prev.map(s => s._id === result._id ? { ...s, status: logStatus } : s));
      setLogOpen(false); setLogNote("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally { setLogSaving(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-CA");
  const getInitial = () => (user?.name || "F")[0].toUpperCase();

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f4f0e8" }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{ width:190, background:"linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
        display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, bottom:0, zIndex:50 }}>
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
              <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{user?.name||"Farmer"}</div>
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
        <div style={{ marginBottom:"24px" }}>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#1a3a2a", margin:0, display:"flex", alignItems:"center", gap:10 }}>
            🤖 AI Crop Doctor
          </h1>
          <p style={{ fontSize:"14px", color:"#6b8070", marginTop:"4px" }}>
            Upload a photo of your crop to detect diseases instantly
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"20px" }}>

          {/* Upload Card */}
          <div style={{ background:"white", borderRadius:"16px", padding:"24px", border:"1px solid #e8e4dc", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
            <h2 style={{ fontSize:"16px", fontWeight:700, color:"#1a3a2a", marginBottom:"18px" }}>Scan Your Crop</h2>
            <div style={{ marginBottom:"14px" }}>
              <label style={{ fontSize:"11px", fontWeight:700, color:"#6b8070", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"6px" }}>Crop Name</label>
              <input type="text" placeholder="e.g. Tomato, Chili, Broccoli, Spinach"
                value={cropName} onChange={e => setCropName(e.target.value)}
                style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e8e4dc", borderRadius:"10px",
                fontFamily:"'DM Sans',sans-serif", fontSize:"14px", color:"#1a3a2a",
                background:"#f9f7f3", outline:"none", boxSizing:"border-box" as const }} />
            </div>

            <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{ border:`2px dashed ${preview?"#6aaa78":"#d4d0c8"}`, borderRadius:"14px",
              padding:preview?"16px":"48px 20px", textAlign:"center", cursor:"pointer",
              background:preview?"#f4f8f4":"#fafaf7", transition:"all 0.2s", marginBottom:"14px" }}>
              {preview ? (
                <div>
                  <img src={preview} alt="preview"
                    style={{ maxHeight:"180px", maxWidth:"100%", borderRadius:"10px", objectFit:"cover" }} />
                  <div style={{ fontSize:"12px", color:"#6b8070", marginTop:"8px" }}>{file?.name}</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize:"36px", marginBottom:"10px" }}>⬆️</div>
                  <div style={{ fontSize:"14px", fontWeight:600, color:"#1a3a2a", marginBottom:"4px" }}>Upload Crop Image</div>
                  <div style={{ fontSize:"12px", color:"#6b8070" }}>Click or drag a photo of leaves, fruits, or stems</div>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display:"none" }}
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            {!preview && (
              <button onClick={() => fileInputRef.current?.click()}
                style={{ width:"100%", padding:"11px", background:"#2d6a35", color:"white", border:"none",
                borderRadius:"10px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                🔍 Choose Photo
              </button>
            )}

            {preview && (
              <button onClick={handleScan} disabled={loading}
                style={{ width:"100%", padding:"11px",
                background:loading?"#a8d5b5":"linear-gradient(135deg,#1a3a2a,#2d6a35)",
                color:"white", border:"none", borderRadius:"10px",
                fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600,
                cursor:loading?"not-allowed":"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                {loading ? (
                  <><span style={{ width:"14px", height:"14px", border:"2px solid rgba(255,255,255,0.4)",
                    borderTopColor:"white", borderRadius:"50%", display:"inline-block",
                    animation:"spin 0.7s linear infinite" }} />Analyzing…</>
                ) : "🤖 Analyze with AI"}
              </button>
            )}

            {error && (
              <div style={{ marginTop:"12px", padding:"10px 14px", background:"#fff1f1",
                border:"1px solid #fcd0d0", borderRadius:"10px", color:"#c0392b", fontSize:"13px" }}>
                ⚠️ {error}
              </div>
            )}
            {preview && (
              <button onClick={() => { setFile(null); setPreview(""); setResult(null); setError(""); }}
                style={{ width:"100%", marginTop:"10px", padding:"9px", background:"transparent",
                border:"1.5px solid #e8e4dc", borderRadius:"10px", color:"#6b8070", fontSize:"13px", cursor:"pointer" }}>
                ↺ Change Photo
              </button>
            )}
          </div>

          {/* Diagnosis Card */}
          <div style={{ background:"white", borderRadius:"16px", padding:"24px", border:"1px solid #e8e4dc", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
            <h2 style={{ fontSize:"16px", fontWeight:700, color:"#1a3a2a", marginBottom:"18px" }}>AI Diagnosis</h2>
            {!result ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"240px", color:"#c0bdb5" }}>
                <div style={{ fontSize:"48px", marginBottom:"12px", opacity:0.3 }}>🔬</div>
                <div style={{ fontSize:"14px" }}>Upload a crop image to get AI-powered diagnosis</div>
              </div>
            ) : (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"20px",
                  padding:"16px", background:result.isHealthy?"#e8f5e9":"#fff8e6", borderRadius:"12px" }}>
                  <div style={{ fontSize:"32px" }}>{result.isHealthy?"✅":"🔬"}</div>
                  <div>
                    <div style={{ fontSize:"18px", fontWeight:700, color:"#1a3a2a" }}>
                      {result.isHealthy ? "Crop is Healthy!" : `${result.diseaseName} Detected`}
                    </div>
                    <div style={{ fontSize:"13px", color:"#6b8070", marginTop:"2px" }}>
                      {result.scientificName && `${result.scientificName} · `}Confidence: {result.confidence}%
                    </div>
                  </div>
                </div>

                {!result.isHealthy && (
                  <div style={{ marginBottom:"20px" }}>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#1a3a2a", marginBottom:"8px" }}>Severity</div>
                    <div style={{ background:"#f0ede8", borderRadius:"6px", height:"10px", overflow:"hidden", marginBottom:"6px" }}>
                      <div style={{ height:"100%", width:SEVERITY_WIDTH[result.severity],
                        background:`linear-gradient(90deg,#2d6a35,${SEVERITY_COLOR[result.severity]})`,
                        borderRadius:"6px", transition:"width 1s ease" }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"flex-end" }}>
                      <span style={{ fontSize:"12px", fontWeight:700, padding:"3px 12px", borderRadius:"100px",
                        background:result.severity==="High"?"#fce4ec":result.severity==="Medium"?"#fff8e6":"#e8f5e9",
                        color:SEVERITY_COLOR[result.severity] }}>{result.severity}</span>
                    </div>
                  </div>
                )}

                {!result.isHealthy && (
                  <>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#1a3a2a", marginBottom:"10px" }}>Recommended Treatment</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", background:"#f4f0e8", borderRadius:"100px", padding:"3px", marginBottom:"14px" }}>
                      {(["organic","chemical"] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                          padding:"9px", borderRadius:"100px", border:"none", cursor:"pointer",
                          fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600,
                          background:activeTab===tab?"white":"transparent",
                          color:activeTab===tab?"#1a3a2a":"#6b8070",
                          boxShadow:activeTab===tab?"0 2px 8px rgba(0,0,0,0.08)":"none",
                          transition:"all 0.2s" }}>
                          {tab==="organic"?"🌿 Organic":"🧪 Chemical"}
                        </button>
                      ))}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"16px" }}>
                      {(activeTab==="organic"?result.organicTreatments:result.chemicalTreatments).map((t,i) => (
                        <div key={i} style={{ padding:"14px", background:"#f9f7f3", borderRadius:"12px", border:"1px solid #e8e4dc" }}>
                          <div style={{ fontSize:"14px", fontWeight:600, color:"#1a3a2a", marginBottom:"4px" }}>{t.name}</div>
                          <div style={{ fontSize:"12px", color:"#6b8070" }}>Dosage: {t.dosage}</div>
                          {t.instruction && <div style={{ fontSize:"12px", color:"#2d6a35", marginTop:"4px" }}>💡 {t.instruction}</div>}
                          {t.warning && <div style={{ fontSize:"12px", color:"#a07000", marginTop:"4px" }}>{t.warning}</div>}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setLogOpen(true)} style={{
                      width:"100%", padding:"11px", background:"#f4f0e8", border:"1.5px solid #d4d0c8",
                      borderRadius:"10px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px",
                      fontWeight:600, color:"#1a3a2a", cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                      🔄 Log Treatment
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Scan History */}
        <div style={{ background:"white", borderRadius:"16px", padding:"24px", border:"1px solid #e8e4dc", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"18px" }}>
            <h2 style={{ fontSize:"16px", fontWeight:700, color:"#1a3a2a", margin:0 }}>Scan History</h2>
            <span style={{ fontSize:"12px", color:"#6b8070" }}>{history.length} scans total</span>
          </div>
          {histLoading ? (
            <div style={{ textAlign:"center", padding:"40px", color:"#6b8070" }}>Loading history…</div>
          ) : history.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px", color:"#c0bdb5" }}>
              <div style={{ fontSize:"36px", marginBottom:"10px" }}>🔬</div>
              No scans yet. Upload a crop photo to get started.
            </div>
          ) : (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"100px 1fr 1fr 100px 120px",
                gap:"12px", padding:"8px 14px", fontSize:"11px", fontWeight:700, color:"#9b9b9b",
                textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid #f0ede8", marginBottom:"4px" }}>
                <span>Date</span><span>Crop</span><span>Disease</span><span>Severity</span><span>Status</span>
              </div>
              {history.map(s => (
                <div key={s._id} onClick={() => setResult(s)} style={{
                  display:"grid", gridTemplateColumns:"100px 1fr 1fr 100px 120px",
                  gap:"12px", padding:"12px 14px", borderBottom:"1px solid #f9f7f3",
                  cursor:"pointer", transition:"background 0.15s", borderRadius:"8px", alignItems:"center" }}
                  onMouseEnter={e => (e.currentTarget.style.background="#f9f7f3")}
                  onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                  <span style={{ fontSize:"12px", color:"#9b9b9b" }}>{formatDate(s.createdAt)}</span>
                  <span style={{ fontSize:"14px", fontWeight:600, color:"#1a3a2a" }}>{s.cropName}</span>
                  <span style={{ fontSize:"13px", color:"#6b8070" }}>{s.diseaseName}</span>
                  <span style={{ fontSize:"12px", fontWeight:600, color:SEVERITY_COLOR[s.severity]||"#6b8070" }}>{s.severity}</span>
                  <span style={{ fontSize:"11px", fontWeight:700, padding:"3px 12px", borderRadius:"100px", display:"inline-block",
                    background:STATUS_STYLE[s.status]?.bg||"#f4f0e8", color:STATUS_STYLE[s.status]?.color||"#6b8070" }}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Log Treatment Modal */}
      {logOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100,
          display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={e => { if(e.target===e.currentTarget) setLogOpen(false); }}>
          <div style={{ background:"white", borderRadius:"16px", padding:"28px", width:"100%", maxWidth:"420px" }}>
            <h3 style={{ fontSize:"18px", fontWeight:700, color:"#1a3a2a", marginBottom:"20px" }}>🔄 Log Treatment</h3>
            <label style={{ fontSize:"11px", fontWeight:700, color:"#6b8070", textTransform:"uppercase",
              letterSpacing:"0.06em", display:"block", marginBottom:"6px" }}>Update Status</label>
            <select value={logStatus} onChange={e => setLogStatus(e.target.value)}
              style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e8e4dc", borderRadius:"10px",
              fontFamily:"'DM Sans',sans-serif", fontSize:"14px", marginBottom:"16px", background:"#f9f7f3", outline:"none" }}>
              <option value="Treated">Treated</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Resolved">Resolved</option>
            </select>
            <label style={{ fontSize:"11px", fontWeight:700, color:"#6b8070", textTransform:"uppercase",
              letterSpacing:"0.06em", display:"block", marginBottom:"6px" }}>Notes (optional)</label>
            <textarea value={logNote} onChange={e => setLogNote(e.target.value)}
              placeholder="e.g. Applied Neem Oil spray on all leaves…" rows={3}
              style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e8e4dc", borderRadius:"10px",
              fontFamily:"'DM Sans',sans-serif", fontSize:"14px", background:"#f9f7f3", outline:"none",
              resize:"none" as const, marginBottom:"20px", boxSizing:"border-box" as const }} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <button onClick={() => setLogOpen(false)} style={{ padding:"11px", background:"transparent",
                border:"1.5px solid #e8e4dc", borderRadius:"10px", fontFamily:"'DM Sans',sans-serif",
                fontSize:"14px", fontWeight:600, color:"#6b8070", cursor:"pointer" }}>Cancel</button>
              <button onClick={handleLogTreatment} disabled={logSaving} style={{ padding:"11px",
                background:logSaving?"#a8d5b5":"linear-gradient(135deg,#1a3a2a,#2d6a35)",
                color:"white", border:"none", borderRadius:"10px",
                fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, cursor:"pointer" }}>
                {logSaving?"Saving…":"Save Log"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}