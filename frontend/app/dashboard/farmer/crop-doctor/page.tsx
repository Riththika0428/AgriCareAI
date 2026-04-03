// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
// import { diseaseAPI } from "@/lib/axios-proxy";

// interface Treatment {
//   name: string; dosage: string; instruction?: string; warning?: string;
// }
// interface ScanResult {
//   _id: string; cropName: string; imageUrl: string;
//   diseaseName: string; scientificName: string;
//   confidence: number; severity: "None"|"Low"|"Medium"|"High";
//   isHealthy: boolean;
//   organicTreatments: Treatment[]; chemicalTreatments: Treatment[];
//   status: string; createdAt: string;
// }

// const SEVERITY_COLOR: Record<string,string> = { None:"#2d6a35",Low:"#2d6a35",Medium:"#f5a623",High:"#e05252" };
// const SEVERITY_WIDTH: Record<string,string> = { None:"10%",Low:"30%",Medium:"65%",High:"90%" };
// const STATUS_STYLE: Record<string,{bg:string;color:string}> = {
//   Pending:{bg:"#fff8e6",color:"#a07000"}, Treated:{bg:"#fff8e6",color:"#a07000"},
//   Resolved:{bg:"#e8f5e9",color:"#2d6a35"}, Monitoring:{bg:"#e3f2fd",color:"#1565c0"},
// };

// const NAV = [
//   { label: "Overview",    href: "/dashboard/farmer",              icon: "⌂" },
//   { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor",  icon: "✦" },
//   { label: "My Products", href: "/dashboard/farmer/products",     icon: "❧" },
//   { label: "Orders",      href: "/dashboard/farmer/orders",       icon: "◈" },
//   { label: "Weather",     href: "/dashboard/farmer/weather",      icon: "◎" },
//   { label: "Earnings",    href: "/dashboard/farmer/earnings",     icon: "◇" },
// ];

// export default function CropDoctorPage() {
//   const router   = useRouter();
//   const pathname = usePathname();

//   const [user, setUser]           = useState<{name:string}|null>(null);
//   const [cropName, setCropName]   = useState("");
//   const [file, setFile]           = useState<File|null>(null);
//   const [preview, setPreview]     = useState("");
//   const [loading, setLoading]     = useState(false);
//   const [error, setError]         = useState("");
//   const [result, setResult]       = useState<ScanResult|null>(null);
//   const [activeTab, setActiveTab] = useState<"organic"|"chemical">("organic");
//   const [history, setHistory]     = useState<ScanResult[]>([]);
//   const [histLoading, setHistLoad]= useState(false);
//   const [logOpen, setLogOpen]     = useState(false);
//   const [logNote, setLogNote]     = useState("");
//   const [logStatus, setLogStatus] = useState("Treated");
//   const [logSaving, setLogSaving] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("agriai_user");
//     const token  = localStorage.getItem("agriai_token");
//     if (!stored || !token) { router.push("/"); return; }
//     const u = JSON.parse(stored);
//     if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
//     setUser(u);
//     fetchHistory();
//   }, []);

//   // ✅ Uses diseaseAPI.getMy() — axios with auto-token, no manual header
//   const fetchHistory = async () => {
//     setHistLoad(true);
//     try {
//       const { data } = await diseaseAPI.getMy();
//       setHistory(Array.isArray(data) ? data : []);
//     } catch {}
//     setHistLoad(false);
//   };

//   const handleFile = (f: File) => {
//     setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setError("");
//   };
//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f);
//   };

//   // ✅ Uses diseaseAPI.scan() — sends FormData via axios
//   const handleScan = async () => {
//     if (!file)            { setError("Please choose a crop photo first."); return; }
//     if (!cropName.trim()) { setError("Please enter the crop name."); return; }
//     setLoading(true); setError("");
//     try {
//       const formData = new FormData();
//       formData.append("image",    file);
//       formData.append("cropName", cropName.trim());
//       const { data } = await diseaseAPI.scan(formData);
//       setResult(data.scan);
//       setHistory(prev => [data.scan, ...prev]);
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Scan failed. Make sure backend is running.");
//     } finally { setLoading(false); }
//   };

//   // ✅ Uses diseaseAPI.updateStatus() — axios PUT
//   const handleLogTreatment = async () => {
//     if (!result) return;
//     setLogSaving(true);
//     try {
//       await diseaseAPI.updateStatus(result._id, logStatus, logNote);
//       setResult(prev => prev ? { ...prev, status: logStatus } : prev);
//       setHistory(prev => prev.map(s => s._id === result._id ? { ...s, status: logStatus } : s));
//       setLogOpen(false); setLogNote("");
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to save.");
//     } finally { setLogSaving(false); }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("agriai_token");
//     localStorage.removeItem("agriai_user");
//     router.push("/");
//   };

//   const formatDate = (d: string) => new Date(d).toLocaleDateString("en-CA");
//   const getInitial = () => (user?.name || "F")[0].toUpperCase();

//   return (
//     <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f4f0e8" }}>

//       {/* ══ SIDEBAR ══ */}
//       <aside style={{
//         width: 200, background: "linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
//         display: "flex", flexDirection: "column",
//         position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
//       }}>
//         {/* Logo */}
//         <div style={{ padding: "24px 22px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
//           <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 24, color: "#fff" }}>
//             Ag<span style={{ color: "#6aaa78" }}>real</span>
//           </div>
//         </div>

//         {/* User */}
//         <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{
//               width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: 15, fontWeight: 700, color: "#fff",
//               boxShadow: "0 2px 8px rgba(106,170,120,.4)",
//             }}>
//               {getInitial()}
//             </div>
//             <div>
//               <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
//               <div style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>My Farm</div>
//             </div>
//           </div>
//         </div>

//         {/* Nav label */}
//         <div style={{ padding: "16px 22px 6px", fontSize: "10px", fontWeight: 700,
//           color: "rgba(255,255,255,.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
//           Navigation
//         </div>

