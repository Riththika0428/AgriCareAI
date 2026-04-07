// // // "use client";

// // // import { useState, useEffect, useRef } from "react";
// // // import { useRouter } from "next/navigation";
// // // import { productAPI, profileAPI } from "@/lib/axios-proxy";
// // // import api from "@/lib/axios-proxy";

// // // interface User    { _id: string; name: string; email: string; role: string; }
// // // interface Profile { farmName: string; district: string; }
// // // interface Product {
// // //   _id: string; cropName: string; category: string; price: number;
// // //   stock: number; status: string; imageUrl?: string; createdAt?: string;
// // //   description?: string; unit?: string;
// // // }

// // // const NAV = [
// // //   { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
// // //   { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
// // //   { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
// // //   { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
// // //   { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
// // //   { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
// // // ];

// // // const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Herbs", "Other"];
// // // const FILTERS    = ["All", "Active", "Out of Stock", "Inactive"];

// // // const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
// // //   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
// // //     strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
// // //     <path d={d} />
// // //   </svg>
// // // );

// // // const StatusBadge = ({ s }: { s: string }) => {
// // //   const map: Record<string, [string, string]> = {
// // //     Active:   ["#dcfce7","#16a34a"], active: ["#dcfce7","#16a34a"],
// // //     approved: ["#dcfce7","#16a34a"], Inactive: ["#fee2e2","#dc2626"],
// // //     "Out of Stock": ["#fef9c3","#a16207"],
// // //   };
// // //   const [bg, col] = map[s] ?? ["#f3f4f6","#6b7280"];
// // //   return (
// // //     <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: bg, color: col }}>
// // //       {s === "approved" ? "Active" : s}
// // //     </span>
// // //   );
// // // };

// // // export default function ProductsPage() {
// // //   const router = useRouter();

// // //   const [user,          setUser]          = useState<User | null>(null);
// // //   const [profile,       setProfile]       = useState<Profile | null>(null);
// // //   const [sub,           setSub]           = useState<any>(null);
// // //   const [products,      setProducts]      = useState<Product[]>([]);
// // //   const [loading,       setLoading]       = useState(true);
// // //   const [sideCollapsed, setSideCollapsed] = useState(false);
// // //   const [search,        setSearch]        = useState("");
// // //   const [filter,        setFilter]        = useState("All");
// // //   const [catFilter,     setCatFilter]     = useState("All");
// // //   const [showAdd,       setShowAdd]       = useState(false);
// // //   const [showEdit,      setShowEdit]      = useState<Product | null>(null);
// // //   const [saving,        setSaving]        = useState(false);
// // //   const [deleting,      setDeleting]      = useState<string | null>(null);
// // //   const [toast,         setToast]         = useState("");

// // //   const blankForm = { cropName: "", category: "Vegetables", price: "", stock: "", description: "", unit: "kg", imageUrl: "" };
// // //   const [form, setForm] = useState(blankForm);
// // //   const fileRef = useRef<HTMLInputElement>(null);

// // //   const SBW = sideCollapsed ? 68 : 220;

// // //   const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
// // //   const getInitial = () => (user?.name || "F")[0].toUpperCase();

// // //   useEffect(() => {
// // //     const stored = localStorage.getItem("agriai_user");
// // //     const token  = localStorage.getItem("agriai_token");
// // //     if (!stored || !token) { router.push("/"); return; }
// // //     const u = JSON.parse(stored);
// // //     setUser(u);
// // //     loadData(u);
// // //   }, []);

// // //   const loadData = async (u: User) => {
// // //     try {
// // //       const [profR, prodR, subR] = await Promise.allSettled([
// // //         profileAPI.getMe(),
// // //         productAPI.getMyProducts(),
// // //         api.get("/subscriptions/my"),
// // //       ]);
// // //       if (profR.status === "fulfilled") setProfile({ farmName: profR.value.data.farmName || "", district: profR.value.data.district || "" });
// // //       if (prodR.status === "fulfilled") {
// // //         const raw = prodR.value.data?.products || prodR.value.data || [];
// // //         setProducts(Array.isArray(raw) ? raw : []);
// // //       }
// // //       if (subR.status === "fulfilled") setSub(subR.value.data);
// // //     } catch { }
// // //     setLoading(false);
// // //   };

// // //   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

// // //   const handleSave = async () => {
// // //     if (!form.cropName || !form.price || !form.stock) return;
// // //     setSaving(true);
// // //     try {
// // //       if (showEdit) {
// // //         await productAPI.update(showEdit._id, { cropName: form.cropName, category: form.category, price: Number(form.price), stock: Number(form.stock), description: form.description, unit: form.unit });
// // //         setProducts(prev => prev.map(p => p._id === showEdit._id ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p));
// // //         showToast("Product updated!");
// // //       } else {
// // //         const { data } = await productAPI.create({ cropName: form.cropName, category: form.category, price: Number(form.price), stock: Number(form.stock), description: form.description, unit: form.unit });
// // //         setProducts(prev => [...prev, data.product || data]);
// // //         showToast("Product added!");
// // //       }
// // //       setShowAdd(false); setShowEdit(null); setForm(blankForm);
// // //     } catch (e: any) { showToast(e.response?.data?.message || "Error saving product"); }
// // //     setSaving(false);
// // //   };

// // //   const handleDelete = async (id: string) => {
// // //     setDeleting(id);
// // //     try {
// // //       await productAPI.remove(id);
// // //       setProducts(prev => prev.filter(p => p._id !== id));
// // //       showToast("Product deleted.");
// // //     } catch { showToast("Failed to delete."); }
// // //     setDeleting(null);
// // //   };

// // //   const handleLogout = () => { localStorage.removeItem("agriai_token"); localStorage.removeItem("agriai_user"); router.push("/"); };

// // //   const filtered = products.filter(p => {
// // //     const matchSearch = p.cropName.toLowerCase().includes(search.toLowerCase());
// // //     const matchFilter = filter === "All" || (filter === "Active" && (p.status === "Active" || p.status === "approved")) || (filter === "Out of Stock" && p.stock === 0) || p.status === filter;
// // //     const matchCat    = catFilter === "All" || p.category === catFilter;
// // //     return matchSearch && matchFilter && matchCat;
// // //   });

// // //   const totalProducts   = products.length;
// // //   const activeListings  = products.filter(p => p.status === "Active" || p.status === "approved").length;
// // //   const outOfStock      = products.filter(p => p.stock === 0).length;
// // //   const inventoryValue  = products.reduce((a, p) => a + p.price * p.stock, 0);

// // //   if (loading) return (
// // //     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0e8", fontFamily: "'DM Sans',sans-serif" }}>
// // //       <div style={{ textAlign: "center" }}>
// // //         <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#6aaa78)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
// // //           <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={22} style={{ color: "#fff" }} />
// // //         </div>
// // //         <div style={{ color: "#2d5a3d", fontWeight: 700, fontSize: 15 }}>Loading products…</div>
// // //       </div>
// // //     </div>
// // //   );

// // //   return (
// // //     <>
// // //       <style>{`
// // //         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
// // //         *{box-sizing:border-box;margin:0;padding:0;}
// // //         body{font-family:'DM Sans',sans-serif;background:#f2efe8;}
// // //         ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#d0cdc6;border-radius:10px;}
// // //         .nav-btn:hover{background:rgba(106,170,120,.15)!important;color:#fff!important;}
// // //         .action-btn:hover{opacity:.88;}
// // //         .prod-card:hover{box-shadow:0 12px 36px rgba(26,58,42,.13)!important;transform:translateY(-3px);}
// // //         .filter-chip:hover{background:#e8f5e9!important;color:#1a3a2a!important;}
// // //         input:focus,textarea:focus,select:focus{outline:none;border-color:#6aaa78!important;box-shadow:0 0 0 3px rgba(106,170,120,.15);}
// // //         @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
// // //         .fade-up{animation:fadeUp .32s ease both;}
// // //         @keyframes slideIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
// // //         .slide-in{animation:slideIn .28s ease both;}
// // //         @keyframes toastIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
// // //         .toast{animation:toastIn .25s ease both;}
// // //       `}</style>

// // //       <div style={{ display: "flex", minHeight: "100vh", background: "#f2efe8" }}>

// // //         {/* ══ SIDEBAR ══ */}
// // //         <aside style={{
// // //           width: SBW, background: "linear-gradient(185deg,#1a3a2a 0%,#122a1c 60%,#0a1e11 100%)",
// // //           display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 60,
// // //           transition: "width .28s cubic-bezier(.4,0,.2,1)", overflow: "hidden",
// // //           boxShadow: "4px 0 24px rgba(0,0,0,.18)",
// // //         }}>
// // //           {/* Logo */}
// // //           <div style={{ padding: sideCollapsed ? "18px 0" : "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: sideCollapsed ? "center" : "space-between" }}>
// // //             {!sideCollapsed && (
// // //               <div onClick={() => router.push("/")} style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff", cursor: "pointer", letterSpacing: "-0.5px" }}
// // //                 onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
// // //                 Ag<span style={{ color: "#6aaa78" }}>real</span>
// // //               </div>
// // //             )}
// // //             <button onClick={() => setSideCollapsed(p => !p)} className="action-btn"
// // //               style={{ background: "rgba(255,255,255,.07)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,.5)", flexShrink: 0 }}>
// // //               <Icon d={sideCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} size={14} />
// // //             </button>
// // //           </div>
// // //           {/* User card */}
// // //           <div style={{ padding: sideCollapsed ? "14px 0" : "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: sideCollapsed ? "flex" : "block", justifyContent: "center" }}>
// // //             <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start" }}>
// // //               <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,.15)", flexShrink: 0 }}>
// // //                 {getInitial()}
// // //               </div>
// // //               {!sideCollapsed && (
// // //                 <div>
// // //                   <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
// // //                   <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>{profile?.farmName || "My Farm"}</div>
// // //                   {sub?.isActive && (
// // //                     <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(106,170,120,.25)", borderRadius: 99, padding: "1px 8px", fontSize: 9, color: "#6aaa78", fontWeight: 700 }}>
// // //                       <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6aaa78", display: "inline-block" }} />
// // //                       {sub.status === "trialing" ? "Free Trial" : "Active"}
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>
// // //           {/* Nav */}
// // //           <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
// // //             {!sideCollapsed && <div style={{ padding: "10px 16px 4px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em" }}>Navigation</div>}
// // //             {NAV.map(item => {
// // //               const active = item.href === "/dashboard/farmer/products";
// // //               return (
// // //                 <button key={item.href} onClick={() => router.push(item.href)} className="nav-btn"
// // //                   title={sideCollapsed ? item.label : undefined}
// // //                   style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sideCollapsed ? "12px 0" : "9px 16px", justifyContent: sideCollapsed ? "center" : "flex-start", border: "none", background: active ? "rgba(106,170,120,.18)" : "transparent", borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent", color: active ? "#fff" : "rgba(255,255,255,.5)", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all .18s", textAlign: "left" }}>
// // //                   <Icon d={item.icon} size={17} style={{ flexShrink: 0 }} />
// // //                   {!sideCollapsed && <span>{item.label}</span>}
// // //                   {!sideCollapsed && active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6aaa78" }} />}
// // //                 </button>
// // //               );
// // //             })}
// // //           </nav>
// // //           {/* Bottom */}
// // //           <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.07)" }}>
// // //             <button onClick={() => router.push("/dashboard/farmer/settings")} className="nav-btn" title={sideCollapsed ? "Settings" : undefined}
// // //               style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "rgba(255,255,255,.4)", fontSize: 13, cursor: "pointer", transition: "all .18s" }}>
// // //               <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={16} style={{ flexShrink: 0 }} />
// // //               {!sideCollapsed && <span>Settings</span>}
// // //             </button>
// // //             <button onClick={handleLogout} className="nav-btn" title={sideCollapsed ? "Sign Out" : undefined}
// // //               style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "#f87171", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all .18s" }}>
// // //               <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={16} style={{ flexShrink: 0 }} />
// // //               {!sideCollapsed && <span>Sign Out</span>}
// // //             </button>
// // //           </div>
// // //         </aside>

