
// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/lib/axios-proxy";
// import {
//   LayoutDashboard, Users, ShoppingBag, Bell,
//   Search, Settings, LogOut, Plus, Trash2, ChevronRight,
//   Leaf, Edit2, X, Package, TrendingUp,
//   CloudRain, CreditCard, AlertCircle, MoreHorizontal
// } from "lucide-react";

// // ─── Fonts ────────────────────────────────────────────────────────────────────
// const FONTS = `
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   body { font-family: 'DM Sans', sans-serif; }
//   ::-webkit-scrollbar { width: 5px; height: 5px; }
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: rgba(106,170,120,0.3); border-radius: 4px; }
//   @keyframes spin { to { transform: rotate(360deg); } }
//   @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
//   .nav-btn:hover { background: rgba(106,170,120,0.14) !important; color: #a8d5b5 !important; }
//   .row-hover:hover { background: rgba(26,58,42,0.03) !important; }
//   .act-btn:hover { opacity: 0.72; }
//   .card-h:hover { box-shadow: 0 8px 28px rgba(26,58,42,0.10); transform: translateY(-1px); }
// `;

// // ─── Agreal Design Tokens ─────────────────────────────────────────────────────
// const C = {
//   forest: "#1a3a2a",
//   forestMid: "#2d5a3d",
//   forestDark: "#12281d",
//   sage: "#6aaa78",
//   sageLight: "#a8d5b5",
//   sagePale: "#e8f5ec",
//   cream: "#f4f0e8",
//   creamDark: "#ede9e0",
//   amber: "#d4a853",
//   amberLight: "#f0c96b",
//   amberBg: "rgba(212,168,83,0.12)",
//   text: "#1a3a2a",
//   textMid: "#3d5c4a",
//   textMuted: "#7a9a84",
//   border: "rgba(26,58,42,0.1)",
//   borderSage: "rgba(106,170,120,0.25)",
//   white: "#ffffff",
//   red: "#c0392b",
//   redLight: "rgba(192,57,43,0.1)",
//   green: "#27ae60",
//   greenLight: "rgba(39,174,96,0.1)",
//   blue: "#2980b9",
//   blueBg: "rgba(41,128,185,0.1)",
// };

// // ─── Interfaces ───────────────────────────────────────────────────────────────
// interface User { _id: string; name: string; email: string; role: string; createdAt: string; }
// interface Subscription { _id: string; userId: { _id: string; name: string; email: string } | string; status: string; currentPeriodEnd: string; createdAt: string; }
// interface Product { _id: string; cropName?: string; name?: string; farmerId?: { name: string; email: string } | string; price: number; category: string; stock: number; description: string; status: string; createdAt: string; }
// interface Order { _id: string; consumerId: { name: string; email: string } | string; farmerId: { name: string; email: string } | string; totalAmount: number; status: string; createdAt: string; }
// interface Disease { _id: string; userId: { name: string; email: string } | string; cropName: string; diagnosis: string; createdAt: string; status: string; }
// interface WeatherAlert { _id: string; district: string; message: string; severity: string; createdAt: string; }

// type Section = "dashboard" | "users" | "marketplace" | "orders" | "reports" | "weather" | "settings";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const fmt = (n: number) => {
//   const val = n || 0;
//   return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : String(val);
// };
// const fmtC = (n: any) => `Rs. ${Number(n || 0).toLocaleString()}`;
// const fmtD = (s: string) => { try { return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); } catch { return "—"; } };
// const getName = (v: any) => (typeof v === "object" && v?.name) ? v.name : "—";
// const getEmail = (v: any) => (typeof v === "object" && v?.email) ? v.email : "";

// const statusPalette = (s: string) => {
//   switch (s?.toLowerCase()) {
//     case "active": case "delivered": case "completed": case "approved":
//       return { bg: C.greenLight, color: C.green };
//     case "trialing": case "pending": case "processing":
//       return { bg: C.amberBg, color: C.amber };
//     case "inactive": case "cancelled": case "rejected":
//       return { bg: C.redLight, color: C.red };
//     default:
//       return { bg: C.blueBg, color: C.blue };
//   }
// };

// // ─── Atoms ────────────────────────────────────────────────────────────────────
// const Badge = ({ label }: { label: string }) => {
//   const sc = statusPalette(label);
//   return <span style={{
//     padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
//     background: sc.bg, color: sc.color, letterSpacing: "0.04em", whiteSpace: "nowrap"
//   }}>
//     {label?.toUpperCase()}
//   </span>;
// };

// const Avatar = ({ name, size = 34 }: { name: string; size?: number }) => (
//   <div style={{
//     width: size, height: size, borderRadius: "50%", flexShrink: 0,
//     background: `linear-gradient(135deg,${C.sage},${C.forestMid})`,
//     display: "flex", alignItems: "center", justifyContent: "center",
//     fontWeight: 700, color: C.white, fontSize: size / 2.8
//   }}>
//     {name?.charAt(0)?.toUpperCase() || "A"}
//   </div>
// );

// const StatCard = ({ title, value, sub, icon: Icon, color, delta }: any) => (
//   <div className="card-h" style={{
//     background: C.white, borderRadius: 16, padding: "22px 24px",
//     border: `1px solid ${C.border}`, transition: "all 0.2s"
//   }}>
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
//       <div style={{
//         width: 44, height: 44, borderRadius: 12, background: color + "22",
//         display: "flex", alignItems: "center", justifyContent: "center"
//       }}>
//         <Icon size={22} color={color} />
//       </div>
//       {delta !== undefined && <span style={{
//         fontSize: 12, fontWeight: 700,
//         color: delta >= 0 ? C.green : C.red, background: delta >= 0 ? C.greenLight : C.redLight,
//         padding: "3px 8px", borderRadius: 20
//       }}>{delta >= 0 ? "↗" : "↘"} {Math.abs(delta)}%</span>}
//     </div>
//     <div style={{
//       fontSize: 26, fontWeight: 800, color: C.text, fontFamily: "'Playfair Display',serif",
//       lineHeight: 1, marginBottom: 6
//     }}>{value}</div>
//     <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>{title}</div>
//     {sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{sub}</div>}
//   </div>
// );

// const SectionHead = ({ title, action }: { title: string; action?: React.ReactNode }) => (
//   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
//     <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Playfair Display',serif" }}>{title}</h2>
//     {action}
//   </div>
// );

// const Table = ({ head, children }: { head: string[]; children: React.ReactNode }) => (
//   <div style={{
//     overflowX: "auto", borderRadius: "14px 14px 0 0", border: `1px solid ${C.border}`,
//     borderBottom: "none", background: C.white
//   }}>
//     <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, color: C.text }}>
//       <thead>
//         <tr style={{ background: C.sagePale, borderBottom: `1px solid ${C.borderSage}` }}>
//           {head.map((h, i) => (
//             <th key={h} style={{
//               padding: "12px 16px", textAlign: i === head.length - 1 ? "right" : "left",
//               fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.07em",
//               textTransform: "uppercase", whiteSpace: "nowrap"
//             }}>{h}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>{children}</tbody>
//     </table>
//   </div>
// );

// const TR = ({ children }: { children: React.ReactNode }) => (
//   <tr className="row-hover" style={{ borderBottom: `1px solid ${C.border}`, transition: "background 0.12s" }}>
//     {children}
//   </tr>
// );
// const TD = ({ children, right = false, muted = false, mono = false, style: s = {} }: any) => (
//   <td style={{
//     padding: "13px 16px", textAlign: right ? "right" : "left",
//     color: muted ? C.textMuted : C.text, verticalAlign: "middle",
//     fontFamily: mono ? "monospace" : "inherit", ...s
//   }}>{children}</td>
// );