//         {/* Nav items */}
//         <nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
//           {NAV.map(item => {
//             const isActive = pathname === item.href;
//             return (
//               <button key={item.href} onClick={() => router.push(item.href)} style={{
//                 width: "100%", display: "flex", alignItems: "center", gap: 10,
//                 padding: "9px 12px", border: "none", borderRadius: "10px",
//                 marginBottom: "2px",
//                 background: isActive ? "rgba(106,170,120,.18)" : "transparent",
//                 color: isActive ? "#fff" : "rgba(255,255,255,.5)",
//                 fontSize: 13, fontWeight: isActive ? 600 : 400,
//                 cursor: "pointer", transition: "all .18s", textAlign: "left",
//                 position: "relative",
//               }}>
//                 {isActive && (
//                   <div style={{
//                     position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
//                     width: 3, height: 20, background: "#6aaa78", borderRadius: "0 3px 3px 0",
//                   }} />
//                 )}
//                 <span style={{ fontSize: "15px", opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
//                 {item.label}
//               </button>
//             );
//           })}
//         </nav>

//         {/* Settings & Logout */}
//         <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
//           <button onClick={handleLogout} style={{
//             width: "100%", display: "flex", alignItems: "center", gap: 10,
//             padding: "9px 12px", border: "none", background: "transparent",
//             color: "#ef4444", fontSize: 13, cursor: "pointer", fontWeight: 600,
//             borderRadius: "10px",
//           }}>
//             <span>⎋</span> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* ══ MAIN ══ */}
//       <main style={{ marginLeft:190, flex:1, padding:"28px 32px" }}>
//         <div style={{ marginBottom:"24px" }}>
//           <h1 style={{ fontSize:"24px", fontWeight:700, color:"#1a3a2a", margin:0, display:"flex", alignItems:"center", gap:10 }}>
//             🤖 AI Crop Doctor
//           </h1>
//           <p style={{ fontSize:"14px", color:"#6b8070", marginTop:"4px" }}>
//             Upload a photo of your crop to detect diseases instantly
//           </p>
//         </div>

//         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"20px" }}>

//           {/* Upload Card */}
//           <div style={{ background:"white", borderRadius:"16px", padding:"24px", border:"1px solid #e8e4dc", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
//             <h2 style={{ fontSize:"16px", fontWeight:700, color:"#1a3a2a", marginBottom:"18px" }}>Scan Your Crop</h2>
//             <div style={{ marginBottom:"14px" }}>
//               <label style={{ fontSize:"11px", fontWeight:700, color:"#6b8070", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:"6px" }}>Crop Name</label>
//               <input type="text" placeholder="e.g. Tomato, Chili, Broccoli, Spinach"
//                 value={cropName} onChange={e => setCropName(e.target.value)}
//                 style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e8e4dc", borderRadius:"10px",
//                 fontFamily:"'DM Sans',sans-serif", fontSize:"14px", color:"#1a3a2a",
//                 background:"#f9f7f3", outline:"none", boxSizing:"border-box" as const }} />
//             </div>

//             <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
//               onClick={() => fileInputRef.current?.click()}
//               style={{ border:`2px dashed ${preview?"#6aaa78":"#d4d0c8"}`, borderRadius:"14px",
//               padding:preview?"16px":"48px 20px", textAlign:"center", cursor:"pointer",
//               background:preview?"#f4f8f4":"#fafaf7", transition:"all 0.2s", marginBottom:"14px" }}>
//               {preview ? (
//                 <div>
//                   <img src={preview} alt="preview"
//                     style={{ maxHeight:"180px", maxWidth:"100%", borderRadius:"10px", objectFit:"cover" }} />
//                   <div style={{ fontSize:"12px", color:"#6b8070", marginTop:"8px" }}>{file?.name}</div>
//                 </div>
//               ) : (
//                 <>
//                   <div style={{ fontSize:"36px", marginBottom:"10px" }}>⬆️</div>
//                   <div style={{ fontSize:"14px", fontWeight:600, color:"#1a3a2a", marginBottom:"4px" }}>Upload Crop Image</div>
//                   <div style={{ fontSize:"12px", color:"#6b8070" }}>Click or drag a photo of leaves, fruits, or stems</div>
//                 </>
//               )}
//               <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
//                 style={{ display:"none" }}
//                 onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
//             </div>

//             {!preview && (
//               <button onClick={() => fileInputRef.current?.click()}
//                 style={{ width:"100%", padding:"11px", background:"#2d6a35", color:"white", border:"none",
//                 borderRadius:"10px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600,
//                 cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
//                 🔍 Choose Photo
//               </button>
//             )}

//             {preview && (
//               <button onClick={handleScan} disabled={loading}
//                 style={{ width:"100%", padding:"11px",
//                 background:loading?"#a8d5b5":"linear-gradient(135deg,#1a3a2a,#2d6a35)",
//                 color:"white", border:"none", borderRadius:"10px",
//                 fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600,
//                 cursor:loading?"not-allowed":"pointer",
//                 display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
//                 {loading ? (
//                   <><span style={{ width:"14px", height:"14px", border:"2px solid rgba(255,255,255,0.4)",
//                     borderTopColor:"white", borderRadius:"50%", display:"inline-block",
//                     animation:"spin 0.7s linear infinite" }} />Analyzing…</>
//                 ) : "🤖 Analyze with AI"}
//               </button>
//             )}

//             {error && (
//               <div style={{ marginTop:"12px", padding:"10px 14px", background:"#fff1f1",
//                 border:"1px solid #fcd0d0", borderRadius:"10px", color:"#c0392b", fontSize:"13px" }}>
//                 ⚠️ {error}
//               </div>
//             )}
//             {preview && (
//               <button onClick={() => { setFile(null); setPreview(""); setResult(null); setError(""); }}
//                 style={{ width:"100%", marginTop:"10px", padding:"9px", background:"transparent",
//                 border:"1.5px solid #e8e4dc", borderRadius:"10px", color:"#6b8070", fontSize:"13px", cursor:"pointer" }}>
//                 ↺ Change Photo
//               </button>
//             )}
//           </div>