// // //         {/* ══ MAIN ══ */}
// // //         <main style={{ marginLeft: SBW, flex: 1, display: "flex", flexDirection: "column", transition: "margin-left .28s cubic-bezier(.4,0,.2,1)", minHeight: "100vh" }}>

// // //           {/* Topbar */}
// // //           <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
// // //             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
// // //               <button onClick={() => router.back()} className="action-btn"
// // //                 style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "#f4f0e8", border: "1px solid #e0ddd6", cursor: "pointer", flexShrink: 0 }}>
// // //                 <Icon d="M15 19l-7-7 7-7" size={16} style={{ color: "#1a3a2a" }} />
// // //               </button>
// // //               <div>
// // //                 <div style={{ fontSize: 19, fontWeight: 700, color: "#1c2b22", letterSpacing: "-.3px" }}>
// // //                   {greeting()}, <span style={{ color: "#2d5a3d" }}>{user?.name?.split(" ")[0]}</span>
// // //                 </div>
// // //                 <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>
// // //                   {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
// // //                   {profile?.district ? ` · ${profile.district}` : ""}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// // //               {/* Search */}
// // //               <div style={{ position: "relative" }}>
// // //                 <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9b9590" }} />
// // //                 <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crops…"
// // //                   style={{ paddingLeft: 34, paddingRight: 14, height: 36, border: "1px solid #e0ddd6", borderRadius: 9, background: "#f9f7f4", fontSize: 13, color: "#1a3a2a", width: 200, fontFamily: "'DM Sans',sans-serif" }} />
// // //               </div>
// // //               {/* Add Product */}
// // //               <button onClick={() => { setShowAdd(true); setShowEdit(null); setForm(blankForm); }} className="action-btn"
// // //                 style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(26,58,42,.25)" }}>
// // //                 <Icon d="M12 4v16m8-8H4" size={15} />
// // //                 Add Product
// // //               </button>
// // //               {/* Avatar */}
// // //               <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(45,90,61,.3)", cursor: "pointer" }}>
// // //                 {getInitial()}
// // //               </div>
// // //             </div>
// // //           </header>

// // //           {/* Body */}
// // //           <div style={{ padding: "28px 32px", flex: 1 }}>

// // //             {/* Stat cards */}
// // //             <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
// // //               {[
// // //                 { label: "Total Products", value: totalProducts, sub: "Listed crops", dot: "#6aaa78" },
// // //                 { label: "Active Listings", value: activeListings, sub: "Selling now", dot: "#6aaa78" },
// // //                 { label: "Out of Stock",    value: outOfStock,    sub: "Need restocking", dot: "#f59e0b" },
// // //                 { label: "Inventory Value", value: `Rs.${(inventoryValue/1000).toFixed(1)}K`, sub: "Est. total value", dot: "#3b82f6" },
// // //               ].map(s => (
// // //                 <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid #eeebe4", boxShadow: "0 2px 8px rgba(0,0,0,.04)", position: "relative" }}>
// // //                   <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
// // //                     <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
// // //                     <div style={{ fontSize: 11, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".07em" }}>{s.label}</div>
// // //                   </div>
// // //                   <div style={{ fontSize: 32, fontWeight: 800, color: "#1c2b22", fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
// // //                   <div style={{ fontSize: 12, color: "#9b9590" }}>{s.sub}</div>
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {/* Filters row */}
// // //             <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
// // //               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
// // //                 {FILTERS.map(f => (
// // //                   <button key={f} onClick={() => setFilter(f)} className="filter-chip"
// // //                     style={{ padding: "7px 16px", borderRadius: 99, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .18s", background: filter === f ? "#1a3a2a" : "#fff", color: filter === f ? "#fff" : "#6b8070", borderColor: filter === f ? "#1a3a2a" : "#e0ddd6" }}>
// // //                     {f}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //               <div style={{ fontSize: 13, color: "#9b9590", fontWeight: 500 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
// // //             </div>

// // //             {/* Product grid */}
// // //             {filtered.length === 0 ? (
// // //               <div className="fade-up" style={{ textAlign: "center", padding: "80px 20px" }}>
// // //                 <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#f4f0e8,#eef5ec)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
// // //                   <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={30} style={{ color: "#9b9590" }} />
// // //                 </div>
// // //                 <div style={{ fontSize: 18, fontWeight: 700, color: "#1c2b22", marginBottom: 8 }}>No products found</div>
// // //                 <div style={{ fontSize: 14, color: "#9b9590", marginBottom: 24 }}>Add your first crop to start selling</div>
// // //                 <button onClick={() => { setShowAdd(true); setForm(blankForm); }} className="action-btn"
// // //                   style={{ padding: "11px 24px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
// // //                   + Add Product
// // //                 </button>
// // //               </div>
// // //             ) : (
// // //               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
// // //                 {filtered.map((p, i) => (
// // //                   <div key={p._id} className="prod-card fade-up"
// // //                     style={{ background: "#fff", borderRadius: 18, border: "1px solid #eeebe4", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.05)", transition: "all .22s", animationDelay: `${i * 0.04}s` }}>
// // //                     {/* Image */}
// // //                     <div style={{ height: 160, background: "linear-gradient(135deg,#e8f5e9,#f4f0e8)", position: "relative", overflow: "hidden" }}>
// // //                       {p.imageUrl ? (
// // //                         <img src={p.imageUrl} alt={p.cropName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
// // //                       ) : (
// // //                         <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
// // //                           <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={36} style={{ color: "#9b9590" }} />
// // //                         </div>
// // //                       )}
// // //                       {/* Status dot */}
// // //                       <div style={{ position: "absolute", top: 10, right: 10 }}>
// // //                         <StatusBadge s={p.status} />
// // //                       </div>
// // //                     </div>
// // //                     {/* Info */}
// // //                     <div style={{ padding: "16px 18px" }}>
// // //                       <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22", marginBottom: 2 }}>{p.cropName}</div>
// // //                       <div style={{ fontSize: 12, color: "#9b9590", marginBottom: 14 }}>{p.category}</div>
// // //                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f7f4", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
// // //                         <div>
// // //                           <div style={{ fontSize: 10, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".06em" }}>Price</div>
// // //                           <div style={{ fontSize: 17, fontWeight: 800, color: "#1a3a2a" }}>Rs.{p.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 500, color: "#9b9590" }}>/{p.unit || "kg"}</span></div>
// // //                         </div>
// // //                         <div style={{ textAlign: "right" }}>
// // //                           <div style={{ fontSize: 10, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".06em" }}>Stock</div>
// // //                           <div style={{ fontSize: 17, fontWeight: 800, color: p.stock === 0 ? "#ef4444" : "#1a3a2a" }}>{p.stock}<span style={{ fontSize: 11, fontWeight: 500, color: "#9b9590" }}>{p.unit || "kg"}</span></div>
// // //                         </div>
// // //                       </div>
// // //                       {p.createdAt && <div style={{ fontSize: 11, color: "#b0ada8", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
// // //                         <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={12} />
// // //                         {new Date(p.createdAt).toLocaleDateString()}
// // //                       </div>}
// // //                       <div style={{ display: "flex", gap: 8 }}>
// // //                         <button onClick={() => { setShowEdit(p); setShowAdd(true); setForm({ cropName: p.cropName, category: p.category, price: String(p.price), stock: String(p.stock), description: p.description || "", unit: p.unit || "kg", imageUrl: p.imageUrl || "" }); }} className="action-btn"
// // //                           style={{ flex: 1, padding: "8px", background: "#f4f0e8", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#1a3a2a", cursor: "pointer" }}>
// // //                           Edit
// // //                         </button>
// // //                         <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="action-btn"
// // //                           style={{ flex: 1, padding: "8px", background: "#fff0f0", border: "1px solid #fcd0d0", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#c0392b", cursor: "pointer" }}>
// // //                           {deleting === p._id ? "…" : "Delete"}
// // //                         </button>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </main>
// // //       </div>

// // //       {/* ══ ADD / EDIT MODAL ══ */}
// // //       {showAdd && (
// // //         <div onClick={e => { if (e.target === e.currentTarget) { setShowAdd(false); setShowEdit(null); } }}
// // //           style={{ position: "fixed", inset: 0, background: "rgba(10,20,14,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
// // //           <div className="slide-in" style={{ background: "#fff", borderRadius: 24, padding: "36px", width: "100%", maxWidth: 520, boxShadow: "0 32px 80px rgba(0,0,0,.25)", maxHeight: "90vh", overflowY: "auto" }}>
// // //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
// // //               <div>
// // //                 <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a3a2a", fontFamily: "'Playfair Display',serif" }}>{showEdit ? "Edit Product" : "Add New Product"}</h2>
// // //                 <p style={{ fontSize: 13, color: "#9b9590", marginTop: 4 }}>{showEdit ? "Update your listing details" : "List a new crop for sale"}</p>
// // //               </div>
// // //               <button onClick={() => { setShowAdd(false); setShowEdit(null); }}
// // //                 style={{ background: "#f4f0e8", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b8070" }}>
// // //                 <Icon d="M6 18L18 6M6 6l12 12" size={16} />
// // //               </button>
// // //             </div>
// // //             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
// // //               {[
// // //                 { label: "Crop Name *", key: "cropName", placeholder: "e.g. Tomato, Carrot…", type: "text" },
// // //                 { label: "Price (Rs.) *", key: "price", placeholder: "e.g. 450", type: "number" },
// // //                 { label: "Stock *", key: "stock", placeholder: "e.g. 100", type: "number" },
// // //                 { label: "Description", key: "description", placeholder: "Describe your crop…", type: "textarea" },
// // //               ].map(f => (
// // //                 <div key={f.key}>
// // //                   <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>{f.label}</label>
// // //                   {f.type === "textarea" ? (
// // //                     <textarea value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={3}
// // //                       style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4", resize: "vertical" }} />
// // //                   ) : (
// // //                     <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
// // //                       style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }} />
// // //                   )}
// // //                 </div>
// // //               ))}
// // //               {/* Category + Unit row */}
// // //               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
// // //                 <div>
// // //                   <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Category</label>
// // //                   <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
// // //                     style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }}>
// // //                     {["Vegetables","Fruits","Grains","Herbs","Other"].map(c => <option key={c}>{c}</option>)}
// // //                   </select>
// // //                 </div>
// // //                 <div>
// // //                   <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Unit</label>
// // //                   <select value={form.unit} onChange={e => setForm(prev => ({ ...prev, unit: e.target.value }))}
// // //                     style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }}>
// // //                     {["kg","g","litre","bunch","piece"].map(u => <option key={u}>{u}</option>)}
// // //                   </select>
// // //                 </div>
// // //               </div>
// // //               <button onClick={handleSave} disabled={saving || !form.cropName || !form.price || !form.stock} className="action-btn"
// // //                 style={{ padding: "13px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1, marginTop: 4 }}>
// // //                 {saving ? "Saving…" : showEdit ? "Update Product" : "Add Product"}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Toast */}
// // //       {toast && (
// // //         <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, background: "#1a3a2a", color: "#fff", padding: "13px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.2)", zIndex: 300 }}>
// // //           {toast}
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // }

// // "use client";

// // import { useState, useEffect, useRef } from "react";
// // import { useRouter } from "next/navigation";
// // import { productAPI, profileAPI } from "@/lib/axios-proxy";
// // import api from "@/lib/axios-proxy";

