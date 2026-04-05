// // // ── Shared sidebar component for all consumer pages ───────
// // // Usage: import ConsumerLayout from "@/components/ConsumerLayout"
// // // Wrap page content: <ConsumerLayout><YourContent /></ConsumerLayout>

// // "use client";
// // import { useState, useEffect } from "react";
// // import { useRouter, usePathname } from "next/navigation";

// // const NAV = [
// //   { icon:"🏠", label:"Overview",    href:"/dashboard/consumer",              section:"MY HEALTH" },
// //   { icon:"🛒", label:"Marketplace", href:"/dashboard/consumer/marketplace",  section:"" },
// //   { icon:"🥗", label:"Nutrition",   href:"/dashboard/consumer/nutrition",    section:"" },
// //   { icon:"📦", label:"My Orders",   href:"/dashboard/consumer/orders",       section:"" },
// //   { icon:"⚙️", label:"Settings",   href:"/dashboard/consumer/settings",     section:"ACCOUNT" },
// // ];

// // export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
// //   const router   = useRouter();
// //   const pathname = usePathname();
// //   const [user, setUser]         = useState<any>(null);
// //   const [healthScore, setScore] = useState(74);
// //   const [profile, setProfile]   = useState<any>(null);

// //   useEffect(() => {
// //     const stored = localStorage.getItem("agriai_user");
// //     if (!stored) { router.push("/"); return; }
// //     const u = JSON.parse(stored);
// //     if (u.role !== "user" && u.role !== "consumer" && u.role !== "admin") { router.push("/"); return; }
// //     setUser(u);
// //   }, []);

// //   const getInitial = () => (user?.name || "C")[0].toUpperCase();

// //   const handleLogout = () => {
// //     localStorage.removeItem("agriai_token");
// //     localStorage.removeItem("agriai_user");
// //     router.push("/");
// //   };

// //   return (
// //     <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f8faf8" }}>

// //       {/* ══ SIDEBAR ══ */}
// //       <aside style={{
// //         width:185, background:"#fff",
// //         borderRight:"1px solid #e8ede8",
// //         display:"flex", flexDirection:"column",
// //         position:"fixed", top:0, left:0, bottom:0, zIndex:50,
// //         boxShadow:"2px 0 12px rgba(0,0,0,.04)",
// //       }}>
// //         {/* Logo */}
// //         <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid #f0f4f0" }}>
// //           <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:22, color:"#1a3a2a" }}>
// //             Agri<span style={{ color:"#22c55e" }}>AI</span>
// //           </div>
// //         </div>

// //         {/* User card */}
// //         <div style={{ padding:"14px 16px", borderBottom:"1px solid #f0f4f0" }}>
// //           <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
// //             <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#16a34a)",
// //               display:"flex", alignItems:"center", justifyContent:"center",
// //               fontSize:15, fontWeight:700, color:"#fff", flexShrink:0 }}>
// //               {getInitial()}
// //             </div>
// //             <div>
// //               <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{user?.name || "Consumer"}</div>
// //               <div style={{ fontSize:11, color:"#6b7280" }}>Consumer · Colombo</div>
// //             </div>
// //           </div>
// //           {/* Health score */}
// //           <div style={{ background:"#f0fdf4", borderRadius:8, padding:"6px 10px",
// //             display:"flex", alignItems:"center", justifyContent:"space-between" }}>
// //             <span style={{ fontSize:11, color:"#166534", fontWeight:600 }}>Health Score</span>
// //             <span style={{ fontSize:13, fontWeight:800, color:"#16a34a" }}>{healthScore}/100</span>
// //           </div>
// //         </div>

// //         {/* Nav */}
// //         <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
// //           {NAV.map(item => {
// //             const active = pathname === item.href;
// //             return (
// //               <div key={item.href}>
// //                 {item.section && (
// //                   <div style={{ padding:"10px 16px 4px", fontSize:10, fontWeight:700,
// //                     color:"#9ca3af", letterSpacing:".08em", textTransform:"uppercase" }}>
// //                     {item.section}
// //                   </div>
// //                 )}
// //                 <button onClick={() => router.push(item.href)} style={{
// //                   width:"100%", display:"flex", alignItems:"center", gap:10,
// //                   padding:"9px 16px", border:"none",
// //                   background: active ? "#f0fdf4" : "transparent",
// //                   borderLeft: active ? "3px solid #22c55e" : "3px solid transparent",
// //                   color: active ? "#166534" : "#374151",
// //                   fontSize:13, fontWeight: active ? 700 : 400,
// //                   cursor:"pointer", transition:"all .15s", textAlign:"left",
// //                 }}>
// //                   <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
// //                 </button>
// //               </div>
// //             );
// //           })}
// //         </nav>