//           {/* Diagnosis Card */}
//           <div style={{ background:"white", borderRadius:"16px", padding:"24px", border:"1px solid #e8e4dc", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
//             <h2 style={{ fontSize:"16px", fontWeight:700, color:"#1a3a2a", marginBottom:"18px" }}>AI Diagnosis</h2>
//             {!result ? (
//               <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"240px", color:"#c0bdb5" }}>
//                 <div style={{ fontSize:"48px", marginBottom:"12px", opacity:0.3 }}>🔬</div>
//                 <div style={{ fontSize:"14px" }}>Upload a crop image to get AI-powered diagnosis</div>
//               </div>
//             ) : (
//               <>
//                 <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"20px",
//                   padding:"16px", background:result.isHealthy?"#e8f5e9":"#fff8e6", borderRadius:"12px" }}>
//                   <div style={{ fontSize:"32px" }}>{result.isHealthy?"✅":"🔬"}</div>
//                   <div>
//                     <div style={{ fontSize:"18px", fontWeight:700, color:"#1a3a2a" }}>
//                       {result.isHealthy ? "Crop is Healthy!" : `${result.diseaseName} Detected`}
//                     </div>
//                     <div style={{ fontSize:"13px", color:"#6b8070", marginTop:"2px" }}>
//                       {result.scientificName && `${result.scientificName} · `}Confidence: {result.confidence}%
//                     </div>
//                   </div>
//                 </div>

//                 {!result.isHealthy && (
//                   <div style={{ marginBottom:"20px" }}>
//                     <div style={{ fontSize:"13px", fontWeight:600, color:"#1a3a2a", marginBottom:"8px" }}>Severity</div>
//                     <div style={{ background:"#f0ede8", borderRadius:"6px", height:"10px", overflow:"hidden", marginBottom:"6px" }}>
//                       <div style={{ height:"100%", width:SEVERITY_WIDTH[result.severity],
//                         background:`linear-gradient(90deg,#2d6a35,${SEVERITY_COLOR[result.severity]})`,
//                         borderRadius:"6px", transition:"width 1s ease" }} />
//                     </div>
//                     <div style={{ display:"flex", justifyContent:"flex-end" }}>
//                       <span style={{ fontSize:"12px", fontWeight:700, padding:"3px 12px", borderRadius:"100px",
//                         background:result.severity==="High"?"#fce4ec":result.severity==="Medium"?"#fff8e6":"#e8f5e9",
//                         color:SEVERITY_COLOR[result.severity] }}>{result.severity}</span>
//                     </div>
//                   </div>
//                 )}