// // interface User    { _id: string; name: string; email: string; role: string; }
// // interface Profile { farmName: string; district: string; }
// // interface Product {
// //   _id: string; cropName: string; category: string; price: number;
// //   stock: number; status: string; imageUrl?: string; createdAt?: string;
// //   description?: string; unit?: string;
// // }

// // const NAV = [
// //   { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
// //   { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
// //   { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
// //   { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
// //   { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
// //   { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
// // ];

// // const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Herbs", "Other"];
// // const FILTERS    = ["All", "Active", "Out of Stock", "Inactive"];

// // const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
// //   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
// //     strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
// //     <path d={d} />
// //   </svg>
// // );

// // const StatusBadge = ({ s }: { s: string }) => {
// //   const map: Record<string, [string, string]> = {
// //     Active:   ["#dcfce7","#16a34a"], active: ["#dcfce7","#16a34a"],
// //     approved: ["#dcfce7","#16a34a"], Inactive: ["#fee2e2","#dc2626"],
// //     "Out of Stock": ["#fef9c3","#a16207"],
// //   };
// //   const [bg, col] = map[s] ?? ["#f3f4f6","#6b7280"];
// //   return (
// //     <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: bg, color: col }}>
// //       {s === "approved" ? "Active" : s}
// //     </span>
// //   );
// // };

// // export default function ProductsPage() {
// //   const router = useRouter();

// //   const [user,          setUser]          = useState<User | null>(null);
// //   const [profile,       setProfile]       = useState<Profile | null>(null);
// //   const [sub,           setSub]           = useState<any>(null);
// //   const [products,      setProducts]      = useState<Product[]>([]);
// //   const [loading,       setLoading]       = useState(true);
// //   const [sideCollapsed, setSideCollapsed] = useState(false);
// //   const [search,        setSearch]        = useState("");
// //   const [filter,        setFilter]        = useState("All");
// //   const [catFilter,     setCatFilter]     = useState("All");
// //   const [showAdd,       setShowAdd]       = useState(false);
// //   const [showEdit,      setShowEdit]      = useState<Product | null>(null);
// //   const [saving,        setSaving]        = useState(false);
// //   const [deleting,      setDeleting]      = useState<string | null>(null);
// //   const [toast,         setToast]         = useState("");

// //   const blankForm = { cropName: "", category: "Vegetables", price: "", stock: "", description: "", unit: "kg", imageUrl: "" };
// //   const [form, setForm] = useState(blankForm);
// //   const fileRef = useRef<HTMLInputElement>(null);

// //   const SBW = sideCollapsed ? 68 : 220;

// //   const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
// //   const getInitial = () => (user?.name || "F")[0].toUpperCase();

// //   useEffect(() => {
// //     const stored = localStorage.getItem("agriai_user");
// //     const token  = localStorage.getItem("agriai_token");
// //     if (!stored || !token) { router.push("/"); return; }
// //     const u = JSON.parse(stored);
// //     setUser(u);
// //     loadData(u);
// //   }, []);

// //   const loadData = async (u: User) => {
// //     try {
// //       const [profR, prodR, subR] = await Promise.allSettled([
// //         profileAPI.getMe(),
// //         productAPI.getMyProducts(),
// //         api.get("/subscriptions/my"),
// //       ]);
// //       if (profR.status === "fulfilled") setProfile({ farmName: profR.value.data.farmName || "", district: profR.value.data.district || "" });
// //       if (prodR.status === "fulfilled") {
// //         const raw = prodR.value.data?.products || prodR.value.data || [];
// //         setProducts(Array.isArray(raw) ? raw : []);
// //       }
// //       if (subR.status === "fulfilled") setSub(subR.value.data);
// //     } catch { }
// //     setLoading(false);
// //   };

// //   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

// //   const handleSave = async () => {
// //     if (!form.cropName || !form.price || !form.stock) return;
// //     setSaving(true);
// //     try {
// //       const payload = {
// //         cropName: form.cropName, category: form.category,
// //         price: Number(form.price), stock: Number(form.stock),
// //         description: form.description, unit: form.unit,
// //         ...(form.imageUrl ? { imageUrl: form.imageUrl } : {}),
// //       };
// //       if (showEdit) {
// //         await productAPI.update(showEdit._id, payload);
// //         setProducts(prev => prev.map(p => p._id === showEdit._id ? { ...p, ...payload } : p));
// //         showToast("Product updated!");
// //       } else {
// //         const { data } = await productAPI.create(payload);
// //         setProducts(prev => [...prev, data.product || data]);
// //         showToast("Product added!");
// //       }
// //       setShowAdd(false); setShowEdit(null); setForm(blankForm);
// //     } catch (e: any) { showToast(e.response?.data?.message || "Error saving product"); }
// //     setSaving(false);
// //   };

// //   const handleDelete = async (id: string) => {
// //     setDeleting(id);
// //     try {
// //       await productAPI.delete(id);
// //       setProducts(prev => prev.filter(p => p._id !== id));
// //       showToast("Product deleted.");
// //     } catch { showToast("Failed to delete."); }
// //     setDeleting(null);
// //   };

// //   const handleLogout = () => { localStorage.removeItem("agriai_token"); localStorage.removeItem("agriai_user"); router.push("/"); };

// //   const filtered = products.filter(p => {
// //     const matchSearch = p.cropName.toLowerCase().includes(search.toLowerCase());
// //     const matchFilter = filter === "All" || (filter === "Active" && (p.status === "Active" || p.status === "approved")) || (filter === "Out of Stock" && p.stock === 0) || p.status === filter;
// //     const matchCat    = catFilter === "All" || p.category === catFilter;
// //     return matchSearch && matchFilter && matchCat;
// //   });

// //   const totalProducts   = products.length;
// //   const activeListings  = products.filter(p => p.status === "Active" || p.status === "approved").length;
// //   const outOfStock      = products.filter(p => p.stock === 0).length;
// //   const inventoryValue  = products.reduce((a, p) => a + p.price * p.stock, 0);

// //   if (loading) return (
// //     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0e8", fontFamily: "'DM Sans',sans-serif" }}>
// //       <div style={{ textAlign: "center" }}>
// //         <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#6aaa78)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
// //           <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={22} style={{ color: "#fff" }} />
// //         </div>
// //         <div style={{ color: "#2d5a3d", fontWeight: 700, fontSize: 15 }}>Loading products…</div>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
// //         *{box-sizing:border-box;margin:0;padding:0;}
// //         body{font-family:'DM Sans',sans-serif;background:#f2efe8;}
// //         ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#d0cdc6;border-radius:10px;}
// //         .nav-btn:hover{background:rgba(106,170,120,.15)!important;color:#fff!important;}
// //         .action-btn:hover{opacity:.88;}
// //         .prod-card:hover{box-shadow:0 12px 36px rgba(26,58,42,.13)!important;transform:translateY(-3px);}
// //         .filter-chip:hover{background:#e8f5e9!important;color:#1a3a2a!important;}
// //         input:focus,textarea:focus,select:focus{outline:none;border-color:#6aaa78!important;box-shadow:0 0 0 3px rgba(106,170,120,.15);}
// //         @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
// //         .fade-up{animation:fadeUp .32s ease both;}
// //         @keyframes slideIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
// //         .slide-in{animation:slideIn .28s ease both;}
// //         @keyframes toastIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
// //         .toast{animation:toastIn .25s ease both;}
// //       `}</style>

// //       <div style={{ display: "flex", minHeight: "100vh", background: "#f2efe8" }}>

// //         {/* ══ SIDEBAR ══ */}
// //         <aside style={{
// //           width: SBW, background: "linear-gradient(185deg,#1a3a2a 0%,#122a1c 60%,#0a1e11 100%)",
// //           display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 60,
// //           transition: "width .28s cubic-bezier(.4,0,.2,1)", overflow: "hidden",
// //           boxShadow: "4px 0 24px rgba(0,0,0,.18)",
// //         }}>
// //           {/* Logo */}
// //           <div style={{ padding: sideCollapsed ? "18px 0" : "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: sideCollapsed ? "center" : "space-between" }}>
// //             {!sideCollapsed && (
// //               <div onClick={() => router.push("/")} style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff", cursor: "pointer", letterSpacing: "-0.5px" }}
// //                 onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
// //                 Ag<span style={{ color: "#6aaa78" }}>real</span>
// //               </div>
// //             )}
// //             <button onClick={() => setSideCollapsed(p => !p)} className="action-btn"
// //               style={{ background: "rgba(255,255,255,.07)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,.5)", flexShrink: 0 }}>
// //               <Icon d={sideCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} size={14} />
// //             </button>
// //           </div>
// //           {/* User card */}
// //           <div style={{ padding: sideCollapsed ? "14px 0" : "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: sideCollapsed ? "flex" : "block", justifyContent: "center" }}>
// //             <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start" }}>
// //               <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,.15)", flexShrink: 0 }}>
// //                 {getInitial()}
// //               </div>
// //               {!sideCollapsed && (
// //                 <div>
// //                   <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
// //                   <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>{profile?.farmName || "My Farm"}</div>
// //                   {sub?.isActive && (
// //                     <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(106,170,120,.25)", borderRadius: 99, padding: "1px 8px", fontSize: 9, color: "#6aaa78", fontWeight: 700 }}>
// //                       <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6aaa78", display: "inline-block" }} />
// //                       {sub.status === "trialing" ? "Free Trial" : "Active"}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           {/* Nav */}
// //           <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
// //             {!sideCollapsed && <div style={{ padding: "10px 16px 4px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em" }}>Navigation</div>}
// //             {NAV.map(item => {
// //               const active = item.href === "/dashboard/farmer/products";
// //               return (
// //                 <button key={item.href} onClick={() => router.push(item.href)} className="nav-btn"
// //                   title={sideCollapsed ? item.label : undefined}
// //                   style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sideCollapsed ? "12px 0" : "9px 16px", justifyContent: sideCollapsed ? "center" : "flex-start", border: "none", background: active ? "rgba(106,170,120,.18)" : "transparent", borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent", color: active ? "#fff" : "rgba(255,255,255,.5)", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all .18s", textAlign: "left" }}>
// //                   <Icon d={item.icon} size={17} style={{ flexShrink: 0 }} />
// //                   {!sideCollapsed && <span>{item.label}</span>}
// //                   {!sideCollapsed && active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6aaa78" }} />}
// //                 </button>
// //               );
// //             })}
// //           </nav>
// //           {/* Bottom */}
// //           <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.07)" }}>
// //             <button onClick={() => router.push("/dashboard/farmer/settings")} className="nav-btn" title={sideCollapsed ? "Settings" : undefined}
// //               style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "rgba(255,255,255,.4)", fontSize: 13, cursor: "pointer", transition: "all .18s" }}>
// //               <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={16} style={{ flexShrink: 0 }} />
// //               {!sideCollapsed && <span>Settings</span>}
// //             </button>
// //             <button onClick={handleLogout} className="nav-btn" title={sideCollapsed ? "Sign Out" : undefined}
// //               style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "#f87171", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all .18s" }}>
// //               <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={16} style={{ flexShrink: 0 }} />
// //               {!sideCollapsed && <span>Sign Out</span>}
// //             </button>
// //           </div>
// //         </aside>

// //         {/* ══ MAIN ══ */}
// //         <main style={{ marginLeft: SBW, flex: 1, display: "flex", flexDirection: "column", transition: "margin-left .28s cubic-bezier(.4,0,.2,1)", minHeight: "100vh" }}>