// //         {/* Sign out */}
// //         <div style={{ padding:"12px 0", borderTop:"1px solid #f0f4f0" }}>
// //           <button onClick={handleLogout} style={{
// //             width:"100%", display:"flex", alignItems:"center", gap:10,
// //             padding:"9px 16px", border:"none", background:"transparent",
// //             color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600,
// //           }}>
// //             🚪 Sign Out
// //           </button>
// //         </div>
// //       </aside>

// //       {/* ══ CONTENT ══ */}
// //       <div style={{ marginLeft:185, flex:1, display:"flex", flexDirection:"column" }}>
// //         {/* Top bar */}
// //         <header style={{ background:"#fff", borderBottom:"1px solid #e8ede8",
// //           padding:"12px 28px", display:"flex", alignItems:"center",
// //           justifyContent:"space-between", position:"sticky", top:0, zIndex:40,
// //           boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
// //           <div>
// //             <div style={{ fontSize:17, fontWeight:700, color:"#111827" }}>
// //               Good {new Date().getHours()<12?"Morning":new Date().getHours()<17?"Afternoon":"Evening"}, {user?.name?.split(" ")[0]} 
// //             </div>
// //             <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>
// //               {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} · You've logged 2 of 5 recommended veggies today
// //             </div>
// //           </div>
// //           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
// //             <div style={{ position:"relative" }}>
// //               <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }}>🔍</span>
// //               <input placeholder="Search..." style={{ padding:"8px 12px 8px 32px",
// //                 border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13,
// //                 fontFamily:"'DM Sans',sans-serif", outline:"none", width:160 }} />
// //             </div>
// //             <button onClick={() => router.push("/dashboard/consumer/nutrition")} style={{
// //               background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
// //               border:"none", borderRadius:9, padding:"8px 16px",
// //               fontSize:13, fontWeight:700, cursor:"pointer",
// //               display:"flex", alignItems:"center", gap:6,
// //             }}>+ Log Today's Meal</button>
// //             <div style={{ width:34, height:34, borderRadius:"50%",
// //               background:"linear-gradient(135deg,#22c55e,#16a34a)",
// //               display:"flex", alignItems:"center", justifyContent:"center",
// //               color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
// //               {getInitial()}
// //             </div>
// //           </div>
// //         </header>

// //         {/* Page content */}
// //         <main style={{ flex:1, padding:"24px 28px", overflowY:"auto" }}>
// //           {children}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }
// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter, usePathname } from "next/navigation";
// // import Link from "next/link";

// // const NAV = [
// //   { icon:"🏠", label:"Overview",    href:"/dashboard/consumer",             section:"MY HEALTH" },
// //   { icon:"🛒", label:"Marketplace", href:"/dashboard/consumer/marketplace", section:"" },
// //   { icon:"🥗", label:"Nutrition",   href:"/dashboard/consumer/nutrition",   section:"" },
// //   { icon:"📦", label:"My Orders",   href:"/dashboard/consumer/orders",      section:"" },
// //   { icon:"⚙️", label:"Settings",   href:"/dashboard/consumer/settings",    section:"ACCOUNT" },
// // ];

// // export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
// //   const router   = useRouter();
// //   const pathname = usePathname();
// //   const [user, setUser]     = useState<any>(null);
// //   const [healthScore]       = useState(74);

// //   useEffect(() => {
// //     const stored = localStorage.getItem("agriai_user");
// //     if (!stored) { router.push("/"); return; }
// //     const u = JSON.parse(stored);
// //     if (u.role !== "user" && u.role !== "consumer" && u.role !== "admin") {
// //       router.push("/"); return;
// //     }
// //     setUser(u);
// //   }, []);