// const Pagination = ({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) => {
//   const pages = Math.ceil(total / perPage);
//   if (pages <= 1) return null;
//   const nums = Array.from({ length: Math.min(pages, 5) }, (_, i) => {
//     if (pages <= 5) return i + 1;
//     if (page <= 3) return i + 1;
//     if (page >= pages - 2) return pages - 4 + i;
//     return page - 2 + i;
//   });
//   return (
//     <div style={{
//       display: "flex", justifyContent: "space-between", alignItems: "center",
//       padding: "14px 20px", borderTop: `1px solid ${C.border}`, background: C.white,
//       borderRadius: "0 0 14px 14px", border: `1px solid ${C.border}`
//     }}>
//       <span style={{ fontSize: 12, color: C.textMuted }}>
//         Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
//       </span>
//       <div style={{ display: "flex", gap: 6 }}>
//         {[{ l: "‹", p: page - 1, d: page === 1 }, { ...{ l: "›", p: page + 1, d: page === pages } }].map((b, i, arr) => (
//           <React.Fragment key={i}>
//             {i === 1 && nums.map(n => (
//               <button key={n} onClick={() => onChange(n)} style={{
//                 width: 32, height: 32, borderRadius: 8, border: `1px solid ${n === page ? C.sage : C.border}`,
//                 background: n === page ? C.forest : C.white, color: n === page ? C.white : C.text,
//                 fontWeight: n === page ? 700 : 500, fontSize: 13, cursor: "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center"
//               }}>{n}</button>
//             ))}
//             <button onClick={() => !b.d && onChange(b.p)} disabled={b.d} style={{
//               width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`,
//               background: C.white, color: b.d ? C.textMuted : C.text,
//               fontSize: 13, cursor: b.d ? "not-allowed" : "pointer",
//               display: "flex", alignItems: "center", justifyContent: "center"
//             }}>{b.l}</button>
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Btn = ({ children, onClick, variant = "primary", disabled = false }: any) => (
//   <button onClick={onClick} disabled={disabled} className="act-btn" style={{
//     padding: "9px 18px", borderRadius: 10, border: "none", cursor: disabled ? "not-allowed" : "pointer",
//     fontSize: 13, fontWeight: 700, transition: "opacity 0.15s",
//     background: variant === "primary" ? C.forest : variant === "danger" ? C.red : C.creamDark,
//     color: variant === "secondary" ? C.text : C.white,
//     opacity: disabled ? 0.6 : 1, display: "flex", alignItems: "center", gap: 6
//   }}>{children}</button>
// );

// const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
//   <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//     <label style={{
//       fontSize: 12, fontWeight: 600, color: C.textMid, letterSpacing: "0.04em",
//       textTransform: "uppercase"
//     }}>{label}</label>
//     {children}
//   </div>
// );

// const inputStyle = {
//   padding: "9px 14px", borderRadius: 10, border: `1px solid ${C.border}`,
//   background: C.white, color: C.text, fontSize: 13, width: "100%", outline: "none",
//   fontFamily: "'DM Sans',sans-serif"
// };

// const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
//   <div style={{
//     position: "fixed", inset: 0, background: "rgba(26,58,42,0.5)", backdropFilter: "blur(4px)",
//     display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
//     animation: "fadeIn 0.2s ease"
//   }}>
//     <div style={{
//       background: C.white, borderRadius: 20, width: "100%", maxWidth: 480,
//       maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(26,58,42,0.25)"
//     }}>
//       <div style={{
//         padding: "22px 28px", borderBottom: `1px solid ${C.border}`,
//         display: "flex", justifyContent: "space-between", alignItems: "center"
//       }}>
//         <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: "'Playfair Display',serif" }}>{title}</h3>
//         <button onClick={onClose} className="act-btn"
//           style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4 }}>
//           <X size={18} />
//         </button>
//       </div>
//       <div style={{ padding: "24px 28px" }}>{children}</div>
//     </div>
//   </div>
// );

// // ─── Revenue Chart ────────────────────────────────────────────────────────────
// const RevenueChart = ({ orders, subscriptions }: { orders: Order[]; subscriptions: Subscription[] }) => {
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   const now = new Date();
//   const data = Array.from({ length: 6 }, (_, i) => {
//     const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
//     const m = d.getMonth(); const y = d.getFullYear();
//     const orderRev = orders.filter(o => { try { const od = new Date(o.createdAt); return od.getMonth() === m && od.getFullYear() === y; } catch { return false; } })
//       .reduce((s, o) => s + (o.totalAmount || 0), 0);
//     const subRev = subscriptions.filter(s => { try { const sd = new Date(s.createdAt); return sd.getMonth() === m && sd.getFullYear() === y && s.status === "active"; } catch { return false; } }).length * 2999;
//     return { label: months[m], orders: orderRev, subs: subRev, total: orderRev + subRev };
//   });
//   const max = Math.max(...data.map(d => d.total), 1);
//   return (
//     <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
//         <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: "'Playfair Display',serif" }}>Revenue Overview (6 months)</h3>
//         <div style={{ display: "flex", gap: 16 }}>
//           {[{ c: C.forest, l: "Orders" }, { c: C.sage, l: "Subscriptions" }].map(x => (
//             <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
//               <div style={{ width: 10, height: 10, borderRadius: 3, background: x.c }} />
//               <span style={{ fontSize: 11, color: C.textMuted }}>{x.l}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130 }}>
//         {data.map((d, i) => (
//           <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, height: "100%" }}>
//             <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
//               <div style={{
//                 width: "100%", background: C.sage, opacity: 0.75,
//                 borderRadius: `3px 3px 0 0`, height: `${(d.subs / max) * 60}%`, minHeight: d.subs > 0 ? 4 : 0
//               }} />
//               <div style={{
//                 width: "100%", background: C.forest,
//                 borderRadius: d.subs > 0 ? "0" : `3px 3px 0 0`,
//                 height: `${(d.orders / max) * 60}%`, minHeight: d.orders > 0 ? 4 : 0
//               }} />
//             </div>
//             <span style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>{d.label}</span>
//           </div>
//         ))}
//       </div>
//       <div style={{
//         display: "flex", justifyContent: "space-between", marginTop: 16,
//         paddingTop: 16, borderTop: `1px solid ${C.border}`
//       }}>
//         <div>
//           <div style={{ fontSize: 11, color: C.textMuted }}>Order Revenue</div>
//           <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{fmtC(data.reduce((s, d) => s + d.orders, 0))}</div>
//         </div>
//         <div style={{ textAlign: "right" }}>
//           <div style={{ fontSize: 11, color: C.textMuted }}>Subscription Revenue</div>
//           <div style={{ fontSize: 16, fontWeight: 700, color: C.sage }}>{fmtC(data.reduce((s, d) => s + d.subs, 0))}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Right Panel ──────────────────────────────────────────────────────────────
// const RightPanel = ({ users, diseases, weather, subscriptions }: any) => {
//   const recent = [...users].sort((a: User, b: User) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
//   const highAlerts = weather.filter((w: WeatherAlert) => ["high", "critical"].includes(w.severity)).slice(0, 3);

//   return (
//     <div style={{
//       width: 268, flexShrink: 0, background: C.white, borderLeft: `1px solid ${C.border}`,
//       overflowY: "auto", display: "flex", flexDirection: "column"
//     }}>

//       {/* Stats summary */}
//       <div style={{ padding: "20px 18px", borderBottom: `1px solid ${C.border}` }}>
//         <h4 style={{
//           fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14,
//           fontFamily: "'Playfair Display',serif"
//         }}>Platform Summary</h4>
//         {[
//           { icon: "👨‍🌾", text: `${users.filter((u: User) => u.role === "farmer").length} Farmers`, sub: "Registered" },
//           { icon: "🛒", text: `${subscriptions.filter((s: Subscription) => s.status === "active").length} Active Subs`, sub: "Stripe paid" },
//           { icon: "🌾", text: `${diseases.length} AI Scans`, sub: "Crop diagnoses" },
//           { icon: "⛅", text: `${weather.length} Weather Alerts`, sub: "All districts" },
//         ].map((n, i) => (
//           <div key={i} style={{
//             display: "flex", alignItems: "center", gap: 10, padding: "9px 0",
//             borderBottom: i < 3 ? `1px solid ${C.border}` : "none"
//           }}>
//             <div style={{
//               width: 32, height: 32, borderRadius: 8, background: C.sagePale,
//               display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0
//             }}>
//               {n.icon}
//             </div>
//             <div>
//               <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{n.text}</div>
//               <div style={{ fontSize: 10, color: C.textMuted }}>{n.sub}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Registrations */}
//       <div style={{ padding: "18px 18px", borderBottom: `1px solid ${C.border}` }}>
//         <h4 style={{
//           fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12,
//           fontFamily: "'Playfair Display',serif"
//         }}>Recent Signups</h4>
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {recent.map((u: User) => (
//             <div key={u._id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <Avatar name={u.name} size={28} />
//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <div style={{
//                   fontSize: 12, fontWeight: 600, color: C.text,
//                   overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"
//                 }}>{u.name}</div>
//                 <div style={{ fontSize: 10, color: C.textMuted }}>{u.role} · {fmtD(u.createdAt)}</div>
//               </div>
//             </div>
//           ))}
//           {recent.length === 0 && <div style={{ fontSize: 12, color: C.textMuted }}>No recent signups.</div>}
//         </div>
//       </div>

//       {/* Recent AI Scans */}
//       <div style={{ padding: "18px 18px", borderBottom: `1px solid ${C.border}` }}>
//         <h4 style={{
//           fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12,
//           fontFamily: "'Playfair Display',serif"
//         }}>Recent AI Scans</h4>
//         <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//           {diseases.slice(0, 3).map((d: Disease) => (
//             <div key={d._id} style={{
//               padding: "8px 10px", borderRadius: 10, background: C.sagePale,
//               border: `1px solid ${C.borderSage}`
//             }}>
//               <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{d.cropName}</div>
//               <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>
//                 {getName(d.userId)} · {fmtD(d.createdAt)}
//               </div>
//             </div>
//           ))}
//           {diseases.length === 0 && <div style={{ fontSize: 12, color: C.textMuted }}>No scans yet.</div>}
//         </div>
//       </div>

//       {/* Weather */}
//       <div style={{ padding: "18px 18px", borderBottom: `1px solid ${C.border}` }}>
//         <h4 style={{
//           fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12,
//           fontFamily: "'Playfair Display',serif"
//         }}>Critical Alerts</h4>
//         {highAlerts.length > 0 ? highAlerts.map((w: WeatherAlert) => (
//           <div key={w._id} style={{
//             padding: "8px 10px", borderRadius: 10, marginBottom: 8,
//             background: C.amberBg, border: `1px solid ${C.amber}40`
//           }}>
//             <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{w.district}</div>
//             <div style={{
//               fontSize: 10, color: C.textMuted, marginTop: 2,
//               overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"
//             }}>{w.message}</div>
//           </div>
//         )) : (
//           <div style={{
//             padding: "8px 10px", borderRadius: 10, background: C.greenLight,
//             fontSize: 12, color: C.green, fontWeight: 600
//           }}>✓ No critical alerts</div>
//         )}
//       </div>

//       {/* Farmer Plan CTA */}
//       <div style={{ padding: "18px 18px" }}>
//         <div style={{
//           borderRadius: 14, padding: "18px 16px",
//           background: `linear-gradient(135deg,${C.forest},${C.forestMid})`,
//           position: "relative", overflow: "hidden"
//         }}>
//           <div style={{
//             position: "absolute", top: -24, right: -24, width: 80, height: 80,
//             background: "rgba(106,170,120,0.18)", borderRadius: "50%"
//           }} />
//           <div style={{ fontSize: 11, color: C.sageLight, marginBottom: 6, fontWeight: 600 }}>🌾 Farmer Plan</div>
//           <div style={{
//             fontSize: 22, fontWeight: 800, color: C.amberLight,
//             fontFamily: "'Playfair Display',serif"
//           }}>Rs. 2,999</div>
//           <div style={{ fontSize: 10, color: C.sageLight, marginBottom: 12 }}>Per Month · 7-day trial</div>
//           <div style={{ fontSize: 11, color: "rgba(168,213,181,0.8)", marginBottom: 14, lineHeight: 1.5 }}>
//             AI disease detection · Weather alerts · Marketplace
//           </div>
//           <button className="act-btn" style={{
//             width: "100%", background: C.sage, color: C.white,
//             border: "none", padding: "9px 0", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer"
//           }}>
//             Manage Plans
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function AdminDashboard() {
//   const router = useRouter();
//   const [section, setSection] = useState<Section>("dashboard");
//   const [adminUser, setAdmin] = useState<any>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const [subscriptions, setSubs] = useState<Subscription[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [diseases, setDiseases] = useState<Disease[]>([]);
//   const [weather, setWeather] = useState<WeatherAlert[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQ, setSearchQ] = useState("");

//   // Pagination state
//   const [userPage, setUserPage] = useState(1);
//   const [prodPage, setProdPage] = useState(1);
//   const [orderPage, setOrderPage] = useState(1);
//   const PER = 10;

//   // Filter state
//   const [orderFilter, setOrderFilter] = useState("all");
//   const [userFilter, setUserFilter] = useState("all");
//   const [prodFilter, setProdFilter] = useState("all");

//   // Product modal
//   const [pModal, setPModal] = useState<"create" | "edit" | null>(null);
//   const [pEdit, setPEdit] = useState<Partial<Product>>({});
//   const [pSaving, setPSaving] = useState(false);
//   const [pError, setPError] = useState("");

//   // ─── Data loading ──────────────────────────────────────────────────────────
//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         api.get("/auth/users").then(r => setUsers(Array.isArray(r.data) ? r.data : [])),
//         api.get("/subscriptions/admin/all").then(r => setSubs(Array.isArray(r.data) ? r.data : r.data?.subscriptions || [])),
//         api.get("/products/admin/all").then(r => setProducts(r.data?.products || r.data || [])),
//         api.get("/orders/admin/all").then(r => setOrders(r.data?.orders || r.data || [])),
//         api.get("/diseases/admin/all").then(r => setDiseases(Array.isArray(r.data) ? r.data : r.data?.diseases || [])),
//         api.get("/weather/admin/all").then(r => setWeather(r.data?.alerts || r.data || [])),
//       ]);
//     } catch (e) { console.error("Load error:", e); }
//     finally { setLoading(false); }
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem("agriai_token");
//     const raw = localStorage.getItem("agriai_user");
//     if (!token || !raw) { router.push("/"); return; }
//     try {
//       const u = JSON.parse(raw);
//       if (u.role !== "admin") { router.push("/"); return; }
//       setAdmin(u);
//     } catch { router.push("/"); return; }
//     load();
//   }, [router, load]);

//   const handleLogout = () => {
//     localStorage.removeItem("agriai_token");
//     localStorage.removeItem("agriai_user");
//     router.push("/");
//   };

//   // ─── Product CRUD ──────────────────────────────────────────────────────────
//   const openCreate = () => {
//     setPEdit({ cropName: "", category: "Seeds", price: 0, stock: 0, description: "", status: "active" });
//     setPError(""); setPModal("create");
//   };
//   const openEdit = (p: Product) => { setPEdit({ ...p }); setPError(""); setPModal("edit"); };
//   const handleProdSave = async () => {
//     const name = (pEdit.cropName || pEdit.name || "").trim();
//     if (!name) { setPError("Product name is required."); return; }
//     if (!pEdit.price || pEdit.price <= 0) { setPError("Valid price required."); return; }
//     setPSaving(true); setPError("");
//     try {
//       if (pModal === "create") await api.post("/products", { ...pEdit, name });
//       else await api.put(`/products/${(pEdit as any)._id}`, pEdit);
//       setPModal(null); await load();
//     } catch (e: any) { setPError(e.response?.data?.message || "Save failed."); }
//     finally { setPSaving(false); }
//   };
//   const handleProdDelete = async (id: string) => {
//     if (!confirm("Permanently delete this product?")) return;
//     try { await api.delete(`/products/${id}`); setProducts(prev => prev.filter(p => p._id !== id)); }
//     catch (e: any) { alert(e.response?.data?.message || "Delete failed."); }
//   };
//   const handleProdStatus = async (id: string, cur: string) => {
//     try { await api.patch(`/products/admin/${id}/status`, { status: cur === "active" ? "inactive" : "active" }); await load(); }
//     catch (e) { console.error(e); }
//   };

//   // ─── Derived / filtered data ───────────────────────────────────────────────
//   const farmers = users.filter(u => u.role === "farmer");
//   const consumers = users.filter(u => u.role === "consumer" || u.role === "user");
//   const totalRev = orders.reduce((s, o) => s + (o.totalAmount || 0), 0)
//     + subscriptions.filter(s => s.status === "active").length * 2999;

//   const filteredUsers = users
//     .filter(u => userFilter === "all" || u.role === userFilter)
//     .filter(u => !searchQ || (u.name + u.email).toLowerCase().includes(searchQ.toLowerCase()));
//   const filteredProds = products
//     .filter(p => prodFilter === "all" || p.status === prodFilter)
//     .filter(p => !searchQ || (p.cropName || p.name || "").toLowerCase().includes(searchQ.toLowerCase()));
//   const filteredOrds = orders
//     .filter(o => orderFilter === "all" || o.status === orderFilter)
//     .filter(o => !searchQ || getName(o.consumerId).toLowerCase().includes(searchQ.toLowerCase()));

//   const pageU = filteredUsers.slice((userPage - 1) * PER, userPage * PER);
//   const pageP = filteredProds.slice((prodPage - 1) * PER, prodPage * PER);
//   const pageO = filteredOrds.slice((orderPage - 1) * PER, orderPage * PER);

//   // ─── Section renders ───────────────────────────────────────────────────────

//   const renderDashboard = () => (
//     <div style={{ display: "flex", flexDirection: "column", gap: 22, animation: "fadeIn 0.3s ease" }}>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 14 }}>
//         <StatCard title="Total Farmers" value={fmt(farmers.length)} icon={Leaf}
//           color={C.sage} delta={4} sub="Registered" />
//         <StatCard title="Consumers" value={fmt(consumers.length)} icon={Users}
//           color={C.forest} delta={8} sub="Active buyers" />
//         <StatCard title="Total Orders" value={fmt(orders.length)} icon={ShoppingBag}
//           color={C.amber} delta={12} sub="All time" />
//         <StatCard title="Platform Revenue" value={fmtC(totalRev)} icon={CreditCard}
//           color={C.forestMid} delta={6} sub="Orders + Subs" />
//       </div>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
//         <StatCard title="Active Subscriptions" value={fmt(subscriptions.filter(s => s.status === "active").length)}
//           icon={TrendingUp} color={C.green} sub="Stripe active" />
//         <StatCard title="Listings" value={fmt(products.length)} icon={Package}
//           color={C.forestMid} sub="All products" />
//         <StatCard title="AI Scans" value={fmt(diseases.length)} icon={Leaf}
//           color={C.amber} sub="Crop diagnoses" />
//         <StatCard title="Weather Alerts" value={fmt(weather.length)} icon={CloudRain}
//           color={C.blue} sub="All districts" />
//       </div>
//       <RevenueChart orders={orders} subscriptions={subscriptions} />
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//         <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
//           <h3 style={{
//             fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16,
//             fontFamily: "'Playfair Display',serif"
//           }}>Recent Orders</h3>
//           {orders.slice(0, 5).map(o => (
//             <div key={o._id} style={{
//               display: "flex", justifyContent: "space-between",
//               alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}`
//             }}>
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{getName(o.consumerId)}</div>
//                 <div style={{ fontSize: 11, color: C.textMuted }}>{fmtD(o.createdAt)}</div>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{fmtC(o.totalAmount)}</span>
//                 <Badge label={o.status} />
//               </div>
//             </div>
//           ))}
//           {orders.length === 0 && <div style={{ fontSize: 13, color: C.textMuted }}>No orders yet.</div>}
//         </div>
//         <div style={{ background: C.white, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
//           <h3 style={{
//             fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16,
//             fontFamily: "'Playfair Display',serif"
//           }}>Subscription Breakdown</h3>
//           {[
//             { label: "Active", count: subscriptions.filter(s => s.status === "active").length, color: C.green },
//             { label: "Trialing", count: subscriptions.filter(s => s.status === "trialing").length, color: C.amber },
//             { label: "Cancelled", count: subscriptions.filter(s => s.status === "cancelled").length, color: C.red },
//             { label: "Past Due", count: subscriptions.filter(s => s.status === "past_due").length, color: C.blue },
//           ].map(s => {
//             const pct = subscriptions.length ? Math.round(s.count / subscriptions.length * 100) : 0;
//             return (
//               <div key={s.label} style={{ marginBottom: 14 }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
//                   <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{s.label}</span>
//                   <span style={{ fontSize: 12, color: C.textMuted }}>{s.count} ({pct}%)</span>
//                 </div>
//                 <div style={{ height: 7, borderRadius: 4, background: C.creamDark, overflow: "hidden" }}>
//                   <div style={{
//                     height: "100%", width: `${pct}%`, background: s.color,
//                     borderRadius: 4, transition: "width 0.6s ease"
//                   }} />
//                 </div>
//               </div>
//             );
//           })}
//           {subscriptions.length === 0 && <div style={{ fontSize: 13, color: C.textMuted }}>No subscription data.</div>}
//         </div>
//       </div>
//     </div>
//   );

//   const FilterBar = ({ searchPlaceholder, filterValue, filterOptions, onFilter, onPage }: any) => (
//     <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
//       <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
//         <Search size={14} style={{
//           position: "absolute", left: 12, top: "50%",
//           transform: "translateY(-50%)", color: C.textMuted
//         }} />
//         <input placeholder={searchPlaceholder} value={searchQ}
//           onChange={e => { setSearchQ(e.target.value); onPage(1); }}
//           style={{ ...inputStyle, paddingLeft: 36 }} />
//       </div>
//       <select value={filterValue} onChange={(e: any) => { onFilter(e.target.value); onPage(1); }}
//         style={{ ...inputStyle, width: "auto", cursor: "pointer" }}>
//         {filterOptions.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
//       </select>
//     </div>
//   );

//   const renderUsers = () => (
//     <div style={{ animation: "fadeIn 0.3s ease" }}>
//       <SectionHead title="User Directory" />
//       <FilterBar searchPlaceholder="Search users…" filterValue={userFilter}
//         filterOptions={[
//           { value: "all", label: "All Roles" }, { value: "farmer", label: "Farmers" },
//           { value: "consumer", label: "Consumers" }, { value: "admin", label: "Admins" },
//         ]}
//         onFilter={setUserFilter} onPage={setUserPage} />
//       <Table head={["User", "Role", "Joined", "Subscription", ""]}>
//         {pageU.map(u => {
//           const sub = subscriptions.find(s => {
//             const uid = typeof s.userId === "object" ? (s.userId as any)._id : s.userId;
//             return uid === u._id;
//           });
//           return (
//             <TR key={u._id}>
//               <TD>
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   <Avatar name={u.name} size={34} />
//                   <div>
//                     <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
//                     <div style={{ fontSize: 11, color: C.textMuted }}>{u.email}</div>
//                   </div>
//                 </div>
//               </TD>
//               <TD><Badge label={u.role} /></TD>
//               <TD muted>{fmtD(u.createdAt)}</TD>
//               <TD>{sub ? <Badge label={sub.status} /> : <span style={{ fontSize: 11, color: C.textMuted }}>None</span>}</TD>
//               <TD right>
//                 <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", padding: 4 }}>
//                   <MoreHorizontal size={15} />
//                 </button>
//               </TD>
//             </TR>
//           );
//         })}
//         {pageU.length === 0 && <TR><td colSpan={5} style={{ padding: 32, textAlign: "center", color: C.textMuted, fontSize: 13 }}>No users found.</td></TR>}
//       </Table>
//       <Pagination page={userPage} total={filteredUsers.length} perPage={PER} onChange={setUserPage} />
//     </div>
//   );

//   const renderMarketplace = () => (
//     <div style={{ animation: "fadeIn 0.3s ease" }}>
//       <SectionHead title="Marketplace Management"
//         action={<Btn onClick={openCreate}><Plus size={15} /> Add Product</Btn>} />
//       <FilterBar searchPlaceholder="Search products…" filterValue={prodFilter}
//         filterOptions={[{ value: "all", label: "All Status" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
//         onFilter={setProdFilter} onPage={setProdPage} />
//       <Table head={["Product", "Farmer", "Category", "Price", "Stock", "Status", "Actions"]}>
//         {pageP.map(p => (
//           <TR key={p._id}>
//             <TD><div style={{ fontWeight: 600 }}>{p.cropName || p.name}</div></TD>
//             <TD muted>{getName(p.farmerId)}</TD>
//             <TD muted>{p.category}</TD>
//             <TD><span style={{ fontWeight: 700 }}>{fmtC(p.price)}</span></TD>
//             <TD muted>{p.stock}</TD>
//             <TD>
//               <button onClick={() => handleProdStatus(p._id, p.status)} className="act-btn"
//                 style={{
//                   padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
//                   border: "none", cursor: "pointer", transition: "opacity 0.15s",
//                   ...statusPalette(p.status || "active")
//                 }}>
//                 {(p.status || "active").toUpperCase()}
//               </button>
//             </TD>
//             <TD right>
//               <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
//                 <button onClick={() => openEdit(p)} className="act-btn"
//                   style={{
//                     background: C.sagePale, border: "none", borderRadius: 8,
//                     padding: "6px 10px", cursor: "pointer", color: C.forest, display: "flex", alignItems: "center"
//                   }}>
//                   <Edit2 size={13} />
//                 </button>
//                 <button onClick={() => handleProdDelete(p._id)} className="act-btn"
//                   style={{
//                     background: C.redLight, border: "none", borderRadius: 8,
//                     padding: "6px 10px", cursor: "pointer", color: C.red, display: "flex", alignItems: "center"
//                   }}>
//                   <Trash2 size={13} />
//                 </button>
//               </div>
//             </TD>
//           </TR>
//         ))}
//         {pageP.length === 0 && <TR><td colSpan={7} style={{ padding: 32, textAlign: "center", color: C.textMuted, fontSize: 13 }}>No products found.</td></TR>}
//       </Table>
//       <Pagination page={prodPage} total={filteredProds.length} perPage={PER} onChange={setProdPage} />

//       {pModal && (
//         <Modal title={pModal === "create" ? "Add Product" : "Edit Product"} onClose={() => setPModal(null)}>
//           <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//             <Field label="Product Name">
//               <input style={inputStyle} placeholder="e.g. Tomato Seeds"
//                 value={pEdit.cropName || pEdit.name || ""}
//                 onChange={(e: any) => setPEdit({ ...pEdit, cropName: e.target.value })} />
//             </Field>
//             <Field label="Category">
//               <select style={{ ...inputStyle, cursor: "pointer" }}
//                 value={pEdit.category || "Seeds"}
//                 onChange={(e: any) => setPEdit({ ...pEdit, category: e.target.value })}>
//                 {["Seeds", "Fertilizer", "Vegetables", "Fruits", "Pesticides", "Tools"].map(c => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </Field>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//               <Field label="Price (Rs.)">
//                 <input style={inputStyle} type="number" placeholder="0"
//                   value={pEdit.price || ""} onChange={(e: any) => setPEdit({ ...pEdit, price: parseFloat(e.target.value) || 0 })} />
//               </Field>
//               <Field label="Stock">
//                 <input style={inputStyle} type="number" placeholder="0"
//                   value={pEdit.stock || ""} onChange={(e: any) => setPEdit({ ...pEdit, stock: parseInt(e.target.value) || 0 })} />
//               </Field>
//             </div>
//             <Field label="Description">
//               <textarea style={{ ...inputStyle, height: 90, resize: "vertical" }}
//                 placeholder="Short description…" value={pEdit.description || ""}
//                 onChange={(e: any) => setPEdit({ ...pEdit, description: e.target.value })} />
//             </Field>
//             {pError && (
//               <div style={{
//                 padding: "10px 14px", borderRadius: 10, background: C.redLight,
//                 color: C.red, fontSize: 13, display: "flex", alignItems: "center", gap: 8
//               }}>
//                 <AlertCircle size={14} /> {pError}
//               </div>
//             )}
//             <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
//               <Btn variant="secondary" onClick={() => setPModal(null)}>Cancel</Btn>
//               <Btn onClick={handleProdSave} disabled={pSaving}>
//                 {pSaving ? "Saving…" : "Save Product"}
//               </Btn>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );

//   const renderOrders = () => (
//     <div style={{ animation: "fadeIn 0.3s ease" }}>
//       <SectionHead title="All Orders" />
//       <FilterBar searchPlaceholder="Search by customer…" filterValue={orderFilter}
//         filterOptions={[
//           { value: "all", label: "All Status" }, { value: "pending", label: "Pending" },
//           { value: "processing", label: "Processing" }, { value: "delivered", label: "Delivered" },
//           { value: "cancelled", label: "Cancelled" },
//         ]}
//         onFilter={setOrderFilter} onPage={setOrderPage} />
//       <Table head={["Order ID", "Customer", "Farmer", "Amount", "Status", "Date"]}>
//         {pageO.map(o => (
//           <TR key={o._id}>
//             <TD mono muted style={{ fontSize: 11 }}>{o._id.slice(-8).toUpperCase()}</TD>
//             <TD>
//               <div style={{ fontWeight: 600 }}>{getName(o.consumerId)}</div>
//               <div style={{ fontSize: 11, color: C.textMuted }}>{getEmail(o.consumerId)}</div>
//             </TD>
//             <TD muted>{getName(o.farmerId)}</TD>
//             <TD><span style={{ fontWeight: 700 }}>{fmtC(o.totalAmount)}</span></TD>
//             <TD><Badge label={o.status} /></TD>
//             <TD muted>{fmtD(o.createdAt)}</TD>
//           </TR>
//         ))}
//         {pageO.length === 0 && <TR><td colSpan={6} style={{ padding: 32, textAlign: "center", color: C.textMuted, fontSize: 13 }}>No orders found.</td></TR>}
//       </Table>
//       <Pagination page={orderPage} total={filteredOrds.length} perPage={PER} onChange={setOrderPage} />
//     </div>
//   );

//   const renderReports = () => (
//     <div style={{ animation: "fadeIn 0.3s ease" }}>
//       <SectionHead title="AI Disease Reports" />
//       <Table head={["Farmer", "Crop", "Diagnosis", "Date", "Status"]}>
//         {diseases.slice(0, 30).map(d => (
//           <TR key={d._id}>
//             <TD>
//               <div style={{ fontWeight: 600 }}>{getName(d.userId)}</div>
//               <div style={{ fontSize: 11, color: C.textMuted }}>{getEmail(d.userId)}</div>
//             </TD>
//             <TD muted>{d.cropName}</TD>
//             <TD style={{ maxWidth: 220 }}>
//               <div style={{
//                 fontSize: 12, color: C.text, overflow: "hidden",
//                 display: "-webkit-box" as any, WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any
//               }}>
//                 {d.diagnosis || "Pending"}
//               </div>
//             </TD>
//             <TD muted>{fmtD(d.createdAt)}</TD>
//             <TD><Badge label={d.status || "completed"} /></TD>
//           </TR>
//         ))}
//         {diseases.length === 0 && <TR><td colSpan={5} style={{ padding: 32, textAlign: "center", color: C.textMuted, fontSize: 13 }}>No reports yet.</td></TR>}
//       </Table>
//     </div>
//   );

//   const renderWeather = () => (
//     <div style={{ animation: "fadeIn 0.3s ease" }}>
//       <SectionHead title="Weather Alerts" />
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
//         {weather.map(w => (
//           <div key={w._id} style={{
//             background: C.white, borderRadius: 14, padding: "18px 20px",
//             border: `1px solid ${C.border}`,
//             borderLeft: `4px solid ${w.severity === "critical" ? C.red : w.severity === "high" ? C.amber : C.sage}`
//           }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
//               <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{w.district}</div>
//               <Badge label={w.severity} />
//             </div>
//             <div style={{ fontSize: 13, color: C.textMid, lineHeight: 1.5, marginBottom: 8 }}>{w.message}</div>
//             <div style={{ fontSize: 11, color: C.textMuted }}>{fmtD(w.createdAt)}</div>
//           </div>
//         ))}
//         {weather.length === 0 && (
//           <div style={{
//             padding: 40, textAlign: "center", color: C.textMuted, fontSize: 13,
//             background: C.white, borderRadius: 14, border: `1px solid ${C.border}`
//           }}>
//             No weather alerts on record.
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderSettings = () => (
//     <div style={{ animation: "fadeIn 0.3s ease" }}>
//       <SectionHead title="System Configuration" />
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//         {[
//           { title: "Platform Info", items: ["App: AgriCare AI", "Region: Sri Lanka", "Currency: LKR", "Version: 1.0.0"] },
//           { title: "Farmer Plan", items: ["Price: Rs. 2,999 / month", "Free Trial: 7 days", "Payment: Stripe", "Billing: Per-farmer"] },
//           { title: "AI Service", items: ["Provider: OpenRouter", "Model: Llama 3.2 Vision", "Use: Crop diagnosis", "Tier: Free"] },
//           { title: "Weather", items: ["Provider: OpenWeatherMap", "Districts: 25 (Sri Lanka)", "Tier: Free", "Alerts: Admin-managed"] },
//         ].map(sec => (
//           <div key={sec.title} style={{
//             background: C.white, borderRadius: 16, padding: "20px 24px",
//             border: `1px solid ${C.border}`
//           }}>
//             <h3 style={{
//               fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14,
//               fontFamily: "'Playfair Display',serif"
//             }}>{sec.title}</h3>
//             {sec.items.map(item => (
//               <div key={item} style={{
//                 display: "flex", alignItems: "center", gap: 8,
//                 padding: "7px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13, color: C.textMid
//               }}>
//                 <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.sage, flexShrink: 0 }} />
//                 {item}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderContent = () => {
//     if (loading) return (
//       <div style={{
//         display: "flex", flexDirection: "column", alignItems: "center",
//         justifyContent: "center", height: 300, gap: 16
//       }}>
//         <div style={{
//           width: 36, height: 36, border: `3px solid ${C.sageLight}`,
//           borderTopColor: C.forest, borderRadius: "50%", animation: "spin 0.8s linear infinite"
//         }} />
//         <span style={{ color: C.textMuted, fontSize: 13 }}>Loading platform data…</span>
//       </div>
//     );
//     switch (section) {
//       case "dashboard": return renderDashboard();
//       case "users": return renderUsers();
//       case "marketplace": return renderMarketplace();
//       case "orders": return renderOrders();
//       case "reports": return renderReports();
//       case "weather": return renderWeather();
//       case "settings": return renderSettings();
//     }
//   };

//   // ─── Navigation config ─────────────────────────────────────────────────────
//   const navGroups = [
//     {
//       label: "MAIN", items: [
//         { id: "dashboard", label: "Overview", icon: LayoutDashboard },
//         { id: "users", label: "Users", icon: Users },
//         { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
//         { id: "orders", label: "Orders", icon: Package },
//       ]
//     },
//     {
//       label: "ANALYTICS", items: [
//         { id: "reports", label: "AI Reports", icon: Leaf },
//         { id: "weather", label: "Weather", icon: CloudRain },
//       ]
//     },
//     {
//       label: "SYSTEM", items: [
//         { id: "settings", label: "Settings", icon: Settings },
//       ]
//     },
//   ];

//   const sectionTitles: Record<Section, string> = {
//     dashboard: "Overview", users: "User Directory", marketplace: "Marketplace",
//     orders: "Orders", reports: "AI Reports", weather: "Weather Alerts", settings: "Settings",
//   };

//   return (
//     <>
//       <style>{FONTS}</style>
//       <div style={{
//         display: "flex", height: "100vh", background: C.cream,
//         color: C.text, overflow: "hidden", fontFamily: "'DM Sans',sans-serif"
//       }}>

//         {/* ── Sidebar ───────────────────────────────────────────────────── */}
//         <aside style={{
//           width: 226, background: C.forest, display: "flex",
//           flexDirection: "column", flexShrink: 0, overflowY: "auto"
//         }}>

//           {/* Logo */}
//           <div style={{ padding: "26px 18px 20px" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 30 }}>
//               <div style={{
//                 width: 36, height: 36, borderRadius: 10, background: C.sage,
//                 display: "flex", alignItems: "center", justifyContent: "center"
//               }}>
//                 <Leaf size={19} color={C.white} />
//               </div>
//               <span style={{
//                 fontSize: 18, fontWeight: 800, color: C.white,
//                 fontFamily: "'Playfair Display',serif"
//               }}>
//                 Agreal<span style={{ color: C.amberLight }}>.</span>
//               </span>
//             </div>

//             {navGroups.map(g => (
//               <div key={g.label} style={{ marginBottom: 22 }}>
//                 <div style={{
//                   fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 8,
//                   paddingLeft: 12, color: "rgba(168,213,181,0.45)"
//                 }}>{g.label}</div>
//                 {g.items.map(item => {
//                   const active = section === item.id;
//                   return (
//                     <button key={item.id} className="nav-btn"
//                       onClick={() => { setSection(item.id as Section); setSearchQ(""); }}
//                       style={{
//                         display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
//                         borderRadius: 10, border: "none", cursor: "pointer", width: "100%",
//                         textAlign: "left", marginBottom: 2, transition: "all 0.15s",
//                         background: active ? "rgba(106,170,120,0.18)" : "transparent",
//                         color: active ? C.sageLight : "rgba(168,213,181,0.65)",
//                         fontWeight: active ? 700 : 500, fontSize: 13
//                       }}>
//                       <item.icon size={16} />
//                       <span style={{ flex: 1 }}>{item.label}</span>
//                       {active && <ChevronRight size={12} />}
//                     </button>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>

//           {/* Admin footer */}
//           <div style={{
//             marginTop: "auto", padding: "16px 18px",
//             borderTop: "1px solid rgba(106,170,120,0.12)"
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
//               <Avatar name={adminUser?.name || "Admin"} size={36} />
//               <div>
//                 <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{adminUser?.name || "Administrator"}</div>
//                 <div style={{ fontSize: 10, color: "rgba(168,213,181,0.55)" }}>Super Admin</div>
//               </div>
//             </div>
//             <button onClick={handleLogout} className="act-btn"
//               style={{
//                 display: "flex", alignItems: "center", gap: 8, width: "100%",
//                 padding: "8px 12px", borderRadius: 10,
//                 border: "1px solid rgba(192,57,43,0.3)", background: "rgba(192,57,43,0.08)",
//                 color: "rgba(255,120,100,0.9)", fontWeight: 600, cursor: "pointer", fontSize: 12
//               }}>
//               <LogOut size={13} /> Logout
//             </button>
//           </div>
//         </aside>

//         {/* ── Centre + Right ────────────────────────────────────────────── */}
//         <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

//           {/* Main content */}
//           <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

//             {/* Header */}
//             <header style={{
//               height: 60, background: C.white, borderBottom: `1px solid ${C.border}`,
//               padding: "0 28px", display: "flex", alignItems: "center",
//               justifyContent: "space-between", flexShrink: 0
//             }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                 <span style={{ fontSize: 11, color: C.textMuted }}>Dashboards</span>
//                 <ChevronRight size={12} color={C.textMuted} />
//                 <span style={{ fontSize: 11, fontWeight: 700, color: C.forest }}>{sectionTitles[section]}</span>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                 <span style={{ fontSize: 12, color: C.textMuted }}>
//                   {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
//                 </span>
//                 <div style={{ position: "relative", cursor: "pointer" }}>
//                   <Bell size={18} color={C.textMuted} />
//                   <div style={{
//                     position: "absolute", top: -2, right: -2, width: 7, height: 7,
//                     background: C.amber, borderRadius: "50%", border: `2px solid ${C.white}`
//                   }} />
//                 </div>
//                 <div style={{
//                   display: "flex", alignItems: "center", gap: 8,
//                   paddingLeft: 14, borderLeft: `1px solid ${C.border}`
//                 }}>
//                   <Avatar name={adminUser?.name || "A"} size={30} />
//                   <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
//                     {adminUser?.name?.split(" ")[0] || "Admin"}
//                   </span>
//                 </div>
//               </div>
//             </header>

//             {/* Page content */}
//             <main style={{ flex: 1, overflowY: "auto", padding: "26px 28px 48px" }}>
//               {renderContent()}
//             </main>
//           </div>

//           {/* Right panel */}
//           <RightPanel users={users} diseases={diseases} weather={weather} subscriptions={subscriptions} />
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios-proxy";

// ─── Types ────────────────────────────────────────────────────────────────────
interface User    { _id:string; name:string; email:string; role:string; createdAt:string; }
interface Subscription { _id:string; userId:{_id:string;name:string;email:string}|string; status:string; currentPeriodEnd:string; createdAt:string; }
interface Order   { _id:string; consumerId:{name:string;email:string}|string; farmerId:{name:string}|string; totalAmount:number; status:string; createdAt:string; }
interface Product { _id:string; name?:string; cropName?:string; price:number; farmerId:{name:string;email:string}|string; category:string; status?:string; description?:string; stock?:number; createdAt:string; imageUrl?:string; type?:string; }
interface Disease { _id:string; userId:{name:string}|string; cropName:string; diagnosis:string; createdAt:string; status:string; }
interface WeatherAlert { _id:string; district:string; message:string; severity:string; createdAt:string; }

type Section = "dashboard"|"users"|"marketplace"|"reports"|"settings";

// ─── Design Tokens — Forest Green ─────────────────────────────────────────────
const T = {
  bg:      "#0e1f16",
  sidebar: "#091710",
  card:    "#122019",
  card2:   "#163025",
  border:  "rgba(106,170,120,0.15)",
  accent:  "#6aaa78",
  accentL: "#a8d5b5",
  green:   "#4ade80",
  amber:   "#d4a853",
  amberL:  "#f0c96b",
  red:     "#f87171",
  blue:    "#60a5fa",
  text:    "#e8f5ec",
  muted:   "#4a7a5a",
  subtle:  "#2d5a3d",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtLKR  = (n:number) => "Rs."+new Intl.NumberFormat("en-LK",{maximumFractionDigits:0}).format(n);
const fmtDate = (d:string) => new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const fmtTime = (d:string) => { const diff=Date.now()-new Date(d).getTime(); const m=Math.floor(diff/60000); if(m<1)return"Just now"; if(m<60)return`${m}m ago`; const h=Math.floor(m/60); if(h<24)return`${h}h ago`; return fmtDate(d); };
const prodName= (p:Product) => p.cropName||p.name||"—";

const statusMeta = (s:string):{bg:string;color:string;label:string} => {
  const m:Record<string,{bg:string;color:string;label:string}> = {
    active:    {bg:"rgba(74,222,128,.12)",  color:"#4ade80", label:"Active"    },
    trialing:  {bg:"rgba(212,168,83,.12)",  color:"#d4a853", label:"Trialing"  },
    canceled:  {bg:"rgba(248,113,113,.12)", color:"#f87171", label:"Canceled"  },
    past_due:  {bg:"rgba(248,113,113,.12)", color:"#f87171", label:"Past Due"  },
    pending:   {bg:"rgba(212,168,83,.12)",  color:"#d4a853", label:"Pending"   },
    approved:  {bg:"rgba(74,222,128,.12)",  color:"#4ade80", label:"Approved"  },
    rejected:  {bg:"rgba(248,113,113,.12)", color:"#f87171", label:"Rejected"  },
    delivered: {bg:"rgba(74,222,128,.12)",  color:"#4ade80", label:"Delivered" },
    processing:{bg:"rgba(212,168,83,.12)",  color:"#d4a853", label:"Processing"},
    shipped:   {bg:"rgba(96,165,250,.12)",  color:"#60a5fa", label:"Shipped"   },
    cancelled: {bg:"rgba(248,113,113,.12)", color:"#f87171", label:"Cancelled" },
  };
  return m[s?.toLowerCase()]??{bg:"rgba(74,222,128,.08)",color:"#4a7a5a",label:s??"—"};
};

const Pill = ({s}:{s:string}) => {
  const {bg,color,label}=statusMeta(s);
  return <span style={{background:bg,color,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{label}</span>;
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const AV_COLORS = ["#2d5a3d","#1e4a30","#3a6040","#4a7a50","#163520","#0f2a1a"];
const avBg = (name:string) => AV_COLORS[(name||"A").charCodeAt(0)%AV_COLORS.length];
const Avatar = ({name,size=30}:{name:string;size?:number}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:avBg(name||"A"),
    display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:size*0.38,fontWeight:700,color:"#a8d5b5",flexShrink:0,
    border:"1px solid rgba(106,170,120,.2)"}}>
    {(name||"A").slice(0,2).toUpperCase()}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({label,value,delta,accent,sub}:{label:string;value:string|number;delta?:number;accent:string;sub?:string}) => (
  <div style={{background:T.card,borderRadius:14,padding:"20px 22px",border:`1px solid ${T.border}`,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent,borderRadius:"14px 14px 0 0"}}/>
    {delta!==undefined&&(
      <span style={{position:"absolute",top:14,right:14,fontSize:10,fontWeight:700,
        color:delta>=0?T.green:T.red,background:delta>=0?"rgba(74,222,128,.1)":"rgba(248,113,113,.1)",
        padding:"2px 7px",borderRadius:20}}>{delta>=0?"+":""}{delta}%</span>
    )}
    <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{label}</div>
    <div style={{fontSize:28,fontWeight:800,color:T.text,fontFamily:"'Sora',sans-serif",lineHeight:1,marginBottom:4}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:T.muted}}>{sub}</div>}
  </div>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const MiniBar = ({data}:{data:{label:string;farmers:number;orders:number}[]}) => {
  const max=Math.max(...data.flatMap(d=>[d.farmers,d.orders]),1);
  const W=100,H=80,bw=6,gap=3,slotW=W/data.length;
  return(
    <svg viewBox={`0 0 ${W} ${H+14}`} style={{width:"100%",height:100}} preserveAspectRatio="none">
      {data.map((d,i)=>{
        const x=i*slotW+(slotW-bw*2-gap)/2;
        const fh=Math.max((d.farmers/max)*H,2);
        const oh=Math.max((d.orders/max)*H,2);
        return(
          <g key={i}>
            <rect x={x}        y={H-fh} width={bw} height={fh} fill={T.accent} opacity={.85} rx={2}/>
            <rect x={x+bw+gap} y={H-oh} width={bw} height={oh} fill={T.amber}  opacity={.85} rx={2}/>
            <text x={x+bw+1.5} y={H+11} textAnchor="middle" fill={T.muted} fontSize={6.5} fontFamily="'DM Sans',sans-serif">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const Donut = ({farmers,consumers}:{farmers:number;consumers:number}) => {
  const total=farmers+consumers||1;
  const r=36,cx=44,cy=44,circ=2*Math.PI*r;
  const fDash=(farmers/total)*circ;
  return(
    <svg width={88} height={88}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a3a2a" strokeWidth={11}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.amber}  strokeWidth={11} strokeDasharray={circ} strokeDashoffset={0} transform={`rotate(-90 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.accent} strokeWidth={11} strokeDasharray={`${fDash} ${circ-fDash}`} strokeDashoffset={0} transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy-3} textAnchor="middle" fill={T.text} fontSize={15} fontWeight={700} fontFamily="'Sora',sans-serif">{total}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill={T.muted} fontSize={8} fontFamily="'DM Sans',sans-serif">users</text>
    </svg>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({page,total,per,onChange}:{page:number;total:number;per:number;onChange:(p:number)=>void}) => {
  const pages=Math.ceil(total/per); if(pages<=1)return null;
  return(
    <div style={{display:"flex",gap:5,justifyContent:"flex-end",paddingTop:12}}>
      <PBtn disabled={page===1}     onClick={()=>onChange(Math.max(1,page-1))}>←</PBtn>
      {[...Array(Math.min(5,pages))].map((_,i)=>{ const p=page<=3?i+1:page-2+i; if(p<1||p>pages)return null;
        return <PBtn key={p} active={p===page} onClick={()=>onChange(p)}>{p}</PBtn>; })}
      <PBtn disabled={page===pages} onClick={()=>onChange(Math.min(pages,page+1))}>→</PBtn>
    </div>
  );
};
const PBtn = ({children,onClick,disabled,active}:{children:React.ReactNode;onClick?:()=>void;disabled?:boolean;active?:boolean}) => (
  <button onClick={onClick} disabled={disabled}
    style={{width:28,height:28,borderRadius:7,border:`1px solid ${T.border}`,
      background:active?T.accent:"rgba(106,170,120,.06)",
      color:active?"#0e1f16":T.accentL,fontSize:11,fontWeight:active?700:500,
      cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1}}>
    {children}
  </button>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:999,
    display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:T.card,borderRadius:16,width:"100%",maxWidth:500,
      maxHeight:"90vh",overflowY:"auto",padding:24,border:`1px solid ${T.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{color:T.text,fontSize:17,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>{title}</h3>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.06)",border:"none",
          color:T.muted,cursor:"pointer",width:30,height:30,borderRadius:8,fontSize:15}}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Form helpers ─────────────────────────────────────────────────────────────
const FL = ({children}:{children:React.ReactNode}) => (
  <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,
    textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{children}</label>
);
const FI = ({value,onChange,type="text",placeholder}:{value:string|number;onChange:(v:string)=>void;type?:string;placeholder?:string}) => (
  <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{width:"100%",background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
      borderRadius:8,padding:"9px 12px",color:T.text,fontSize:13,outline:"none",
      boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}/>
);

// ─── Table helpers ────────────────────────────────────────────────────────────
const TH = ({children,w}:{children:React.ReactNode;w?:string}) => (
  <th style={{padding:"9px 13px",textAlign:"left",color:T.muted,fontWeight:600,fontSize:10,
    textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap",
    borderBottom:`1px solid rgba(106,170,120,.1)`,width:w}}>{children}</th>
);
const TD = ({children,style}:{children:React.ReactNode;style?:React.CSSProperties}) => (
  <td style={{padding:"10px 13px",color:"#a8d5b5",fontSize:13,
    borderBottom:`1px solid rgba(106,170,120,.06)`,verticalAlign:"middle",...style}}>{children}</td>
);
const TR = ({children,onClick}:{children:React.ReactNode;onClick?:()=>void}) => (
  <tr onClick={onClick}
    onMouseEnter={e=>(e.currentTarget.style.background="rgba(106,170,120,.05)")}
    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
    style={{transition:"background .12s",cursor:onClick?"pointer":"default"}}>
    {children}
  </tr>
);

// ─── Action Button ────────────────────────────────────────────────────────────
const Btn = ({children,onClick,v="primary",sm,disabled}:{children:React.ReactNode;onClick?:()=>void;v?:"primary"|"danger"|"ghost"|"success";sm?:boolean;disabled?:boolean}) => {
  const vs:Record<string,React.CSSProperties> = {
    primary: {background:T.accent,         color:"#0e1f16",border:"none"},
    success: {background:"rgba(74,222,128,.15)",color:T.green,  border:`1px solid rgba(74,222,128,.25)`},
    danger:  {background:"rgba(248,113,113,.12)",color:T.red,   border:`1px solid rgba(248,113,113,.2)`},
    ghost:   {background:"rgba(106,170,120,.07)",color:T.accentL,border:`1px solid ${T.border}`},
  };
  return(
    <button onClick={onClick} disabled={disabled}
      style={{...vs[v],borderRadius:7,padding:sm?"3px 10px":"8px 16px",
        fontSize:sm?11:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",
        opacity:disabled?.6:1,fontFamily:"'DM Sans',sans-serif",transition:"opacity .15s"}}
      onMouseEnter={e=>{if(!disabled)(e.currentTarget as HTMLElement).style.opacity=".8";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="1";}}>
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();

  const [section,   setSection]   = useState<Section>("dashboard");
  const [adminUser, setAdminUser] = useState<User|null>(null);
  const [loading,   setLoading]   = useState(true);

  // ── Data states ────────────────────────────────────────────────────────────
  const [users,    setUsers]    = useState<User[]>([]);
  const [subs,     setSubs]     = useState<Subscription[]>([]);
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [weather,  setWeather]  = useState<WeatherAlert[]>([]);

  // ── Users filters ──────────────────────────────────────────────────────────
  const [uSearch,setUSearch]=useState(""); const [uRole,setURole]=useState("all"); const [uPage,setUPage]=useState(1); const U_PER=10;

  // ── Orders filters ─────────────────────────────────────────────────────────
  const [oFilter,setOFilter]=useState("all"); const [oPage,setOPage]=useState(1); const O_PER=10;

  // ── Products / Marketplace ─────────────────────────────────────────────────
  const [pFilter,setPFilter]=useState("all"); const [pSearch,setPSearch]=useState(""); const [pPage,setPPage]=useState(1); const P_PER=10;
  const [pModal,setPModal]  =useState<"create"|"edit"|null>(null);
  const [pEdit, setPEdit]   =useState<Partial<Product&{name:string}>>({});
  const [pSaving,setPSaving]=useState(false);
  const [pError, setPError] =useState("");

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(()=>{
    const raw=localStorage.getItem("agriai_user");
    if(!raw){router.push("/");return;}
    try{
      const u=JSON.parse(raw);
      if(u.role!=="admin"){router.push("/");return;}
      setAdminUser(u);
    }catch{router.push("/");}
  },[router]);

  // ── Fetch all data ─────────────────────────────────────────────────────────
  const fetchAll=useCallback(async()=>{
    setLoading(true);
    try{
      const [uR,sR,oR,pR,dR,wR]=await Promise.allSettled([
        api.get("/auth/users"),
        api.get("/subscriptions/admin/all"),
        api.get("/orders/admin/all"),
        // Try admin endpoint first, fall back to public /products
        api.get("/products/admin/all").catch(()=>api.get("/products")),
        api.get("/diseases/admin/all"),
        api.get("/weather/admin/all"),
      ]);
      if(uR.status==="fulfilled") { const d=uR.value.data; const raw=d?.users??d?.data??d; setUsers(Array.isArray(raw)?raw:[]); }
      if(sR.status==="fulfilled") { const d=sR.value.data; const raw=d?.subscriptions??d?.data??d; setSubs(Array.isArray(raw)?raw:[]); }
      if(oR.status==="fulfilled") { const d=oR.value.data; const raw=d?.orders??d?.data??d; setOrders(Array.isArray(raw)?raw:[]); }
      if(pR.status==="fulfilled") { const d=pR.value.data; const raw=d?.products??d?.data??d; setProducts(Array.isArray(raw)?raw:[]); }
      if(dR.status==="fulfilled") { const d=dR.value.data; const raw=d?.diseases??d?.data??d; setDiseases(Array.isArray(raw)?raw:[]); }
      if(wR.status==="fulfilled") { const d=wR.value.data; const raw=d?.alerts??d?.data??d; setWeather(Array.isArray(raw)?raw:[]); }
    }catch(e){console.error("fetchAll error",e);}
    setLoading(false);
  },[]);

  useEffect(()=>{if(adminUser)fetchAll();},[adminUser,fetchAll]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const farmers    = (Array.isArray(users)?users:[]).filter(u=>u.role==="farmer");
  const consumers  = (Array.isArray(users)?users:[]).filter(u=>u.role==="user"||u.role==="consumer");
  const activeSubs = (Array.isArray(subs)?subs:[]).filter(s=>s.status==="active"||s.status==="trialing");
  const totalRev   = activeSubs.length*2999;
  const todayScan  = (Array.isArray(diseases)?diseases:[]).filter(d=>new Date(d.createdAt).toDateString()===new Date().toDateString()).length;

  const chartData=(()=>{
    const out:{label:string;farmers:number;orders:number}[]=[];
    for(let i=5;i>=0;i--){
      const d=new Date(); d.setMonth(d.getMonth()-i);
      const ym=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      out.push({label:d.toLocaleString("en",{month:"short"}),
        farmers:farmers.filter(u=>u.createdAt?.startsWith(ym)).length,
        orders: orders.filter(x=>x.createdAt?.startsWith(ym)).length});
    }
    return out;
  })();

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const filtUsers=users.filter(u=>{
    const mR=uRole==="all"||u.role===uRole;
    const mS=!uSearch||u.name?.toLowerCase().includes(uSearch.toLowerCase())||u.email?.toLowerCase().includes(uSearch.toLowerCase());
    return mR&&mS;
  });
  const pagedUsers  = filtUsers.slice((uPage-1)*U_PER,uPage*U_PER);

  const filtOrders  = oFilter==="all"?orders:orders.filter(o=>o.status===oFilter);
  const pagedOrders = filtOrders.slice((oPage-1)*O_PER,oPage*O_PER);

  const filtProds=products.filter(p=>{
    const mF=pFilter==="all"||(p.status??"pending")===pFilter;
    const mS=!pSearch||prodName(p).toLowerCase().includes(pSearch.toLowerCase());
    return mF&&mS;
  });
  const pagedProds=filtProds.slice((pPage-1)*P_PER,pPage*P_PER);

  // ── Product CRUD ───────────────────────────────────────────────────────────
  const handleProdStatus=async(id:string,status:string)=>{
    try{
      // Use the correct admin status update endpoint
      await api.patch(`/products/admin/${id}/status`,{status})
        .catch(()=>api.put(`/products/${id}`,{status}));
      await fetchAll();
    }catch(e:any){console.error("Status update error:",e.message);}
  };

  const handleProdDelete=async(id:string)=>{
    if(!confirm("Delete this product permanently?"))return;
    try{
      await api.delete(`/products/${id}`);
      setProducts(prev=>prev.filter(p=>p._id!==id));
    }catch(e:any){alert(e.response?.data?.message||"Delete failed.");}
  };

  const openCreate=()=>{ setPEdit({cropName:"",name:"",category:"",price:0,stock:0,description:""}); setPError(""); setPModal("create"); };
  const openEdit  =(p:Product)=>{ setPEdit({...p,name:p.cropName||p.name||""}); setPError(""); setPModal("edit"); };

  const handleProdSave=async()=>{
    const nm=pEdit.cropName||pEdit.name||"";
    if(!nm.trim()||!pEdit.category||!pEdit.price){ setPError("Name, category and price are required."); return; }
    setPSaving(true); setPError("");
    try{
      const payload={cropName:nm,name:nm,category:pEdit.category,price:Number(pEdit.price),stock:Number(pEdit.stock||0),description:pEdit.description||""};
      if(pModal==="create") await api.post("/products",payload);
      else                  await api.put(`/products/${pEdit._id}`,payload);
      setPModal(null); await fetchAll();
    }catch(e:any){ setPError(e.response?.data?.message||"Save failed."); }
    finally{ setPSaving(false); }
  };

  // ── Sidebar nav items ──────────────────────────────────────────────────────
  const NAV = [
    {id:"dashboard"  as Section, label:"Dashboard"},
    {id:"users"      as Section, label:"Users",       badge:users.length},
    {id:"marketplace"as Section, label:"Marketplace", badge:products.filter(p=>!p.status||p.status==="pending").length||undefined},
    {id:"reports"    as Section, label:"Reports"},
    {id:"settings"   as Section, label:"Settings"},
  ];

  const card:React.CSSProperties={background:T.card,borderRadius:14,border:`1px solid ${T.border}`,padding:"20px 22px"};

  // ══════════════════════════════════════════════════════════════════════════
  // DASHBOARD OVERVIEW
  // ══════════════════════════════════════════════════════════════════════════
  const DashSection=()=>(
    <div>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Total Users"       value={users.length}   delta={8}  accent={T.accent} sub={`${farmers.length} farmers · ${consumers.length} consumers`}/>
        <StatCard label="Active Farmers"    value={farmers.length} delta={5}  accent={T.blue}   sub={`${activeSubs.length} active subscriptions`}/>
        <StatCard label="Scans Today"       value={todayScan}      delta={14} accent={T.green}  sub={`${diseases.length} total scans`}/>
        <StatCard label="Monthly Revenue"   value={fmtLKR(totalRev)} delta={-2} accent={T.amber} sub={`${activeSubs.length} × Rs.2,999`}/>
      </div>

      {/* Chart + System alerts */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:14,marginBottom:16}}>
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>User Registration & Activity</p>
              <p style={{color:T.muted,fontSize:11,margin:"3px 0 0"}}>Last 6 months</p>
            </div>
            <div style={{display:"flex",gap:12,fontSize:11,color:T.muted,alignItems:"center"}}>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:9,height:9,background:T.accent,borderRadius:2,display:"inline-block"}}/>Farmers</span>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:9,height:9,background:T.amber, borderRadius:2,display:"inline-block"}}/>Orders</span>
            </div>
          </div>
          <MiniBar data={chartData}/>
        </div>
        <div style={card}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:"0 0 12px"}}>System Alerts</p>
          {weather.length===0
            ?<div style={{padding:"10px 12px",background:"rgba(74,222,128,.08)",borderRadius:9,border:"1px solid rgba(74,222,128,.15)"}}>
               <p style={{color:T.green,fontSize:12,fontWeight:600,margin:0}}>System Health: All OK</p>
               <p style={{color:T.muted,fontSize:11,margin:"2px 0 0"}}>All microservices running normally</p>
             </div>
            :weather.slice(0,4).map(a=>(
               <div key={a._id} style={{marginBottom:9,padding:"9px 12px",background:"rgba(212,168,83,.06)",borderRadius:9,border:"1px solid rgba(212,168,83,.15)"}}>
                 <p style={{color:T.amber,fontSize:12,fontWeight:600,margin:0}}>{a.district}</p>
                 <p style={{color:"#a8d5b5",fontSize:11,margin:"2px 0 0"}}>{a.message}</p>
               </div>
             ))}
        </div>
      </div>

      {/* User Breakdown + Disease + Recent */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        {/* Donut */}
        <div style={card}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:"0 0 14px"}}>User Breakdown</p>
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <Donut farmers={farmers.length} consumers={consumers.length}/>
            <div>
              {[{label:"Farmers",val:farmers.length,c:T.accent},{label:"Consumers",val:consumers.length,c:T.amber}].map(r=>(
                <div key={r.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <span style={{width:9,height:9,background:r.c,borderRadius:2,display:"inline-block",flexShrink:0}}/>
                  <span style={{color:"#a8d5b5",fontSize:12}}>{r.label}</span>
                  <span style={{color:T.text,fontWeight:700,marginLeft:4}}>{r.val}</span>
                  <span style={{color:T.muted,fontSize:11}}>({Math.round((r.val/(users.length||1))*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Disease Reports */}
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>Top Disease Reports</p>
            <span onClick={()=>setSection("reports")} style={{fontSize:11,color:T.accentL,cursor:"pointer"}}>View All</span>
          </div>
          {diseases.length===0
            ?<p style={{color:T.muted,fontSize:12}}>No disease reports yet</p>
            :diseases.slice(0,4).map(d=>(
               <div key={d._id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid rgba(106,170,120,.08)`}}>
                 <div>
                   <p style={{color:T.text,fontSize:12,fontWeight:500,margin:0}}>{d.cropName}</p>
                   <p style={{color:T.muted,fontSize:10,margin:0}}>{d.diagnosis}</p>
                 </div>
                 <span style={{color:T.muted,fontSize:10}}>{fmtDate(d.createdAt)}</span>
               </div>
             ))}
        </div>

        {/* Recent Registrations */}
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>Recent Registrations</p>
            <span onClick={()=>setSection("users")} style={{fontSize:11,color:T.accentL,cursor:"pointer"}}>Manage →</span>
          </div>
          {users.slice(0,5).map(u=>{
            const sub=subs.find(s=>(typeof s.userId==="object"?s.userId._id:s.userId)===u._id);
            return(
              <div key={u._id} style={{display:"flex",alignItems:"center",gap:9,padding:"6px 0",borderBottom:`1px solid rgba(106,170,120,.08)`}}>
                <Avatar name={u.name} size={28}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{color:T.text,fontSize:12,fontWeight:500,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</p>
                  <p style={{color:T.muted,fontSize:10,margin:0,textTransform:"capitalize"}}>{u.role==="user"?"Consumer":u.role}</p>
                </div>
                {sub?<Pill s={sub.status}/>:<span style={{color:T.muted,fontSize:10}}>—</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // USERS SECTION
  // ══════════════════════════════════════════════════════════════════════════
  const UsersSection=()=>(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <input value={uSearch} onChange={e=>{setUSearch(e.target.value);setUPage(1);}} placeholder="Search name or email…"
          style={{flex:1,minWidth:200,background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
            borderRadius:8,padding:"8px 13px",color:T.text,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        {["all","farmer","user","admin"].map(r=>(
          <button key={r} onClick={()=>{setURole(r);setUPage(1);}}
            style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${T.border}`,
              background:uRole===r?T.accent:"rgba(106,170,120,.05)",
              color:uRole===r?"#0e1f16":T.muted,fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>
            {r==="all"?"All":r==="user"?"Consumer":r.charAt(0).toUpperCase()+r.slice(1)}
          </button>
        ))}
        <span style={{color:T.muted,fontSize:12,marginLeft:"auto"}}>{filtUsers.length} users</span>
      </div>
      <div style={card}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><TH>User</TH><TH>Role</TH><TH>Subscription</TH><TH>Joined</TH><TH>Status</TH></tr></thead>
            <tbody>
              {pagedUsers.map(u=>{
                const sub=subs.find(s=>(typeof s.userId==="object"?s.userId._id:s.userId)===u._id);
                return(
                  <TR key={u._id}>
                    <TD><div style={{display:"flex",alignItems:"center",gap:10}}>
                      <Avatar name={u.name} size={32}/>
                      <div>
                        <p style={{color:T.text,fontSize:13,fontWeight:600,margin:0}}>{u.name}</p>
                        <p style={{color:T.muted,fontSize:10,margin:0}}>{u.email}</p>
                      </div>
                    </div></TD>
                    <TD><span style={{textTransform:"capitalize"}}>{u.role==="user"?"Consumer":u.role}</span></TD>
                    <TD>{sub?<Pill s={sub.status}/>:<span style={{color:T.muted,fontSize:11}}>No subscription</span>}</TD>
                    <TD style={{color:T.muted}}>{fmtDate(u.createdAt)}</TD>
                    <TD><Pill s="active"/></TD>
                  </TR>
                );
              })}
              {pagedUsers.length===0&&<tr><td colSpan={5} style={{padding:24,textAlign:"center",color:T.muted}}>No users found</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={uPage} total={filtUsers.length} per={U_PER} onChange={setUPage}/>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // MARKETPLACE SECTION — full CRUD + real product fetch
  // ══════════════════════════════════════════════════════════════════════════
  const MarketSection=()=>(
    <div>
      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Total Products",  value:products.length,                                                   accent:T.accent},
          {label:"Pending Review",  value:products.filter(p=>!p.status||p.status==="pending").length,         accent:T.amber},
          {label:"Approved",        value:products.filter(p=>p.status==="approved"||p.status==="Active").length,accent:T.green},
          {label:"Rejected",        value:products.filter(p=>p.status==="rejected").length,                   accent:T.red},
        ].map(s=>(
          <div key={s.label} style={{...card,padding:"14px 16px"}}>
            <p style={{color:T.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 5px"}}>{s.label}</p>
            <p style={{color:s.accent,fontSize:24,fontWeight:800,fontFamily:"'Sora',sans-serif",margin:0}}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={pSearch} onChange={e=>{setPSearch(e.target.value);setPPage(1);}} placeholder="Search products…"
          style={{flex:1,minWidth:180,background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
            borderRadius:8,padding:"8px 13px",color:T.text,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        {["all","pending","approved","Active","rejected"].map(f=>(
          <button key={f} onClick={()=>{setPFilter(f);setPPage(1);}}
            style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${T.border}`,
              background:pFilter===f?T.accent:"rgba(106,170,120,.05)",
              color:pFilter===f?"#0e1f16":T.muted,fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>
            {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
        <Btn onClick={openCreate}>+ Add Product</Btn>
      </div>

      {/* Table */}
      <div style={card}>
        {products.length===0&&!loading?(
          <div style={{textAlign:"center",padding:"48px 0",color:T.muted}}>
            <p style={{fontSize:14,fontWeight:600,marginBottom:6}}>No products found</p>
            <p style={{fontSize:12,maxWidth:440,margin:"0 auto",lineHeight:1.6}}>
              Products added by farmers will appear here automatically.<br/>
              Make sure <code style={{color:T.accentL,background:"rgba(106,170,120,.1)",padding:"1px 6px",borderRadius:4}}>/api/products/admin/all</code> is registered in your backend routes.
            </p>
          </div>
        ):(
          <>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  <TH>Product</TH><TH>Farmer</TH><TH>Category</TH>
                  <TH>Price</TH><TH>Stock</TH><TH>Status</TH><TH>Actions</TH>
                </tr></thead>
                <tbody>
                  {pagedProds.map(p=>{
                    const fname=typeof p.farmerId==="object"?p.farmerId.name:"—";
                    const pStatus=p.status||"pending";
                    return(
                      <TR key={p._id}>
                        <TD>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            {p.imageUrl?(
                              <img src={`http://localhost:5000${p.imageUrl}`} alt={prodName(p)}
                                style={{width:34,height:34,borderRadius:8,objectFit:"cover",flexShrink:0,border:`1px solid ${T.border}`}}
                                onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                            ):(
                              <div style={{width:34,height:34,borderRadius:8,background:"rgba(106,170,120,.1)",
                                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
                                🌾
                              </div>
                            )}
                            <div>
                              <p style={{color:T.text,fontWeight:600,margin:0,fontSize:13}}>{prodName(p)}</p>
                              {p.type&&<p style={{color:T.muted,fontSize:10,margin:0}}>{p.type}</p>}
                            </div>
                          </div>
                        </TD>
                        <TD style={{color:T.muted}}>{fname}</TD>
                        <TD style={{textTransform:"capitalize",color:"#a8d5b5"}}>{p.category||"—"}</TD>
                        <TD style={{color:T.amber,fontWeight:600}}>{fmtLKR(p.price)}</TD>
                        <TD style={{color:"#a8d5b5"}}>{p.stock??"—"}</TD>
                        <TD><Pill s={pStatus}/></TD>
                        <TD>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            {pStatus!=="approved"&&pStatus!=="Active"&&(
                              <Btn sm v="success" onClick={()=>handleProdStatus(p._id,"approved")}>Approve</Btn>
                            )}
                            {pStatus!=="rejected"&&(
                              <Btn sm v="danger" onClick={()=>handleProdStatus(p._id,"rejected")}>Reject</Btn>
                            )}
                            <Btn sm v="ghost" onClick={()=>openEdit(p)}>Edit</Btn>
                            <Btn sm v="danger" onClick={()=>handleProdDelete(p._id)}>Delete</Btn>
                          </div>
                        </TD>
                      </TR>
                    );
                  })}
                  {pagedProds.length===0&&products.length>0&&(
                    <tr><td colSpan={7} style={{padding:24,textAlign:"center",color:T.muted}}>No products match filters</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={pPage} total={filtProds.length} per={P_PER} onChange={setPPage}/>
          </>
        )}
      </div>

      {/* Product Modal */}
      {pModal&&(
        <Modal title={pModal==="create"?"Add New Product":"Edit Product"} onClose={()=>setPModal(null)}>
          {pError&&(
            <div style={{background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.2)",
              borderRadius:8,padding:"9px 12px",color:T.red,fontSize:12,marginBottom:14}}>
              {pError}
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div><FL>Product Name *</FL><FI value={pEdit.cropName||pEdit.name||""} onChange={v=>setPEdit(x=>({...x,cropName:v,name:v}))} placeholder="e.g. Organic Tomatoes"/></div>
            <div>
              <FL>Category *</FL>
              <select value={pEdit.category||""} onChange={e=>setPEdit(x=>({...x,category:e.target.value}))}
                style={{width:"100%",background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
                  borderRadius:8,padding:"9px 12px",color:pEdit.category?T.text:T.muted,fontSize:13,outline:"none"}}>
                <option value="">Select category</option>
                {["Leafy Green","Root","Fruit","Grain","Herb","Seafood","Dairy","Other"].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><FL>Price (LKR) *</FL><FI type="number" value={pEdit.price||0} onChange={v=>setPEdit(x=>({...x,price:+v}))} placeholder="150"/></div>
              <div><FL>Stock (kg)</FL><FI type="number" value={pEdit.stock||0} onChange={v=>setPEdit(x=>({...x,stock:+v}))} placeholder="25"/></div>
            </div>
            <div>
              <FL>Description</FL>
              <textarea value={pEdit.description||""} onChange={e=>setPEdit(x=>({...x,description:e.target.value}))}
                placeholder="Product description…" rows={3}
                style={{width:"100%",background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
                  borderRadius:8,padding:"9px 12px",color:T.text,fontSize:13,outline:"none",
                  resize:"vertical",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
              <Btn v="ghost" onClick={()=>setPModal(null)}>Cancel</Btn>
              <Btn onClick={handleProdSave} disabled={pSaving}>
                {pSaving?"Saving…":pModal==="create"?"Create Product":"Save Changes"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // REPORTS SECTION
  // ══════════════════════════════════════════════════════════════════════════
  const ReportsSection=()=>(
    <div>
      {/* Revenue summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[
          {label:"Subscription Revenue",value:fmtLKR(totalRev),       accent:T.accent},
          {label:"Total Orders",        value:orders.length,           accent:T.blue},
          {label:"Order Value",         value:fmtLKR(orders.reduce((a,o)=>a+(o.totalAmount||0),0)), accent:T.amber},
          {label:"Active Subscriptions",value:activeSubs.length,       accent:T.green},
        ].map(s=>(
          <div key={s.label} style={card}>
            <p style={{color:T.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 5px"}}>{s.label}</p>
            <p style={{color:s.accent,fontSize:22,fontWeight:800,fontFamily:"'Sora',sans-serif",margin:0}}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div style={{...card,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>All Orders</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["all","pending","processing","shipped","delivered","cancelled"].map(f=>(
              <button key={f} onClick={()=>{setOFilter(f);setOPage(1);}}
                style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${T.border}`,
                  background:oFilter===f?T.accent:"rgba(106,170,120,.05)",
                  color:oFilter===f?"#0e1f16":T.muted,fontSize:10,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><TH>Order ID</TH><TH>Consumer</TH><TH>Amount</TH><TH>Status</TH><TH>Date</TH></tr></thead>
            <tbody>
              {pagedOrders.map(o=>{
                const cName=typeof o.consumerId==="object"?o.consumerId.name:"—";
                return(
                  <TR key={o._id}>
                    <TD style={{fontFamily:"monospace",fontSize:11,color:T.muted}}>#{o._id.slice(-6).toUpperCase()}</TD>
                    <TD style={{color:T.text,fontWeight:500}}>{cName}</TD>
                    <TD style={{color:T.amber,fontWeight:600}}>{fmtLKR(o.totalAmount||0)}</TD>
                    <TD><Pill s={o.status||"pending"}/></TD>
                    <TD style={{color:T.muted}}>{fmtDate(o.createdAt)}</TD>
                  </TR>
                );
              })}
              {pagedOrders.length===0&&<tr><td colSpan={5} style={{padding:24,textAlign:"center",color:T.muted}}>No orders</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={oPage} total={filtOrders.length} per={O_PER} onChange={setOPage}/>
      </div>

      {/* Disease + Weather */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={card}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:"0 0 12px"}}>Disease Scan Reports</p>
          {diseases.length===0?<p style={{color:T.muted,fontSize:12}}>No reports</p>
            :diseases.slice(0,6).map(d=>(
              <div key={d._id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid rgba(106,170,120,.08)`}}>
                <div>
                  <p style={{color:T.text,fontSize:12,fontWeight:500,margin:0}}>{d.cropName}</p>
                  <p style={{color:T.muted,fontSize:10,margin:0}}>{d.diagnosis}</p>
                </div>
                <span style={{color:T.muted,fontSize:10}}>{fmtDate(d.createdAt)}</span>
              </div>
            ))}
        </div>
        <div style={card}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:"0 0 12px"}}>Weather Alerts</p>
          {weather.length===0
            ?<div style={{padding:"9px 12px",background:"rgba(74,222,128,.06)",borderRadius:9,border:"1px solid rgba(74,222,128,.12)"}}>
               <p style={{color:T.green,fontSize:12,fontWeight:600,margin:0}}>No active alerts</p>
             </div>
            :weather.map(a=>(
               <div key={a._id} style={{marginBottom:9,padding:"9px 12px",background:"rgba(212,168,83,.06)",borderRadius:9,border:"1px solid rgba(212,168,83,.15)"}}>
                 <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                   <span style={{color:T.amber,fontWeight:600,fontSize:12}}>{a.district}</span>
                   <span style={{color:T.muted,fontSize:10}}>{fmtDate(a.createdAt)}</span>
                 </div>
                 <p style={{color:"#a8d5b5",fontSize:11,margin:"0 0 5px"}}>{a.message}</p>
                 <Pill s={a.severity||"medium"}/>
               </div>
             ))}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SETTINGS SECTION
  // ══════════════════════════════════════════════════════════════════════════
  const SettingsSection=()=>(
    <div style={{maxWidth:560}}>
      <div style={card}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <Avatar name={adminUser?.name||"A"} size={50}/>
          <div>
            <p style={{color:T.text,fontSize:16,fontWeight:700,margin:0}}>{adminUser?.name||"Admin"}</p>
            <p style={{color:T.muted,fontSize:12,margin:"2px 0 5px"}}>{adminUser?.email}</p>
            <Pill s="active"/>
          </div>
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16}}>
          {[
            ["Farmer Subscription","Rs.2,999 / month"],
            ["Stripe Mode","Test Mode"],
            ["AI Model","Cerebras / Llama 4 Scout"],
            ["Weather API","OpenWeatherMap (Free Tier)"],
            ["Platform","Agreal v1.0"],
          ].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
              <span style={{color:T.muted}}>{k}</span>
              <span style={{color:T.text,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent=()=>{
    if(loading)return<div style={{color:T.accentL,padding:40,textAlign:"center",fontSize:14}}>Loading data…</div>;
    switch(section){
      case"dashboard":  return<DashSection/>;
      case"users":      return<UsersSection/>;
      case"marketplace":return<MarketSection/>;
      case"reports":    return<ReportsSection/>;
      case"settings":   return<SettingsSection/>;
    }
  };

  const META:Record<Section,{title:string;sub:string}>={
    dashboard:  {title:"Admin Dashboard",   sub:"Platform overview and key metrics"},
    users:      {title:"Users",             sub:"Manage registered users and subscriptions"},
    marketplace:{title:"Marketplace",       sub:"Review, approve and manage all product listings"},
    reports:    {title:"Reports",           sub:"Orders, revenue, disease scans and weather alerts"},
    settings:   {title:"Settings",          sub:"Admin account and platform configuration"},
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:${T.bg};font-family:'DM Sans',sans-serif;color:${T.text};}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#1a3a2a;border-radius:10px;}
        input::placeholder,textarea::placeholder{color:${T.muted};}
        option{background:#122019;color:#e8f5ec;}
        code{background:rgba(106,170,120,.12);padding:2px 6px;border-radius:4px;color:${T.accentL};}
      `}</style>

      <div style={{display:"flex",minHeight:"100vh",background:T.bg}}>

        {/* ════ SIDEBAR ════ */}
        <aside style={{width:218,flexShrink:0,background:T.sidebar,display:"flex",flexDirection:"column",
          position:"sticky",top:0,height:"100vh",overflowY:"auto",borderRight:`1px solid ${T.border}`}}>

          {/* Logo */}
          <div style={{padding:"20px 18px 14px",borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:22,color:"#fff",letterSpacing:"-.5px"}}>
              Ag<span style={{color:T.accent}}>real</span>
            </div>
            <span style={{fontSize:9,fontWeight:700,color:T.accent,background:"rgba(106,170,120,.15)",
              padding:"2px 8px",borderRadius:6,letterSpacing:1,textTransform:"uppercase"}}>
              Admin
            </span>
          </div>

          {/* User */}
          {adminUser&&(
            <div style={{padding:"13px 18px",borderBottom:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Avatar name={adminUser.name} size={34}/>
                <div style={{minWidth:0}}>
                  <p style={{color:"#fff",fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{adminUser.name}</p>
                  <p style={{color:T.muted,fontSize:9,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{adminUser.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav style={{flex:1,padding:"10px 8px"}}>
            <p style={{fontSize:9,fontWeight:700,color:"#1a3a2a",padding:"8px 10px 4px",letterSpacing:1.2,textTransform:"uppercase"}}>Overview</p>
            {NAV.slice(0,1).map(item=>{
              const active=section===item.id;
              return(
                <div key={item.id} onClick={()=>setSection(item.id)}
                  style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:9,cursor:"pointer",
                    fontSize:13,fontWeight:active?600:400,color:active?"#fff":T.muted,
                    background:active?"rgba(106,170,120,.18)":"transparent",transition:"all .12s",
                    userSelect:"none",marginBottom:2,borderLeft:active?`3px solid ${T.accent}`:"3px solid transparent"}}>
                  <span style={{flex:1}}>{item.label}</span>
                </div>
              );
            })}
            <p style={{fontSize:9,fontWeight:700,color:"#1a3a2a",padding:"12px 10px 4px",letterSpacing:1.2,textTransform:"uppercase"}}>Management</p>
            {NAV.slice(1).map(item=>{
              const active=section===item.id;
              return(
                <div key={item.id} onClick={()=>setSection(item.id)}
                  style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:9,cursor:"pointer",
                    fontSize:13,fontWeight:active?600:400,color:active?"#fff":T.muted,
                    background:active?"rgba(106,170,120,.18)":"transparent",transition:"all .12s",
                    userSelect:"none",marginBottom:2,borderLeft:active?`3px solid ${T.accent}`:"3px solid transparent"}}>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.badge!==undefined&&item.badge>0&&(
                    <span style={{background:active?T.accent:"rgba(106,170,120,.2)",
                      color:active?"#0e1f16":T.accent,fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:10}}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{padding:"10px 8px",borderTop:`1px solid ${T.border}`}}>
            <button onClick={fetchAll}
              style={{width:"100%",padding:"8px 10px",borderRadius:9,border:"none",
                background:"rgba(106,170,120,.1)",color:T.accent,fontSize:12,fontWeight:600,
                cursor:"pointer",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>
              Refresh Data
            </button>
            <button onClick={()=>{localStorage.removeItem("agriai_token");localStorage.removeItem("agriai_user");router.push("/");}}
              style={{width:"100%",padding:"8px 10px",borderRadius:9,border:"none",
                background:"rgba(248,113,113,.08)",color:T.red,fontSize:12,fontWeight:600,
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Sign Out
            </button>
          </div>
        </aside>

        {/* ════ MAIN ════ */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>

          {/* Header */}
          <header style={{background:T.card,borderBottom:`1px solid ${T.border}`,padding:"13px 26px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            position:"sticky",top:0,zIndex:50}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:T.muted,marginBottom:3}}>
                <span>Dashboards</span><span>/</span>
                <span style={{color:T.text,textTransform:"capitalize"}}>{section}</span>
              </div>
              <h1 style={{color:T.text,fontSize:18,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>
                {META[section].title}
              </h1>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:11,color:T.muted}}>
                {new Date().toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}
              </span>
              <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(74,222,128,.08)",
                border:"1px solid rgba(74,222,128,.15)",borderRadius:99,padding:"4px 10px"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:T.green}}/>
                <span style={{fontSize:10,fontWeight:700,color:T.green}}>All systems operational</span>
              </div>
              <Avatar name={adminUser?.name||"A"} size={32}/>
            </div>
          </header>

          {/* Content */}
          <div style={{flex:1,padding:"22px 26px",overflowX:"hidden"}}>
            <p style={{color:T.muted,fontSize:12,marginBottom:18}}>{META[section].sub}</p>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}