// //           {/* Topbar */}
// //           <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
// //             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
// //               <button onClick={() => router.back()} className="action-btn"
// //                 style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "#f4f0e8", border: "1px solid #e0ddd6", cursor: "pointer", flexShrink: 0 }}>
// //                 <Icon d="M15 19l-7-7 7-7" size={16} style={{ color: "#1a3a2a" }} />
// //               </button>
// //               <div>
// //                 <div style={{ fontSize: 19, fontWeight: 700, color: "#1c2b22", letterSpacing: "-.3px" }}>
// //                   {greeting()}, <span style={{ color: "#2d5a3d" }}>{user?.name?.split(" ")[0]}</span>
// //                 </div>
// //                 <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>
// //                   {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
// //                   {profile?.district ? ` · ${profile.district}` : ""}
// //                 </div>
// //               </div>
// //             </div>
// //             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //               {/* Search */}
// //               <div style={{ position: "relative" }}>
// //                 <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9b9590" }} />
// //                 <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crops…"
// //                   style={{ paddingLeft: 34, paddingRight: 14, height: 36, border: "1px solid #e0ddd6", borderRadius: 9, background: "#f9f7f4", fontSize: 13, color: "#1a3a2a", width: 200, fontFamily: "'DM Sans',sans-serif" }} />
// //               </div>
// //               {/* Add Product */}
// //               <button onClick={() => { setShowAdd(true); setShowEdit(null); setForm(blankForm); }} className="action-btn"
// //                 style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(26,58,42,.25)" }}>
// //                 <Icon d="M12 4v16m8-8H4" size={15} />
// //                 Add Product
// //               </button>
// //               {/* Avatar */}
// //               <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(45,90,61,.3)", cursor: "pointer" }}>
// //                 {getInitial()}
// //               </div>
// //             </div>
// //           </header>

// //           {/* Body */}
// //           <div style={{ padding: "28px 32px", flex: 1 }}>

// //             {/* Stat cards */}
// //             <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
// //               {[
// //                 { label: "Total Products", value: totalProducts, sub: "Listed crops", dot: "#6aaa78" },
// //                 { label: "Active Listings", value: activeListings, sub: "Selling now", dot: "#6aaa78" },
// //                 { label: "Out of Stock",    value: outOfStock,    sub: "Need restocking", dot: "#f59e0b" },
// //                 { label: "Inventory Value", value: `Rs.${(inventoryValue/1000).toFixed(1)}K`, sub: "Est. total value", dot: "#3b82f6" },
// //               ].map(s => (
// //                 <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid #eeebe4", boxShadow: "0 2px 8px rgba(0,0,0,.04)", position: "relative" }}>
// //                   <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
// //                     <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
// //                     <div style={{ fontSize: 11, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".07em" }}>{s.label}</div>
// //                   </div>
// //                   <div style={{ fontSize: 32, fontWeight: 800, color: "#1c2b22", fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
// //                   <div style={{ fontSize: 12, color: "#9b9590" }}>{s.sub}</div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Filters row */}
// //             <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
// //               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
// //                 {FILTERS.map(f => (
// //                   <button key={f} onClick={() => setFilter(f)} className="filter-chip"
// //                     style={{ padding: "7px 16px", borderRadius: 99, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .18s", background: filter === f ? "#1a3a2a" : "#fff", color: filter === f ? "#fff" : "#6b8070", borderColor: filter === f ? "#1a3a2a" : "#e0ddd6" }}>
// //                     {f}
// //                   </button>
// //                 ))}
// //               </div>
// //               <div style={{ fontSize: 13, color: "#9b9590", fontWeight: 500 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
// //             </div>

// //             {/* Product grid */}
// //             {filtered.length === 0 ? (
// //               <div className="fade-up" style={{ textAlign: "center", padding: "80px 20px" }}>
// //                 <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#f4f0e8,#eef5ec)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
// //                   <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={30} style={{ color: "#9b9590" }} />
// //                 </div>
// //                 <div style={{ fontSize: 18, fontWeight: 700, color: "#1c2b22", marginBottom: 8 }}>No products found</div>
// //                 <div style={{ fontSize: 14, color: "#9b9590", marginBottom: 24 }}>Add your first crop to start selling</div>
// //                 <button onClick={() => { setShowAdd(true); setForm(blankForm); }} className="action-btn"
// //                   style={{ padding: "11px 24px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
// //                   + Add Product
// //                 </button>
// //               </div>
// //             ) : (
// //               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
// //                 {filtered.map((p, i) => (
// //                   <div key={p._id} className="prod-card fade-up"
// //                     style={{ background: "#fff", borderRadius: 18, border: "1px solid #eeebe4", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.05)", transition: "all .22s", animationDelay: `${i * 0.04}s` }}>
// //                     {/* Image */}
// //                     <div style={{ height: 160, background: "linear-gradient(135deg,#e8f5e9,#f4f0e8)", position: "relative", overflow: "hidden" }}>
// //                       {p.imageUrl ? (
// //                         <img src={p.imageUrl} alt={p.cropName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
// //                       ) : (
// //                         <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
// //                           <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={36} style={{ color: "#9b9590" }} />
// //                         </div>
// //                       )}
// //                       {/* Status dot */}
// //                       <div style={{ position: "absolute", top: 10, right: 10 }}>
// //                         <StatusBadge s={p.status} />
// //                       </div>
// //                     </div>
// //                     {/* Info */}
// //                     <div style={{ padding: "16px 18px" }}>
// //                       <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22", marginBottom: 2 }}>{p.cropName}</div>
// //                       <div style={{ fontSize: 12, color: "#9b9590", marginBottom: 14 }}>{p.category}</div>
// //                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f7f4", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
// //                         <div>
// //                           <div style={{ fontSize: 10, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".06em" }}>Price</div>
// //                           <div style={{ fontSize: 17, fontWeight: 800, color: "#1a3a2a" }}>Rs.{p.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 500, color: "#9b9590" }}>/{p.unit || "kg"}</span></div>
// //                         </div>
// //                         <div style={{ textAlign: "right" }}>
// //                           <div style={{ fontSize: 10, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".06em" }}>Stock</div>
// //                           <div style={{ fontSize: 17, fontWeight: 800, color: p.stock === 0 ? "#ef4444" : "#1a3a2a" }}>{p.stock}<span style={{ fontSize: 11, fontWeight: 500, color: "#9b9590" }}>{p.unit || "kg"}</span></div>
// //                         </div>
// //                       </div>
// //                       {p.createdAt && <div style={{ fontSize: 11, color: "#b0ada8", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
// //                         <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={12} />
// //                         {new Date(p.createdAt).toLocaleDateString()}
// //                       </div>}
// //                       <div style={{ display: "flex", gap: 8 }}>
// //                         <button onClick={() => { setShowEdit(p); setShowAdd(true); setForm({ cropName: p.cropName, category: p.category, price: String(p.price), stock: String(p.stock), description: p.description || "", unit: p.unit || "kg", imageUrl: p.imageUrl || "" }); }} className="action-btn"
// //                           style={{ flex: 1, padding: "8px", background: "#f4f0e8", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#1a3a2a", cursor: "pointer" }}>
// //                           Edit
// //                         </button>
// //                         <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="action-btn"
// //                           style={{ flex: 1, padding: "8px", background: "#fff0f0", border: "1px solid #fcd0d0", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#c0392b", cursor: "pointer" }}>
// //                           {deleting === p._id ? "…" : "Delete"}
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </main>
// //       </div>

// //       {/* ══ ADD / EDIT MODAL ══ */}
// //       {showAdd && (
// //         <div onClick={e => { if (e.target === e.currentTarget) { setShowAdd(false); setShowEdit(null); } }}
// //           style={{ position: "fixed", inset: 0, background: "rgba(10,20,14,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
// //           <div className="slide-in" style={{ background: "#fff", borderRadius: 24, padding: "36px", width: "100%", maxWidth: 520, boxShadow: "0 32px 80px rgba(0,0,0,.25)", maxHeight: "90vh", overflowY: "auto" }}>
// //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
// //               <div>
// //                 <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a3a2a", fontFamily: "'Playfair Display',serif" }}>{showEdit ? "Edit Product" : "Add New Product"}</h2>
// //                 <p style={{ fontSize: 13, color: "#9b9590", marginTop: 4 }}>{showEdit ? "Update your listing details" : "List a new crop for sale"}</p>
// //               </div>
// //               <button onClick={() => { setShowAdd(false); setShowEdit(null); }}
// //                 style={{ background: "#f4f0e8", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b8070" }}>
// //                 <Icon d="M6 18L18 6M6 6l12 12" size={16} />
// //               </button>
// //             </div>
// //             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
// //               {[
// //                 { label: "Crop Name *", key: "cropName", placeholder: "e.g. Tomato, Carrot…", type: "text" },
// //                 { label: "Price (Rs.) *", key: "price", placeholder: "e.g. 450", type: "number" },
// //                 { label: "Stock *", key: "stock", placeholder: "e.g. 100", type: "number" },
// //                 { label: "Description", key: "description", placeholder: "Describe your crop…", type: "textarea" },
// //               ].map(f => (
// //                 <div key={f.key}>
// //                   <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>{f.label}</label>
// //                   {f.type === "textarea" ? (
// //                     <textarea value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={3}
// //                       style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4", resize: "vertical" }} />
// //                   ) : (
// //                     <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
// //                       style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }} />
// //                   )}
// //                 </div>
// //               ))}
// //               {/* Image upload */}
// //               <div>
// //                 <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Product Photo</label>
// //                 {/* Preview */}
// //                 {form.imageUrl && (
// //                   <div style={{ position: "relative", marginBottom: 10, borderRadius: 10, overflow: "hidden", border: "1.5px solid #e0ddd6", height: 140 }}>
// //                     <img src={form.imageUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
// //                     <button
// //                       onClick={() => { setForm(prev => ({ ...prev, imageUrl: "" })); if (fileRef.current) fileRef.current.value = ""; }}
// //                       style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.6)", border: "none", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
// //                       <Icon d="M6 18L18 6M6 6l12 12" size={13} />
// //                     </button>
// //                   </div>
// //                 )}
// //                 {/* Drop zone */}
// //                 <div
// //                   onClick={() => fileRef.current?.click()}
// //                   style={{ border: "2px dashed #d0ddd6", borderRadius: 11, padding: "20px", textAlign: "center", cursor: "pointer", background: "#fafaf8", transition: "all .2s" }}
// //                   onMouseEnter={e => { e.currentTarget.style.borderColor = "#6aaa78"; e.currentTarget.style.background = "#f0faf2"; }}
// //                   onMouseLeave={e => { e.currentTarget.style.borderColor = "#d0ddd6"; e.currentTarget.style.background = "#fafaf8"; }}
// //                   onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#6aaa78"; e.currentTarget.style.background = "#f0faf2"; }}
// //                   onDragLeave={e => { e.currentTarget.style.borderColor = "#d0ddd6"; e.currentTarget.style.background = "#fafaf8"; }}
// //                   onDrop={e => {
// //                     e.preventDefault();
// //                     e.currentTarget.style.borderColor = "#d0ddd6";
// //                     e.currentTarget.style.background = "#fafaf8";
// //                     const file = e.dataTransfer.files[0];
// //                     if (file) {
// //                       if (file.size > 5 * 1024 * 1024) { showToast("File too large. Max 5MB."); return; }
// //                       const reader = new FileReader();
// //                       reader.onload = ev => setForm(prev => ({ ...prev, imageUrl: ev.target?.result as string }));
// //                       reader.readAsDataURL(file);
// //                     }
// //                   }}>
// //                   <div style={{ width: 38, height: 38, borderRadius: 10, background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
// //                     <Icon d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" size={18} style={{ color: "#6aaa78" }} />
// //                   </div>
// //                   <div style={{ fontSize: 13, fontWeight: 600, color: "#1c2b22", marginBottom: 2 }}>
// //                     {form.imageUrl ? "Change Photo" : "Upload Crop Photo"}
// //                   </div>
// //                   <div style={{ fontSize: 11, color: "#9b9590" }}>Click or drag & drop · JPG, PNG, WebP · Max 5MB</div>
// //                 </div>
// //                 <input
// //                   ref={fileRef}
// //                   type="file"
// //                   accept="image/*"
// //                   style={{ display: "none" }}
// //                   onChange={e => {
// //                     const file = e.target.files?.[0];
// //                     if (!file) return;
// //                     if (file.size > 5 * 1024 * 1024) { showToast("File too large. Max 5MB."); return; }
// //                     const reader = new FileReader();
// //                     reader.onload = ev => setForm(prev => ({ ...prev, imageUrl: ev.target?.result as string }));
// //                     reader.readAsDataURL(file);
// //                   }}
// //                 />
// //               </div>