// //   const getInitial = () => (user?.name || "C")[0].toUpperCase();

// //   const handleLogout = () => {
// //     localStorage.removeItem("agriai_token");
// //     localStorage.removeItem("agriai_user");
// //     router.push("/");
// //   };

// //   return (
// //     <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f8faf8" }}>

// //       {/* ══ SIDEBAR ══ */}
// //       <aside style={{
// //         width: 185, background: "#fff",
// //         borderRight: "1px solid #e8ede8",
// //         display: "flex", flexDirection: "column",
// //         position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
// //         boxShadow: "2px 0 12px rgba(0,0,0,.04)",
// //       }}>
// //         {/* Sidebar logo text — unchanged */}
// //         <div style={{
// //           height: 64,                              /* matches navbar height exactly */
// //           display: "flex", alignItems: "center",
// //           padding: "0 20px",
// //           borderBottom: "1px solid rgba(255,255,255,0.07)",
// //           flexShrink: 0,
// //         }}>
// //           <Link href="/" style={{ display:"flex", alignItems:"center", textDecoration:"none" }}>
// //             <img
// //               src="/Agreal.png"
// //               alt="Agreal"
// //               style={{ height: 32, width: "auto", display: "block" }}
// //             />
// //           </Link>
// //         </div>

// //          {/* User card */}
// //         <div style={{ padding:"14px 16px", borderBottom:"1px solid #f0f4f0" }}>
// //           <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
// //             <div style={{
// //               width:36, height:36, borderRadius:"50%",
// //               background:"linear-gradient(135deg,#22c55e,#16a34a)",
// //               display:"flex", alignItems:"center", justifyContent:"center",
// //               fontSize:15, fontWeight:700, color:"#fff", flexShrink:0,
// //             }}>
// //               {getInitial()}
// //             </div>
// //             <div>
// //               <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{user?.name || "Consumer"}</div>
// //               <div style={{ fontSize:11, color:"#6b7280" }}>Consumer · Colombo</div>
// //             </div>
// //           </div>
// //           {/* Health score */}
// //           <div style={{
// //             background:"#f0fdf4", borderRadius:8, padding:"6px 10px",
// //             display:"flex", alignItems:"center", justifyContent:"space-between",
// //           }}>
// //             <span style={{ fontSize:11, color:"#166534", fontWeight:600 }}>Health Score</span>
// //             <span style={{ fontSize:13, fontWeight:800, color:"#16a34a" }}>{healthScore}/100</span>
// //           </div>
// //         </div>

// //         {/* Nav links */}
// //         <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
// //           {NAV.map(item => {
// //             const active = pathname === item.href;
// //             return (
// //               <div key={item.href}>
// //                 {item.section && (
// //                   <div style={{
// //                     padding:"10px 16px 4px", fontSize:10, fontWeight:700,
// //                     color:"#9ca3af", letterSpacing:".08em", textTransform:"uppercase",
// //                   }}>
// //                     {item.section}
// //                   </div>
// //                 )}
// //                 <button onClick={() => router.push(item.href)} style={{
// //                   width:"100%", display:"flex", alignItems:"center", gap:10,
// //                   padding:"9px 16px", border:"none",
// //                   background: active ? "#f0fdf4" : "transparent",
// //                   borderLeft: active ? "3px solid #22c55e" : "3px solid transparent",
// //                   color: active ? "#166534" : "#374151",
// //                   fontSize:13, fontWeight: active ? 700 : 400,
// //                   cursor:"pointer", transition:"all .15s", textAlign:"left",
// //                 }}>
// //                   <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
// //                 </button>
// //               </div>
// //             );
// //           })}
// //         </nav>

// //         {/* Sign out */}
// //         <div style={{ padding:"12px 0", borderTop:"1px solid #f0f4f0" }}>
// //           <button onClick={handleLogout} style={{
// //             width:"100%", display:"flex", alignItems:"center", gap:10,
// //             padding:"9px 16px", border:"none", background:"transparent",
// //             color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600,
// //           }}>
// //             🚪 Sign Out
// //           </button>
// //         </div>
// //       </aside>