//                 {!result.isHealthy && (
//                   <>
//                     <div style={{ fontSize:"13px", fontWeight:600, color:"#1a3a2a", marginBottom:"10px" }}>Recommended Treatment</div>
//                     <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", background:"#f4f0e8", borderRadius:"100px", padding:"3px", marginBottom:"14px" }}>
//                       {(["organic","chemical"] as const).map(tab => (
//                         <button key={tab} onClick={() => setActiveTab(tab)} style={{
//                           padding:"9px", borderRadius:"100px", border:"none", cursor:"pointer",
//                           fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600,
//                           background:activeTab===tab?"white":"transparent",
//                           color:activeTab===tab?"#1a3a2a":"#6b8070",
//                           boxShadow:activeTab===tab?"0 2px 8px rgba(0,0,0,0.08)":"none",
//                           transition:"all 0.2s" }}>
//                           {tab==="organic"?"🌿 Organic":"🧪 Chemical"}
//                         </button>
//                       ))}
//                     </div>
//                     <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"16px" }}>
//                       {(activeTab==="organic"?result.organicTreatments:result.chemicalTreatments).map((t,i) => (
//                         <div key={i} style={{ padding:"14px", background:"#f9f7f3", borderRadius:"12px", border:"1px solid #e8e4dc" }}>
//                           <div style={{ fontSize:"14px", fontWeight:600, color:"#1a3a2a", marginBottom:"4px" }}>{t.name}</div>
//                           <div style={{ fontSize:"12px", color:"#6b8070" }}>Dosage: {t.dosage}</div>
//                           {t.instruction && <div style={{ fontSize:"12px", color:"#2d6a35", marginTop:"4px" }}>💡 {t.instruction}</div>}
//                           {t.warning && <div style={{ fontSize:"12px", color:"#a07000", marginTop:"4px" }}>{t.warning}</div>}
//                         </div>
//                       ))}
//                     </div>
//                     <button onClick={() => setLogOpen(true)} style={{
//                       width:"100%", padding:"11px", background:"#f4f0e8", border:"1.5px solid #d4d0c8",
//                       borderRadius:"10px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px",
//                       fontWeight:600, color:"#1a3a2a", cursor:"pointer",
//                       display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
//                       🔄 Log Treatment
//                     </button>
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {/* Scan History */}
//         <div style={{ background:"white", borderRadius:"16px", padding:"24px", border:"1px solid #e8e4dc", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"18px" }}>
//             <h2 style={{ fontSize:"16px", fontWeight:700, color:"#1a3a2a", margin:0 }}>Scan History</h2>
//             <span style={{ fontSize:"12px", color:"#6b8070" }}>{history.length} scans total</span>
//           </div>
//           {histLoading ? (
//             <div style={{ textAlign:"center", padding:"40px", color:"#6b8070" }}>Loading history…</div>
//           ) : history.length === 0 ? (
//             <div style={{ textAlign:"center", padding:"40px", color:"#c0bdb5" }}>
//               <div style={{ fontSize:"36px", marginBottom:"10px" }}>🔬</div>
//               No scans yet. Upload a crop photo to get started.
//             </div>
//           ) : (
//             <div>
//               <div style={{ display:"grid", gridTemplateColumns:"100px 1fr 1fr 100px 120px",
//                 gap:"12px", padding:"8px 14px", fontSize:"11px", fontWeight:700, color:"#9b9b9b",
//                 textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:"1px solid #f0ede8", marginBottom:"4px" }}>
//                 <span>Date</span><span>Crop</span><span>Disease</span><span>Severity</span><span>Status</span>
//               </div>
//               {history.map(s => (
//                 <div key={s._id} onClick={() => setResult(s)} style={{
//                   display:"grid", gridTemplateColumns:"100px 1fr 1fr 100px 120px",
//                   gap:"12px", padding:"12px 14px", borderBottom:"1px solid #f9f7f3",
//                   cursor:"pointer", transition:"background 0.15s", borderRadius:"8px", alignItems:"center" }}
//                   onMouseEnter={e => (e.currentTarget.style.background="#f9f7f3")}
//                   onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
//                   <span style={{ fontSize:"12px", color:"#9b9b9b" }}>{formatDate(s.createdAt)}</span>
//                   <span style={{ fontSize:"14px", fontWeight:600, color:"#1a3a2a" }}>{s.cropName}</span>
//                   <span style={{ fontSize:"13px", color:"#6b8070" }}>{s.diseaseName}</span>
//                   <span style={{ fontSize:"12px", fontWeight:600, color:SEVERITY_COLOR[s.severity]||"#6b8070" }}>{s.severity}</span>
//                   <span style={{ fontSize:"11px", fontWeight:700, padding:"3px 12px", borderRadius:"100px", display:"inline-block",
//                     background:STATUS_STYLE[s.status]?.bg||"#f4f0e8", color:STATUS_STYLE[s.status]?.color||"#6b8070" }}>
//                     {s.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Log Treatment Modal */}
//       {logOpen && (
//         <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100,
//           display:"flex", alignItems:"center", justifyContent:"center" }}
//           onClick={e => { if(e.target===e.currentTarget) setLogOpen(false); }}>
//           <div style={{ background:"white", borderRadius:"16px", padding:"28px", width:"100%", maxWidth:"420px" }}>
//             <h3 style={{ fontSize:"18px", fontWeight:700, color:"#1a3a2a", marginBottom:"20px" }}>🔄 Log Treatment</h3>
//             <label style={{ fontSize:"11px", fontWeight:700, color:"#6b8070", textTransform:"uppercase",
//               letterSpacing:"0.06em", display:"block", marginBottom:"6px" }}>Update Status</label>
//             <select value={logStatus} onChange={e => setLogStatus(e.target.value)}
//               style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e8e4dc", borderRadius:"10px",
//               fontFamily:"'DM Sans',sans-serif", fontSize:"14px", marginBottom:"16px", background:"#f9f7f3", outline:"none" }}>
//               <option value="Treated">Treated</option>
//               <option value="Monitoring">Monitoring</option>
//               <option value="Resolved">Resolved</option>
//             </select>
//             <label style={{ fontSize:"11px", fontWeight:700, color:"#6b8070", textTransform:"uppercase",
//               letterSpacing:"0.06em", display:"block", marginBottom:"6px" }}>Notes (optional)</label>
//             <textarea value={logNote} onChange={e => setLogNote(e.target.value)}
//               placeholder="e.g. Applied Neem Oil spray on all leaves…" rows={3}
//               style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e8e4dc", borderRadius:"10px",
//               fontFamily:"'DM Sans',sans-serif", fontSize:"14px", background:"#f9f7f3", outline:"none",
//               resize:"none" as const, marginBottom:"20px", boxSizing:"border-box" as const }} />
//             <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
//               <button onClick={() => setLogOpen(false)} style={{ padding:"11px", background:"transparent",
//                 border:"1.5px solid #e8e4dc", borderRadius:"10px", fontFamily:"'DM Sans',sans-serif",
//                 fontSize:"14px", fontWeight:600, color:"#6b8070", cursor:"pointer" }}>Cancel</button>
//               <button onClick={handleLogTreatment} disabled={logSaving} style={{ padding:"11px",
//                 background:logSaving?"#a8d5b5":"linear-gradient(135deg,#1a3a2a,#2d6a35)",
//                 color:"white", border:"none", borderRadius:"10px",
//                 fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, cursor:"pointer" }}>
//                 {logSaving?"Saving…":"Save Log"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { diseaseAPI } from "@/lib/axios-proxy";
import { PageHeader } from "@/app/components/BackButton";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Treatment { name:string; dosage:string; instruction?:string; warning?:string; }
interface ScanResult {
  _id:string; cropName:string; imageUrl:string;
  diseaseName:string; scientificName:string;
  confidence:number; severity:"None"|"Low"|"Medium"|"High";
  isHealthy:boolean; symptoms:string; preventionTips:string; detailedAnalysis?:string;
  organicTreatments:Treatment[]; chemicalTreatments:Treatment[];
  status:string; createdAt:string; aiPowered?:boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SEV_COLOR:Record<string,string> = { None:"#16a34a", Low:"#16a34a", Medium:"#d97706", High:"#dc2626" };
const SEV_BG:Record<string,string>    = { None:"#f0fdf4", Low:"#f0fdf4", Medium:"#fffbeb", High:"#fff1f1" };
const SEV_W:Record<string,string>     = { None:"8%", Low:"28%", Medium:"62%", High:"92%" };

const STATUS_STYLE:Record<string,{bg:string;color:string}> = {
  Pending:    { bg:"#fffbeb", color:"#d97706" },
  Treated:    { bg:"#eff6ff", color:"#1d4ed8" },
  Resolved:   { bg:"#f0fdf4", color:"#16a34a" },
  Monitoring: { bg:"#f5f3ff", color:"#7c3aed" },
};

const NAV = [
  { label:"Overview",    href:"/dashboard/farmer"             },
  { label:"Crop Doctor", href:"/dashboard/farmer/crop-doctor" },
  { label:"My Products", href:"/dashboard/farmer/products"    },
  { label:"Orders",      href:"/dashboard/farmer/orders"      },
  { label:"Weather",     href:"/dashboard/farmer/weather"     },
  { label:"Earnings",    href:"/dashboard/farmer/earnings"    },
];

const BACKEND = "http://localhost:5000";

// ─── SVG Icon ─────────────────────────────────────────────────────────────────
const Icon = ({ d, size=18, style }: { d:string; size?:number; style?:React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d}/>
  </svg>
);

export default function CropDoctorPage() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,       setUser]      = useState<{name:string}|null>(null);
  const [cropName,   setCropName]  = useState("");
  const [file,       setFile]      = useState<File|null>(null);
  const [preview,    setPreview]   = useState("");
  const [loading,    setLoading]   = useState(false);
  const [error,      setError]     = useState("");
  const [result,     setResult]    = useState<ScanResult|null>(null);
  const [activeTab,  setActiveTab] = useState<"organic"|"chemical">("organic");
  const [history,    setHistory]   = useState<ScanResult[]>([]);
  const [histLoading,setHistLoad]  = useState(false);
  const [logOpen,    setLogOpen]   = useState(false);
  const [logNote,    setLogNote]   = useState("");
  const [logStatus,  setLogStatus] = useState("Treated");
  const [logSaving,  setLogSaving] = useState(false);
  const [aiPowered,  setAiPowered] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
    setUser(u);
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setHistLoad(true);
    try {
      const { data } = await diseaseAPI.getMy();
      setHistory(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setHistLoad(false);
  };

  const handleFile = (f: File) => {
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setError(""); setAiPowered(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const handleScan = async () => {
    if (!file)            { setError("Please upload a crop photo first."); return; }
    if (!cropName.trim()) { setError("Please enter the crop name."); return; }
    
    const symptomsInput = (document.getElementById("symptomsInput") as HTMLTextAreaElement)?.value || "";
    if (!symptomsInput.trim()) {
      setError("Please describe the symptoms (e.g. yellow spots, holes) because Cerebras AI cannot analyze the image directly.");
      return;
    }
    
    setLoading(true); setError(""); setResult(null);
    try {
      const formData = new FormData();
      formData.append("image",    file);
      formData.append("cropName", cropName.trim());
      formData.append("symptoms", symptomsInput);
      const { data } = await diseaseAPI.scan(formData);
      setResult(data.scan);
      setAiPowered(data.aiPowered ?? false);
      setHistory(prev => [data.scan, ...prev.filter(s => s._id !== data.scan._id)]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Scan failed. Is the backend running?");
    } finally { setLoading(false); }
  };

  const handleLogTreatment = async () => {
    if (!result) return;
    setLogSaving(true);
    try {
      await diseaseAPI.updateStatus(result._id, logStatus, logNote);
      setResult(prev => prev ? { ...prev, status: logStatus } : prev);
      setHistory(prev => prev.map(s => s._id === result._id ? { ...s, status: logStatus } : s));
      setLogOpen(false); setLogNote("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save log.");
    } finally { setLogSaving(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-CA");
  const getInitial = () => (user?.name || "F")[0].toUpperCase();

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f2efe8" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        .fu{animation:fadeUp .3s ease both}
        .btn-h:hover{opacity:.82}
        .card-h:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(26,58,42,.12)!important;transition:all .2s}
        .nav-btn:hover{background:rgba(106,170,120,.1)!important;color:rgba(255,255,255,.9)!important}
        .row-h:hover{background:#f8f5f0!important}
        .spinner{width:16px;height:16px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
        .thinking-dot{width:8px;height:8px;border-radius:50%;background:#6aaa78;animation:spin .8s linear infinite}
      `}</style>

      {/* ════ SIDEBAR ════ */}
      <aside style={{ width:200, background:"linear-gradient(185deg,#1a3a2a 0%,#0f2418 100%)",
        display:"flex", flexDirection:"column", position:"fixed",
        top:0, left:0, bottom:0, zIndex:50, boxShadow:"4px 0 20px rgba(0,0,0,.15)" }}>

        <div style={{ padding:"22px 20px 16px", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:22, color:"#fff" }}>
            Ag<span style={{ color:"#6aaa78" }}>real</span>
          </div>
        </div>

        <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:"50%",
              background:"linear-gradient(135deg,#6aaa78,#2d5a3d)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, fontWeight:700, color:"#fff", border:"2px solid rgba(255,255,255,.15)" }}>
              {getInitial()}
            </div>
            <div>
              <div style={{ color:"#fff", fontSize:13, fontWeight:600 }}>{user?.name||"Farmer"}</div>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:10 }}>My Farm</div>
            </div>
          </div>
        </div>

        <div style={{ padding:"10px 4px 4px 10px", fontSize:9, fontWeight:700, color:"rgba(255,255,255,.2)", textTransform:"uppercase", letterSpacing:".1em" }}>Navigation</div>

        <nav style={{ flex:1, padding:"4px 8px", overflowY:"auto" }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <button key={item.href} onClick={() => router.push(item.href)} className="nav-btn"
                style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
                  padding:"9px 12px", border:"none", borderRadius:9, marginBottom:2,
                  background: active ? "rgba(106,170,120,.18)" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,.5)",
                  fontSize:13, fontWeight: active ? 600 : 400,
                  cursor:"pointer", transition:"all .15s", textAlign:"left", position:"relative" }}>
                {active && <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:18, background:"#6aaa78", borderRadius:"0 3px 3px 0" }}/>}
                {item.label}
                {active && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:"#6aaa78" }}/>}
              </button>
            );
          })}
        </nav>

        <div style={{ padding:"8px", borderTop:"1px solid rgba(255,255,255,.07)" }}>
          <button onClick={handleLogout} className="nav-btn"
            style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
              padding:"9px 12px", border:"none", background:"transparent",
              color:"#f87171", fontSize:13, cursor:"pointer", fontWeight:600, borderRadius:9 }}>
            <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={15}/>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <main style={{ marginLeft:200, flex:1, padding:"28px 32px" }}>

        {/* ── Page header ── */}
        <div className="fu" style={{ marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
            <div style={{ width:40, height:40, borderRadius:12,
              background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={20} style={{ color:"#6aaa78" }}/>
            </div>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:"#1a3a2a", margin:0 }}><PageHeader
  title="Crop Doctor"
  backTo="/dashboard/farmer"
  subtitle="Upload a photo of your crop for AI diagnosis"
/></h1>
              <p style={{ fontSize:13, color:"#6b8070", margin:0 }}>
                Powered by Cerebras AI — instant plant disease detection
              </p>
            </div>
            {/* AI badge */}
            <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6,
              background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
              borderRadius:99, padding:"5px 14px" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#6aaa78" }}/>
              <span style={{ fontSize:11, fontWeight:700, color:"#6aaa78" }}>Cerebras AI Active</span>
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>

          {/* ── Upload Card ── */}
          <div className="fu" style={{ background:"#fff", borderRadius:18, padding:"24px",
            border:"1px solid #eeebe4", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
              <Icon d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" size={18} style={{ color:"#6aaa78" }}/>
              <h2 style={{ fontSize:16, fontWeight:700, color:"#1a3a2a", margin:0 }}>Scan Your Crop</h2>
            </div>

            {/* Crop name input */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:10, fontWeight:700, color:"#9b9086",
                textTransform:"uppercase", letterSpacing:".07em", display:"block", marginBottom:5 }}>
                Crop Name *
              </label>
              <input type="text" placeholder="e.g. Tomato, Chili, Broccoli, Spinach…"
                value={cropName} onChange={e => setCropName(e.target.value)}
                style={{ width:"100%", padding:"10px 13px",
                  border:"1.5px solid #e0ddd6", borderRadius:9,
                  fontFamily:"'DM Sans',sans-serif", fontSize:14,
                  color:"#1a3a2a", background:"#f9f7f4", outline:"none", boxSizing:"border-box", marginBottom: 14 }}/>
                  
              <label style={{ fontSize:10, fontWeight:700, color:"#9b9086",
                textTransform:"uppercase", letterSpacing:".07em", display:"block", marginBottom:5 }}>
                Symptoms Description *
              </label>
              <textarea placeholder="e.g. Yellow spots on leaves, wilting stems"
                name="symptoms"
                id="symptomsInput"
                style={{ width:"100%", padding:"10px 13px",
                  border:"1.5px solid #e0ddd6", borderRadius:9,
                  fontFamily:"'DM Sans',sans-serif", fontSize:14,
                  color:"#1a3a2a", background:"#f9f7f4", outline:"none", boxSizing:"border-box", minHeight: "80px" }}/>
            </div>

            {/* Drop zone */}
            <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => !loading && fileRef.current?.click()}
              style={{ border:`2px dashed ${preview?"#6aaa78":"#d4d0c8"}`,
                borderRadius:14, padding:preview?"14px":"42px 20px",
                textAlign:"center", cursor:loading?"not-allowed":"pointer",
                background:preview?"#f4f8f4":"#fafaf7", transition:"all .2s", marginBottom:14,
                position:"relative", overflow:"hidden" }}>
              {preview ? (
                <div style={{ position:"relative" }}>
                  <img src={preview} alt="preview"
                    style={{ width:"100%", maxHeight:200, objectFit:"cover", borderRadius:10, display:"block" }}/>
                  <div style={{ position:"absolute", top:8, right:8,
                    background:"rgba(26,58,42,.8)", color:"#fff",
                    borderRadius:8, padding:"3px 9px", fontSize:11, fontWeight:700 }}>
                    {file?.name?.slice(0,20)}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ width:52, height:52, borderRadius:14, background:"#f0f8f2",
                    display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                    <Icon d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" size={24} style={{ color:"#6aaa78" }}/>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#1a3a2a", marginBottom:4 }}>Upload Crop Photo</div>
                  <div style={{ fontSize:12, color:"#9b9086" }}>Click or drag & drop — JPG, PNG, WebP</div>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display:"none" }}
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}/>
            </div>

            {/* Action buttons */}
            {!preview ? (
              <button className="btn-h" onClick={() => fileRef.current?.click()}
                style={{ width:"100%", padding:"11px",
                  background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
                  color:"#fff", border:"none", borderRadius:9,
                  fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <Icon d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" size={16}/>
                Choose Photo
              </button>
            ) : (
              <button className="btn-h" onClick={handleScan} disabled={loading}
                style={{ width:"100%", padding:"12px",
                  background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
                  color:"#fff", border:"none", borderRadius:9,
                  fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                {loading ? (
                  <>
                    <div className="spinner"/>
                    Analyzing with Cerebras AI…
                  </>
                ) : (
                  <>
                    <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={16}/>
                    Analyze with Cerebras AI
                  </>
                )}
              </button>
            )}

            {/* AI thinking animation */}
            {loading && (
              <div style={{ marginTop:14, padding:"12px 16px", background:"#f0f8f2",
                borderRadius:10, border:"1px solid #c8e6c9", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ display:"flex", gap:4 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#6aaa78",
                      animation:`spin .8s ease-in-out ${i*0.15}s infinite alternate` }}/>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#2d5a3d" }}>Cerebras is analyzing your crop…</div>
                  <div style={{ fontSize:11, color:"#4a7a5a" }}>Applying high volume inference to biological markers</div>
                </div>
              </div>
            )}

            {error && (
              <div style={{ marginTop:12, padding:"10px 13px", background:"#fff1f1",
                border:"1px solid #fcd0d0", borderRadius:9, color:"#c0392b", fontSize:13,
                display:"flex", alignItems:"center", gap:8 }}>
                <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={15} style={{ color:"#c0392b", flexShrink:0 }}/>
                {error}
              </div>
            )}

            {preview && (
              <button className="btn-h" onClick={() => { setFile(null); setPreview(""); setResult(null); setError(""); }}
                style={{ width:"100%", marginTop:10, padding:"9px", background:"transparent",
                  border:"1.5px solid #e0ddd6", borderRadius:9, color:"#9b9086", fontSize:13, cursor:"pointer" }}>
                Change Photo
              </button>
            )}
          </div>

          {/* ── Diagnosis Card ── */}
          <div className="fu" style={{ background:"#fff", borderRadius:18, padding:"24px",
            border:"1px solid #eeebe4", boxShadow:"0 2px 10px rgba(0,0,0,.05)", display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
              <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size={18} style={{ color:"#6aaa78" }}/>
              <h2 style={{ fontSize:16, fontWeight:700, color:"#1a3a2a", margin:0 }}>AI Diagnosis</h2>
              {aiPowered && result && (
                <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:5,
                  background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:99, padding:"3px 10px" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e" }}/>
                  <span style={{ fontSize:10, fontWeight:700, color:"#16a34a" }}>Gemini AI</span>
                </div>
              )}
            </div>

            {!result ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                flex:1, color:"#c0bdb5", minHeight:260 }}>
                <div style={{ width:64, height:64, borderRadius:18, background:"#f4f0e8",
                  display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={28} style={{ color:"#c0bdb5" }}/>
                </div>
                <div style={{ fontSize:14, fontWeight:600, color:"#9b9086", marginBottom:4 }}>
                  No diagnosis yet
                </div>
                <div style={{ fontSize:12, color:"#b0ada8", textAlign:"center", maxWidth:220 }}>
                  Upload a crop photo and click Analyze to get instant AI-powered disease detection
                </div>
              </div>
            ) : (
              <div style={{ flex:1, overflowY:"auto" }}>
                {/* Result header */}
                <div style={{ padding:"16px", borderRadius:14, marginBottom:18,
                  background: result.isHealthy ? "#f0fdf4" : SEV_BG[result.severity] || "#fffbeb",
                  border:`1px solid ${result.isHealthy?"#bbf7d0":"#e0ddd6"}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:12,
                      background: result.isHealthy ? "#22c55e" : SEV_COLOR[result.severity],
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {result.isHealthy
                        ? <Icon d="M5 13l4 4L19 7" size={20} style={{ color:"#fff" }}/>
                        : <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={20} style={{ color:"#fff" }}/>
                      }
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:17, fontWeight:800, color:"#1a3a2a" }}>
                        {result.isHealthy ? "Crop is Healthy!" : result.diseaseName}
                      </div>
                      {result.scientificName && !result.isHealthy && (
                        <div style={{ fontSize:11, color:"#6b8070", fontStyle:"italic", marginTop:1 }}>{result.scientificName}</div>
                      )}
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                        <div style={{ fontSize:11, color:"#9b9086" }}>Confidence:</div>
                        <div style={{ flex:1, background:"rgba(0,0,0,.06)", borderRadius:99, height:5, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${result.confidence}%`,
                            background: result.isHealthy ? "#22c55e" : SEV_COLOR[result.severity],
                            borderRadius:99, transition:"width .8s ease" }}/>
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:result.isHealthy?"#16a34a":SEV_COLOR[result.severity] }}>{result.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Severity bar */}
                {!result.isHealthy && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:"#1a3a2a" }}>Disease Severity</span>
                      <span style={{ fontSize:12, fontWeight:700, padding:"2px 10px", borderRadius:99,
                        background:SEV_BG[result.severity], color:SEV_COLOR[result.severity] }}>
                        {result.severity}
                      </span>
                    </div>
                    <div style={{ background:"#f0ede8", borderRadius:99, height:8, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:SEV_W[result.severity],
                        background:`linear-gradient(90deg,#16a34a,${SEV_COLOR[result.severity]})`,
                        borderRadius:99, transition:"width 1s ease" }}/>
                    </div>
                  </div>
                )}

                {/* Symptoms */}
                {result.symptoms && !result.isHealthy && (
                  <div style={{ marginBottom:16, padding:"12px 14px", background:"#f9f7f4",
                    borderRadius:10, border:"1px solid #eeebe4" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#9b9086", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>Observed Symptoms</div>
                    <div style={{ fontSize:13, color:"#374151", lineHeight:1.6 }}>{result.symptoms}</div>
                  </div>
                )}

                {!result.isHealthy && result.detailedAnalysis && (
                  <div style={{ marginBottom:"20px", padding:"16px", background:"#f4f8f4", borderRadius:"12px", border:"1px solid #d1e5d5" }}>
                    <div style={{ fontSize:"14px", fontWeight:700, color:"#1a3a2a", marginBottom:"10px" }}>Expert Analysis & Details</div>
                    <div style={{ fontSize:"13px", color:"#2d5a3d", lineHeight:"1.6", whiteSpace:"pre-wrap" }}>
                      {result.detailedAnalysis}
                    </div>
                  </div>
                )}

                {!result.isHealthy && (
                  <>
                    {/* Treatment tabs */}
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#1a3a2a", marginBottom:8 }}>Recommended Treatment</div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                        background:"#f4f0e8", borderRadius:99, padding:3, marginBottom:12 }}>
                        {(["organic","chemical"] as const).map(tab => (
                          <button key={tab} onClick={() => setActiveTab(tab)} className="btn-h"
                            style={{ padding:"8px", borderRadius:99, border:"none", cursor:"pointer",
                              fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600,
                              background: activeTab===tab ? "#fff" : "transparent",
                              color: activeTab===tab ? "#1a3a2a" : "#6b8070",
                              boxShadow: activeTab===tab ? "0 2px 8px rgba(0,0,0,.08)" : "none",
                              transition:"all .18s" }}>
                            {tab==="organic" ? "🌿 Organic" : "🧪 Chemical"}
                          </button>
                        ))}
                      </div>

                      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                        {(activeTab==="organic" ? result.organicTreatments : result.chemicalTreatments).map((t, i) => (
                          <div key={i} style={{ padding:"13px", background:"#f9f7f4",
                            borderRadius:11, border:"1px solid #eeebe4" }}>
                            <div style={{ fontSize:14, fontWeight:700, color:"#1a3a2a", marginBottom:3 }}>{t.name}</div>
                            <div style={{ fontSize:12, color:"#6b8070", marginBottom:t.instruction||t.warning?5:0 }}>
                              Dosage: <strong>{t.dosage}</strong>
                            </div>
                            {t.instruction && (
                              <div style={{ fontSize:12, color:"#2d5a3d", display:"flex", gap:5, alignItems:"flex-start" }}>
                                <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={13} style={{ color:"#6aaa78", flexShrink:0, marginTop:1 }}/>
                                {t.instruction}
                              </div>
                            )}
                            {t.warning && (
                              <div style={{ fontSize:12, color:"#d97706", marginTop:4, display:"flex", gap:5, alignItems:"flex-start" }}>
                                <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={13} style={{ color:"#d97706", flexShrink:0, marginTop:1 }}/>
                                {t.warning}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prevention tips */}
                    {result.preventionTips && (
                      <div style={{ marginBottom:12, padding:"12px 14px", background:"#f0f8f2",
                        borderRadius:10, border:"1px solid #c8e6c9" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#2d5a3d", textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>
                          Prevention Tips
                        </div>
                        <div style={{ fontSize:12, color:"#374151", lineHeight:1.6 }}>{result.preventionTips}</div>
                      </div>
                    )}

                    <button className="btn-h" onClick={() => setLogOpen(true)}
                      style={{ width:"100%", padding:"10px", background:"#f4f0e8",
                        border:"1.5px solid #d4d0c8", borderRadius:9,
                        fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
                        color:"#1a3a2a", cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                      <Icon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" size={14}/>
                      Log Treatment Progress
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Scan History ── */}
        <div className="fu" style={{ background:"#fff", borderRadius:18, padding:"22px 24px",
          border:"1px solid #eeebe4", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={17} style={{ color:"#6aaa78" }}/>
              <h2 style={{ fontSize:15, fontWeight:700, color:"#1a3a2a", margin:0 }}>Scan History</h2>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:"#9b9086" }}>{history.length} total scans</span>
            </div>
          </div>

          {histLoading ? (
            <div style={{ textAlign:"center", padding:"40px", color:"#9b9086" }}>Loading history…</div>
          ) : history.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px", color:"#c0bdb5" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:"#f4f0e8",
                display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={24} style={{ color:"#c0bdb5" }}/>
              </div>
              <div style={{ fontSize:14, color:"#9b9086", fontWeight:600 }}>No scans yet</div>
              <div style={{ fontSize:12, color:"#b0ada8", marginTop:3 }}>Upload a crop photo to get started</div>
            </div>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"96px 1fr 1fr 90px 110px",
                gap:12, padding:"7px 12px", marginBottom:4,
                fontSize:10, fontWeight:700, color:"#b0ada8",
                textTransform:"uppercase", letterSpacing:".07em",
                borderBottom:"1px solid #f0ede8" }}>
                <span>Date</span><span>Crop</span><span>Disease</span><span>Severity</span><span>Status</span>
              </div>
              {history.map(s => (
                <div key={s._id} onClick={() => { setResult(s); setAiPowered(true); }}
                  className="row-h"
                  style={{ display:"grid", gridTemplateColumns:"96px 1fr 1fr 90px 110px",
                    gap:12, padding:"11px 12px", borderRadius:9, cursor:"pointer",
                    transition:"background .12s", alignItems:"center" }}>
                  <span style={{ fontSize:11, color:"#9b9086" }}>{fmtDate(s.createdAt)}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#1a3a2a" }}>{s.cropName}</div>
                  </div>
                  <span style={{ fontSize:13, color:"#6b8070", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {s.isHealthy ? "Healthy" : s.diseaseName}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700,
                    color:SEV_COLOR[s.severity]||"#6b8070",
                    background:SEV_BG[s.severity]||"#f9f7f4",
                    padding:"2px 9px", borderRadius:99, textAlign:"center" }}>
                    {s.severity}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:99, display:"inline-block",
                    background:STATUS_STYLE[s.status]?.bg||"#f4f0e8",
                    color:STATUS_STYLE[s.status]?.color||"#6b8070" }}>
                    {s.status}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      {/* ── Log Treatment Modal ── */}
      {logOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:200,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={e => { if (e.target === e.currentTarget) setLogOpen(false); }}>
          <div style={{ background:"#fff", borderRadius:18, padding:"26px 28px",
            width:"100%", maxWidth:420, boxShadow:"0 24px 64px rgba(0,0,0,.18)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontSize:17, fontWeight:700, color:"#1a3a2a", margin:0 }}>Log Treatment</h3>
              <button onClick={() => setLogOpen(false)}
                style={{ background:"#f4f0e8", border:"none", width:30, height:30, borderRadius:"50%",
                  cursor:"pointer", fontSize:15, color:"#9b9086",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:10, fontWeight:700, color:"#9b9086", textTransform:"uppercase", letterSpacing:".07em", display:"block", marginBottom:5 }}>Update Status</label>
              <select value={logStatus} onChange={e => setLogStatus(e.target.value)}
                style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e0ddd6",
                  borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:14,
                  background:"#f9f7f4", outline:"none", color:"#1a3a2a" }}>
                <option value="Treated">Treated</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:10, fontWeight:700, color:"#9b9086", textTransform:"uppercase", letterSpacing:".07em", display:"block", marginBottom:5 }}>Notes (optional)</label>
              <textarea value={logNote} onChange={e => setLogNote(e.target.value)}
                placeholder="e.g. Applied Neem Oil spray on all leaves…" rows={3}
                style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e0ddd6",
                  borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13,
                  background:"#f9f7f4", outline:"none", resize:"none",
                  boxSizing:"border-box", color:"#1a3a2a" }}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <button className="btn-h" onClick={() => setLogOpen(false)}
                style={{ padding:"11px", background:"transparent", border:"1.5px solid #e0ddd6",
                  borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600,
                  color:"#9b9086", cursor:"pointer" }}>Cancel</button>
              <button className="btn-h" onClick={handleLogTreatment} disabled={logSaving}
                style={{ padding:"11px",
                  background: logSaving ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
                  color:"#fff", border:"none", borderRadius:9,
                  fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                {logSaving ? "Saving…" : "Save Log"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}