// //               {/* Category + Unit row */}
// //               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
// //                 <div>
// //                   <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Category</label>
// //                   <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
// //                     style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }}>
// //                     {["Vegetables","Fruits","Grains","Herbs","Other"].map(c => <option key={c}>{c}</option>)}
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Unit</label>
// //                   <select value={form.unit} onChange={e => setForm(prev => ({ ...prev, unit: e.target.value }))}
// //                     style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }}>
// //                     {["kg","g","litre","bunch","piece"].map(u => <option key={u}>{u}</option>)}
// //                   </select>
// //                 </div>
// //               </div>
// //               <button onClick={handleSave} disabled={saving || !form.cropName || !form.price || !form.stock} className="action-btn"
// //                 style={{ padding: "13px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1, marginTop: 4 }}>
// //                 {saving ? "Saving…" : showEdit ? "Update Product" : "Add Product"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Toast */}
// //       {toast && (
// //         <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, background: "#1a3a2a", color: "#fff", padding: "13px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.2)", zIndex: 300 }}>
// //           {toast}
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { productAPI, profileAPI } from "@/lib/axios-proxy";
// import api from "@/lib/axios-proxy";

// interface User    { _id: string; name: string; email: string; role: string; }
// interface Profile { farmName: string; district: string; }
// interface Product {
//   _id: string; cropName: string; category: string; price: number;
//   stock: number; status: string; imageUrl?: string; createdAt?: string;
//   description?: string; unit?: string;
// }

// const NAV = [
//   { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
//   { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
//   { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
//   { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
//   { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
//   { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
// ];

// const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Herbs", "Other"];
// const FILTERS    = ["All", "Active", "Out of Stock", "Inactive"];

// const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
//     strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
//     <path d={d} />
//   </svg>
// );

// const StatusBadge = ({ s }: { s: string }) => {
//   const map: Record<string, [string, string]> = {
//     Active:   ["#dcfce7","#16a34a"], active: ["#dcfce7","#16a34a"],
//     approved: ["#dcfce7","#16a34a"], Inactive: ["#fee2e2","#dc2626"],
//     "Out of Stock": ["#fef9c3","#a16207"],
//   };
//   const [bg, col] = map[s] ?? ["#f3f4f6","#6b7280"];
//   return (
//     <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: bg, color: col }}>
//       {s === "approved" ? "Active" : s}
//     </span>
//   );
// };

// export default function ProductsPage() {
//   const router = useRouter();

//   const [user,          setUser]          = useState<User | null>(null);
//   const [profile,       setProfile]       = useState<Profile | null>(null);
//   const [sub,           setSub]           = useState<any>(null);
//   const [products,      setProducts]      = useState<Product[]>([]);
//   const [loading,       setLoading]       = useState(true);
//   const [sideCollapsed, setSideCollapsed] = useState(false);
//   const [search,        setSearch]        = useState("");
//   const [filter,        setFilter]        = useState("All");
//   const [catFilter,     setCatFilter]     = useState("All");
//   const [showAdd,       setShowAdd]       = useState(false);
//   const [showEdit,      setShowEdit]      = useState<Product | null>(null);
//   const [saving,        setSaving]        = useState(false);
//   const [deleting,      setDeleting]      = useState<string | null>(null);
//   const [toast,         setToast]         = useState("");

//   const blankForm = { cropName: "", category: "Vegetables", price: "", stock: "", description: "", unit: "kg" };
//   const [form,      setForm]      = useState(blankForm);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imgPreview,setImgPreview]= useState<string>("");
//   const fileRef = useRef<HTMLInputElement>(null);

//   const SBW = sideCollapsed ? 68 : 220;

//   const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
//   const getInitial = () => (user?.name || "F")[0].toUpperCase();

//   useEffect(() => {
//     const stored = localStorage.getItem("agriai_user");
//     const token  = localStorage.getItem("agriai_token");
//     if (!stored || !token) { router.push("/"); return; }
//     const u = JSON.parse(stored);
//     setUser(u);
//     loadData(u);
//   }, []);

//   const loadData = async (u: User) => {
//     try {
//       const [profR, prodR, subR] = await Promise.allSettled([
//         profileAPI.getMe(),
//         productAPI.getMyProducts(),
//         api.get("/subscriptions/my"),
//       ]);
//       if (profR.status === "fulfilled") setProfile({ farmName: profR.value.data.farmName || "", district: profR.value.data.district || "" });
//       if (prodR.status === "fulfilled") {
//         const raw = prodR.value.data?.products || prodR.value.data || [];
//         setProducts(Array.isArray(raw) ? raw : []);
//       }
//       if (subR.status === "fulfilled") setSub(subR.value.data);
//     } catch { }
//     setLoading(false);
//   };

//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

//   const resetModal = () => {
//     setShowAdd(false); setShowEdit(null);
//     setForm(blankForm); setImageFile(null); setImgPreview("");
//     if (fileRef.current) fileRef.current.value = "";
//   };

//   const handleFile = (file: File) => {
//     if (file.size > 5 * 1024 * 1024) { showToast("File too large. Max 5MB."); return; }
//     setImageFile(file);
//     const reader = new FileReader();
//     reader.onload = e => setImgPreview(e.target?.result as string);
//     reader.readAsDataURL(file);
//   };

//   const handleSave = async () => {
//     if (!form.cropName || !form.price || !form.stock) return;
//     setSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append("cropName",    form.cropName);
//       fd.append("category",    form.category);
//       fd.append("price",       String(Number(form.price)));
//       fd.append("stock",       String(Number(form.stock)));
//       fd.append("description", form.description);
//       fd.append("unit",        form.unit);
//       if (imageFile) fd.append("image", imageFile);

//       if (showEdit) {
//         const { data } = await productAPI.update(showEdit._id, fd);
//         setProducts(prev => prev.map(p => p._id === showEdit._id ? { ...p, ...(data.product || data) } : p));
//         showToast("Product updated!");
//       } else {
//         const { data } = await productAPI.create(fd);
//         setProducts(prev => [...prev, data.product || data]);
//         showToast("Product added!");
//       }
//       resetModal();
//     } catch (e: any) { showToast(e.response?.data?.message || "Error saving product"); }
//     setSaving(false);
//   };

//   const handleDelete = async (id: string) => {
//     setDeleting(id);
//     try {
//       await productAPI.delete(id);
//       setProducts(prev => prev.filter(p => p._id !== id));
//       showToast("Product deleted.");
//     } catch { showToast("Failed to delete."); }
//     setDeleting(null);
//   };

//   const handleLogout = () => { localStorage.removeItem("agriai_token"); localStorage.removeItem("agriai_user"); router.push("/"); };

//   const filtered = products.filter(p => {
//     const matchSearch = p.cropName.toLowerCase().includes(search.toLowerCase());
//     const matchFilter = filter === "All" || (filter === "Active" && (p.status === "Active" || p.status === "approved")) || (filter === "Out of Stock" && p.stock === 0) || p.status === filter;
//     const matchCat    = catFilter === "All" || p.category === catFilter;
//     return matchSearch && matchFilter && matchCat;
//   });

//   const totalProducts   = products.length;
//   const activeListings  = products.filter(p => p.status === "Active" || p.status === "approved").length;
//   const outOfStock      = products.filter(p => p.stock === 0).length;
//   const inventoryValue  = products.reduce((a, p) => a + p.price * p.stock, 0);

//   if (loading) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0e8", fontFamily: "'DM Sans',sans-serif" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#6aaa78)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
//           <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={22} style={{ color: "#fff" }} />
//         </div>
//         <div style={{ color: "#2d5a3d", fontWeight: 700, fontSize: 15 }}>Loading products…</div>
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
//         .prod-card:hover{box-shadow:0 12px 36px rgba(26,58,42,.13)!important;transform:translateY(-3px);}
//         .filter-chip:hover{background:#e8f5e9!important;color:#1a3a2a!important;}
//         input:focus,textarea:focus,select:focus{outline:none;border-color:#6aaa78!important;box-shadow:0 0 0 3px rgba(106,170,120,.15);}
//         @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
//         .fade-up{animation:fadeUp .32s ease both;}
//         @keyframes slideIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
//         .slide-in{animation:slideIn .28s ease both;}
//         @keyframes toastIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
//         .toast{animation:toastIn .25s ease both;}
//       `}</style>

//       <div style={{ display: "flex", minHeight: "100vh", background: "#f2efe8" }}>

//         {/* ══ SIDEBAR ══ */}
//         <aside style={{
//           width: SBW, background: "linear-gradient(185deg,#1a3a2a 0%,#122a1c 60%,#0a1e11 100%)",
//           display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 60,
//           transition: "width .28s cubic-bezier(.4,0,.2,1)", overflow: "hidden",
//           boxShadow: "4px 0 24px rgba(0,0,0,.18)",
//         }}>
//           {/* Logo */}
//           <div style={{ padding: sideCollapsed ? "18px 0" : "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: sideCollapsed ? "center" : "space-between" }}>
//             {!sideCollapsed && (
//               <div onClick={() => router.push("/")} style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff", cursor: "pointer", letterSpacing: "-0.5px" }}
//                 onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
//                 Ag<span style={{ color: "#6aaa78" }}>real</span>
//               </div>
//             )}
//             <button onClick={() => setSideCollapsed(p => !p)} className="action-btn"
//               style={{ background: "rgba(255,255,255,.07)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,.5)", flexShrink: 0 }}>
//               <Icon d={sideCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} size={14} />
//             </button>
//           </div>
//           {/* User card */}
//           <div style={{ padding: sideCollapsed ? "14px 0" : "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: sideCollapsed ? "flex" : "block", justifyContent: "center" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start" }}>
//               <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,.15)", flexShrink: 0 }}>
//                 {getInitial()}
//               </div>
//               {!sideCollapsed && (
//                 <div>
//                   <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
//                   <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>{profile?.farmName || "My Farm"}</div>
//                   {sub?.isActive && (
//                     <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(106,170,120,.25)", borderRadius: 99, padding: "1px 8px", fontSize: 9, color: "#6aaa78", fontWeight: 700 }}>
//                       <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6aaa78", display: "inline-block" }} />
//                       {sub.status === "trialing" ? "Free Trial" : "Active"}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Nav */}
//           <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
//             {!sideCollapsed && <div style={{ padding: "10px 16px 4px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em" }}>Navigation</div>}
//             {NAV.map(item => {
//               const active = item.href === "/dashboard/farmer/products";
//               return (
//                 <button key={item.href} onClick={() => router.push(item.href)} className="nav-btn"
//                   title={sideCollapsed ? item.label : undefined}
//                   style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sideCollapsed ? "12px 0" : "9px 16px", justifyContent: sideCollapsed ? "center" : "flex-start", border: "none", background: active ? "rgba(106,170,120,.18)" : "transparent", borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent", color: active ? "#fff" : "rgba(255,255,255,.5)", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all .18s", textAlign: "left" }}>
//                   <Icon d={item.icon} size={17} style={{ flexShrink: 0 }} />
//                   {!sideCollapsed && <span>{item.label}</span>}
//                   {!sideCollapsed && active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6aaa78" }} />}
//                 </button>
//               );
//             })}
//           </nav>
//           {/* Bottom */}
//           <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.07)" }}>
//             <button onClick={() => router.push("/dashboard/farmer/settings")} className="nav-btn" title={sideCollapsed ? "Settings" : undefined}
//               style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "rgba(255,255,255,.4)", fontSize: 13, cursor: "pointer", transition: "all .18s" }}>
//               <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={16} style={{ flexShrink: 0 }} />
//               {!sideCollapsed && <span>Settings</span>}
//             </button>
//             <button onClick={handleLogout} className="nav-btn" title={sideCollapsed ? "Sign Out" : undefined}
//               style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "#f87171", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all .18s" }}>
//               <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={16} style={{ flexShrink: 0 }} />
//               {!sideCollapsed && <span>Sign Out</span>}
//             </button>
//           </div>
//         </aside>