// //       {/* ══ MAIN CONTENT AREA ══ */}
// //       <div style={{ marginLeft:185, flex:1, display:"flex", flexDirection:"column" }}>

// //         {/* ── TOP HEADER BAR ── */}
// //         <header style={{
// //           background:"#fff", borderBottom:"1px solid #e8ede8",
// //           padding:"0 28px", height:64,
// //           display:"flex", alignItems:"center", justifyContent:"space-between",
// //           position:"sticky", top:0, zIndex:40,
// //           boxShadow:"0 1px 6px rgba(0,0,0,.04)",
// //         }}>

// //           {/* Left: Logo → clicking goes to landing page "/" */}
// //           <Link href="/" style={{ display:"flex", alignItems:"center", textDecoration:"none", flexShrink:0 }}>
// //             <img
// //               src="/Agreal.png"
// //               alt="Agreal"
// //               style={{ height:36, width:"auto", display:"block" }}
// //             />
// //           </Link>

// //           {/* Right: greeting, search, CTA, avatar */}
// //           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
// //             {/* Greeting — hidden on small screens via inline clamp */}
// //             <div style={{ marginRight:8 }}>
// //               <div style={{ fontSize:15, fontWeight:700, color:"#111827", whiteSpace:"nowrap" }}>
// //                 Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"},{" "}
// //                 {user?.name?.split(" ")[0]}
// //               </div>
// //               <div style={{ fontSize:11, color:"#6b7280", marginTop:1, whiteSpace:"nowrap" }}>
// //                 {new Date().toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" })}
// //               </div>
// //             </div>

// //             {/* Search */}
// //             <div style={{ position:"relative" }}>
// //               <span style={{
// //                 position:"absolute", left:10, top:"50%", transform:"translateY(-50%)",
// //                 fontSize:14, color:"#9ca3af",
// //               }}>🔍</span>
// //               <input
// //                 placeholder="Search..."
// //                 style={{
// //                   padding:"8px 12px 8px 32px", border:"1.5px solid #e5e7eb",
// //                   borderRadius:9, fontSize:13, fontFamily:"'DM Sans',sans-serif",
// //                   outline:"none", width:160,
// //                 }}
// //               />
// //             </div>

// //             {/* Log meal CTA */}
// //             <button
// //               onClick={() => router.push("/dashboard/consumer/nutrition")}
// //               style={{
// //                 background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
// //                 border:"none", borderRadius:9, padding:"8px 16px",
// //                 fontSize:13, fontWeight:700, cursor:"pointer",
// //                 display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap",
// //               }}
// //             >
// //               + Log Today's Meal
// //             </button>

// //             {/* Avatar */}
// //             <div style={{
// //               width:34, height:34, borderRadius:"50%",
// //               background:"linear-gradient(135deg,#22c55e,#16a34a)",
// //               display:"flex", alignItems:"center", justifyContent:"center",
// //               color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", flexShrink:0,
// //             }}>
// //               {getInitial()}
// //             </div>
// //           </div>
// //         </header>

// //         {/* Page content */}
// //         <main style={{ flex:1, padding:"24px 28px", overflowY:"auto" }}>
// //           {children}
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }

// // ── Shared sidebar layout for all consumer pages ──────────────────────────────
// "use client";
// import { useState, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";

// const NAV = [
//   { icon:"🏠", label:"Overview",    href:"/dashboard/consumer",             section:"MY HEALTH" },
//   { icon:"🛒", label:"Marketplace", href:"/dashboard/consumer/marketplace", section:"" },
//   { icon:"🥗", label:"Nutrition",   href:"/dashboard/consumer/nutrition",   section:"" },
//   { icon:"📦", label:"My Orders",   href:"/dashboard/consumer/orders",      section:"" },
//   { icon:"⚙️", label:"Settings",   href:"/dashboard/consumer/settings",    section:"ACCOUNT" },
// ];

// const SUB_PAGES: Record<string, string> = {
//   "/dashboard/consumer/marketplace": "Marketplace",
//   "/dashboard/consumer/nutrition":   "Nutrition",
//   "/dashboard/consumer/orders":      "My Orders",
//   "/dashboard/consumer/settings":    "Settings",
// };

// const hour     = new Date().getHours();
// const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
// const dateStr  = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

// export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
//   const router   = useRouter();
//   const pathname = usePathname();
//   const [user, setUser]           = useState<any>(null);
//   const [healthScore]             = useState(74);
//   const [searchFocused, setFocus] = useState(false);

//   useEffect(() => {
//     const stored = localStorage.getItem("agriai_user");
//     if (!stored) { router.push("/"); return; }
//     const u = JSON.parse(stored);
//     if (u.role !== "user" && u.role !== "consumer" && u.role !== "admin") {
//       router.push("/"); return;
//     }
//     setUser(u);
//   }, []);

//   const getInitial = () => (user?.name || "C")[0].toUpperCase();
//   const isSubPage  = !!SUB_PAGES[pathname];
//   const pageLabel  = SUB_PAGES[pathname] ?? "";

//   const handleLogout = () => {
//     localStorage.removeItem("agriai_token");
//     localStorage.removeItem("agriai_user");
//     router.push("/");
//   };

//   return (
//     <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f8faf8" }}>

//       {/* ══ SIDEBAR — white, matches original ══ */}
//       <aside style={{
//         width: 185, background: "#fff",
//         borderRight: "1px solid #e8ede8",
//         display: "flex", flexDirection: "column",
//         position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
//         boxShadow: "2px 0 12px rgba(0,0,0,.04)",
//       }}>

//         {/* Logo */}
//         <div style={{
//           height: 64, display: "flex", alignItems: "center",
//           padding: "0 18px",
//           borderBottom: "1px solid #f0f4f0",
//           flexShrink: 0,
//         }}>
//           <Link href="/" style={{ display:"flex", alignItems:"center", textDecoration:"none" }}>
//             <img src="/Agreal.png" alt="Agreal" style={{ height:30, width:"auto", display:"block" }} />
//           </Link>
//         </div>

//         {/* User card */}
//         <div style={{ padding:"14px 16px", borderBottom:"1px solid #f0f4f0", flexShrink:0 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
//             <div style={{
//               width:36, height:36, borderRadius:"50%",
//               background:"linear-gradient(135deg,#22c55e,#16a34a)",
//               display:"flex", alignItems:"center", justifyContent:"center",
//               fontSize:15, fontWeight:700, color:"#fff", flexShrink:0,
//             }}>
//               {getInitial()}
//             </div>
//             <div style={{ minWidth:0 }}>
//               <div style={{
//                 fontSize:13, fontWeight:700, color:"#111827",
//                 overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis",
//               }}>
//                 {user?.name || "Consumer"}
//               </div>
//               <div style={{ fontSize:11, color:"#6b7280", marginTop:1 }}>Consumer · Colombo</div>
//             </div>
//           </div>

//           {/* Health score */}
//           <div style={{
//             background:"#f0fdf4", borderRadius:8, padding:"6px 10px", marginBottom:8,
//             display:"flex", alignItems:"center", justifyContent:"space-between",
//           }}>
//             <span style={{ fontSize:11, color:"#166534", fontWeight:600 }}>Health Score</span>
//             <span style={{ fontSize:13, fontWeight:800, color:"#16a34a" }}>{healthScore}/100</span>
//           </div>

//           {/* Greeting — sits here, subtle, doesn't compete */}
//           <div style={{
//             background:"#f8faf8", borderRadius:8, padding:"7px 10px",
//             border:"1px solid #eef2ee",
//           }}>
//             <div style={{ fontSize:11, fontWeight:600, color:"#1a3a2a", lineHeight:1.4 }}>
//               {greeting}, {user?.name?.split(" ")[0] ?? "there"} 👋
//             </div>
//             <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{dateStr}</div>
//           </div>
//         </div>