//         {/* ══ MAIN ══ */}
//         <main style={{ marginLeft: SBW, flex: 1, display: "flex", flexDirection: "column", transition: "margin-left .28s cubic-bezier(.4,0,.2,1)", minHeight: "100vh" }}>

//           {/* Topbar */}
//           <header style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,.07)", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//               <button onClick={() => router.back()} className="action-btn"
//                 style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "#f4f0e8", border: "1px solid #e0ddd6", cursor: "pointer", flexShrink: 0 }}>
//                 <Icon d="M15 19l-7-7 7-7" size={16} style={{ color: "#1a3a2a" }} />
//               </button>
//               <div>
//                 <div style={{ fontSize: 19, fontWeight: 700, color: "#1c2b22", letterSpacing: "-.3px" }}>
//                   {greeting()}, <span style={{ color: "#2d5a3d" }}>{user?.name?.split(" ")[0]}</span>
//                 </div>
//                 <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>
//                   {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
//                   {profile?.district ? ` · ${profile.district}` : ""}
//                 </div>
//               </div>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               {/* Search */}
//               <div style={{ position: "relative" }}>
//                 <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9b9590" }} />
//                 <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crops…"
//                   style={{ paddingLeft: 34, paddingRight: 14, height: 36, border: "1px solid #e0ddd6", borderRadius: 9, background: "#f9f7f4", fontSize: 13, color: "#1a3a2a", width: 200, fontFamily: "'DM Sans',sans-serif" }} />
//               </div>
//               {/* Add Product */}
//               <button onClick={() => { setShowAdd(true); setShowEdit(null); setForm(blankForm); setImageFile(null); setImgPreview(""); if (fileRef.current) fileRef.current.value = ""; }} className="action-btn"
//                 style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(26,58,42,.25)" }}>
//                 <Icon d="M12 4v16m8-8H4" size={15} />
//                 Add Product
//               </button>
//               {/* Avatar */}
//               <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(45,90,61,.3)", cursor: "pointer" }}>
//                 {getInitial()}
//               </div>
//             </div>
//           </header>

//           {/* Body */}
//           <div style={{ padding: "28px 32px", flex: 1 }}>

//             {/* Stat cards */}
//             <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
//               {[
//                 { label: "Total Products", value: totalProducts, sub: "Listed crops", dot: "#6aaa78" },
//                 { label: "Active Listings", value: activeListings, sub: "Selling now", dot: "#6aaa78" },
//                 { label: "Out of Stock",    value: outOfStock,    sub: "Need restocking", dot: "#f59e0b" },
//                 { label: "Inventory Value", value: `Rs.${(inventoryValue/1000).toFixed(1)}K`, sub: "Est. total value", dot: "#3b82f6" },
//               ].map(s => (
//                 <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid #eeebe4", boxShadow: "0 2px 8px rgba(0,0,0,.04)", position: "relative" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
//                     <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
//                     <div style={{ fontSize: 11, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".07em" }}>{s.label}</div>
//                   </div>
//                   <div style={{ fontSize: 32, fontWeight: 800, color: "#1c2b22", fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
//                   <div style={{ fontSize: 12, color: "#9b9590" }}>{s.sub}</div>
//                 </div>
//               ))}
//             </div>

//             {/* Filters row */}
//             <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                 {FILTERS.map(f => (
//                   <button key={f} onClick={() => setFilter(f)} className="filter-chip"
//                     style={{ padding: "7px 16px", borderRadius: 99, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .18s", background: filter === f ? "#1a3a2a" : "#fff", color: filter === f ? "#fff" : "#6b8070", borderColor: filter === f ? "#1a3a2a" : "#e0ddd6" }}>
//                     {f}
//                   </button>
//                 ))}
//               </div>
//               <div style={{ fontSize: 13, color: "#9b9590", fontWeight: 500 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
//             </div>

//             {/* Product grid */}
//             {filtered.length === 0 ? (
//               <div className="fade-up" style={{ textAlign: "center", padding: "80px 20px" }}>
//                 <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#f4f0e8,#eef5ec)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
//                   <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={30} style={{ color: "#9b9590" }} />
//                 </div>
//                 <div style={{ fontSize: 18, fontWeight: 700, color: "#1c2b22", marginBottom: 8 }}>No products found</div>
//                 <div style={{ fontSize: 14, color: "#9b9590", marginBottom: 24 }}>Add your first crop to start selling</div>
//                 <button onClick={() => { setShowAdd(true); setShowEdit(null); setForm(blankForm); setImageFile(null); setImgPreview(""); }} className="action-btn"
//                   style={{ padding: "11px 24px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
//                   + Add Product
//                 </button>
//               </div>
//             ) : (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
//                 {filtered.map((p, i) => (
//                   <div key={p._id} className="prod-card fade-up"
//                     style={{ background: "#fff", borderRadius: 18, border: "1px solid #eeebe4", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.05)", transition: "all .22s", animationDelay: `${i * 0.04}s` }}>
//                     {/* Image */}
//                     <div style={{ height: 160, background: "linear-gradient(135deg,#e8f5e9,#f4f0e8)", position: "relative", overflow: "hidden" }}>
//                       {p.imageUrl ? (
//                         <img src={`http://localhost:5000${p.imageUrl}`} alt={p.cropName} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
//                       ) : (
//                         <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                           <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={36} style={{ color: "#9b9590" }} />
//                         </div>
//                       )}
//                       {/* Status dot */}
//                       <div style={{ position: "absolute", top: 10, right: 10 }}>
//                         <StatusBadge s={p.status} />
//                       </div>
//                     </div>
//                     {/* Info */}
//                     <div style={{ padding: "16px 18px" }}>
//                       <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22", marginBottom: 2 }}>{p.cropName}</div>
//                       <div style={{ fontSize: 12, color: "#9b9590", marginBottom: 14 }}>{p.category}</div>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f7f4", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
//                         <div>
//                           <div style={{ fontSize: 10, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".06em" }}>Price</div>
//                           <div style={{ fontSize: 17, fontWeight: 800, color: "#1a3a2a" }}>Rs.{p.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 500, color: "#9b9590" }}>/{p.unit || "kg"}</span></div>
//                         </div>
//                         <div style={{ textAlign: "right" }}>
//                           <div style={{ fontSize: 10, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".06em" }}>Stock</div>
//                           <div style={{ fontSize: 17, fontWeight: 800, color: p.stock === 0 ? "#ef4444" : "#1a3a2a" }}>{p.stock}<span style={{ fontSize: 11, fontWeight: 500, color: "#9b9590" }}>{p.unit || "kg"}</span></div>
//                         </div>
//                       </div>
//                       {p.createdAt && <div style={{ fontSize: 11, color: "#b0ada8", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
//                         <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={12} />
//                         {new Date(p.createdAt).toLocaleDateString()}
//                       </div>}
//                       <div style={{ display: "flex", gap: 8 }}>
//                         <button onClick={() => {
//                             setShowEdit(p); setShowAdd(true);
//                             setForm({ cropName: p.cropName, category: p.category, price: String(p.price), stock: String(p.stock), description: p.description || "", unit: p.unit || "kg" });
//                             setImageFile(null);
//                             setImgPreview(p.imageUrl ? `http://localhost:5000${p.imageUrl}` : "");
//                             if (fileRef.current) fileRef.current.value = "";
//                           }} className="action-btn"
//                           style={{ flex: 1, padding: "8px", background: "#f4f0e8", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#1a3a2a", cursor: "pointer" }}>
//                           Edit
//                         </button>
//                         <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="action-btn"
//                           style={{ flex: 1, padding: "8px", background: "#fff0f0", border: "1px solid #fcd0d0", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#c0392b", cursor: "pointer" }}>
//                           {deleting === p._id ? "…" : "Delete"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* ══ ADD / EDIT MODAL ══ */}
//       {showAdd && (
//         <div onClick={e => { if (e.target === e.currentTarget) resetModal(); }}
//           style={{ position: "fixed", inset: 0, background: "rgba(10,20,14,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
//           <div className="slide-in" style={{ background: "#fff", borderRadius: 24, padding: "36px", width: "100%", maxWidth: 520, boxShadow: "0 32px 80px rgba(0,0,0,.25)", maxHeight: "90vh", overflowY: "auto" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
//               <div>
//                 <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a3a2a", fontFamily: "'Playfair Display',serif" }}>{showEdit ? "Edit Product" : "Add New Product"}</h2>
//                 <p style={{ fontSize: 13, color: "#9b9590", marginTop: 4 }}>{showEdit ? "Update your listing details" : "List a new crop for sale"}</p>
//               </div>
//               <button onClick={resetModal}
//                 style={{ background: "#f4f0e8", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b8070" }}>
//                 <Icon d="M6 18L18 6M6 6l12 12" size={16} />
//               </button>
//             </div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               {[
//                 { label: "Crop Name *", key: "cropName", placeholder: "e.g. Tomato, Carrot…", type: "text" },
//                 { label: "Price (Rs.) *", key: "price", placeholder: "e.g. 450", type: "number" },
//                 { label: "Stock *", key: "stock", placeholder: "e.g. 100", type: "number" },
//                 { label: "Description", key: "description", placeholder: "Describe your crop…", type: "textarea" },
//               ].map(f => (
//                 <div key={f.key}>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>{f.label}</label>
//                   {f.type === "textarea" ? (
//                     <textarea value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={3}
//                       style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4", resize: "vertical" }} />
//                   ) : (
//                     <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
//                       style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }} />
//                   )}
//                 </div>
//               ))}
//               {/* Image upload */}
//               <div>
//                 <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>
//                   Product Photo <span style={{ fontSize: 10, fontWeight: 500, color: "#b0ada8", textTransform: "none" }}>(optional)</span>
//                 </label>

//                 {/* Preview */}
//                 {imgPreview && (
//                   <div style={{ position: "relative", marginBottom: 10, borderRadius: 12, overflow: "hidden", border: "1.5px solid #e0ddd6", height: 150 }}>
//                     <img src={imgPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                     <button
//                       onClick={() => { setImageFile(null); setImgPreview(""); if (fileRef.current) fileRef.current.value = ""; }}
//                       style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.65)", border: "none", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
//                       <Icon d="M6 18L18 6M6 6l12 12" size={13} />
//                     </button>
//                     <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,.55)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#fff", fontWeight: 600 }}>
//                       {imageFile ? imageFile.name : "Current photo"}
//                     </div>
//                   </div>
//                 )}