//         {/* Nav links */}
//         <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
//           {NAV.map(item => {
//             const active = pathname === item.href;
//             return (
//               <div key={item.href}>
//                 {item.section && (
//                   <div style={{
//                     padding:"10px 16px 4px", fontSize:10, fontWeight:700,
//                     color:"#9ca3af", letterSpacing:".08em", textTransform:"uppercase",
//                   }}>
//                     {item.section}
//                   </div>
//                 )}
//                 <button onClick={() => router.push(item.href)} style={{
//                   width:"100%", display:"flex", alignItems:"center", gap:10,
//                   padding:"9px 16px", border:"none",
//                   background: active ? "#f0fdf4" : "transparent",
//                   borderLeft: active ? "3px solid #22c55e" : "3px solid transparent",
//                   color: active ? "#166534" : "#374151",
//                   fontSize:13, fontWeight: active ? 700 : 400,
//                   cursor:"pointer", transition:"all .15s", textAlign:"left",
//                 }}>
//                   <span style={{ fontSize:16 }}>{item.icon}</span>
//                   {item.label}
//                 </button>
//               </div>
//             );
//           })}
//         </nav>

//         {/* Sign out */}
//         <div style={{ padding:"12px 0", borderTop:"1px solid #f0f4f0", flexShrink:0 }}>
//           <button onClick={handleLogout} style={{
//             width:"100%", display:"flex", alignItems:"center", gap:10,
//             padding:"9px 16px", border:"none", background:"transparent",
//             color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600,
//           }}>
//             🚪 Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* ══ CONTENT COLUMN ══ */}
//       <div style={{ marginLeft:185, flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

//         {/* ── WHITE NAVBAR ──────────────────────────────────────────────────
//             LEFT  → "Back" pill + page name on sub-pages
//                     OR "Consumer Dashboard" on overview
//             RIGHT → search · CTA · bell · avatar
//             No logo (sidebar only). No greeting (sidebar only).
//         ─────────────────────────────────────────────────────────────── */}
//         <header style={{
//           height: 64, background: "#ffffff",
//           borderBottom: "1px solid #e8ede8",
//           display: "flex", alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 28px", gap: 16,
//           position: "sticky", top: 0, zIndex: 40,
//           boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//           flexShrink: 0,
//         }}>

//           {/* LEFT */}
//           <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
//             {isSubPage ? (
//               <>
//                 {/* Back button — always router.replace to exact URL, never router.back() */}
//                 <button
//                   onClick={() => router.replace("/dashboard/consumer")}
//                   style={{
//                     display:"flex", alignItems:"center", gap:5,
//                     background:"#f4f0e8",
//                     border:"1px solid rgba(26,58,42,0.15)",
//                     borderRadius:8, padding:"6px 13px",
//                     color:"#1a3a2a", fontSize:13, fontWeight:600,
//                     cursor:"pointer", transition:"all .15s",
//                     whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif",
//                     flexShrink:0,
//                   }}
//                   onMouseEnter={e => {
//                     e.currentTarget.style.background  = "#e8ede8";
//                     e.currentTarget.style.borderColor = "#22c55e";
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.background  = "#f4f0e8";
//                     e.currentTarget.style.borderColor = "rgba(26,58,42,0.15)";
//                   }}
//                 >
//                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
//                     <path d="M19 12H5M5 12l7 7M5 12l7-7"
//                       stroke="#1a3a2a" strokeWidth="2.5"
//                       strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                   Back
//                 </button>
//                 <span style={{ color:"#d1d5db", fontSize:15, flexShrink:0 }}>›</span>
//                 <span style={{
//                   fontSize:14, fontWeight:700, color:"#111827",
//                   overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis",
//                 }}>
//                   {pageLabel}
//                 </span>
//               </>
//             ) : (
//               <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>
//                 Consumer Dashboard
//               </span>
//             )}
//           </div>

//           {/* RIGHT */}
//           <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>

//             {/* Search */}
//             <div style={{ position:"relative" }}>
//               <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
//                 style={{ position:"absolute", left:10, top:"50%",
//                   transform:"translateY(-50%)", pointerEvents:"none" }}>
//                 <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2"/>
//                 <path d="M16.5 16.5L21 21" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//               <input
//                 placeholder="Search products, orders…"
//                 onFocus={() => setFocus(true)}
//                 onBlur={()  => setFocus(false)}
//                 style={{
//                   width: 200, padding: "8px 12px 8px 30px",
//                   border: `1.5px solid ${searchFocused ? "#22c55e" : "#e5e7eb"}`,
//                   borderRadius: 9, fontSize: 13,
//                   fontFamily: "'DM Sans',sans-serif",
//                   background: "#fff", color: "#111827",
//                   outline: "none", transition: "border-color .15s",
//                 }}
//               />
//             </div>

//             {/* Log meal CTA */}
//             <button
//               onClick={() => router.push("/dashboard/consumer/nutrition")}
//               style={{
//                 background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
//                 color:"#fff", border:"none", borderRadius:9, padding:"8px 16px",
//                 fontSize:13, fontWeight:700, cursor:"pointer",
//                 display:"flex", alignItems:"center", gap:6,
//                 whiteSpace:"nowrap", transition:"opacity .15s",
//               }}
//               onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
//               onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
//             >
//               + Log Today's Meal
//             </button>

//             {/* Bell */}
//             <button style={{
//               position:"relative", background:"none", border:"none",
//               cursor:"pointer", padding:5, color:"#9ca3af",
//               display:"flex", alignItems:"center",
//             }}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                 <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
//                   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
//                 <path d="M13.73 21a2 2 0 0 1-3.46 0"
//                   stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
//               </svg>
//               <span style={{
//                 position:"absolute", top:3, right:3,
//                 width:7, height:7, borderRadius:"50%",
//                 background:"#d4a853", border:"2px solid #fff",
//               }}/>
//             </button>

//             {/* Avatar */}
//             <div style={{
//               width:34, height:34, borderRadius:"50%",
//               background:"linear-gradient(135deg,#22c55e,#16a34a)",
//               display:"flex", alignItems:"center", justifyContent:"center",
//               color:"#fff", fontWeight:700, fontSize:14,
//               cursor:"pointer", flexShrink:0,
//             }}>
//               {getInitial()}
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main style={{ flex:1, padding:"24px 28px", overflowY:"auto" }}>
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// ── Shared sidebar layout for all consumer pages ──────────────────────────────
"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { icon:"🏠", label:"Overview",    href:"/dashboard/consumer",             section:"MY HEALTH" },
  { icon:"🛒", label:"Marketplace", href:"/dashboard/consumer/marketplace", section:"" },
  { icon:"🥗", label:"Nutrition",   href:"/dashboard/consumer/nutrition",   section:"" },
  { icon:"📦", label:"My Orders",   href:"/dashboard/consumer/orders",      section:"" },
  { icon:"⚙️", label:"Settings",   href:"/dashboard/consumer/settings",    section:"ACCOUNT" },
];