//                 {/* Drop zone */}
//                 <div
//                   onClick={() => fileRef.current?.click()}
//                   style={{ border: "2px dashed #d0ddd6", borderRadius: 12, padding: "22px 16px", textAlign: "center", cursor: "pointer", background: "#fafaf8", transition: "all .2s" }}
//                   onMouseEnter={e => { e.currentTarget.style.borderColor = "#6aaa78"; e.currentTarget.style.background = "#f0faf2"; }}
//                   onMouseLeave={e => { e.currentTarget.style.borderColor = "#d0ddd6"; e.currentTarget.style.background = "#fafaf8"; }}
//                   onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#6aaa78"; e.currentTarget.style.background = "#f0faf2"; }}
//                   onDragLeave={e => { e.currentTarget.style.borderColor = "#d0ddd6"; e.currentTarget.style.background = "#fafaf8"; }}
//                   onDrop={e => {
//                     e.preventDefault();
//                     e.currentTarget.style.borderColor = "#d0ddd6";
//                     e.currentTarget.style.background = "#fafaf8";
//                     const file = e.dataTransfer.files[0];
//                     if (file) handleFile(file);
//                   }}>
//                   <div style={{ width: 40, height: 40, borderRadius: 11, background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
//                     <Icon d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" size={20} style={{ color: "#6aaa78" }} />
//                   </div>
//                   <div style={{ fontSize: 14, fontWeight: 600, color: "#1c2b22", marginBottom: 3 }}>
//                     {imgPreview ? "Replace Photo" : "Upload Crop Photo"}
//                   </div>
//                   <div style={{ fontSize: 12, color: "#9b9590" }}>Click or drag & drop · JPG, PNG, WebP · Max 5MB</div>
//                 </div>

//                 {/* Hidden file input */}
//                 <input
//                   ref={fileRef}
//                   type="file"
//                   accept="image/jpeg,image/png,image/webp"
//                   style={{ display: "none" }}
//                   onChange={e => { const file = e.target.files?.[0]; if (file) handleFile(file); }}
//                 />
//               </div>

//               {/* Category + Unit row */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                 <div>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Category</label>
//                   <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
//                     style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }}>
//                     {["Vegetables","Fruits","Grains","Herbs","Other"].map(c => <option key={c}>{c}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Unit</label>
//                   <select value={form.unit} onChange={e => setForm(prev => ({ ...prev, unit: e.target.value }))}
//                     style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }}>
//                     {["kg","g","litre","bunch","piece"].map(u => <option key={u}>{u}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <button onClick={handleSave} disabled={saving || !form.cropName || !form.price || !form.stock} className="action-btn"
//                 style={{ padding: "13px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1, marginTop: 4 }}>
//                 {saving ? "Saving…" : showEdit ? "Update Product" : "Add Product"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast */}
//       {toast && (
//         <div className="toast" style={{ position: "fixed", bottom: 28, right: 28, background: "#1a3a2a", color: "#fff", padding: "13px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.2)", zIndex: 300 }}>
//           {toast}
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { productAPI, profileAPI } from "@/lib/axios-proxy";
import api from "@/lib/axios-proxy";

interface User    { _id: string; name: string; email: string; role: string; }
interface Profile { farmName: string; district: string; }
interface Product {
  _id: string; cropName: string; category: string; price: number;
  stock: number; status: string; imageUrl?: string; createdAt?: string;
  description?: string; unit?: string; type?: string; harvestDate?: string;
  organicTreatmentHistory?: string;
}

const NAV = [
  { label: "Overview",    href: "/dashboard/farmer",             icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" },
  { label: "My Products", href: "/dashboard/farmer/products",    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Orders",      href: "/dashboard/farmer/orders",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Weather",     href: "/dashboard/farmer/weather",     icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Earnings",    href: "/dashboard/farmer/earnings",    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

const CATEGORIES = ["All", "Vegetable", "Leafy Green", "Root", "Fruit", "Grain", "Herb", "Other"];
const FILTERS    = ["All", "Active", "Out of Stock", "Inactive"];

const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d={d} />
  </svg>
);

const StatusBadge = ({ s }: { s: string }) => {
  const map: Record<string, [string, string]> = {
    Active:   ["#dcfce7","#16a34a"], active: ["#dcfce7","#16a34a"],
    approved: ["#dcfce7","#16a34a"], Inactive: ["#fee2e2","#dc2626"],
    "Out of Stock": ["#fef9c3","#a16207"],
  };
  const [bg, col] = map[s] ?? ["#f3f4f6","#6b7280"];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: bg, color: col }}>
      {s === "approved" ? "Active" : s}
    </span>
  );
};