const SUB_PAGES = [
  "/dashboard/consumer/marketplace",
  "/dashboard/consumer/nutrition",
  "/dashboard/consumer/orders",
  "/dashboard/consumer/settings",
];

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]   = useState<any>(null);
  const [healthScore]     = useState(74);

  // Compute greeting fresh on each render (not module-level)
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr  = new Date().toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    if (!stored) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "user" && u.role !== "consumer" && u.role !== "admin") {
      router.push("/"); return;
    }
    setUser(u);
  }, []);

  const getInitial = () => (user?.name || "C")[0].toUpperCase();
  const isSubPage  = SUB_PAGES.includes(pathname);

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", background:"#f8faf8" }}>

      {/* ══ SIDEBAR — white ══ */}
      <aside style={{
        width: 185,
        background: "#fff",
        borderRight: "1px solid #e8ede8",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        boxShadow: "2px 0 12px rgba(0,0,0,.04)",
      }}>

        {/* Logo */}
        <div style={{
          height: 64,
          display: "flex", alignItems: "center",
          padding: "0 18px",
          borderBottom: "1px solid #f0f4f0",
          flexShrink: 0,
        }}>
          <Link href="/" style={{ display:"flex", alignItems:"center", textDecoration:"none" }}>
            <img src="/Agreal.png" alt="Agreal" style={{ height:30, width:"auto", display:"block" }} />
          </Link>
        </div>

        {/* User card */}
        <div style={{ padding:"16px 16px 12px", borderBottom:"1px solid #f0f4f0", flexShrink:0 }}>

          {/* Avatar + name row */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{
              width:38, height:38, borderRadius:"50%",
              background:"linear-gradient(135deg,#22c55e,#16a34a)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:15, fontWeight:700, color:"#fff", flexShrink:0,
            }}>
              {getInitial()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{
                fontSize:13, fontWeight:700, color:"#111827",
                overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis",
              }}>
                {user?.name || "Consumer"}
              </div>
              <div style={{ fontSize:11, color:"#6b7280" }}>Consumer · Colombo</div>
            </div>
          </div>

          {/* Greeting — right below name, simple one-liner, no box */}
          <div style={{ marginBottom:10, paddingLeft:2 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#1a3a2a" }}>
              {greeting}, {user?.name?.split(" ")[0] ?? "there"} 👋
            </div>
            <div style={{ fontSize:10, color:"#9ca3af", marginTop:1 }}>{dateStr}</div>
          </div>

          {/* Health score */}
          <div style={{
            background:"#f0fdf4", borderRadius:8, padding:"6px 10px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <span style={{ fontSize:11, color:"#166534", fontWeight:600 }}>Health Score</span>
            <span style={{ fontSize:13, fontWeight:800, color:"#16a34a" }}>{healthScore}/100</span>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <div key={item.href}>
                {item.section && (
                  <div style={{
                    padding:"10px 16px 4px", fontSize:10, fontWeight:700,
                    color:"#9ca3af", letterSpacing:".08em", textTransform:"uppercase",
                  }}>
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
                  <span style={{ fontSize:16 }}>{item.icon}</span>
                  {item.label}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding:"12px 0", borderTop:"1px solid #f0f4f0", flexShrink:0 }}>
          <button onClick={handleLogout} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10,
            padding:"9px 16px", border:"none", background:"transparent",
            color:"#ef4444", fontSize:13, cursor:"pointer", fontWeight:600,
          }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ══ CONTENT COLUMN ══ */}
      <div style={{ marginLeft:185, flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {/* ── NAVBAR ─────────────────────────────────────────────────────────
            - White background
            - LEFT: Back button (sub-pages only) using router.back()
                    so it goes to whichever page the user came from
            - RIGHT: Log Today's Meal CTA + bell + avatar
            - NO search bar
            - NO page name label next to back button
        ─────────────────────────────────────────────────────────────── */}
        <header style={{
          height: 64,
          background: "#ffffff",
          borderBottom: "1px solid #e8ede8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          position: "sticky", top: 0, zIndex: 40,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          flexShrink: 0,
        }}>

          {/* LEFT — back button on sub-pages, empty on overview */}
          <div>
            {isSubPage && (
              <button
                onClick={() => router.back()}
                style={{
                  display:"flex", alignItems:"center", gap:6,
                  background:"#f4f0e8",
                  border:"1px solid rgba(26,58,42,0.15)",
                  borderRadius:8, padding:"7px 16px",
                  color:"#1a3a2a", fontSize:13, fontWeight:600,
                  cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                  transition:"background .15s, border-color .15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background   = "#e8ede8";
                  e.currentTarget.style.borderColor  = "#22c55e";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background   = "#f4f0e8";
                  e.currentTarget.style.borderColor  = "rgba(26,58,42,0.15)";
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12l7 7M5 12l7-7"
                    stroke="#1a3a2a" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
            )}
          </div>

          {/* RIGHT — CTA + bell + avatar only */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>

            {/* Log meal CTA */}
            <button
              onClick={() => router.push("/dashboard/consumer/nutrition")}
              style={{
                background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
                color:"#fff", border:"none", borderRadius:9, padding:"8px 18px",
                fontSize:13, fontWeight:700, cursor:"pointer",
                display:"flex", alignItems:"center", gap:6,
                whiteSpace:"nowrap",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              + Log Today's Meal
            </button>

            {/* Bell */}
            <button style={{
              position:"relative", background:"none", border:"none",
              cursor:"pointer", padding:5, color:"#9ca3af",
              display:"flex", alignItems:"center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span style={{
                position:"absolute", top:3, right:3,
                width:7, height:7, borderRadius:"50%",
                background:"#d4a853", border:"2px solid #fff",
              }}/>
            </button>

            {/* Avatar */}
            <div style={{
              width:36, height:36, borderRadius:"50%",
              background:"linear-gradient(135deg,#22c55e,#16a34a)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer",
            }}>
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