export default function ProductsPage() {
  const router = useRouter();

  const [user,          setUser]          = useState<User | null>(null);
  const [profile,       setProfile]       = useState<Profile | null>(null);
  const [sub,           setSub]           = useState<any>(null);
  const [products,      setProducts]      = useState<Product[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const [search,        setSearch]        = useState("");
  const [filter,        setFilter]        = useState("All");
  const [catFilter,     setCatFilter]     = useState("All");
  const [showAdd,       setShowAdd]       = useState(false);
  const [showEdit,      setShowEdit]      = useState<Product | null>(null);
  const [saving,        setSaving]        = useState(false);
  const [deleting,      setDeleting]      = useState<string | null>(null);
  const [toast,         setToast]         = useState("");

  const blankForm = { cropName: "", category: "Vegetable", price: "", stock: "", description: "", unit: "kg", type: "Organic", harvestDate: new Date().toISOString().split("T")[0] };
  const [form,      setForm]      = useState(blankForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgPreview,setImgPreview]= useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const SBW = sideCollapsed ? 68 : 220;

  const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const getInitial = () => (user?.name || "F")[0].toUpperCase();

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    loadData(u);
  }, []);

  const loadData = async (u: User) => {
    try {
      const [profR, prodR, subR] = await Promise.allSettled([
        profileAPI.getMe(),
        productAPI.getMyProducts(),
        api.get("/subscriptions/my"),
      ]);
      if (profR.status === "fulfilled") setProfile({ farmName: profR.value.data.farmName || "", district: profR.value.data.district || "" });
      if (prodR.status === "fulfilled") {
        const raw = prodR.value.data?.products || prodR.value.data || [];
        setProducts(Array.isArray(raw) ? raw : []);
      }
      if (subR.status === "fulfilled") setSub(subR.value.data);
    } catch { }
    setLoading(false);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const resetModal = () => {
    setShowAdd(false); setShowEdit(null);
    setForm(blankForm); setImageFile(null); setImgPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { showToast("File too large. Max 5MB."); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setImgPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.cropName.trim()) { showToast("Please enter a crop name."); return; }
    if (!form.price || Number(form.price) <= 0) { showToast("Please enter a valid price."); return; }
    if (!form.stock || Number(form.stock) < 0) { showToast("Please enter a valid stock amount."); return; }
    if (!form.harvestDate) { showToast("Please select a harvest date."); return; }
    setSaving(true);
    try {
      if (imageFile) {
        // Use FormData when an image file is selected
        const fd = new FormData();
        fd.append("cropName",    form.cropName.trim());
        fd.append("category",    form.category);
        fd.append("type",        form.type);
        fd.append("price",       String(Number(form.price)));
        fd.append("stock",       String(Number(form.stock)));
        fd.append("harvestDate", form.harvestDate);
        fd.append("description", form.description.trim());
        fd.append("unit",        form.unit);
        fd.append("image",       imageFile);
        if (showEdit) {
          const { data } = await api.put(`/products/${showEdit._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
          setProducts(prev => prev.map(p => p._id === showEdit._id ? { ...p, ...(data.product || data) } : p));
          showToast("Product updated!");
        } else {
          const { data } = await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
          setProducts(prev => [...prev, data.product || data]);
          showToast("Product added!");
        }
      } else {
        // Use JSON when no new image file
        const payload = {
          cropName:    form.cropName.trim(),
          category:    form.category,
          type:        form.type,
          price:       Number(form.price),
          stock:       Number(form.stock),
          harvestDate: form.harvestDate,
          description: form.description.trim(),
          unit:        form.unit,
        };
        if (showEdit) {
          const { data } = await productAPI.update(showEdit._id, payload);
          setProducts(prev => prev.map(p => p._id === showEdit._id ? { ...p, ...(data.product || data) } : p));
          showToast("Product updated!");
        } else {
          const { data } = await productAPI.create(payload);
          setProducts(prev => [...prev, data.product || data]);
          showToast("Product added!");
        }
      }
      resetModal();
    } catch (e: any) {
      showToast(e.response?.data?.message || e.response?.data?.error || "Error saving product. Please try again.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await productAPI.remove(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      showToast("Product deleted.");
    } catch { showToast("Failed to delete."); }
    setDeleting(null);
  };

  const handleLogout = () => { localStorage.removeItem("agriai_token"); localStorage.removeItem("agriai_user"); router.push("/"); };

  const filtered = products.filter(p => {
    const matchSearch = p.cropName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (filter === "Active" && (p.status === "Active" || p.status === "approved")) || (filter === "Out of Stock" && p.stock === 0) || p.status === filter;
    const matchCat    = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchFilter && matchCat;
  });

  const totalProducts   = products.length;
  const activeListings  = products.filter(p => p.status === "Active" || p.status === "approved").length;
  const outOfStock      = products.filter(p => p.stock === 0).length;
  const inventoryValue  = products.reduce((a, p) => a + p.price * p.stock, 0);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f0e8", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#6aaa78)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={22} style={{ color: "#fff" }} />
        </div>
        <div style={{ color: "#2d5a3d", fontWeight: 700, fontSize: 15 }}>Loading products…</div>
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
        .prod-card:hover{box-shadow:0 12px 36px rgba(26,58,42,.13)!important;transform:translateY(-3px);}
        .filter-chip:hover{background:#e8f5e9!important;color:#1a3a2a!important;}
        input:focus,textarea:focus,select:focus{outline:none;border-color:#6aaa78!important;box-shadow:0 0 0 3px rgba(106,170,120,.15);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp .32s ease both;}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
        .slide-in{animation:slideIn .28s ease both;}
        @keyframes toastIn{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .toast{animation:toastIn .25s ease both;}
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#f2efe8" }}>

        {/* ══ SIDEBAR ══ */}
        <aside style={{
          width: SBW, background: "linear-gradient(185deg,#1a3a2a 0%,#122a1c 60%,#0a1e11 100%)",
          display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 60,
          transition: "width .28s cubic-bezier(.4,0,.2,1)", overflow: "hidden",
          boxShadow: "4px 0 24px rgba(0,0,0,.18)",
        }}>
          {/* Logo */}
          <div style={{ padding: sideCollapsed ? "18px 0" : "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: sideCollapsed ? "center" : "space-between" }}>
            {!sideCollapsed && (
              <div onClick={() => router.push("/")} style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff", cursor: "pointer", letterSpacing: "-0.5px" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Ag<span style={{ color: "#6aaa78" }}>real</span>
              </div>
            )}
            <button onClick={() => setSideCollapsed(p => !p)} className="action-btn"
              style={{ background: "rgba(255,255,255,.07)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,.5)", flexShrink: 0 }}>
              <Icon d={sideCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} size={14} />
            </button>
          </div>
          {/* User card */}
          <div style={{ padding: sideCollapsed ? "14px 0" : "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: sideCollapsed ? "flex" : "block", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,.15)", flexShrink: 0 }}>
                {getInitial()}
              </div>
              {!sideCollapsed && (
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
                  <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>{profile?.farmName || "My Farm"}</div>
                  {sub?.isActive && (
                    <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(106,170,120,.25)", borderRadius: 99, padding: "1px 8px", fontSize: 9, color: "#6aaa78", fontWeight: 700 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6aaa78", display: "inline-block" }} />
                      {sub.status === "trialing" ? "Free Trial" : "Active"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Nav */}
          <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
            {!sideCollapsed && <div style={{ padding: "10px 16px 4px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".1em" }}>Navigation</div>}
            {NAV.map(item => {
              const active = item.href === "/dashboard/farmer/products";
              return (
                <button key={item.href} onClick={() => router.push(item.href)} className="nav-btn"
                  title={sideCollapsed ? item.label : undefined}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sideCollapsed ? "12px 0" : "9px 16px", justifyContent: sideCollapsed ? "center" : "flex-start", border: "none", background: active ? "rgba(106,170,120,.18)" : "transparent", borderLeft: active ? "3px solid #6aaa78" : "3px solid transparent", color: active ? "#fff" : "rgba(255,255,255,.5)", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all .18s", textAlign: "left" }}>
                  <Icon d={item.icon} size={17} style={{ flexShrink: 0 }} />
                  {!sideCollapsed && <span>{item.label}</span>}
                  {!sideCollapsed && active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6aaa78" }} />}
                </button>
              );
            })}
          </nav>
          {/* Bottom */}
          <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.07)" }}>
            <button onClick={() => router.push("/dashboard/farmer/settings")} className="nav-btn" title={sideCollapsed ? "Settings" : undefined}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "rgba(255,255,255,.4)", fontSize: 13, cursor: "pointer", transition: "all .18s" }}>
              <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={16} style={{ flexShrink: 0 }} />
              {!sideCollapsed && <span>Settings</span>}
            </button>
            <button onClick={handleLogout} className="nav-btn" title={sideCollapsed ? "Sign Out" : undefined}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, justifyContent: sideCollapsed ? "center" : "flex-start", padding: sideCollapsed ? "11px 0" : "9px 16px", border: "none", background: "transparent", color: "#f87171", fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all .18s" }}>
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
              <button onClick={() => router.back()} className="action-btn"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, background: "#f4f0e8", border: "1px solid #e0ddd6", cursor: "pointer", flexShrink: 0 }}>
                <Icon d="M15 19l-7-7 7-7" size={16} style={{ color: "#1a3a2a" }} />
              </button>
              <div>
                <div style={{ fontSize: 19, fontWeight: 700, color: "#1c2b22", letterSpacing: "-.3px" }}>
                  {greeting()}, <span style={{ color: "#2d5a3d" }}>{user?.name?.split(" ")[0]}</span>
                </div>
                <div style={{ fontSize: 12, color: "#9b9590", marginTop: 2 }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  {profile?.district ? ` · ${profile.district}` : ""}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Search */}
              <div style={{ position: "relative" }}>
                <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={15} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9b9590" }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crops…"
                  style={{ paddingLeft: 34, paddingRight: 14, height: 36, border: "1px solid #e0ddd6", borderRadius: 9, background: "#f9f7f4", fontSize: 13, color: "#1a3a2a", width: 200, fontFamily: "'DM Sans',sans-serif" }} />
              </div>
              {/* Add Product */}
              <button onClick={() => { setShowAdd(true); setShowEdit(null); setForm(blankForm); setImageFile(null); setImgPreview(""); if (fileRef.current) fileRef.current.value = ""; }} className="action-btn"
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", border: "none", borderRadius: 99, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(26,58,42,.25)", whiteSpace: "nowrap", flexShrink: 0, width: "auto", height: "auto" }}>
                <Icon d="M12 4v16m8-8H4" size={15} />
                Add Product
              </button>
              {/* Avatar */}
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15, border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 2px 8px rgba(45,90,61,.3)", cursor: "pointer" }}>
                {getInitial()}
              </div>
            </div>
          </header>

          {/* Body */}
          <div style={{ padding: "28px 32px", flex: 1 }}>

            {/* Stat cards */}
            <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Products", value: totalProducts, sub: "Listed crops", dot: "#6aaa78" },
                { label: "Active Listings", value: activeListings, sub: "Selling now", dot: "#6aaa78" },
                { label: "Out of Stock",    value: outOfStock,    sub: "Need restocking", dot: "#f59e0b" },
                { label: "Inventory Value", value: `Rs.${(inventoryValue/1000).toFixed(1)}K`, sub: "Est. total value", dot: "#3b82f6" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 16, padding: "20px 22px", border: "1px solid #eeebe4", boxShadow: "0 2px 8px rgba(0,0,0,.04)", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".07em" }}>{s.label}</div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#1c2b22", fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#9b9590" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Filters row */}
            <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)} className="filter-chip"
                    style={{ padding: "7px 16px", borderRadius: 99, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .18s", background: filter === f ? "#1a3a2a" : "#fff", color: filter === f ? "#fff" : "#6b8070", borderColor: filter === f ? "#1a3a2a" : "#e0ddd6" }}>
                    {f}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "#9b9590", fontWeight: 500 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
            </div>

            {/* Product grid */}
            {filtered.length === 0 ? (
              <div className="fade-up" style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#f4f0e8,#eef5ec)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={30} style={{ color: "#9b9590" }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#1c2b22", marginBottom: 8 }}>No products found</div>
                <div style={{ fontSize: 14, color: "#9b9590", marginBottom: 24 }}>Add your first crop to start selling</div>
                <button onClick={() => { setShowAdd(true); setShowEdit(null); setForm(blankForm); setImageFile(null); setImgPreview(""); }} className="action-btn"
                  style={{ padding: "11px 24px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  + Add Product
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
                {filtered.map((p, i) => (
                  <div key={p._id} className="prod-card fade-up"
                    style={{ background: "#fff", borderRadius: 18, border: "1px solid #eeebe4", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.05)", transition: "all .22s", animationDelay: `${i * 0.04}s` }}>
                    {/* Image */}
                    <div style={{ height: 160, background: "linear-gradient(135deg,#e8f5e9,#f4f0e8)", position: "relative", overflow: "hidden" }}>
                      {p.imageUrl ? (
                        <img src={`http://localhost:5000${p.imageUrl}`} alt={p.cropName} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" size={36} style={{ color: "#9b9590" }} />
                        </div>
                      )}
                      {/* Status dot */}
                      <div style={{ position: "absolute", top: 10, right: 10 }}>
                        <StatusBadge s={p.status} />
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#1c2b22", marginBottom: 2 }}>{p.cropName}</div>
                      <div style={{ fontSize: 12, color: "#9b9590", marginBottom: 14 }}>{p.category}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9f7f4", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".06em" }}>Price</div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: "#1a3a2a" }}>Rs.{p.price.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 500, color: "#9b9590" }}>/{p.unit || "kg"}</span></div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: ".06em" }}>Stock</div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: p.stock === 0 ? "#ef4444" : "#1a3a2a" }}>{p.stock}<span style={{ fontSize: 11, fontWeight: 500, color: "#9b9590" }}>{p.unit || "kg"}</span></div>
                        </div>
                      </div>
                      {p.createdAt && <div style={{ fontSize: 11, color: "#b0ada8", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
                        <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={12} />
                        {new Date(p.createdAt).toLocaleDateString()}
                      </div>}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => {
                            setShowEdit(p); setShowAdd(true);
                            setForm({ cropName: p.cropName, category: p.category, price: String(p.price), stock: String(p.stock), description: p.description || "", unit: p.unit || "kg", type: p.type || "Organic", harvestDate: p.harvestDate ? new Date(p.harvestDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0] });
                            setImageFile(null);
                            setImgPreview(p.imageUrl ? `http://localhost:5000${p.imageUrl}` : "");
                            if (fileRef.current) fileRef.current.value = "";
                          }} className="action-btn"
                          style={{ flex: 1, padding: "8px", background: "#f4f0e8", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#1a3a2a", cursor: "pointer" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="action-btn"
                          style={{ flex: 1, padding: "8px", background: "#fff0f0", border: "1px solid #fcd0d0", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#c0392b", cursor: "pointer" }}>
                          {deleting === p._id ? "…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ══ ADD / EDIT MODAL ══ */}
      {showAdd && (
        <div onClick={e => { if (e.target === e.currentTarget) resetModal(); }}
          style={{ position: "fixed", inset: 0, background: "rgba(10,20,14,.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="slide-in" style={{ background: "#fff", borderRadius: 24, padding: "36px", width: "100%", maxWidth: 520, boxShadow: "0 32px 80px rgba(0,0,0,.25)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a3a2a", fontFamily: "'Playfair Display',serif" }}>{showEdit ? "Edit Product" : "Add New Product"}</h2>
                <p style={{ fontSize: 13, color: "#9b9590", marginTop: 4 }}>{showEdit ? "Update your listing details" : "List a new crop for sale"}</p>
              </div>
              <button onClick={resetModal}
                style={{ background: "#f4f0e8", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b8070" }}>
                <Icon d="M6 18L18 6M6 6l12 12" size={16} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Crop Name *", key: "cropName", placeholder: "e.g. Tomato, Carrot…", type: "text" },
                { label: "Price (Rs.) *", key: "price", placeholder: "e.g. 450", type: "number" },
                { label: "Stock *", key: "stock", placeholder: "e.g. 100", type: "number" },
                { label: "Description", key: "description", placeholder: "Describe your crop…", type: "textarea" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={3}
                      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4", resize: "vertical" }} />
                  ) : (
                    <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }} />
                  )}
                </div>
              ))}
              {/* Image upload */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>
                  Product Photo <span style={{ fontSize: 10, fontWeight: 500, color: "#b0ada8", textTransform: "none" }}>(optional)</span>
                </label>

                {/* Preview */}
                {imgPreview && (
                  <div style={{ position: "relative", marginBottom: 10, borderRadius: 12, overflow: "hidden", border: "1.5px solid #e0ddd6", height: 150 }}>
                    <img src={imgPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      onClick={() => { setImageFile(null); setImgPreview(""); if (fileRef.current) fileRef.current.value = ""; }}
                      style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.65)", border: "none", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                      <Icon d="M6 18L18 6M6 6l12 12" size={13} />
                    </button>
                    <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,.55)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#fff", fontWeight: 600 }}>
                      {imageFile ? imageFile.name : "Current photo"}
                    </div>
                  </div>
                )}

                {/* Drop zone */}
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ border: "2px dashed #d0ddd6", borderRadius: 12, padding: "22px 16px", textAlign: "center", cursor: "pointer", background: "#fafaf8", transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#6aaa78"; e.currentTarget.style.background = "#f0faf2"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#d0ddd6"; e.currentTarget.style.background = "#fafaf8"; }}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#6aaa78"; e.currentTarget.style.background = "#f0faf2"; }}
                  onDragLeave={e => { e.currentTarget.style.borderColor = "#d0ddd6"; e.currentTarget.style.background = "#fafaf8"; }}
                  onDrop={e => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = "#d0ddd6";
                    e.currentTarget.style.background = "#fafaf8";
                    const file = e.dataTransfer.files[0];
                    if (file) handleFile(file);
                  }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                    <Icon d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" size={20} style={{ color: "#6aaa78" }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1c2b22", marginBottom: 3 }}>
                    {imgPreview ? "Replace Photo" : "Upload Crop Photo"}
                  </div>
                  <div style={{ fontSize: 12, color: "#9b9590" }}>Click or drag & drop · JPG, PNG, WebP · Max 5MB</div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={e => { const file = e.target.files?.[0]; if (file) handleFile(file); }}
                />
              </div>

              {/* Category + Type row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Category *</label>
                  <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }}>
                    {["Vegetable","Leafy Green","Root","Fruit","Grain","Herb","Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Type *</label>
                  <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }}>
                    {["Organic","Conventional"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {/* Harvest Date + Unit row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Harvest Date *</label>
                  <input type="date" value={form.harvestDate} onChange={e => setForm(prev => ({ ...prev, harvestDate: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 6 }}>Unit</label>
                  <select value={form.unit} onChange={e => setForm(prev => ({ ...prev, unit: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e0ddd6", borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#1a3a2a", background: "#f9f7f4" }}>
                    {["kg","g","litre","bunch","piece"].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSave} disabled={saving} className="action-btn"
                style={{ padding: "13px", background: saving ? "#6b8070" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.75 : 1, marginTop: 4, transition: "all .2s" }}>
                {saving ? "Saving…" : showEdit ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast" style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: toast.startsWith("Product") || toast.startsWith("Marked") || toast.startsWith("Deleted") ? "#1a3a2a" : "#c0392b", color: "#fff", padding: "13px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.25)", zIndex: 400, whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}
    </>
  );
}