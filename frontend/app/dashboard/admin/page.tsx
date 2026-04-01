// // "use client";

// // import { useEffect, useState, useCallback } from "react";
// // import { useRouter } from "next/navigation";
// // import api from "@/lib/axios-proxy";

// // // ─── Types ────────────────────────────────────────────────────────────────────
// // interface User {
// //   _id: string;
// //   name: string;
// //   email: string;
// //   role: string;
// //   location?: string;
// //   createdAt: string;
// //   status?: string;
// // }

// // interface Subscription {
// //   _id: string;
// //   userId: { _id: string; name: string; email: string };
// //   status: "active" | "trialing" | "canceled" | "past_due";
// //   currentPeriodEnd: string;
// //   createdAt: string;
// // }

// // interface Order {
// //   _id: string;
// //   consumerId: { name: string; email: string };
// //   farmerId: { name: string };
// //   totalAmount: number;
// //   status: string;
// //   createdAt: string;
// //   items?: { productId: { name: string }; quantity: number; price: number }[];
// // }

// // interface Product {
// //   _id: string;
// //   name: string;
// //   farmerId: { name: string; email: string };
// //   price: number;
// //   category: string;
// //   isOrganic: boolean;
// //   status?: string;
// //   createdAt: string;
// // }

// // interface Disease {
// //   _id: string;
// //   userId: { name: string };
// //   cropName: string;
// //   diagnosis: string;
// //   confidence: number;
// //   createdAt: string;
// // }

// // interface WeatherAlert {
// //   _id: string;
// //   district: string;
// //   alertType: string;
// //   message: string;
// //   createdAt: string;
// // }

// // // ─── Sidebar nav items ────────────────────────────────────────────────────────
// // const NAV = [
// //   { id: "dashboard", label: "Dashboard", icon: "⊞", group: "OVERVIEW" },
// //   { id: "users",     label: "Users",     icon: "👥", group: "OVERVIEW" },
// //   { id: "marketplace", label: "Marketplace", icon: "🛒", group: "MANAGEMENT" },
// //   { id: "reports",   label: "Reports",   icon: "⚠️", group: "MANAGEMENT" },
// //   { id: "settings",  label: "Settings",  icon: "⚙️", group: "MANAGEMENT" },
// // ];

// // // ─── Safe array helper ────────────────────────────────────────────────────────
// // // eslint-disable-next-line @typescript-eslint/no-explicit-any
// // function toArray<T>(data: any, key?: string): T[] {
// //   if (Array.isArray(data)) return data as T[];
// //   if (key && data && Array.isArray(data[key])) return data[key] as T[];
// //   return [];
// // }

// // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // const fmt = (n: number) =>
// //   n >= 1_000_000
// //     ? `${(n / 1_000_000).toFixed(1)}M`
// //     : n >= 1_000
// //     ? `${(n / 1_000).toFixed(1)}K`
// //     : String(n);

// // const fmtRs = (n: number) =>
// //   n >= 1_000_000
// //     ? `Rs.${(n / 1_000_000).toFixed(1)}M`
// //     : `Rs.${(n / 1_000).toFixed(0)}K`;

// // const dateFmt = (d: string) => new Date(d).toLocaleDateString("en-LK");

// // const statusColor = (s: string) => {
// //   const map: Record<string, string> = {
// //     active:     "#6aaa78",
// //     trialing:   "#d4a853",
// //     canceled:   "#e05252",
// //     past_due:   "#e05252",
// //     pending:    "#d4a853",
// //     delivered:  "#6aaa78",
// //     cancelled:  "#e05252",
// //     processing: "#6aaa78",
// //     approved:   "#6aaa78",
// //     rejected:   "#e05252",
// //     flagged:    "#d4a853",
// //   };
// //   return map[s?.toLowerCase()] ?? "#888";
// // };

// // // ─── Stat Card ────────────────────────────────────────────────────────────────
// // function StatCard({
// //   icon, label, value, badge, badgeColor,
// // }: {
// //   icon: string; label: string; value: string | number; badge?: string; badgeColor?: string;
// // }) {
// //   return (
// //     <div style={{
// //       background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12,
// //       padding: "22px 24px", flex: 1, minWidth: 180, position: "relative", overflow: "hidden",
// //     }}>
// //       {badge && (
// //         <span style={{
// //           position: "absolute", top: 14, right: 14,
// //           background: badgeColor ?? "#6aaa7830",
// //           color: badgeColor ? "#fff" : "#6aaa78",
// //           fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
// //         }}>{badge}</span>
// //       )}
// //       <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
// //       <div style={{
// //         fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700,
// //         color: "#f4f0e8", letterSpacing: -1,
// //       }}>{value}</div>
// //       <div style={{ fontSize: 13, color: "#a8d5b5", marginTop: 4 }}>{label}</div>
// //     </div>
// //   );
// // }

// // // ─── Mini bar chart ───────────────────────────────────────────────────────────
// // function MiniBarChart({ data }: { data: { label: string; farmers: number; orders: number }[] }) {
// //   const maxVal = Math.max(...data.flatMap((d) => [d.farmers, d.orders]), 1);
// //   return (
// //     <div style={{ width: "100%", paddingTop: 8 }}>
// //       <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
// //         {data.map((d, i) => (
// //           <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
// //             <div style={{ display: "flex", gap: 2, alignItems: "flex-end", width: "100%" }}>
// //               <div style={{
// //                 flex: 1, height: `${(d.farmers / maxVal) * 100}px`,
// //                 background: "#6aaa78", borderRadius: "3px 3px 0 0", minHeight: 4, transition: "height 0.6s ease",
// //               }} />
// //               <div style={{
// //                 flex: 1, height: `${(d.orders / maxVal) * 100}px`,
// //                 background: "#d4a853", borderRadius: "3px 3px 0 0", minHeight: 4, transition: "height 0.6s ease",
// //               }} />
// //             </div>
// //             <div style={{ fontSize: 10, color: "#a8d5b5", textAlign: "center" }}>{d.label}</div>
// //           </div>
// //         ))}
// //       </div>
// //       <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
// //         <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a8d5b5" }}>
// //           <span style={{ width: 10, height: 10, background: "#6aaa78", borderRadius: 2, display: "inline-block" }} />Farmers
// //         </span>
// //         <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a8d5b5" }}>
// //           <span style={{ width: 10, height: 10, background: "#d4a853", borderRadius: 2, display: "inline-block" }} />Orders
// //         </span>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Donut chart ──────────────────────────────────────────────────────────────
// // function DonutChart({ farmers, consumers }: { farmers: number; consumers: number }) {
// //   const total = farmers + consumers || 1;
// //   const r = 50;
// //   const circ = 2 * Math.PI * r;
// //   const fArc = (farmers / total) * circ;
// //   return (
// //     <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
// //       <svg width={130} height={130} viewBox="0 0 130 130">
// //         <circle cx={65} cy={65} r={r} fill="none" stroke="#2d5a3d" strokeWidth={18} />
// //         <circle cx={65} cy={65} r={r} fill="none" stroke="#d4a853" strokeWidth={18}
// //           strokeDasharray={circ} strokeDashoffset={0} strokeLinecap="round"
// //           style={{ transform: "rotate(-90deg)", transformOrigin: "65px 65px" }} />
// //         <circle cx={65} cy={65} r={r} fill="none" stroke="#6aaa78" strokeWidth={18}
// //           strokeDasharray={`${fArc} ${circ - fArc}`} strokeDashoffset={0} strokeLinecap="round"
// //           style={{ transform: "rotate(-90deg)", transformOrigin: "65px 65px" }} />
// //         <text x={65} y={60} textAnchor="middle" fill="#f4f0e8" fontSize={16} fontWeight={700} fontFamily="Playfair Display, serif">
// //           {fmt(total)}
// //         </text>
// //         <text x={65} y={76} textAnchor="middle" fill="#a8d5b5" fontSize={10}>users</text>
// //       </svg>
// //       <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
// //         <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#f4f0e8" }}>
// //           <span style={{ width: 10, height: 10, background: "#6aaa78", borderRadius: 2, flexShrink: 0 }} />
// //           Farmers&nbsp;<span style={{ color: "#6aaa78", fontWeight: 700 }}>{fmt(farmers)}</span>
// //           &nbsp;<span style={{ color: "#a8d5b5" }}>({((farmers / total) * 100).toFixed(0)}%)</span>
// //         </div>
// //         <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#f4f0e8" }}>
// //           <span style={{ width: 10, height: 10, background: "#d4a853", borderRadius: 2, flexShrink: 0 }} />
// //           Consumers&nbsp;<span style={{ color: "#d4a853", fontWeight: 700 }}>{fmt(consumers)}</span>
// //           &nbsp;<span style={{ color: "#a8d5b5" }}>({((consumers / total) * 100).toFixed(0)}%)</span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
// // function DashboardView({
// //   users, subscriptions, orders, diseases, weatherAlerts,
// // }: {
// //   users: User[]; subscriptions: Subscription[]; orders: Order[];
// //   diseases: Disease[]; weatherAlerts: WeatherAlert[];
// // }) {
// //   const farmers   = users.filter((u) => u.role === "farmer");
// //   const consumers = users.filter((u) => u.role === "user" || u.role === "consumer");
// //   const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trialing");
// //   const totalRevenue = activeSubs.length * 9.99 * 375;

// //   const months = Array.from({ length: 6 }, (_, i) => {
// //     const d = new Date();
// //     d.setMonth(d.getMonth() - (5 - i));
// //     return { label: d.toLocaleDateString("en-LK", { month: "short" }), month: d.getMonth(), year: d.getFullYear() };
// //   });

// //   const chartData = months.map(({ label, month, year }) => ({
// //     label,
// //     farmers: farmers.filter((u) => { const d = new Date(u.createdAt); return d.getMonth() === month && d.getFullYear() === year; }).length,
// //     orders:  orders.filter((o)  => { const d = new Date(o.createdAt); return d.getMonth() === month && d.getFullYear() === year; }).length,
// //   }));

// //   const recentUsers = [...users].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);

// //   const topDiseases = diseases.reduce<Record<string, { count: number; crop: string }>>((acc, d) => {
// //     const key = d.diagnosis ?? "Unknown";
// //     if (!acc[key]) acc[key] = { count: 0, crop: d.cropName };
// //     acc[key].count++;
// //     return acc;
// //   }, {});

// //   const topDiseaseList = Object.entries(topDiseases).sort((a, b) => b[1].count - a[1].count).slice(0, 4);

// //   const DISEASE_ICONS: Record<string, string> = { blight: "🍅", mildew: "🌶️", rust: "🌽", spot: "🥬", default: "🌿" };
// //   const diseaseIcon = (name: string) => {
// //     const lower = name.toLowerCase();
// //     for (const [k, v] of Object.entries(DISEASE_ICONS)) { if (lower.includes(k)) return v; }
// //     return DISEASE_ICONS.default;
// //   };

// //   return (
// //     <div>
// //       <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
// //         <StatCard icon="👥" label="Total Registered Users" value={fmt(users.length)} badge="+8.2%" />
// //         <StatCard icon="🧑‍🌾" label="Active Farmers" value={fmt(farmers.length)} badge="+5.4%" />
// //         <StatCard icon="🔬" label="Disease Scans Today" value={fmt(diseases.length)} badge="+14%" />
// //         <StatCard icon="💰" label="Platform Revenue (Month)" value={fmtRs(totalRevenue)} badge="-2.1%" badgeColor="#e05252" />
// //       </div>

// //       <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}>
// //         <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
// //           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
// //             <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700 }}>User Registration &amp; Activity</div>
// //             <span style={{ color: "#6aaa78", fontSize: 13, cursor: "pointer" }}>View Report →</span>
// //           </div>
// //           <MiniBarChart data={chartData} />
// //         </div>

// //         <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
// //           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
// //             <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700 }}>System Alerts</div>
// //             <span style={{ color: "#6aaa78", fontSize: 13, cursor: "pointer" }}>All Alerts</span>
// //           </div>
// //           <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
// //             {weatherAlerts.slice(0, 3).map((a, i) => (
// //               <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
// //                 <span style={{
// //                   width: 8, height: 8, borderRadius: "50%",
// //                   background: i === 0 ? "#e05252" : i === 1 ? "#d4a853" : "#6aaa78",
// //                   marginTop: 5, flexShrink: 0,
// //                 }} />
// //                 <div>
// //                   <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>{a.alertType}</div>
// //                   <div style={{ fontSize: 12, color: "#a8d5b5", marginTop: 2 }}>{a.message?.slice(0, 60)}…</div>
// //                   <div style={{ fontSize: 11, color: "#6aaa78", marginTop: 2 }}>{dateFmt(a.createdAt)}</div>
// //                 </div>
// //               </div>
// //             ))}
// //             {weatherAlerts.length === 0 && <div style={{ fontSize: 13, color: "#a8d5b5" }}>No active alerts</div>}
// //             <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
// //               <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6aaa78", marginTop: 5, flexShrink: 0 }} />
// //               <div>
// //                 <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>System Health: All OK</div>
// //                 <div style={{ fontSize: 12, color: "#a8d5b5", marginTop: 2 }}>All microservices running normally</div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
// //         <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
// //           <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700, marginBottom: 16 }}>User Breakdown</div>
// //           <DonutChart farmers={farmers.length} consumers={consumers.length} />
// //         </div>

// //         <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
// //           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
// //             <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700 }}>Top Disease Reports</div>
// //             <span style={{ color: "#6aaa78", fontSize: 13, cursor: "pointer" }}>View All</span>
// //           </div>
// //           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
// //             {topDiseaseList.map(([name, info], i) => (
// //               <div key={i} style={{ background: "#162318", borderRadius: 8, padding: "12px 14px" }}>
// //                 <div style={{ fontSize: 22 }}>{diseaseIcon(name)}</div>
// //                 <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600, marginTop: 6 }}>{name}</div>
// //                 <div style={{ fontSize: 11, color: "#a8d5b5" }}>{info.crop}</div>
// //                 <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#6aaa78", fontWeight: 700, marginTop: 4 }}>{info.count}</div>
// //               </div>
// //             ))}
// //             {topDiseaseList.length === 0 && <div style={{ fontSize: 13, color: "#a8d5b5", gridColumn: "1/-1" }}>No disease reports yet</div>}
// //           </div>
// //         </div>

// //         <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
// //           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
// //             <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700 }}>Recent Registrations</div>
// //             <span style={{ color: "#6aaa78", fontSize: 13, cursor: "pointer" }}>Manage →</span>
// //           </div>
// //           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
// //             {recentUsers.map((u, i) => (
// //               <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
// //                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //                   <div style={{
// //                     width: 32, height: 32, borderRadius: "50%", background: "#2d5a3d",
// //                     display: "flex", alignItems: "center", justifyContent: "center",
// //                     fontSize: 13, fontWeight: 700, color: "#6aaa78", flexShrink: 0,
// //                   }}>{u.name?.[0]?.toUpperCase() ?? "?"}</div>
// //                   <div>
// //                     <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>{u.name}</div>
// //                     <div style={{ fontSize: 11, color: "#a8d5b5" }}>{u.role === "farmer" ? "Farmer" : "Consumer"} · {u.location ?? "—"}</div>
// //                   </div>
// //                 </div>
// //                 <span style={{
// //                   fontSize: 11, fontWeight: 700,
// //                   color: statusColor(u.status ?? "active"),
// //                   background: `${statusColor(u.status ?? "active")}22`,
// //                   padding: "3px 8px", borderRadius: 20,
// //                 }}>{u.status ?? "Active"}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── USERS VIEW ───────────────────────────────────────────────────────────────
// // function UsersView({ users, subscriptions }: { users: User[]; subscriptions: Subscription[] }) {
// //   const [search, setSearch]           = useState("");
// //   const [roleFilter, setRoleFilter]   = useState("All");
// //   const [statusFilter, setStatusFilter] = useState("All");

// //   const farmers   = users.filter((u) => u.role === "farmer");
// //   const consumers = users.filter((u) => u.role === "user" || u.role === "consumer");
// //   const admins    = users.filter((u) => u.role === "admin");
// //   const subMap    = Object.fromEntries(subscriptions.map((s) => [s.userId?._id, s.status]));

// //   const filtered = users.filter((u) => {
// //     const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
// //     const matchRole =
// //       roleFilter === "All" ||
// //       (roleFilter === "Farmer"   && u.role === "farmer") ||
// //       (roleFilter === "Consumer" && (u.role === "user" || u.role === "consumer")) ||
// //       (roleFilter === "Admin"    && u.role === "admin");
// //     const matchStatus = statusFilter === "All" || (u.status ?? "active").toLowerCase() === statusFilter.toLowerCase();
// //     return matchSearch && matchRole && matchStatus;
// //   });

// //   return (
// //     <div>
// //       <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
// //         <StatCard icon="👥" label="Total Users"  value={fmt(users.length)} />
// //         <StatCard icon="🧑‍🌾" label="Farmers"    value={fmt(farmers.length)} />
// //         <StatCard icon="🛍️" label="Consumers"  value={fmt(consumers.length)} />
// //         <StatCard icon="🔑" label="Admins"      value={fmt(admins.length)} />
// //       </div>

// //       <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
// //         <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
// //           <input value={search} onChange={(e) => setSearch(e.target.value)}
// //             placeholder="🔍  Search users by name or email..."
// //             style={{ flex: 1, minWidth: 220, background: "#162318", border: "1px solid #2d5a3d", borderRadius: 8, padding: "10px 14px", color: "#f4f0e8", fontSize: 13, outline: "none" }}
// //           />
// //           {["All", "Farmer", "Consumer", "Admin"].map((r) => (
// //             <button key={r} onClick={() => setRoleFilter(r)} style={{
// //               padding: "8px 14px", borderRadius: 8, border: "1px solid #2d5a3d",
// //               background: roleFilter === r ? "#6aaa78" : "#162318",
// //               color: roleFilter === r ? "#fff" : "#a8d5b5",
// //               fontSize: 12, cursor: "pointer", fontWeight: roleFilter === r ? 700 : 400,
// //             }}>{r}</button>
// //           ))}
// //           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{
// //             background: "#162318", border: "1px solid #2d5a3d", borderRadius: 8,
// //             padding: "8px 14px", color: "#a8d5b5", fontSize: 12, cursor: "pointer",
// //           }}>
// //             {["All", "Active", "Pending", "Suspended"].map((s) => <option key={s}>{s}</option>)}
// //           </select>
// //         </div>

// //         <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //           <thead>
// //             <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
// //               {["USER", "ROLE", "LOCATION", "JOINED", "SUBSCRIPTION", "STATUS", "ACTIONS"].map((h) => (
// //                 <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
// //               ))}
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filtered.slice(0, 20).map((u, i) => (
// //               <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
// //                 onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
// //                 onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
// //               >
// //                 <td style={{ padding: "12px" }}>
// //                   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //                     <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2d5a3d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#6aaa78", flexShrink: 0 }}>
// //                       {u.name?.[0]?.toUpperCase() ?? "?"}
// //                     </div>
// //                     <div>
// //                       <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>{u.name}</div>
// //                       <div style={{ fontSize: 11, color: "#a8d5b5" }}>{u.email}</div>
// //                     </div>
// //                   </div>
// //                 </td>
// //                 <td style={{ padding: "12px" }}>
// //                   <span style={{
// //                     fontSize: 11, fontWeight: 700, textTransform: "capitalize",
// //                     color: u.role === "farmer" ? "#6aaa78" : u.role === "admin" ? "#d4a853" : "#a8d5b5",
// //                     background: u.role === "farmer" ? "#6aaa7822" : u.role === "admin" ? "#d4a85322" : "#a8d5b522",
// //                     padding: "3px 8px", borderRadius: 20,
// //                   }}>{u.role === "user" ? "Consumer" : u.role}</span>
// //                 </td>
// //                 <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{u.location ?? "—"}</td>
// //                 <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{dateFmt(u.createdAt)}</td>
// //                 <td style={{ padding: "12px" }}>
// //                   {u.role === "farmer" ? (
// //                     <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: statusColor(subMap[u._id] ?? "canceled"), background: `${statusColor(subMap[u._id] ?? "canceled")}22`, padding: "3px 8px", borderRadius: 20 }}>
// //                       {subMap[u._id] ?? "None"}
// //                     </span>
// //                   ) : <span style={{ color: "#a8d5b5", fontSize: 12 }}>—</span>}
// //                 </td>
// //                 <td style={{ padding: "12px" }}>
// //                   <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: statusColor(u.status ?? "active"), background: `${statusColor(u.status ?? "active")}22`, padding: "3px 8px", borderRadius: 20 }}>
// //                     {u.status ?? "Active"}
// //                   </span>
// //                 </td>
// //                 <td style={{ padding: "12px" }}>
// //                   <button style={{ background: "none", border: "none", color: "#a8d5b5", cursor: "pointer", fontSize: 18, padding: "4px 6px" }}>···</button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //         {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#a8d5b5", fontSize: 14 }}>No users found</div>}
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── MARKETPLACE VIEW ─────────────────────────────────────────────────────────
// // function MarketplaceView({ products, orders }: { products: Product[]; orders: Order[] }) {
// //   const [orderStatusFilter, setOrderStatusFilter] = useState("All");
// //   const [tab, setTab] = useState<"products" | "orders">("products");

// //   const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
// //   const pending = products.filter((p) => !p.status || p.status === "pending").length;
// //   const organic = products.filter((p) => p.isOrganic).length;
// //   const filteredOrders = orderStatusFilter === "All" ? orders : orders.filter((o) => o.status?.toLowerCase() === orderStatusFilter.toLowerCase());

// //   return (
// //     <div>
// //       <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
// //         <StatCard icon="📦" label="Total Products"    value={fmt(products.length)} />
// //         <StatCard icon="🌿" label="Organic Listed"    value={fmt(organic)} badge={`${((organic / (products.length || 1)) * 100).toFixed(0)}% of total`} />
// //         <StatCard icon="⏳" label="Pending Approval"  value={fmt(pending)} badge="Needs review" badgeColor="#d4a853" />
// //         <StatCard icon="💰" label="Total Revenue"     value={fmtRs(totalRevenue)} />
// //       </div>

// //       <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
// //         {(["products", "orders"] as const).map((t) => (
// //           <button key={t} onClick={() => setTab(t)} style={{
// //             padding: "8px 20px", borderRadius: 8,
// //             border: `1px solid ${tab === t ? "#6aaa78" : "#2d5a3d"}`,
// //             background: tab === t ? "#6aaa7822" : "transparent",
// //             color: tab === t ? "#6aaa78" : "#a8d5b5",
// //             fontSize: 13, fontWeight: tab === t ? 700 : 400, cursor: "pointer", textTransform: "capitalize",
// //           }}>{t === "products" ? "Product Listings" : "Orders"}</button>
// //         ))}
// //         {tab === "orders" && (
// //           <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
// //             {["All", "Pending", "Processing", "Delivered", "Cancelled"].map((s) => (
// //               <button key={s} onClick={() => setOrderStatusFilter(s)} style={{
// //                 padding: "6px 12px", borderRadius: 8,
// //                 border: `1px solid ${orderStatusFilter === s ? "#6aaa78" : "#2d5a3d"}`,
// //                 background: orderStatusFilter === s ? "#6aaa78" : "transparent",
// //                 color: orderStatusFilter === s ? "#fff" : "#a8d5b5",
// //                 fontSize: 11, cursor: "pointer",
// //               }}>{s}</button>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
// //         {tab === "products" ? (
// //           <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //             <thead>
// //               <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
// //                 {["PRODUCT", "FARMER", "PRICE", "TYPE", "STATUS", "ACTIONS"].map((h) => (
// //                   <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {products.slice(0, 20).map((p, i) => (
// //                 <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
// //                   onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
// //                   onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
// //                 >
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>{p.name}</td>
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{p.farmerId?.name ?? "—"}</td>
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#d4a853" }}>Rs. {p.price}/kg</td>
// //                   <td style={{ padding: "12px" }}>
// //                     <span style={{ fontSize: 11, fontWeight: 700, color: p.isOrganic ? "#6aaa78" : "#a8d5b5", background: p.isOrganic ? "#6aaa7822" : "#a8d5b522", padding: "3px 8px", borderRadius: 20 }}>
// //                       {p.isOrganic ? "🌿 Organic" : "Conventional"}
// //                     </span>
// //                   </td>
// //                   <td style={{ padding: "12px" }}>
// //                     <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: statusColor(p.status ?? "active"), background: `${statusColor(p.status ?? "active")}22`, padding: "3px 8px", borderRadius: 20 }}>
// //                       {p.status ?? "Active"}
// //                     </span>
// //                   </td>
// //                   <td style={{ padding: "12px", display: "flex", gap: 8 }}>
// //                     <button style={{ background: "none", border: "none", color: "#6aaa78", cursor: "pointer", fontSize: 16 }} title="Approve">✓</button>
// //                     <button style={{ background: "none", border: "none", color: "#e05252", cursor: "pointer", fontSize: 16 }} title="Reject">⊘</button>
// //                     <button style={{ background: "none", border: "none", color: "#a8d5b5", cursor: "pointer", fontSize: 16 }} title="View">👁</button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         ) : (
// //           <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //             <thead>
// //               <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
// //                 {["ORDER ID", "CONSUMER", "FARMER", "AMOUNT", "STATUS", "DATE"].map((h) => (
// //                   <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filteredOrders.slice(0, 20).map((o, i) => (
// //                 <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
// //                   onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
// //                   onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
// //                 >
// //                   <td style={{ padding: "12px", fontSize: 12, color: "#a8d5b5", fontFamily: "monospace" }}>#{o._id.slice(-8)}</td>
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#f4f0e8" }}>{o.consumerId?.name ?? "—"}</td>
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{o.farmerId?.name ?? "—"}</td>
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#d4a853", fontWeight: 700 }}>Rs. {o.totalAmount?.toLocaleString()}</td>
// //                   <td style={{ padding: "12px" }}>
// //                     <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: statusColor(o.status), background: `${statusColor(o.status)}22`, padding: "3px 8px", borderRadius: 20 }}>
// //                       {o.status}
// //                     </span>
// //                   </td>
// //                   <td style={{ padding: "12px", fontSize: 12, color: "#a8d5b5" }}>{dateFmt(o.createdAt)}</td>
// //                 </tr>
// //               ))}
// //               {filteredOrders.length === 0 && (
// //                 <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#a8d5b5" }}>No orders found</td></tr>
// //               )}
// //             </tbody>
// //           </table>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── REPORTS VIEW ─────────────────────────────────────────────────────────────
// // function ReportsView({ diseases, weatherAlerts }: { diseases: Disease[]; weatherAlerts: WeatherAlert[] }) {
// //   const [tab, setTab] = useState<"reports" | "disease">("reports");

// //   const mockReports = [
// //     { type: "Product", desc: "Fake organic claim on listing #234",         reporter: "Amara S.", priority: "High",   status: "Open",          date: "2026-03-05" },
// //     { type: "User",    desc: "Suspicious bulk orders from new account",     reporter: "System",   priority: "Medium", status: "Investigating", date: "2026-03-04" },
// //     { type: "System",  desc: "API rate limit exceeded for weather service", reporter: "System",   priority: "Medium", status: "Resolved",      date: "2026-03-01" },
// //   ];

// //   return (
// //     <div>
// //       <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
// //         <StatCard icon="📋" label="Open Reports"    value={mockReports.filter((r) => r.status === "Open").length} />
// //         <StatCard icon="🔴" label="High Priority"   value={mockReports.filter((r) => r.priority === "High").length} />
// //         <StatCard icon="🔬" label="Disease Alerts"  value={diseases.length} />
// //         <StatCard icon="🌦️" label="Weather Alerts" value={weatherAlerts.length} />
// //       </div>

// //       <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
// //         {(["reports", "disease"] as const).map((t) => (
// //           <button key={t} onClick={() => setTab(t)} style={{
// //             padding: "8px 20px", borderRadius: 8,
// //             border: `1px solid ${tab === t ? "#6aaa78" : "#2d5a3d"}`,
// //             background: tab === t ? "#6aaa7822" : "transparent",
// //             color: tab === t ? "#6aaa78" : "#a8d5b5",
// //             fontSize: 13, fontWeight: tab === t ? 700 : 400, cursor: "pointer",
// //           }}>{t === "reports" ? "Reports" : "Disease Alerts"}</button>
// //         ))}
// //       </div>

// //       <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
// //         {tab === "reports" ? (
// //           <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //             <thead>
// //               <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
// //                 {["TYPE", "DESCRIPTION", "REPORTER", "PRIORITY", "STATUS", "ACTIONS"].map((h) => (
// //                   <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {mockReports.map((r, i) => (
// //                 <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
// //                   onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
// //                   onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
// //                 >
// //                   <td style={{ padding: "12px" }}>
// //                     <span style={{ background: "#2d5a3d", color: "#a8d5b5", padding: "3px 8px", borderRadius: 6, fontSize: 11 }}>{r.type}</span>
// //                   </td>
// //                   <td style={{ padding: "12px" }}>
// //                     <div style={{ fontSize: 13, color: "#f4f0e8" }}>{r.desc}</div>
// //                     <div style={{ fontSize: 11, color: "#a8d5b5" }}>{r.date}</div>
// //                   </td>
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{r.reporter}</td>
// //                   <td style={{ padding: "12px" }}>
// //                     <span style={{
// //                       fontSize: 11, fontWeight: 700,
// //                       color: r.priority === "High" ? "#e05252" : r.priority === "Medium" ? "#d4a853" : "#6aaa78",
// //                       background: r.priority === "High" ? "#e0525222" : r.priority === "Medium" ? "#d4a85322" : "#6aaa7822",
// //                       padding: "3px 8px", borderRadius: 20,
// //                     }}>{r.priority}</span>
// //                   </td>
// //                   <td style={{ padding: "12px" }}>
// //                     <span style={{ fontSize: 11, color: statusColor(r.status), background: `${statusColor(r.status)}22`, padding: "3px 8px", borderRadius: 20 }}>
// //                       {r.status}
// //                     </span>
// //                   </td>
// //                   <td style={{ padding: "12px" }}>
// //                     <button style={{ background: "none", border: "none", color: "#a8d5b5", cursor: "pointer", fontSize: 16 }}>👁</button>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         ) : (
// //           <table style={{ width: "100%", borderCollapse: "collapse" }}>
// //             <thead>
// //               <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
// //                 {["FARMER", "CROP", "DIAGNOSIS", "CONFIDENCE", "DATE"].map((h) => (
// //                   <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {diseases.slice(0, 20).map((d, i) => (
// //                 <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
// //                   onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
// //                   onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
// //                 >
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#f4f0e8" }}>{d.userId?.name ?? "—"}</td>
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{d.cropName}</td>
// //                   <td style={{ padding: "12px", fontSize: 13, color: "#f4f0e8" }}>{d.diagnosis}</td>
// //                   <td style={{ padding: "12px" }}>
// //                     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
// //                       <div style={{ flex: 1, height: 6, background: "#2d5a3d", borderRadius: 3, overflow: "hidden" }}>
// //                         <div style={{ width: `${d.confidence ?? 0}%`, height: "100%", background: d.confidence > 70 ? "#6aaa78" : "#d4a853", borderRadius: 3 }} />
// //                       </div>
// //                       <span style={{ fontSize: 12, color: "#a8d5b5", width: 36 }}>{d.confidence}%</span>
// //                     </div>
// //                   </td>
// //                   <td style={{ padding: "12px", fontSize: 12, color: "#a8d5b5" }}>{dateFmt(d.createdAt)}</td>
// //                 </tr>
// //               ))}
// //               {diseases.length === 0 && (
// //                 <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#a8d5b5" }}>No disease reports</td></tr>
// //               )}
// //             </tbody>
// //           </table>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
// // function SettingsView() {
// //   const [settings, setSettings] = useState({
// //     platformName: "AgriCare AI", supportEmail: "support@agriai.lk",
// //     maintenanceMode: false, diseaseAlerts: true, weatherAlerts: true,
// //     newUserNotifications: true, nutritionReminders: false,
// //   });

// //   const toggle = (key: keyof typeof settings) => setSettings((s) => ({ ...s, [key]: !s[key] }));

// //   const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
// //     <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: value ? "#6aaa78" : "#2d5a3d", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
// //       <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
// //     </div>
// //   );

// //   const Section = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
// //     <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24, marginBottom: 16 }}>
// //       <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700, marginBottom: 20 }}>{icon} {title}</div>
// //       {children}
// //     </div>
// //   );

// //   const Row = ({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) => (
// //     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1a2e1e" }}>
// //       <div>
// //         <div style={{ fontSize: 14, color: "#f4f0e8" }}>{label}</div>
// //         {sublabel && <div style={{ fontSize: 12, color: "#a8d5b5", marginTop: 2 }}>{sublabel}</div>}
// //       </div>
// //       {children}
// //     </div>
// //   );

// //   return (
// //     <div style={{ maxWidth: 780 }}>
// //       <Section icon="🌐" title="General">
// //         <Row label="Platform Name">
// //           <input value={settings.platformName} onChange={(e) => setSettings((s) => ({ ...s, platformName: e.target.value }))}
// //             style={{ background: "#162318", border: "1px solid #2d5a3d", borderRadius: 8, padding: "8px 14px", color: "#f4f0e8", fontSize: 13, width: 220, outline: "none" }} />
// //         </Row>
// //         <Row label="Support Email">
// //           <input value={settings.supportEmail} onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))}
// //             style={{ background: "#162318", border: "1px solid #2d5a3d", borderRadius: 8, padding: "8px 14px", color: "#f4f0e8", fontSize: 13, width: 220, outline: "none" }} />
// //         </Row>
// //         <Row label="Maintenance Mode" sublabel="Temporarily disable platform access">
// //           <Toggle value={settings.maintenanceMode} onToggle={() => toggle("maintenanceMode")} />
// //         </Row>
// //       </Section>

// //       <Section icon="🔔" title="Notifications">
// //         <Row label="Disease Outbreak Alerts" sublabel="Auto-notify farmers in affected regions">
// //           <Toggle value={settings.diseaseAlerts} onToggle={() => toggle("diseaseAlerts")} />
// //         </Row>
// //         <Row label="Weather Alerts" sublabel="Send location-based weather notifications">
// //           <Toggle value={settings.weatherAlerts} onToggle={() => toggle("weatherAlerts")} />
// //         </Row>
// //         <Row label="New User Notifications" sublabel="Alert admins on new farmer registrations">
// //           <Toggle value={settings.newUserNotifications} onToggle={() => toggle("newUserNotifications")} />
// //         </Row>
// //         <Row label="Consumer Nutrition Reminders" sublabel="Daily nudge for consumers to log intake">
// //           <Toggle value={settings.nutritionReminders} onToggle={() => toggle("nutritionReminders")} />
// //         </Row>
// //       </Section>

// //       <button style={{ background: "#6aaa78", border: "none", borderRadius: 10, padding: "12px 28px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
// //         Save Settings
// //       </button>
// //     </div>
// //   );
// // }

// // // ─── MAIN PAGE ────────────────────────────────────────────────────────────────
// // export default function AdminDashboardPage() {
// //   const router = useRouter();
// //   const [activeNav, setActiveNav]       = useState("dashboard");
// //   const [users, setUsers]               = useState<User[]>([]);
// //   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
// //   const [orders, setOrders]             = useState<Order[]>([]);
// //   const [products, setProducts]         = useState<Product[]>([]);
// //   const [diseases, setDiseases]         = useState<Disease[]>([]);
// //   const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
// //   const [loading, setLoading]           = useState(true);
// //   const [adminUser, setAdminUser]       = useState<{ name: string; email: string } | null>(null);
// //   const [globalSearch, setGlobalSearch] = useState("");

// //   useEffect(() => {
// //     const stored = localStorage.getItem("agriai_user");
// //     if (!stored) { router.replace("/"); return; }
// //     try {
// //       const parsed = JSON.parse(stored);
// //       if (parsed.role !== "admin") { router.replace("/"); return; }
// //       setAdminUser(parsed);
// //     } catch {
// //       router.replace("/");
// //       return;
// //     }
// //     fetchAll();
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const fetchAll = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const [u, s, o, p, d, w] = await Promise.allSettled([
// //         api.get("/auth/users"),
// //         api.get("/subscriptions/admin/all"),
// //         api.get("/orders/admin/all"),
// //         api.get("/products/admin/all"),
// //         api.get("/diseases/admin/all"),
// //         api.get("/weather/admin/all"),
// //       ]);

// //       // ── Safe array parsing — handles any response shape ──────────────────
// //       if (u.status === "fulfilled") setUsers(toArray<User>(u.value.data, "users"));
// //       if (s.status === "fulfilled") setSubscriptions(toArray<Subscription>(s.value.data, "subscriptions"));
// //       if (o.status === "fulfilled") setOrders(toArray<Order>(o.value.data, "orders"));
// //       if (p.status === "fulfilled") setProducts(toArray<Product>(p.value.data, "products"));
// //       if (d.status === "fulfilled") setDiseases(toArray<Disease>(d.value.data, "diseases"));
// //       if (w.status === "fulfilled") setWeatherAlerts(toArray<WeatherAlert>(w.value.data, "alerts"));
// //     } catch (err) {
// //       console.error("Admin fetch error", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   const VIEW_TITLES: Record<string, { icon: string; title: string; sub: string }> = {
// //     dashboard:   { icon: "⊞", title: "Admin Dashboard",         sub: "Platform overview and key metrics" },
// //     users:       { icon: "👥", title: "User Management",         sub: "View and manage all platform users" },
// //     marketplace: { icon: "🛒", title: "Marketplace Management",  sub: "Monitor product listings, compliance, and revenue" },
// //     reports:     { icon: "⚠️", title: "Reports & Alerts",        sub: "Review reports, disease outbreaks, and system alerts" },
// //     settings:    { icon: "⚙️", title: "Platform Settings",       sub: "Configure platform-wide settings and preferences" },
// //   };

// //   const currentView = VIEW_TITLES[activeNav];
// //   const today = new Date().toLocaleDateString("en-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
// //   const groups = ["OVERVIEW", "MANAGEMENT"];

// //   return (
// //     <>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
// //         * { box-sizing: border-box; margin: 0; padding: 0; }
// //         body { font-family: 'DM Sans', sans-serif; }
// //         ::-webkit-scrollbar { width: 6px; }
// //         ::-webkit-scrollbar-track { background: #1a3a2a; }
// //         ::-webkit-scrollbar-thumb { background: #2d5a3d; border-radius: 3px; }
// //       `}</style>

// //       <div style={{ display: "flex", height: "100vh", background: "#f4f0e8", overflow: "hidden" }}>

// //         {/* ── Sidebar ── */}
// //         <aside style={{ width: 185, minWidth: 185, background: "#1a3a2a", display: "flex", flexDirection: "column", padding: "20px 0", position: "relative", zIndex: 10 }}>
// //           <div style={{ padding: "0 20px 24px" }}>
// //             <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#f4f0e8", letterSpacing: -0.5 }}>
// //               <span style={{ color: "#6aaa78" }}>Ag</span>real
// //             </div>
// //             <div style={{ marginTop: 6, background: "#2d5a3d", color: "#6aaa78", fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: "2px 8px", borderRadius: 4, display: "inline-block" }}>ADMIN</div>
// //           </div>

// //           {groups.map((group) => {
// //             const items = NAV.filter((n) => n.group === group);
// //             return (
// //               <div key={group} style={{ marginBottom: 8 }}>
// //                 <div style={{ fontSize: 10, color: "#6aaa7888", fontWeight: 700, letterSpacing: 1.5, padding: "0 20px 6px" }}>{group}</div>
// //                 {items.map((item) => {
// //                   const isActive = activeNav === item.id;
// //                   const pendingCount = item.id === "reports" ? 5 : item.id === "users" ? 12 : 0;
// //                   return (
// //                     <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
// //                       width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 20px",
// //                       background: isActive ? "#2d5a3d" : "transparent", border: "none",
// //                       borderLeft: isActive ? "3px solid #6aaa78" : "3px solid transparent",
// //                       color: isActive ? "#f4f0e8" : "#a8d5b5",
// //                       fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: "pointer",
// //                       textAlign: "left", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
// //                     }}>
// //                       <span style={{ fontSize: 15 }}>{item.icon}</span>
// //                       <span style={{ flex: 1 }}>{item.label}</span>
// //                       {pendingCount > 0 && (
// //                         <span style={{ background: item.id === "reports" ? "#e05252" : "#6aaa78", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px" }}>
// //                           {pendingCount}
// //                         </span>
// //                       )}
// //                     </button>
// //                   );
// //                 })}
// //               </div>
// //             );
// //           })}

// //           <div style={{ flex: 1 }} />

// //           <div style={{ padding: "16px 20px", borderTop: "1px solid #2d5a3d" }}>
// //             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //               <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#6aaa78", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1a3a2a", flexShrink: 0 }}>
// //                 {adminUser?.name?.[0]?.toUpperCase() ?? "S"}
// //               </div>
// //               <div style={{ overflow: "hidden" }}>
// //                 <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminUser?.name ?? "Super Admin"}</div>
// //                 <div style={{ fontSize: 11, color: "#a8d5b5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminUser?.email ?? "admin@agriai.lk"}</div>
// //               </div>
// //             </div>
// //           </div>
// //         </aside>

// //         {/* ── Main ── */}
// //         <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
// //           <header style={{ background: "#1a3a2a", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #2d5a3d", flexShrink: 0 }}>
// //             <div>
// //               <div style={{ fontSize: 15, fontWeight: 700, color: "#f4f0e8" }}>Admin Dashboard</div>
// //               <div style={{ fontSize: 11, color: "#a8d5b5" }}>{today} · <span style={{ color: "#6aaa78" }}>All systems operational</span></div>
// //             </div>
// //             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
// //               <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#2d5a3d", borderRadius: 8, padding: "7px 14px", border: "1px solid #3d7a52" }}>
// //                 <span style={{ color: "#6aaa78", fontSize: 13 }}>🔍</span>
// //                 <input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Search users, orders..."
// //                   style={{ background: "none", border: "none", outline: "none", color: "#f4f0e8", fontSize: 12, width: 180 }} />
// //               </div>
// //               <button style={{ background: "#2d5a3d", border: "1px solid #3d7a52", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#f4f0e8", fontSize: 16 }}>🔔</button>
// //               <button style={{ background: "#2d5a3d", border: "1px solid #3d7a52", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#f4f0e8", fontSize: 16 }}>⚙️</button>
// //               <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#6aaa78", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1a3a2a", cursor: "pointer" }}>
// //                 {adminUser?.name?.[0]?.toUpperCase() ?? "A"}
// //               </div>
// //             </div>
// //           </header>

// //           <main style={{ flex: 1, overflow: "auto", padding: 28, background: "#162318" }}>
// //             <div style={{ marginBottom: 24 }}>
// //               <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "#f4f0e8", display: "flex", alignItems: "center", gap: 12 }}>
// //                 <span style={{ fontSize: 28 }}>{currentView?.icon}</span>{currentView?.title}
// //               </h1>
// //               <p style={{ color: "#a8d5b5", fontSize: 13, marginTop: 4 }}>{currentView?.sub}</p>
// //             </div>

// //             {loading ? (
// //               <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 16 }}>
// //                 <div style={{ width: 40, height: 40, border: "3px solid #2d5a3d", borderTop: "3px solid #6aaa78", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
// //                 <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
// //                 <div style={{ color: "#a8d5b5", fontSize: 14 }}>Loading dashboard data…</div>
// //               </div>
// //             ) : (
// //               <>
// //                 {activeNav === "dashboard"   && <DashboardView users={users} subscriptions={subscriptions} orders={orders} diseases={diseases} weatherAlerts={weatherAlerts} />}
// //                 {activeNav === "users"       && <UsersView users={users} subscriptions={subscriptions} />}
// //                 {activeNav === "marketplace" && <MarketplaceView products={products} orders={orders} />}
// //                 {activeNav === "reports"     && <ReportsView diseases={diseases} weatherAlerts={weatherAlerts} />}
// //                 {activeNav === "settings"    && <SettingsView />}
// //               </>
// //             )}
// //           </main>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }
// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/lib/axios-proxy";

// // ─── Types ──────────────────────────────────────────────────────────────────
// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
//   createdAt: string;
//   isActive?: boolean;
// }
// interface Subscription {
//   _id: string;
//   userId: { _id: string; name: string; email: string } | string;
//   status: "active" | "trialing" | "canceled" | "past_due" | string;
//   currentPeriodEnd: string;
//   createdAt: string;
// }
// interface Order {
//   _id: string;
//   consumerId: { name: string; email: string } | string;
//   farmerId: { name: string } | string;
//   totalAmount: number;
//   status: string;
//   createdAt: string;
//   items?: { name: string; quantity: number }[];
// }
// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   farmerId: { name: string; email: string } | string;
//   category: string;
//   status?: "approved" | "pending" | "rejected" | string;
//   description?: string;
//   stock?: number;
//   createdAt: string;
//   imageUrl?: string;
// }
// interface Disease {
//   _id: string;
//   userId: { name: string } | string;
//   cropName: string;
//   diagnosis: string;
//   createdAt: string;
// }
// interface WeatherAlert {
//   _id: string;
//   district: string;
//   message: string;
//   severity: string;
//   createdAt: string;
// }

// type Section = "dashboard" | "users" | "marketplace" | "reports" | "settings";

// // ─── Helpers ────────────────────────────────────────────────────────────────
// const fmt = (n: number) =>
//   new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n);

// const fmtDate = (d: string) =>
//   new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

// const avatarColor = (name: string) => {
//   const colors = ["#2d5a3d", "#6aaa78", "#d4a853", "#1a3a2a", "#8a6a3a"];
//   return colors[name.charCodeAt(0) % colors.length];
// };

// const statusPill = (s: string) => {
//   const map: Record<string, { bg: string; color: string; label: string }> = {
//     active:    { bg: "rgba(106,170,120,0.15)", color: "#6aaa78",  label: "Active"    },
//     trialing:  { bg: "rgba(212,168,83,0.15)",  color: "#d4a853",  label: "Trialing"  },
//     canceled:  { bg: "rgba(200,80,80,0.15)",   color: "#e57373",  label: "Canceled"  },
//     past_due:  { bg: "rgba(200,80,80,0.15)",   color: "#e57373",  label: "Past Due"  },
//     pending:   { bg: "rgba(212,168,83,0.15)",  color: "#d4a853",  label: "Pending"   },
//     approved:  { bg: "rgba(106,170,120,0.15)", color: "#6aaa78",  label: "Approved"  },
//     rejected:  { bg: "rgba(200,80,80,0.15)",   color: "#e57373",  label: "Rejected"  },
//     delivered: { bg: "rgba(106,170,120,0.15)", color: "#6aaa78",  label: "Delivered" },
//     processing:{ bg: "rgba(212,168,83,0.15)",  color: "#d4a853",  label: "Processing"},
//     shipped:   { bg: "rgba(100,150,220,0.15)", color: "#7aabee",  label: "Shipped"   },
//     cancelled: { bg: "rgba(200,80,80,0.15)",   color: "#e57373",  label: "Cancelled" },
//   };
//   const d = map[s?.toLowerCase()] ?? { bg: "rgba(150,150,150,0.1)", color: "#aaa", label: s ?? "—" };
//   return (
//     <span style={{ background: d.bg, color: d.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.3 }}>
//       {d.label}
//     </span>
//   );
// };

// // ─── Stat Card ───────────────────────────────────────────────────────────────
// function StatCard({ label, value, sub, delta }: { label: string; value: string | number; sub?: string; delta?: number }) {
//   const positive = (delta ?? 0) >= 0;
//   return (
//     <div style={{ background: "#1e3d2e", borderRadius: 14, padding: "22px 24px", flex: 1, minWidth: 180, position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", top: 12, right: 14, fontSize: 11, fontWeight: 700,
//         color: positive ? "#6aaa78" : "#e57373",
//         background: positive ? "rgba(106,170,120,0.12)" : "rgba(229,115,115,0.12)",
//         padding: "2px 8px", borderRadius: 20 }}>
//         {delta !== undefined ? `${positive ? "+" : ""}${delta}%` : null}
//       </div>
//       <div style={{ fontSize: 28, fontWeight: 700, color: "#f4f0e8", fontFamily: "'Sora', sans-serif", marginBottom: 4 }}>{value}</div>
//       <div style={{ fontSize: 13, color: "#6aaa78", fontWeight: 600 }}>{label}</div>
//       {sub && <div style={{ fontSize: 11, color: "#7a9a87", marginTop: 4 }}>{sub}</div>}
//     </div>
//   );
// }

// // ─── Mini Bar Chart ──────────────────────────────────────────────────────────
// function MiniBarChart({ data }: { data: { label: string; farmers: number; orders: number }[] }) {
//   const max = Math.max(...data.map(d => Math.max(d.farmers, d.orders)), 1);
//   return (
//     <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
//       {data.map((d, i) => (
//         <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
//           <div style={{ display: "flex", alignItems: "flex-end", gap: 2, width: "100%" }}>
//             <div style={{ flex: 1, background: "#6aaa78", height: `${(d.farmers / max) * 100}px`, borderRadius: "3px 3px 0 0", minHeight: 3 }} />
//             <div style={{ flex: 1, background: "#d4a853", height: `${(d.orders / max) * 100}px`, borderRadius: "3px 3px 0 0", minHeight: 3 }} />
//           </div>
//           <span style={{ fontSize: 10, color: "#7a9a87", whiteSpace: "nowrap" }}>{d.label}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Donut Chart ─────────────────────────────────────────────────────────────
// function DonutChart({ farmers, consumers }: { farmers: number; consumers: number }) {
//   const total = farmers + consumers || 1;
//   const farmerPct = (farmers / total) * 100;
//   const r = 44, cx = 56, cy = 56;
//   const circ = 2 * Math.PI * r;
//   const farmerDash = (farmerPct / 100) * circ;
//   return (
//     <div style={{ position: "relative", width: 112, height: 112, flexShrink: 0 }}>
//       <svg width={112} height={112}>
//         <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a4a38" strokeWidth={14} />
//         <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d4a853" strokeWidth={14}
//           strokeDasharray={circ} strokeDashoffset={0} transform={`rotate(-90 ${cx} ${cy})`} />
//         <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6aaa78" strokeWidth={14}
//           strokeDasharray={`${farmerDash} ${circ - farmerDash}`}
//           strokeDashoffset={0} transform={`rotate(-90 ${cx} ${cy})`} />
//       </svg>
//       <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//         <span style={{ fontSize: 18, fontWeight: 700, color: "#f4f0e8", fontFamily: "'Sora', sans-serif" }}>{total}</span>
//         <span style={{ fontSize: 10, color: "#7a9a87" }}>users</span>
//       </div>
//     </div>
//   );
// }

// // ─── Modal ───────────────────────────────────────────────────────────────────
// function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
//       <div style={{ background: "#1a3a2a", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto", padding: 28, position: "relative" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
//           <h3 style={{ color: "#f4f0e8", fontSize: 18, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: 0 }}>{title}</h3>
//           <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#a8d5b5", cursor: "pointer", width: 32, height: 32, borderRadius: 8, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// // ─── Input ────────────────────────────────────────────────────────────────────
// function FormInput({ label, value, onChange, type = "text", placeholder }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) {
//   return (
//     <div style={{ marginBottom: 14 }}>
//       <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#a8d5b5", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
//       <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
//         style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(106,170,120,0.2)", borderRadius: 8, padding: "9px 12px", color: "#f4f0e8", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
//     </div>
//   );
// }

// // ─── Table wrapper ────────────────────────────────────────────────────────────
// function TableWrap({ children }: { children: React.ReactNode }) {
//   return (
//     <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(106,170,120,0.1)" }}>
//       <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//         {children}
//       </table>
//     </div>
//   );
// }
// const TH = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
//   <th style={{ padding: "11px 14px", textAlign: "left", color: "#6aaa78", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, background: "rgba(26,58,42,0.9)", borderBottom: "1px solid rgba(106,170,120,0.12)", whiteSpace: "nowrap", ...style }}>{children}</th>
// );
// const TD = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
//   <td style={{ padding: "11px 14px", color: "#d0e8d8", borderBottom: "1px solid rgba(106,170,120,0.07)", verticalAlign: "middle", ...style }}>{children}</td>
// );
// const TR = ({ children }: { children: React.ReactNode }) => (
//   <tr style={{ transition: "background 0.15s" }}
//     onMouseEnter={e => (e.currentTarget.style.background = "rgba(106,170,120,0.05)")}
//     onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
//     {children}
//   </tr>
// );

// // ─── Pagination ──────────────────────────────────────────────────────────────
// function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
//   const pages = Math.ceil(total / perPage);
//   if (pages <= 1) return null;
//   return (
//     <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", padding: "12px 0 4px" }}>
//       <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
//         style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(106,170,120,0.15)", color: "#a8d5b5", padding: "5px 12px", borderRadius: 7, cursor: page === 1 ? "not-allowed" : "pointer", fontSize: 12, opacity: page === 1 ? 0.4 : 1 }}>←</button>
//       {Array.from({ length: Math.min(5, pages) }, (_, i) => {
//         const p = page <= 3 ? i + 1 : page - 2 + i;
//         if (p < 1 || p > pages) return null;
//         return (
//           <button key={p} onClick={() => onChange(p)}
//             style={{ background: p === page ? "#6aaa78" : "rgba(255,255,255,0.06)", border: "1px solid rgba(106,170,120,0.15)", color: p === page ? "#1a3a2a" : "#a8d5b5", padding: "5px 11px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: p === page ? 700 : 400 }}>
//             {p}
//           </button>
//         );
//       })}
//       <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages}
//         style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(106,170,120,0.15)", color: "#a8d5b5", padding: "5px 12px", borderRadius: 7, cursor: page === pages ? "not-allowed" : "pointer", fontSize: 12, opacity: page === pages ? 0.4 : 1 }}>→</button>
//     </div>
//   );
// }

// // ─── Action Button ────────────────────────────────────────────────────────────
// const Btn = ({ children, onClick, variant = "primary", small }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "danger" | "ghost" | "amber"; small?: boolean }) => {
//   const styles: Record<string, React.CSSProperties> = {
//     primary: { background: "#6aaa78", color: "#1a3a2a" },
//     danger:  { background: "rgba(229,115,115,0.15)", color: "#e57373", border: "1px solid rgba(229,115,115,0.3)" },
//     ghost:   { background: "rgba(255,255,255,0.07)", color: "#a8d5b5", border: "1px solid rgba(106,170,120,0.2)" },
//     amber:   { background: "rgba(212,168,83,0.15)", color: "#d4a853", border: "1px solid rgba(212,168,83,0.3)" },
//   };
//   return (
//     <button onClick={onClick}
//       style={{ ...styles[variant], border: "none", borderRadius: 7, padding: small ? "4px 10px" : "7px 14px", fontSize: small ? 11 : 13, fontWeight: 600, cursor: "pointer", transition: "opacity 0.15s", fontFamily: "'DM Sans', sans-serif", ...(styles[variant] as object) }}
//       onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
//       onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
//       {children}
//     </button>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function AdminDashboard() {
//   const router = useRouter();
//   const [section, setSection] = useState<Section>("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // ── FIX 2: Client-only date to prevent SSR hydration mismatch ─────────────
//   const [dateString, setDateString] = useState("");
//   useEffect(() => {
//     setDateString(
//       new Date().toLocaleDateString("en-GB", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       })
//     );
//   }, []);

//   // data
//   const [users, setUsers]               = useState<User[]>([]);
//   const [subscriptions, setSubs]        = useState<Subscription[]>([]);
//   const [orders, setOrders]             = useState<Order[]>([]);
//   const [products, setProducts]         = useState<Product[]>([]);
//   const [diseases, setDiseases]         = useState<Disease[]>([]);
//   const [weatherAlerts, setWeather]     = useState<WeatherAlert[]>([]);
//   const [loading, setLoading]           = useState(true);
//   const [adminUser, setAdminUser]       = useState<User | null>(null);

//   // users section
//   const [userSearch, setUserSearch]     = useState("");
//   const [userRoleFilter, setUserRoleFilter] = useState("all");
//   const [userPage, setUserPage]         = useState(1);
//   const USER_PER_PAGE = 10;

//   // orders section
//   const [orderFilter, setOrderFilter]   = useState("all");
//   const [orderPage, setOrderPage]       = useState(1);
//   const ORDER_PER_PAGE = 10;

//   // marketplace CRUD
//   const [productFilter, setProductFilter] = useState("all");
//   const [prodPage, setProdPage]           = useState(1);
//   const PROD_PER_PAGE = 10;
//   const [prodModal, setProdModal]         = useState<"create" | "edit" | null>(null);
//   const [editProduct, setEditProduct]     = useState<Partial<Product>>({});
//   const [prodSaving, setProdSaving]       = useState(false);

//   // ── auth check ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     const raw = localStorage.getItem("agriai_user");
//     if (!raw) { router.push("/"); return; }
//     try {
//       const u = JSON.parse(raw);
//       if (u.role !== "admin") { router.push("/"); return; }
//       setAdminUser(u);
//     } catch { router.push("/"); }
//   }, [router]);

//   // ── fetch all data ───────────────────────────────────────────────────────
//   const fetchAll = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [u, s, o, p, d, w] = await Promise.allSettled([
//         api.get("/auth/users"),
//         api.get("/subscriptions/admin/all"),
//         api.get("/orders/admin/all"),
//         api.get("/products/admin/all"),
//         api.get("/diseases/admin/all"),
//         api.get("/weather/admin/all"),
//       ]);

//       // ── FIX 1: Robust array extraction for every endpoint ─────────────────
//       const toArray = <T,>(data: unknown, keys: string[]): T[] => {
//         if (Array.isArray(data)) return data as T[];
//         if (data && typeof data === "object") {
//           for (const key of keys) {
//             const val = (data as Record<string, unknown>)[key];
//             if (Array.isArray(val)) return val as T[];
//           }
//         }
//         return [];
//       };

//       if (u.status === "fulfilled") setUsers(toArray<User>(u.value.data, ["users"]));
//       if (s.status === "fulfilled") setSubs(toArray<Subscription>(s.value.data, ["subscriptions"]));
//       if (o.status === "fulfilled") setOrders(toArray<Order>(o.value.data, ["orders"]));
//       if (p.status === "fulfilled") setProducts(toArray<Product>(p.value.data, ["products"]));
//       if (d.status === "fulfilled") setDiseases(toArray<Disease>(d.value.data, ["diseases"]));
//       if (w.status === "fulfilled") setWeather(toArray<WeatherAlert>(w.value.data, ["alerts"]));
//     } finally { setLoading(false); }
//   }, []);

//   useEffect(() => { if (adminUser) fetchAll(); }, [adminUser, fetchAll]);

//   // ── derived stats ────────────────────────────────────────────────────────
//   const farmers    = users.filter(u => u.role === "farmer");
//   const consumers  = users.filter(u => u.role === "user" || u.role === "consumer");
//   // subscriptions is always an array now — .filter() is safe
//   const activeSubs = subscriptions.filter(s => s.status === "active" || s.status === "trialing");
//   const totalRevenueLKR = activeSubs.length * 2999;
//   const todayScans = diseases.filter(d => new Date(d.createdAt).toDateString() === new Date().toDateString()).length;

//   // ── chart data (last 6 months) ────────────────────────────────────────
//   const chartData = (() => {
//     const months: { label: string; farmers: number; orders: number }[] = [];
//     for (let i = 5; i >= 0; i--) {
//       const d = new Date(); d.setMonth(d.getMonth() - i);
//       const label = d.toLocaleString("en", { month: "short" });
//       const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
//       const f = farmers.filter(u => u.createdAt?.startsWith(ym)).length;
//       const o = orders.filter(x => x.createdAt?.startsWith(ym)).length;
//       months.push({ label, farmers: f, orders: o });
//     }
//     return months;
//   })();

//   // ── filtered users ───────────────────────────────────────────────────────
//   const filteredUsers = users.filter(u => {
//     const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
//     const matchSearch = !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase());
//     return matchRole && matchSearch;
//   });
//   const pagedUsers = filteredUsers.slice((userPage - 1) * USER_PER_PAGE, userPage * USER_PER_PAGE);

//   // ── filtered orders ──────────────────────────────────────────────────────
//   const filteredOrders = orderFilter === "all" ? orders : orders.filter(o => o.status === orderFilter);
//   const pagedOrders = filteredOrders.slice((orderPage - 1) * ORDER_PER_PAGE, orderPage * ORDER_PER_PAGE);

//   // ── filtered products ─────────────────────────────────────────────────────
//   const filteredProds = productFilter === "all" ? products : products.filter(p => (p.status ?? "pending") === productFilter);
//   const pagedProds = filteredProds.slice((prodPage - 1) * PROD_PER_PAGE, prodPage * PROD_PER_PAGE);

//   // ── product actions ───────────────────────────────────────────────────────
//   const handleProductStatus = async (id: string, status: string) => {
//     try { await api.patch(`/products/${id}/status`, { status }); await fetchAll(); } catch { /* ignore */ }
//   };
//   const handleProductDelete = async (id: string) => {
//     if (!confirm("Delete this product?")) return;
//     try { await api.delete(`/products/${id}`); await fetchAll(); } catch { /* ignore */ }
//   };
//   const openCreateProduct = () => {
//     setEditProduct({ name: "", price: 0, category: "", description: "", stock: 0 });
//     setProdModal("create");
//   };
//   const openEditProduct = (p: Product) => {
//     setEditProduct({ ...p });
//     setProdModal("edit");
//   };
//   const handleSaveProduct = async () => {
//     setProdSaving(true);
//     try {
//       if (prodModal === "create") {
//         await api.post("/products", editProduct);
//       } else {
//         await api.put(`/products/${editProduct._id}`, editProduct);
//       }
//       setProdModal(null);
//       await fetchAll();
//     } catch { /* ignore */ } finally { setProdSaving(false); }
//   };

//   // ── navbar name helper ────────────────────────────────────────────────────
//   const initials = (name?: string) => (name ?? "A").slice(0, 1).toUpperCase();

//   // ─── Styles ────────────────────────────────────────────────────────────────
//   const S = {
//     sidebar: {
//       width: 220,
//       background: "#0f2419",
//       height: "100vh",
//       position: "fixed" as const,
//       left: 0,
//       top: 0,
//       display: "flex",
//       flexDirection: "column" as const,
//       zIndex: 100,
//       borderRight: "1px solid rgba(106,170,120,0.12)",
//       transition: "transform 0.3s",
//     } as React.CSSProperties,
//     navItem: (active: boolean): React.CSSProperties => ({
//       display: "flex",
//       alignItems: "center",
//       gap: 10,
//       padding: "9px 16px",
//       borderRadius: 9,
//       margin: "2px 10px",
//       cursor: "pointer",
//       background: active ? "rgba(106,170,120,0.18)" : "transparent",
//       color: active ? "#6aaa78" : "#7a9a87",
//       fontSize: 13,
//       fontWeight: active ? 700 : 500,
//       transition: "all 0.15s",
//       userSelect: "none" as const,
//     }),
//     card: {
//       background: "#1a3a2a",
//       borderRadius: 14,
//       padding: "22px 24px",
//       border: "1px solid rgba(106,170,120,0.1)",
//     } as React.CSSProperties,
//   };

//   // ─── Sidebar items ─────────────────────────────────────────────────────────
//   const navItems: { id: Section; label: string; badge?: number }[] = [
//     { id: "dashboard",   label: "Dashboard"  },
//     { id: "users",       label: "Users",       badge: users.length     },
//     { id: "marketplace", label: "Marketplace"                          },
//     { id: "reports",     label: "Reports",     badge: weatherAlerts.length },
//     { id: "settings",    label: "Settings"                             },
//   ];

//   const renderSection = () => {
//     if (loading) return (
//       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
//         <div style={{ color: "#6aaa78", fontSize: 15 }}>Loading…</div>
//       </div>
//     );

//     // ──────────────────── DASHBOARD ─────────────────────────────────────────
//     if (section === "dashboard") return (
//       <div>
//         <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
//           <StatCard label="Total Users"         value={users.length}                                             delta={8}  />
//           <StatCard label="Active Farmers"      value={farmers.length}                                           delta={5}  />
//           <StatCard label="Disease Scans Today" value={todayScans}                                               delta={14} />
//           <StatCard label="Platform Revenue"    value={`Rs.${(totalRevenueLKR / 1000).toFixed(0)}K`}            delta={-2} />
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 24 }}>
//           <div style={S.card}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
//               <div>
//                 <h3 style={{ color: "#f4f0e8", fontSize: 16, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: 0 }}>User Registration & Activity</h3>
//                 <p style={{ color: "#7a9a87", fontSize: 12, margin: "3px 0 0" }}>Last 6 months</p>
//               </div>
//               <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#7a9a87", alignItems: "center" }}>
//                 <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, background: "#6aaa78", borderRadius: 2, display: "inline-block" }} />Farmers</span>
//                 <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 10, height: 10, background: "#d4a853", borderRadius: 2, display: "inline-block" }} />Orders</span>
//               </div>
//             </div>
//             <MiniBarChart data={chartData} />
//           </div>
//           <div style={S.card}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
//               <h3 style={{ color: "#f4f0e8", fontSize: 15, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: 0 }}>System Alerts</h3>
//               <span style={{ fontSize: 11, color: "#6aaa78", cursor: "pointer" }}>All Alerts</span>
//             </div>
//             {weatherAlerts.length === 0
//               ? <div style={{ color: "#7a9a87", fontSize: 13 }}>No active alerts</div>
//               : weatherAlerts.slice(0, 4).map(a => (
//                   <div key={a._id} style={{ marginBottom: 10, padding: "9px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
//                     <div style={{ color: "#d4a853", fontSize: 12, fontWeight: 600 }}>{a.district}</div>
//                     <div style={{ color: "#a8d5b5", fontSize: 12, marginTop: 2 }}>{a.message}</div>
//                   </div>
//                 ))}
//             <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(106,170,120,0.08)", borderRadius: 9, border: "1px solid rgba(106,170,120,0.15)" }}>
//               <span style={{ color: "#6aaa78", fontSize: 12, fontWeight: 600 }}>System Health: All OK</span>
//               <p style={{ color: "#7a9a87", fontSize: 11, margin: "3px 0 0" }}>All microservices running normally</p>
//             </div>
//           </div>
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
//           <div style={S.card}>
//             <h3 style={{ color: "#f4f0e8", fontSize: 15, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: "0 0 16px" }}>User Breakdown</h3>
//             <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
//               <DonutChart farmers={farmers.length} consumers={consumers.length} />
//               <div style={{ fontSize: 13 }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                   <span style={{ width: 10, height: 10, background: "#6aaa78", borderRadius: 2, display: "inline-block" }} />
//                   <span style={{ color: "#a8d5b5" }}>Farmers</span>
//                   <span style={{ color: "#f4f0e8", fontWeight: 700, marginLeft: 4 }}>{farmers.length}</span>
//                   <span style={{ color: "#7a9a87" }}>({Math.round((farmers.length / (users.length || 1)) * 100)}%)</span>
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                   <span style={{ width: 10, height: 10, background: "#d4a853", borderRadius: 2, display: "inline-block" }} />
//                   <span style={{ color: "#a8d5b5" }}>Consumers</span>
//                   <span style={{ color: "#f4f0e8", fontWeight: 700, marginLeft: 4 }}>{consumers.length}</span>
//                   <span style={{ color: "#7a9a87" }}>({Math.round((consumers.length / (users.length || 1)) * 100)}%)</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div style={S.card}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//               <h3 style={{ color: "#f4f0e8", fontSize: 15, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: 0 }}>Top Disease Reports</h3>
//               <span onClick={() => setSection("reports")} style={{ fontSize: 11, color: "#6aaa78", cursor: "pointer" }}>View All</span>
//             </div>
//             {diseases.length === 0
//               ? <div style={{ color: "#7a9a87", fontSize: 13, marginTop: 8 }}>No disease reports yet</div>
//               : diseases.slice(0, 4).map(d => (
//                   <div key={d._id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(106,170,120,0.07)" }}>
//                     <div>
//                       <div style={{ color: "#d0e8d8", fontSize: 13, fontWeight: 600 }}>{d.cropName}</div>
//                       <div style={{ color: "#7a9a87", fontSize: 11 }}>{d.diagnosis}</div>
//                     </div>
//                     <span style={{ color: "#7a9a87", fontSize: 11 }}>{fmtDate(d.createdAt)}</span>
//                   </div>
//                 ))}
//           </div>

//           <div style={S.card}>
//             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//               <h3 style={{ color: "#f4f0e8", fontSize: 15, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: 0 }}>Recent Registrations</h3>
//               <span onClick={() => setSection("users")} style={{ fontSize: 11, color: "#6aaa78", cursor: "pointer" }}>Manage</span>
//             </div>
//             {users.slice(0, 5).map(u => {
//               const sub = subscriptions.find(s => (typeof s.userId === "object" ? s.userId._id : s.userId) === u._id);
//               return (
//                 <div key={u._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(106,170,120,0.07)" }}>
//                   <div style={{ width: 30, height: 30, borderRadius: "50%", background: avatarColor(u.name ?? "A"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#f4f0e8", flexShrink: 0 }}>
//                     {initials(u.name)}
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div style={{ color: "#d0e8d8", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</div>
//                     <div style={{ color: "#7a9a87", fontSize: 11, textTransform: "capitalize" }}>{u.role}</div>
//                   </div>
//                   {sub ? statusPill(sub.status) : <span style={{ fontSize: 11, color: "#7a9a87" }}>—</span>}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );

//     // ──────────────────── USERS ──────────────────────────────────────────────
//     if (section === "users") return (
//       <div>
//         <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
//           <input value={userSearch} onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
//             placeholder="Search by name or email…"
//             style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(106,170,120,0.2)", borderRadius: 8, padding: "9px 14px", color: "#f4f0e8", fontSize: 13, outline: "none" }} />
//           {["all", "farmer", "user", "admin"].map(r => (
//             <button key={r} onClick={() => { setUserRoleFilter(r); setUserPage(1); }}
//               style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(106,170,120,0.2)", background: userRoleFilter === r ? "#6aaa78" : "rgba(255,255,255,0.05)", color: userRoleFilter === r ? "#1a3a2a" : "#a8d5b5", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
//               {r === "all" ? "All" : r === "user" ? "Consumer" : r.charAt(0).toUpperCase() + r.slice(1)}
//             </button>
//           ))}
//           <span style={{ color: "#7a9a87", fontSize: 12, marginLeft: "auto" }}>{filteredUsers.length} users</span>
//         </div>

//         <div style={S.card}>
//           <TableWrap>
//             <thead>
//               <tr>
//                 <TH>User</TH>
//                 <TH>Role</TH>
//                 <TH>Subscription</TH>
//                 <TH>Joined</TH>
//                 <TH>Status</TH>
//               </tr>
//             </thead>
//             <tbody>
//               {pagedUsers.map(u => {
//                 const sub = subscriptions.find(s => (typeof s.userId === "object" ? s.userId._id : s.userId) === u._id);
//                 return (
//                   <TR key={u._id}>
//                     <TD>
//                       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                         <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarColor(u.name ?? "A"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#f4f0e8", flexShrink: 0 }}>
//                           {initials(u.name)}
//                         </div>
//                         <div>
//                           <div style={{ color: "#d0e8d8", fontWeight: 600 }}>{u.name}</div>
//                           <div style={{ color: "#7a9a87", fontSize: 11 }}>{u.email}</div>
//                         </div>
//                       </div>
//                     </TD>
//                     <TD><span style={{ textTransform: "capitalize" }}>{u.role === "user" ? "Consumer" : u.role}</span></TD>
//                     <TD>{sub ? statusPill(sub.status) : <span style={{ color: "#7a9a87", fontSize: 12 }}>No subscription</span>}</TD>
//                     <TD style={{ color: "#7a9a87" }}>{fmtDate(u.createdAt)}</TD>
//                     <TD>{statusPill("active")}</TD>
//                   </TR>
//                 );
//               })}
//               {pagedUsers.length === 0 && (
//                 <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#7a9a87" }}>No users found</td></tr>
//               )}
//             </tbody>
//           </TableWrap>
//           <Pagination page={userPage} total={filteredUsers.length} perPage={USER_PER_PAGE} onChange={setUserPage} />
//         </div>
//       </div>
//     );

//     // ──────────────────── MARKETPLACE ────────────────────────────────────────
//     if (section === "marketplace") return (
//       <div>
//         <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
//           {["all", "pending", "approved", "rejected"].map(f => (
//             <button key={f} onClick={() => { setProductFilter(f); setProdPage(1); }}
//               style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(106,170,120,0.2)", background: productFilter === f ? "#6aaa78" : "rgba(255,255,255,0.05)", color: productFilter === f ? "#1a3a2a" : "#a8d5b5", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
//               {f.charAt(0).toUpperCase() + f.slice(1)}
//             </button>
//           ))}
//           <span style={{ marginLeft: "auto" }}><Btn onClick={openCreateProduct}>+ Add Product</Btn></span>
//         </div>

//         <div style={S.card}>
//           <TableWrap>
//             <thead>
//               <tr>
//                 <TH>Product</TH>
//                 <TH>Farmer</TH>
//                 <TH>Category</TH>
//                 <TH>Price</TH>
//                 <TH>Stock</TH>
//                 <TH>Status</TH>
//                 <TH>Actions</TH>
//               </tr>
//             </thead>
//             <tbody>
//               {pagedProds.map(p => {
//                 const farmerName = typeof p.farmerId === "object" ? p.farmerId.name : "—";
//                 return (
//                   <TR key={p._id}>
//                     <TD>
//                       <div style={{ fontWeight: 600, color: "#d0e8d8" }}>{p.name}</div>
//                       {p.description && <div style={{ color: "#7a9a87", fontSize: 11, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</div>}
//                     </TD>
//                     <TD style={{ color: "#7a9a87" }}>{farmerName}</TD>
//                     <TD style={{ textTransform: "capitalize" }}>{p.category}</TD>
//                     <TD>{fmt(p.price)}</TD>
//                     <TD>{p.stock ?? "—"}</TD>
//                     <TD>{statusPill(p.status ?? "pending")}</TD>
//                     <TD>
//                       <div style={{ display: "flex", gap: 6 }}>
//                         {p.status !== "approved"  && <Btn small onClick={() => handleProductStatus(p._id, "approved")}>Approve</Btn>}
//                         {p.status !== "rejected"  && <Btn small variant="danger" onClick={() => handleProductStatus(p._id, "rejected")}>Reject</Btn>}
//                         <Btn small variant="ghost" onClick={() => openEditProduct(p)}>Edit</Btn>
//                         <Btn small variant="danger" onClick={() => handleProductDelete(p._id)}>Delete</Btn>
//                       </div>
//                     </TD>
//                   </TR>
//                 );
//               })}
//               {pagedProds.length === 0 && (
//                 <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#7a9a87" }}>No products found</td></tr>
//               )}
//             </tbody>
//           </TableWrap>
//           <Pagination page={prodPage} total={filteredProds.length} perPage={PROD_PER_PAGE} onChange={setProdPage} />
//         </div>

//         {prodModal && (
//           <Modal title={prodModal === "create" ? "Add Product" : "Edit Product"} onClose={() => setProdModal(null)}>
//             <FormInput label="Name"       value={editProduct.name ?? ""}        onChange={v => setEditProduct(p => ({ ...p, name: v }))}        placeholder="Product name" />
//             <FormInput label="Category"   value={editProduct.category ?? ""}    onChange={v => setEditProduct(p => ({ ...p, category: v }))}    placeholder="e.g. Vegetables" />
//             <FormInput label="Price (LKR)" type="number" value={editProduct.price ?? 0}  onChange={v => setEditProduct(p => ({ ...p, price: Number(v) }))} />
//             <FormInput label="Stock"      type="number" value={editProduct.stock ?? 0}   onChange={v => setEditProduct(p => ({ ...p, stock: Number(v) }))} />
//             <div style={{ marginBottom: 14 }}>
//               <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#a8d5b5", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Description</label>
//               <textarea value={editProduct.description ?? ""} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))}
//                 rows={3} placeholder="Product description…"
//                 style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(106,170,120,0.2)", borderRadius: 8, padding: "9px 12px", color: "#f4f0e8", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} />
//             </div>
//             <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
//               <Btn variant="ghost" onClick={() => setProdModal(null)}>Cancel</Btn>
//               <Btn onClick={handleSaveProduct}>{prodSaving ? "Saving…" : prodModal === "create" ? "Create" : "Save Changes"}</Btn>
//             </div>
//           </Modal>
//         )}
//       </div>
//     );

//     // ──────────────────── REPORTS ─────────────────────────────────────────────
//     if (section === "reports") return (
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//         <div style={{ ...S.card, gridColumn: "1 / -1" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
//             <h3 style={{ color: "#f4f0e8", fontSize: 16, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: 0 }}>All Orders</h3>
//             <div style={{ display: "flex", gap: 8 }}>
//               {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(f => (
//                 <button key={f} onClick={() => { setOrderFilter(f); setOrderPage(1); }}
//                   style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(106,170,120,0.2)", background: orderFilter === f ? "#6aaa78" : "rgba(255,255,255,0.05)", color: orderFilter === f ? "#1a3a2a" : "#a8d5b5", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
//                   {f.charAt(0).toUpperCase() + f.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <TableWrap>
//             <thead>
//               <tr><TH>Order ID</TH><TH>Consumer</TH><TH>Amount</TH><TH>Status</TH><TH>Date</TH></tr>
//             </thead>
//             <tbody>
//               {pagedOrders.map(o => {
//                 const cName = typeof o.consumerId === "object" ? o.consumerId.name : "—";
//                 return (
//                   <TR key={o._id}>
//                     <TD style={{ fontFamily: "monospace", fontSize: 11, color: "#7a9a87" }}>#{o._id.slice(-6).toUpperCase()}</TD>
//                     <TD style={{ color: "#d0e8d8" }}>{cName}</TD>
//                     <TD style={{ fontWeight: 600, color: "#d4a853" }}>{fmt(o.totalAmount)}</TD>
//                     <TD>{statusPill(o.status)}</TD>
//                     <TD style={{ color: "#7a9a87" }}>{fmtDate(o.createdAt)}</TD>
//                   </TR>
//                 );
//               })}
//               {pagedOrders.length === 0 && (
//                 <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#7a9a87" }}>No orders found</td></tr>
//               )}
//             </tbody>
//           </TableWrap>
//           <Pagination page={orderPage} total={filteredOrders.length} perPage={ORDER_PER_PAGE} onChange={setOrderPage} />
//         </div>

//         <div style={S.card}>
//           <h3 style={{ color: "#f4f0e8", fontSize: 15, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: "0 0 14px" }}>Disease Scan Reports</h3>
//           {diseases.length === 0
//             ? <div style={{ color: "#7a9a87", fontSize: 13 }}>No disease reports</div>
//             : diseases.slice(0, 8).map(d => (
//                 <div key={d._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(106,170,120,0.07)" }}>
//                   <div>
//                     <div style={{ color: "#d0e8d8", fontSize: 13, fontWeight: 600 }}>{d.cropName}</div>
//                     <div style={{ color: "#7a9a87", fontSize: 11 }}>{d.diagnosis}</div>
//                   </div>
//                   <span style={{ color: "#7a9a87", fontSize: 11 }}>{fmtDate(d.createdAt)}</span>
//                 </div>
//               ))}
//         </div>

//         <div style={S.card}>
//           <h3 style={{ color: "#f4f0e8", fontSize: 15, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: "0 0 14px" }}>Weather Alerts</h3>
//           {weatherAlerts.length === 0
//             ? <div style={{ color: "#7a9a87", fontSize: 13 }}>No active weather alerts</div>
//             : weatherAlerts.map(a => (
//                 <div key={a._id} style={{ marginBottom: 10, padding: "10px 14px", background: "rgba(212,168,83,0.06)", borderRadius: 9, border: "1px solid rgba(212,168,83,0.15)" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
//                     <span style={{ color: "#d4a853", fontWeight: 600, fontSize: 13 }}>{a.district}</span>
//                     <span style={{ fontSize: 10, color: "#7a9a87" }}>{fmtDate(a.createdAt)}</span>
//                   </div>
//                   <div style={{ color: "#a8d5b5", fontSize: 12 }}>{a.message}</div>
//                   {statusPill(a.severity ?? "medium")}
//                 </div>
//               ))}
//         </div>

//         <div style={{ ...S.card, gridColumn: "1 / -1" }}>
//           <h3 style={{ color: "#f4f0e8", fontSize: 15, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: "0 0 16px" }}>Revenue Overview</h3>
//           <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//             {[
//               { label: "Subscription Revenue", value: fmt(totalRevenueLKR), sub: `${activeSubs.length} active subs × Rs.2,999` },
//               { label: "Total Orders",          value: orders.length,        sub: "All time" },
//               { label: "Order Value (Est.)",    value: fmt(orders.reduce((a, o) => a + (o.totalAmount ?? 0), 0)), sub: "Cash on delivery" },
//               { label: "Farmers on Platform",   value: farmers.length,       sub: "Paid subscribers" },
//             ].map((s, i) => (
//               <div key={i} style={{ flex: 1, minWidth: 160, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px 16px", border: "1px solid rgba(106,170,120,0.1)" }}>
//                 <div style={{ fontSize: 22, fontWeight: 700, color: "#f4f0e8", fontFamily: "'Sora', sans-serif" }}>{s.value}</div>
//                 <div style={{ fontSize: 12, color: "#6aaa78", fontWeight: 600, marginTop: 3 }}>{s.label}</div>
//                 <div style={{ fontSize: 11, color: "#7a9a87", marginTop: 2 }}>{s.sub}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );

//     // ──────────────────── SETTINGS ─────────────────────────────────────────────
//     if (section === "settings") return (
//       <div style={{ maxWidth: 600 }}>
//         <div style={S.card}>
//           <h3 style={{ color: "#f4f0e8", fontSize: 16, fontWeight: 700, fontFamily: "'Sora', sans-serif", margin: "0 0 18px" }}>Admin Account</h3>
//           <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
//             <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#6aaa78", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#1a3a2a" }}>
//               {initials(adminUser?.name)}
//             </div>
//             <div>
//               <div style={{ color: "#f4f0e8", fontWeight: 700, fontSize: 16 }}>{adminUser?.name ?? "Admin"}</div>
//               <div style={{ color: "#7a9a87", fontSize: 13 }}>{adminUser?.email ?? ""}</div>
//               <span style={{ fontSize: 11, background: "rgba(106,170,120,0.15)", color: "#6aaa78", padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>Administrator</span>
//             </div>
//           </div>
//           <div style={{ borderTop: "1px solid rgba(106,170,120,0.1)", paddingTop: 18 }}>
//             <p style={{ color: "#7a9a87", fontSize: 13, marginBottom: 14 }}>Platform Configuration</p>
//             {[
//               { label: "Farmer Subscription Price", value: "Rs. 2,999 / month" },
//               { label: "Stripe Mode",               value: "Test Mode" },
//               { label: "AI Model",                  value: "meta-llama/llama-3.2-11b-vision" },
//               { label: "Weather Provider",           value: "OpenWeatherMap (Free Tier)" },
//             ].map((item, i) => (
//               <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(106,170,120,0.07)", fontSize: 13 }}>
//                 <span style={{ color: "#a8d5b5" }}>{item.label}</span>
//                 <span style={{ color: "#d0e8d8", fontWeight: 600 }}>{item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ──────────────────── RENDER ───────────────────────────────────────────────
//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { background: #112218; font-family: 'DM Sans', sans-serif; }
//         ::-webkit-scrollbar { width: 5px; height: 5px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #2d5a3d; border-radius: 10px; }
//         input::placeholder { color: #7a9a87; }
//         textarea::placeholder { color: #7a9a87; }
//         @media (max-width: 768px) {
//           .sidebar { transform: translateX(-220px); }
//           .sidebar.open { transform: translateX(0) !important; }
//           .main { margin-left: 0 !important; }
//         }
//       `}</style>

//       <div style={{ display: "flex", minHeight: "100vh", background: "#112218" }}>
//         {/* Sidebar */}
//         <aside className={`sidebar${sidebarOpen ? " open" : ""}`} style={S.sidebar}>
//           <div style={{ padding: "20px 18px 12px", borderBottom: "1px solid rgba(106,170,120,0.1)" }}>
//             <div style={{ fontSize: 20, fontWeight: 800, color: "#6aaa78", fontFamily: "'Sora', sans-serif", letterSpacing: -0.5 }}>Agreal</div>
//             <span style={{ fontSize: 10, background: "rgba(106,170,120,0.15)", color: "#6aaa78", padding: "2px 8px", borderRadius: 6, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Admin</span>
//           </div>

//           <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
//             <p style={{ fontSize: 10, fontWeight: 700, color: "#3a6a4a", padding: "6px 18px", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Overview</p>
//             {navItems.slice(0, 1).map(item => (
//               <div key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }} style={S.navItem(section === item.id)}>
//                 <span style={{ flex: 1 }}>{item.label}</span>
//               </div>
//             ))}
//             <p style={{ fontSize: 10, fontWeight: 700, color: "#3a6a4a", padding: "12px 18px 4px", letterSpacing: 1.2, textTransform: "uppercase" }}>Management</p>
//             {navItems.slice(1).map(item => (
//               <div key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }} style={S.navItem(section === item.id)}>
//                 <span style={{ flex: 1 }}>{item.label}</span>
//                 {item.badge !== undefined && item.badge > 0 && (
//                   <span style={{ background: "#6aaa78", color: "#1a3a2a", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20 }}>{item.badge}</span>
//                 )}
//               </div>
//             ))}
//           </nav>

//           {adminUser && (
//             <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(106,170,120,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarColor(adminUser.name ?? "A"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#f4f0e8", flexShrink: 0 }}>
//                 {initials(adminUser.name)}
//               </div>
//               <div style={{ minWidth: 0 }}>
//                 <div style={{ color: "#d0e8d8", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminUser.name}</div>
//                 <div style={{ color: "#7a9a87", fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminUser.email}</div>
//               </div>
//             </div>
//           )}
//         </aside>

//         {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }} />}

//         <main className="main" style={{ marginLeft: 220, flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//           <header style={{ background: "#0f2419", borderBottom: "1px solid rgba(106,170,120,0.1)", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//               <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: "none", background: "none", border: "none", color: "#6aaa78", cursor: "pointer", fontSize: 18 }} className="mobile-menu">☰</button>
//               <div>
//                 <h1 style={{ color: "#f4f0e8", fontSize: 18, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>Admin Dashboard</h1>
//                 {/* FIX 2: dateString is "" on SSR, populated after mount — no mismatch */}
//                 <p style={{ color: "#7a9a87", fontSize: 12 }}>
//                   {dateString}
//                   <span style={{ marginLeft: 10, color: "#6aaa78" }}>All systems operational</span>
//                 </p>
//               </div>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <button onClick={fetchAll} style={{ background: "rgba(106,170,120,0.1)", border: "1px solid rgba(106,170,120,0.2)", color: "#6aaa78", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Refresh</button>
//               <div style={{ width: 34, height: 34, borderRadius: "50%", background: avatarColor(adminUser?.name ?? "A"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#f4f0e8" }}>
//                 {initials(adminUser?.name)}
//               </div>
//             </div>
//           </header>

//           <div style={{ flex: 1, padding: "24px 28px" }}>
//             <div style={{ marginBottom: 20 }}>
//               <h2 style={{ color: "#f4f0e8", fontSize: 22, fontWeight: 700, fontFamily: "'Sora', sans-serif", textTransform: "capitalize" }}>
//                 {section}
//               </h2>
//               <p style={{ color: "#7a9a87", fontSize: 13, marginTop: 2 }}>
//                 {section === "dashboard"   && "Platform overview and key metrics"}
//                 {section === "users"       && "Manage registered users and subscriptions"}
//                 {section === "marketplace" && "Review, approve, and manage product listings"}
//                 {section === "reports"     && "Orders, disease scans, and weather alerts"}
//                 {section === "settings"    && "Platform configuration and admin account"}
//               </p>
//             </div>
//             {renderSection()}
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios-proxy";

// ─── Types ───────────────────────────────────────────────────────────────────
interface User { _id: string; name: string; email: string; role: string; createdAt: string; }
interface Subscription { _id: string; userId: { _id: string; name: string; email: string } | string; status: string; currentPeriodEnd: string; createdAt: string; }
interface Order { _id: string; consumerId: { name: string; email: string } | string; farmerId: { name: string } | string; totalAmount: number; status: string; createdAt: string; }
interface Product { _id: string; name: string; price: number; farmerId: { name: string; email: string } | string; category: string; status?: string; description?: string; stock?: number; createdAt: string; }
interface Disease { _id: string; userId: { name: string } | string; cropName: string; diagnosis: string; createdAt: string; }
interface WeatherAlert { _id: string; district: string; message: string; severity: string; createdAt: string; }

type Section = "overview" | "ecommerce" | "analytics" | "customers" | "messages" | "reviews" | "settings" | "help";

// ─── Safe array helper ────────────────────────────────────────────────────────
const toArray = <T,>(data: unknown, keys: string[]): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    for (const key of keys) {
      const val = (data as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val as T[];
    }
  }
  return [];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtLKR = (n: number) => "Rs." + new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(n);
const fmtTime = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const initials = (name = "A") => name.slice(0, 2).toUpperCase();
const AVBG = ["#163520", "#1a4028", "#0f2a1a", "#1e3a25", "#122a18"];
const avBg = (name: string) => AVBG[name.charCodeAt(0) % AVBG.length];

const statusColor = (s: string): { bg: string; text: string } => {
  const m: Record<string, { bg: string; text: string }> = {
    active:     { bg: "rgba(74,222,128,0.12)",  text: "#4ade80" },
    trialing:   { bg: "rgba(251,191,36,0.12)",  text: "#fbbf24" },
    canceled:   { bg: "rgba(248,113,113,0.12)", text: "#f87171" },
    past_due:   { bg: "rgba(248,113,113,0.12)", text: "#f87171" },
    pending:    { bg: "rgba(251,191,36,0.12)",  text: "#fbbf24" },
    approved:   { bg: "rgba(74,222,128,0.12)",  text: "#4ade80" },
    rejected:   { bg: "rgba(248,113,113,0.12)", text: "#f87171" },
    delivered:  { bg: "rgba(74,222,128,0.12)",  text: "#4ade80" },
    processing: { bg: "rgba(251,191,36,0.12)",  text: "#fbbf24" },
    shipped:    { bg: "rgba(96,165,250,0.12)",  text: "#60a5fa" },
    cancelled:  { bg: "rgba(248,113,113,0.12)", text: "#f87171" },
  };
  return m[s?.toLowerCase()] ?? { bg: "rgba(150,150,150,0.1)", text: "#9ca3af" };
};
const Pill = ({ s }: { s: string }) => {
  const { bg, text } = statusColor(s);
  return <span style={{ background: bg, color: text, padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{s ? s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ") : "—"}</span>;
};

// ─── Visual components ────────────────────────────────────────────────────────
function Sparkline({ data, color = "#4ade80", h = 56 }: { data: number[]; color?: string; h?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const W = 200;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${h - (v / max) * (h - 4) - 2}`);
  const path = `M${pts.join(" L")}`;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} style={{ width: "100%", height: h }} preserveAspectRatio="none">
      <path d={`${path} L${W},${h} L0,${h} Z`} fill={color} fillOpacity={0.1} />
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── REAL DATA Donut — Farmers / Active Subscribers / Consumers ───────────────
function UserDonut({
  farmers, consumers, activeSubs,
}: {
  farmers: number; consumers: number; activeSubs: number;
}) {
  const total = farmers + consumers || 1;
  const r = 36, cx = 44, cy = 44;
  const circ = 2 * Math.PI * r;

  // three segments: active subscribers (gold), other farmers (green), consumers (blue)
  const otherFarmers = Math.max(farmers - activeSubs, 0);
  const activeSubDash   = (activeSubs    / total) * circ;
  const otherFarmerDash = (otherFarmers  / total) * circ;
  const consumerDash    = (consumers     / total) * circ;

  // cumulative offsets (SVG strokeDashoffset trick — rotate to start position)
  const gap = 0; // seamless
  let offset = 0;
  const seg = (dash: number, color: string, off: number) => (
    <circle
      cx={cx} cy={cy} r={r}
      fill="none" stroke={color} strokeWidth={11}
      strokeDasharray={`${dash - gap} ${circ - dash + gap}`}
      strokeDashoffset={-off}
      transform={`rotate(-90 ${cx} ${cy})`}
    />
  );

  const s1off = offset; offset += activeSubDash;
  const s2off = offset; offset += otherFarmerDash;
  const s3off = offset;

  return (
    <svg width={88} height={88}>
      {/* track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a3020" strokeWidth={11} />
      {/* segments */}
      {seg(activeSubDash,   "#fbbf24", s1off)}
      {seg(otherFarmerDash, "#4ade80", s2off)}
      {seg(consumerDash,    "#60a5fa", s3off)}
      {/* centre label */}
      <text x={cx} y={cy - 3} textAnchor="middle" fill="#e0f4ea" fontSize={15} fontWeight={700} fontFamily="'Sora',sans-serif">{total}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fill="#4a7a5a" fontSize={8} fontFamily="'DM Sans',sans-serif">users</text>
    </svg>
  );
}

function BarChart({ data }: { data: { label: string; farmers: number; orders: number }[] }) {
  const max = Math.max(...data.flatMap(d => [d.farmers, d.orders]), 1);
  const W = 100, H = 80, bw = 6, gap = 3;
  const slotW = W / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 13}`} style={{ width: "100%", height: 100 }} preserveAspectRatio="none">
      {data.map((d, i) => {
        const x = i * slotW + (slotW - bw * 2 - gap) / 2;
        const fh = Math.max((d.farmers / max) * H, 2);
        const oh = Math.max((d.orders / max) * H, 2);
        return (
          <g key={i}>
            <rect x={x} y={H - fh} width={bw} height={fh} fill="#4ade80" opacity={0.8} rx={2} />
            <rect x={x + bw + gap} y={H - oh} width={bw} height={oh} fill="#fbbf24" opacity={0.8} rx={2} />
            <text x={x + bw + 1.5} y={H + 10} textAnchor="middle" fill="#4a7a5a" fontSize={6.5} fontFamily="'DM Sans',sans-serif">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────
function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div style={{ display: "flex", gap: 5, justifyContent: "flex-end", paddingTop: 10 }}>
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
        style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(74,222,128,0.12)", background: "rgba(255,255,255,0.03)", color: "#6aaa78", fontSize: 12, cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>←</button>
      {Array.from({ length: Math.min(5, pages) }, (_, i) => {
        const p = page <= 3 ? i + 1 : page - 2 + i;
        if (p < 1 || p > pages) return null;
        return (
          <button key={p} onClick={() => onChange(p)}
            style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(74,222,128,0.12)", background: p === page ? "#4ade80" : "rgba(255,255,255,0.03)", color: p === page ? "#0a1f12" : "#6aaa78", fontSize: 11, fontWeight: p === page ? 700 : 500, cursor: "pointer" }}>
            {p}
          </button>
        );
      })}
      <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages}
        style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(74,222,128,0.12)", background: "rgba(255,255,255,0.03)", color: "#6aaa78", fontSize: 12, cursor: page === pages ? "not-allowed" : "pointer", opacity: page === pages ? 0.4 : 1 }}>→</button>
    </div>
  );
}

// ─── Modal + FInput ───────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#0e2118", border: "1px solid rgba(74,222,128,0.12)", borderRadius: 16, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#e0f4ea", fontSize: 16, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#6aaa78", cursor: "pointer", width: 28, height: 28, borderRadius: 7, fontSize: 14 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
const FInput = ({ label, value, onChange, type = "text", placeholder }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#4a7a5a", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(74,222,128,0.14)", borderRadius: 8, padding: "8px 11px", color: "#e0f4ea", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" }} />
  </div>
);

// ─── Table helpers ────────────────────────────────────────────────────────────
const TH = ({ ch, s }: { ch: React.ReactNode; s?: React.CSSProperties }) => (
  <th style={{ padding: "9px 13px", textAlign: "left", color: "#4a7a5a", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.7, whiteSpace: "nowrap", borderBottom: "1px solid rgba(74,222,128,0.07)", ...s }}>{ch}</th>
);
const TD = ({ ch, s }: { ch: React.ReactNode; s?: React.CSSProperties }) => (
  <td style={{ padding: "9px 13px", color: "#b0d4bc", fontSize: 13, borderBottom: "1px solid rgba(74,222,128,0.04)", verticalAlign: "middle", ...s }}>{ch}</td>
);
const TR = ({ children }: { children: React.ReactNode }) => (
  <tr onMouseEnter={e => (e.currentTarget.style.background = "rgba(74,222,128,0.03)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} style={{ transition: "background .12s" }}>{children}</tr>
);
const Btn = ({ children, onClick, v = "primary", sm }: { children: React.ReactNode; onClick?: () => void; v?: "primary" | "danger" | "ghost" | "lime"; sm?: boolean }) => {
  const vs: Record<string, React.CSSProperties> = {
    primary: { background: "#4ade80", color: "#0a1f12", border: "none" },
    lime:    { background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" },
    danger:  { background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" },
    ghost:   { background: "rgba(255,255,255,0.04)", color: "#6aaa78", border: "1px solid rgba(74,222,128,0.12)" },
  };
  return (
    <button onClick={onClick} style={{ ...vs[v], borderRadius: 7, padding: sm ? "3px 9px" : "7px 14px", fontSize: sm ? 11 : 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "opacity .15s" }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();

  const [section, setSection]   = useState<Section>("overview");
  const [adminUser, setAdmin]   = useState<User | null>(null);
  const [users, setUsers]       = useState<User[]>([]);
  const [subs, setSubs]         = useState<Subscription[]>([]);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [weather, setWeather]   = useState<WeatherAlert[]>([]);
  const [loading, setLoading]   = useState(true);

  // client-only date (prevents SSR hydration mismatch)
  const [dateString, setDateString] = useState("");
  useEffect(() => {
    setDateString(new Date().toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }));
  }, []);

  // filters
  const [uSearch, setUSearch] = useState(""); const [uRole, setURole] = useState("all"); const [uPage, setUPage] = useState(1); const U_PER = 10;
  const [oFilter, setOFilter] = useState("all"); const [oPage, setOPage] = useState(1); const O_PER = 10;
  const [pFilter, setPFilter] = useState("all"); const [pPage, setPPage] = useState(1); const P_PER = 10;
  const [pModal, setPModal]   = useState<"create" | "edit" | null>(null);
  const [pEdit, setPEdit]     = useState<Partial<Product>>({});
  const [pSaving, setPSaving] = useState(false);

  // auth
  useEffect(() => {
    const raw = localStorage.getItem("agriai_user");
    if (!raw) { router.push("/"); return; }
    try { const u = JSON.parse(raw); if (u.role !== "admin") { router.push("/"); return; } setAdmin(u); }
    catch { router.push("/"); }
  }, [router]);

  // fetch
  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [u, s, o, p, d, w] = await Promise.allSettled([
      api.get("/auth/users"), api.get("/subscriptions/admin/all"), api.get("/orders/admin/all"),
      api.get("/products/admin/all"), api.get("/diseases/admin/all"), api.get("/weather/admin/all"),
    ]);
    if (u.status === "fulfilled") setUsers(toArray<User>(u.value.data, ["users"]));
    if (s.status === "fulfilled") setSubs(toArray<Subscription>(s.value.data, ["subscriptions"]));
    if (o.status === "fulfilled") setOrders(toArray<Order>(o.value.data, ["orders"]));
    if (p.status === "fulfilled") setProducts(toArray<Product>(p.value.data, ["products"]));
    if (d.status === "fulfilled") setDiseases(toArray<Disease>(d.value.data, ["diseases"]));
    if (w.status === "fulfilled") setWeather(toArray<WeatherAlert>(w.value.data, ["alerts"]));
    setLoading(false);
  }, []);

  useEffect(() => { if (adminUser) fetchAll(); }, [adminUser, fetchAll]);

  // derived
  const farmers    = users.filter(u => u.role === "farmer");
  const consumers  = users.filter(u => u.role === "user" || u.role === "consumer");
  const activeSubs = subs.filter(s => s.status === "active" || s.status === "trialing");
  const totalRev   = activeSubs.length * 2999;
  const todayScan  = diseases.filter(d => new Date(d.createdAt).toDateString() === new Date().toDateString()).length;
  const total      = users.length || 1;

  // percentage helpers
  const pct = (n: number) => Math.round((n / total) * 100);

  const chartData = (() => {
    const out: { label: string; farmers: number; orders: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      out.push({ label: d.toLocaleString("en", { month: "short" }), farmers: farmers.filter(u => u.createdAt?.startsWith(ym)).length, orders: orders.filter(x => x.createdAt?.startsWith(ym)).length });
    }
    return out;
  })();

  const profitSpark = chartData.map((d, i) => d.orders * 120 + d.farmers * 2999 + i * 400);

  const activities = [
    ...users.slice(0, 2).map(u => ({ text: `New ${u.role === "user" ? "consumer" : u.role} registered`, time: u.createdAt, who: u.name })),
    ...products.slice(0, 2).map(p => ({ text: `Product "${p.name}" added`, time: p.createdAt, who: typeof p.farmerId === "object" ? p.farmerId.name : "Farmer" })),
    ...orders.slice(0, 2).map(o => ({ text: "New order placed", time: o.createdAt, who: typeof o.consumerId === "object" ? o.consumerId.name : "Consumer" })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

  // filtered
  const filtUsers   = users.filter(u => (uRole === "all" || u.role === uRole) && (!uSearch || u.name?.toLowerCase().includes(uSearch.toLowerCase()) || u.email?.toLowerCase().includes(uSearch.toLowerCase())));
  const pagedUsers  = filtUsers.slice((uPage - 1) * U_PER, uPage * U_PER);
  const filtOrders  = oFilter === "all" ? orders : orders.filter(o => o.status === oFilter);
  const pagedOrders = filtOrders.slice((oPage - 1) * O_PER, oPage * O_PER);
  const filtProds   = pFilter === "all" ? products : products.filter(p => (p.status ?? "pending") === pFilter);
  const pagedProds  = filtProds.slice((pPage - 1) * P_PER, pPage * P_PER);

  // product CRUD
  const handleProdStatus = async (id: string, status: string) => { try { await api.patch(`/products/${id}/status`, { status }); fetchAll(); } catch { /**/ } };
  const handleProdDelete = async (id: string) => { if (!confirm("Delete?")) return; try { await api.delete(`/products/${id}`); fetchAll(); } catch { /**/ } };
  const handleProdSave   = async () => {
    setPSaving(true);
    try { if (pModal === "create") await api.post("/products", pEdit); else await api.put(`/products/${pEdit._id}`, pEdit); setPModal(null); fetchAll(); }
    catch { /**/ } finally { setPSaving(false); }
  };

  // ─── Design tokens ─────────────────────────────────────────────────────────
  const BG     = "#0a1a10";
  const CARD   = "#0d1f14";
  const BORDER = "rgba(74,222,128,0.08)";
  const GREEN  = "#4ade80";
  const MUTED  = "#4a7a5a";
  const TEXT   = "#dff4e8";
  const AMBER  = "#fbbf24";
  const BLUE   = "#60a5fa";

  const card: React.CSSProperties = { background: CARD, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "16px 18px" };

  const navI = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, cursor: "pointer",
    fontSize: 13, fontWeight: active ? 600 : 400, color: active ? GREEN : MUTED,
    background: active ? "rgba(74,222,128,0.1)" : "transparent", transition: "all .12s", userSelect: "none",
  });

  const DASH_ITEMS: { id: Section; label: string }[] = [
    { id: "overview", label: "Overview" }, { id: "ecommerce", label: "eCommerce" },
    { id: "analytics", label: "Analytics" }, { id: "customers", label: "Customers" },
  ];
  const SET_ITEMS: { id: Section; label: string }[] = [
    { id: "messages", label: "Messages" }, { id: "reviews", label: "Customer Reviews" },
    { id: "settings", label: "Settings" }, { id: "help", label: "Help Centre" },
  ];

  // ─── Right panel ───────────────────────────────────────────────────────────
  const RightPanel = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={card}>
        <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 12px" }}>Notifications</p>
        {[
          { text: `${users.length} new users registered`,      time: users[0]?.createdAt    },
          { text: `${orders.length} total orders placed`,      time: orders[0]?.createdAt   },
          { text: `${activeSubs.length} active subscriptions`, time: subs[0]?.createdAt     },
          { text: `${todayScan} disease scans today`,          time: diseases[0]?.createdAt },
        ].map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 11, alignItems: "flex-start" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN, flexShrink: 0, marginTop: 5 }} />
            <div>
              <p style={{ color: TEXT, fontSize: 12, fontWeight: 500, margin: 0 }}>{n.text}</p>
              <p style={{ color: MUTED, fontSize: 10, margin: "1px 0 0" }}>{n.time ? fmtTime(n.time) : "—"}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={card}>
        <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 12px" }}>Activities</p>
        {activities.length === 0
          ? <p style={{ color: MUTED, fontSize: 12 }}>No recent activity</p>
          : activities.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: avBg(a.who), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#90d4a0", flexShrink: 0 }}>{initials(a.who)}</div>
                <div>
                  <p style={{ color: TEXT, fontSize: 12, fontWeight: 500, margin: 0 }}>{a.text}</p>
                  <p style={{ color: MUTED, fontSize: 10, margin: "1px 0 0" }}>{fmtTime(a.time)}</p>
                </div>
              </div>
            ))}
      </div>

      <div style={card}>
        <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 12px" }}>Contacts of Farmers</p>
        {farmers.slice(0, 5).map(f => {
          const sub = subs.find(s => (typeof s.userId === "object" ? s.userId._id : s.userId) === f._id);
          return (
            <div key={f._id} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: avBg(f.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#90d4a0", flexShrink: 0 }}>{initials(f.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: TEXT, fontSize: 12, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
                <p style={{ color: MUTED, fontSize: 10, margin: 0 }}>{f.email}</p>
              </div>
              {sub ? <Pill s={sub.status} /> : <span style={{ color: MUTED, fontSize: 10 }}>—</span>}
            </div>
          );
        })}
      </div>

      <div style={{ ...card, background: "linear-gradient(135deg,#163520 0%,#1a4028 100%)", border: "1px solid rgba(74,222,128,0.15)" }}>
        <span style={{ background: "rgba(74,222,128,0.15)", color: GREEN, fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>Farmer Plan</span>
        <p style={{ color: TEXT, fontSize: 22, fontWeight: 800, fontFamily: "'Sora',sans-serif", margin: "6px 0 2px" }}>Rs.2,999 <span style={{ fontSize: 12, fontWeight: 400, color: MUTED }}>/ month</span></p>
        <p style={{ color: MUTED, fontSize: 12, margin: "0 0 12px" }}>Improve yields with AI crop scanning and weather alerts</p>
        <button style={{ width: "100%", background: GREEN, color: "#0a1f12", border: "none", borderRadius: 9, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Manage Plans</button>
      </div>
    </div>
  );

  // ─── OVERVIEW ──────────────────────────────────────────────────────────────
  const Overview = () => {
    // real legend rows for the donut
    const otherFarmers = Math.max(farmers.length - activeSubs.length, 0);
    const legendRows = [
      { label: "Active Subscribers", count: activeSubs.length,  color: AMBER,  rev: activeSubs.length * 2999 },
      { label: "Other Farmers",       count: otherFarmers,       color: GREEN,  rev: otherFarmers * 0          },
      { label: "Consumers",           count: consumers.length,   color: BLUE,   rev: null                      },
    ];

    return (
      <div>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Total Users",           value: users.length,     delta: "+8.2%", pos: true  },
            { label: "Active Farmers",         value: farmers.length,   delta: "+5.4%", pos: true  },
            { label: "Disease Scans Today",    value: todayScan,        delta: "+14%",  pos: true  },
            { label: "Platform Revenue (Mo.)", value: fmtLKR(totalRev), delta: "-2.1%", pos: false },
          ].map((s, i) => (
            <div key={i} style={{ ...card, position: "relative" }}>
              <span style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 700, color: s.pos ? GREEN : "#f87171", background: s.pos ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", padding: "1px 7px", borderRadius: 18 }}>{s.delta}</span>
              <p style={{ color: TEXT, fontSize: 24, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 3px" }}>{s.value}</p>
              <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Middle row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12, marginBottom: 16 }}>

          {/* ── Sales Overview with REAL data ── */}
          <div style={card}>
            <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 14px" }}>User Breakdown</p>
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 14 }}>
              <UserDonut farmers={farmers.length} consumers={consumers.length} activeSubs={activeSubs.length} />

              {/* Legend */}
              <div style={{ flex: 1 }}>
                {legendRows.map((row, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: row.color, flexShrink: 0 }} />
                    <span style={{ color: MUTED, fontSize: 12, flex: 1 }}>{row.label}</span>
                    <span style={{ color: TEXT, fontSize: 12, fontWeight: 700 }}>{row.count}</span>
                    <span style={{ color: MUTED, fontSize: 11, minWidth: 34, textAlign: "right" }}>
                      {pct(row.count)}%
                    </span>
                  </div>
                ))}

                {/* mini progress bars */}
                <div style={{ marginTop: 4 }}>
                  {legendRows.map((row, i) => (
                    <div key={i} style={{ marginBottom: 5 }}>
                      <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct(row.count)}%`, background: row.color, borderRadius: 4, transition: "width .6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Total Users",  value: users.length,      color: TEXT  },
                { label: "Active Subs",  value: activeSubs.length, color: AMBER },
                { label: "Revenue/Mo.",  value: fmtLKR(totalRev),  color: GREEN },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 10px" }}>
                  <p style={{ color: MUTED, fontSize: 9, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
                  <p style={{ color: s.color, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profit sparkline */}
          <div style={card}>
            <p style={{ color: MUTED, fontSize: 10, margin: "0 0 2px" }}>Jan 2026 — Present</p>
            <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 4px" }}>Total Profit:</p>
            <p style={{ color: TEXT, fontSize: 22, fontWeight: 800, fontFamily: "'Sora',sans-serif", margin: "0 0 10px" }}>{fmtLKR(totalRev)}</p>
            <Sparkline data={profitSpark} color={GREEN} h={80} />
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ ...card, gridColumn: "span 2" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: 0 }}>User Registration & Activity</p>
              <div style={{ display: "flex", gap: 10, fontSize: 11, color: MUTED }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, background: GREEN, borderRadius: 2 }} />Farmers</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 7, height: 7, background: AMBER, borderRadius: 2 }} />Orders</span>
              </div>
            </div>
            <BarChart data={chartData} />
          </div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 12 }}>
            <div style={card}>
              <p style={{ color: MUTED, fontSize: 10, margin: "0 0 2px" }}>New customers</p>
              <p style={{ color: TEXT, fontSize: 20, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 1px" }}>{consumers.length}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: MUTED, fontSize: 10, margin: 0 }}>Last Week</p>
                <span style={{ color: "#f87171", fontSize: 11, fontWeight: 600, background: "rgba(248,113,113,0.1)", padding: "1px 7px", borderRadius: 16 }}>-1%</span>
              </div>
            </div>
            <div style={card}>
              <p style={{ color: MUTED, fontSize: 10, margin: "0 0 2px" }}>Weekly Revenue</p>
              <p style={{ color: TEXT, fontSize: 17, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 1px" }}>{fmtLKR(activeSubs.length * 2999)}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: MUTED, fontSize: 10, margin: 0 }}>Weekly Profit</p>
                <span style={{ color: GREEN, fontSize: 11, fontWeight: 600, background: "rgba(74,222,128,0.1)", padding: "1px 7px", borderRadius: 16 }}>+42%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer list */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: 0 }}>Customer list</p>
            <button onClick={() => setSection("customers")} style={{ background: "none", border: "none", color: GREEN, fontSize: 12, cursor: "pointer" }}>View all →</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><TH ch="Name" /><TH ch="Role" /><TH ch="Subscription" /><TH ch="Joined" /></tr></thead>
              <tbody>
                {users.slice(0, 5).map(u => {
                  const sub = subs.find(s => (typeof s.userId === "object" ? s.userId._id : s.userId) === u._id);
                  return (
                    <TR key={u._id}>
                      <TD ch={<div style={{ display: "flex", alignItems: "center", gap: 9 }}><div style={{ width: 27, height: 27, borderRadius: "50%", background: avBg(u.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#90d4a0" }}>{initials(u.name)}</div><div><p style={{ color: TEXT, fontSize: 13, fontWeight: 500, margin: 0 }}>{u.name}</p><p style={{ color: MUTED, fontSize: 10, margin: 0 }}>{u.email}</p></div></div>} />
                      <TD ch={<span style={{ textTransform: "capitalize" }}>{u.role === "user" ? "Consumer" : u.role}</span>} />
                      <TD ch={sub ? <Pill s={sub.status} /> : <span style={{ color: MUTED, fontSize: 11 }}>—</span>} />
                      <TD ch={<span style={{ color: MUTED }}>{fmtDate(u.createdAt)}</span>} />
                    </TR>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ─── CUSTOMERS ─────────────────────────────────────────────────────────────
  const Customers = () => (
    <div>
      <div style={{ display: "flex", gap: 9, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <input value={uSearch} onChange={e => { setUSearch(e.target.value); setUPage(1); }} placeholder="Search name or email…"
          style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 13px", color: TEXT, fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
        {["all", "farmer", "user", "admin"].map(r => (
          <button key={r} onClick={() => { setURole(r); setUPage(1); }} style={{ padding: "7px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: uRole === r ? GREEN : "rgba(255,255,255,0.04)", color: uRole === r ? "#0a1f12" : MUTED, fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
            {r === "all" ? "All" : r === "user" ? "Consumer" : r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
        <span style={{ color: MUTED, fontSize: 12, marginLeft: "auto" }}>{filtUsers.length} users</span>
      </div>
      <div style={card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><TH ch="User" /><TH ch="Role" /><TH ch="Subscription" /><TH ch="Joined" /><TH ch="Status" /></tr></thead>
            <tbody>
              {pagedUsers.map(u => {
                const sub = subs.find(s => (typeof s.userId === "object" ? s.userId._id : s.userId) === u._id);
                return (
                  <TR key={u._id}>
                    <TD ch={<div style={{ display: "flex", alignItems: "center", gap: 9 }}><div style={{ width: 28, height: 28, borderRadius: "50%", background: avBg(u.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#90d4a0" }}>{initials(u.name)}</div><div><p style={{ color: TEXT, fontSize: 13, fontWeight: 500, margin: 0 }}>{u.name}</p><p style={{ color: MUTED, fontSize: 10, margin: 0 }}>{u.email}</p></div></div>} />
                    <TD ch={<span style={{ textTransform: "capitalize" }}>{u.role === "user" ? "Consumer" : u.role}</span>} />
                    <TD ch={sub ? <Pill s={sub.status} /> : <span style={{ color: MUTED, fontSize: 11 }}>No sub</span>} />
                    <TD ch={<span style={{ color: MUTED }}>{fmtDate(u.createdAt)}</span>} />
                    <TD ch={<Pill s="active" />} />
                  </TR>
                );
              })}
              {pagedUsers.length === 0 && <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: MUTED }}>No users found</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={uPage} total={filtUsers.length} perPage={U_PER} onChange={setUPage} />
      </div>
    </div>
  );

  // ─── ECOMMERCE ─────────────────────────────────────────────────────────────
  const Ecommerce = () => (
    <div>
      <div style={{ display: "flex", gap: 9, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {["all", "pending", "approved", "rejected"].map(f => (
          <button key={f} onClick={() => { setPFilter(f); setPPage(1); }} style={{ padding: "7px 12px", borderRadius: 7, border: `1px solid ${BORDER}`, background: pFilter === f ? GREEN : "rgba(255,255,255,0.04)", color: pFilter === f ? "#0a1f12" : MUTED, fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <Btn onClick={() => { setPEdit({ name: "", price: 0, category: "", description: "", stock: 0 }); setPModal("create"); }}>+ Add Product</Btn>
        </div>
      </div>
      <div style={card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><TH ch="Product" /><TH ch="Farmer" /><TH ch="Category" /><TH ch="Price" /><TH ch="Stock" /><TH ch="Status" /><TH ch="Actions" /></tr></thead>
            <tbody>
              {pagedProds.map(p => {
                const fname = typeof p.farmerId === "object" ? p.farmerId.name : "—";
                return (
                  <TR key={p._id}>
                    <TD ch={<div><p style={{ color: TEXT, fontWeight: 600, margin: 0, fontSize: 13 }}>{p.name}</p>{p.description && <p style={{ color: MUTED, fontSize: 10, margin: 0, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</p>}</div>} />
                    <TD ch={<span style={{ color: MUTED }}>{fname}</span>} />
                    <TD ch={<span style={{ textTransform: "capitalize" }}>{p.category}</span>} />
                    <TD ch={<span style={{ color: AMBER, fontWeight: 600 }}>{fmtLKR(p.price)}</span>} />
                    <TD ch={p.stock ?? "—"} />
                    <TD ch={<Pill s={p.status ?? "pending"} />} />
                    <TD ch={<div style={{ display: "flex", gap: 5 }}>
                      {p.status !== "approved" && <Btn sm onClick={() => handleProdStatus(p._id, "approved")}>Approve</Btn>}
                      {p.status !== "rejected" && <Btn sm v="danger" onClick={() => handleProdStatus(p._id, "rejected")}>Reject</Btn>}
                      <Btn sm v="ghost" onClick={() => { setPEdit({ ...p }); setPModal("edit"); }}>Edit</Btn>
                      <Btn sm v="danger" onClick={() => handleProdDelete(p._id)}>Delete</Btn>
                    </div>} />
                  </TR>
                );
              })}
              {pagedProds.length === 0 && <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: MUTED }}>No products</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={pPage} total={filtProds.length} perPage={P_PER} onChange={setPPage} />
      </div>
      {pModal && (
        <Modal title={pModal === "create" ? "Add Product" : "Edit Product"} onClose={() => setPModal(null)}>
          <FInput label="Name"        value={pEdit.name ?? ""}     onChange={v => setPEdit(x => ({ ...x, name: v }))} />
          <FInput label="Category"    value={pEdit.category ?? ""} onChange={v => setPEdit(x => ({ ...x, category: v }))} />
          <FInput label="Price (LKR)" type="number" value={pEdit.price ?? 0}  onChange={v => setPEdit(x => ({ ...x, price: +v }))} />
          <FInput label="Stock"       type="number" value={pEdit.stock ?? 0}  onChange={v => setPEdit(x => ({ ...x, stock: +v }))} />
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#4a7a5a", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Description</label>
            <textarea value={pEdit.description ?? ""} onChange={e => setPEdit(x => ({ ...x, description: e.target.value }))} rows={3}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(74,222,128,0.14)", borderRadius: 8, padding: "8px 11px", color: "#e0f4ea", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" }} />
          </div>
          <div style={{ display: "flex", gap: 9, justifyContent: "flex-end" }}>
            <Btn v="ghost" onClick={() => setPModal(null)}>Cancel</Btn>
            <Btn onClick={handleProdSave}>{pSaving ? "Saving…" : pModal === "create" ? "Create" : "Save"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );

  // ─── ANALYTICS ─────────────────────────────────────────────────────────────
  const Analytics = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Subscription Revenue", value: fmtLKR(totalRev)  },
          { label: "Total Orders",          value: orders.length     },
          { label: "Order Value",           value: fmtLKR(orders.reduce((a, o) => a + (o.totalAmount ?? 0), 0)) },
          { label: "Active Subs",           value: activeSubs.length },
        ].map((s, i) => (
          <div key={i} style={card}>
            <p style={{ color: TEXT, fontSize: 20, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 3px" }}>{s.value}</p>
            <p style={{ color: GREEN, fontSize: 11, fontWeight: 600, margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: 0 }}>All Orders</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(f => (
              <button key={f} onClick={() => { setOFilter(f); setOPage(1); }} style={{ padding: "4px 10px", borderRadius: 7, border: `1px solid ${BORDER}`, background: oFilter === f ? GREEN : "rgba(255,255,255,0.04)", color: oFilter === f ? "#0a1f12" : MUTED, fontSize: 10, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><TH ch="Order ID" /><TH ch="Consumer" /><TH ch="Amount" /><TH ch="Status" /><TH ch="Date" /></tr></thead>
            <tbody>
              {pagedOrders.map(o => {
                const cName = typeof o.consumerId === "object" ? o.consumerId.name : "—";
                return (
                  <TR key={o._id}>
                    <TD ch={<span style={{ fontFamily: "monospace", fontSize: 11, color: MUTED }}>#{o._id.slice(-6).toUpperCase()}</span>} />
                    <TD ch={<span style={{ color: TEXT, fontWeight: 500 }}>{cName}</span>} />
                    <TD ch={<span style={{ color: AMBER, fontWeight: 600 }}>{fmtLKR(o.totalAmount)}</span>} />
                    <TD ch={<Pill s={o.status} />} />
                    <TD ch={<span style={{ color: MUTED }}>{fmtDate(o.createdAt)}</span>} />
                  </TR>
                );
              })}
              {pagedOrders.length === 0 && <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: MUTED }}>No orders</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={oPage} total={filtOrders.length} perPage={O_PER} onChange={p => setOPage(p)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={card}>
          <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 12px" }}>Disease Scan Reports</p>
          {diseases.length === 0 ? <p style={{ color: MUTED, fontSize: 12 }}>No reports</p>
            : diseases.slice(0, 6).map(d => (
                <div key={d._id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <div><p style={{ color: TEXT, fontSize: 12, fontWeight: 500, margin: 0 }}>{d.cropName}</p><p style={{ color: MUTED, fontSize: 10, margin: 0 }}>{d.diagnosis}</p></div>
                  <span style={{ color: MUTED, fontSize: 10 }}>{fmtDate(d.createdAt)}</span>
                </div>
              ))}
        </div>
        <div style={card}>
          <p style={{ color: TEXT, fontSize: 14, fontWeight: 700, fontFamily: "'Sora',sans-serif", margin: "0 0 12px" }}>Weather Alerts</p>
          {weather.length === 0 ? <p style={{ color: MUTED, fontSize: 12 }}>No active alerts</p>
            : weather.map(a => (
                <div key={a._id} style={{ marginBottom: 9, padding: "9px 11px", background: "rgba(251,191,36,0.04)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: AMBER, fontWeight: 600, fontSize: 12 }}>{a.district}</span>
                    <span style={{ color: MUTED, fontSize: 10 }}>{fmtDate(a.createdAt)}</span>
                  </div>
                  <p style={{ color: "#b0d4bc", fontSize: 11, margin: "3px 0 5px" }}>{a.message}</p>
                  <Pill s={a.severity ?? "medium"} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );

  // ─── SETTINGS ──────────────────────────────────────────────────────────────
  const Settings = () => (
    <div style={{ maxWidth: 520 }}>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#0a1f12" }}>{initials(adminUser?.name)}</div>
          <div>
            <p style={{ color: TEXT, fontSize: 15, fontWeight: 700, margin: 0 }}>{adminUser?.name ?? "Admin"}</p>
            <p style={{ color: MUTED, fontSize: 12, margin: "2px 0 4px" }}>{adminUser?.email}</p>
            <Pill s="active" />
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
          {[["Farmer Price", "Rs.2,999/month"], ["Stripe Mode", "Test"], ["AI Model", "Llama 3.2 Vision"], ["Weather", "OpenWeatherMap"], ["Platform", "Agreal v1.0"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}`, fontSize: 12 }}>
              <span style={{ color: MUTED }}>{k}</span>
              <span style={{ color: TEXT, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return <div style={{ color: GREEN, padding: 40, textAlign: "center", fontSize: 14 }}>Loading data…</div>;
    switch (section) {
      case "overview":  return <Overview />;
      case "ecommerce": return <Ecommerce />;
      case "analytics": return <Analytics />;
      case "customers": return <Customers />;
      case "settings":  return <Settings />;
      default: return <div style={{ ...card, textAlign: "center", padding: 48, color: MUTED }}>{section.charAt(0).toUpperCase() + section.slice(1)} — coming soon</div>;
    }
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:#0a1a10;font-family:'DM Sans',sans-serif;color:#dff4e8;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#1a3020;border-radius:10px;}
        input::placeholder,textarea::placeholder{color:#4a7a5a;}
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: BG }}>
        {/* Sidebar */}
        <aside style={{ width: 210, flexShrink: 0, background: CARD, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          <div style={{ padding: "16px 14px 10px" }}>
            {adminUser && (
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: avBg(adminUser.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#90d4a0", flexShrink: 0 }}>{initials(adminUser.name)}</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: TEXT, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{adminUser.name}</p>
                  <p style={{ color: MUTED, fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{adminUser.email}</p>
                </div>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, borderRadius: 7, padding: "6px 10px" }}>
              <span style={{ color: MUTED, fontSize: 12 }}>⌕</span>
              <input placeholder="Search…" style={{ background: "none", border: "none", outline: "none", color: TEXT, fontSize: 12, width: "100%", fontFamily: "'DM Sans',sans-serif" }} />
              <span style={{ color: MUTED, fontSize: 9, background: "rgba(255,255,255,0.05)", padding: "1px 4px", borderRadius: 4 }}>⌘K</span>
            </div>
          </div>
          <nav style={{ flex: 1, padding: "2px 10px" }}>
            <p style={{ color: "#1e3825", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", padding: "8px 2px 3px" }}>Dashboards</p>
            {DASH_ITEMS.map(item => (
              <div key={item.id} onClick={() => setSection(item.id)} style={navI(section === item.id)}>{item.label}</div>
            ))}
            <p style={{ color: "#1e3825", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", padding: "14px 2px 3px" }}>Settings</p>
            {SET_ITEMS.map(item => (
              <div key={item.id} onClick={() => setSection(item.id)} style={navI(section === item.id)}>
                {item.label}
                {item.id === "reviews" && weather.length > 0 && <span style={{ marginLeft: "auto", background: AMBER, color: "#0a1f12", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>{weather.length}</span>}
              </div>
            ))}
          </nav>
          <div style={{ padding: "13px 14px", borderTop: `1px solid ${BORDER}` }}>
            <p style={{ color: GREEN, fontSize: 16, fontWeight: 800, fontFamily: "'Sora',sans-serif", letterSpacing: -0.5, margin: 0 }}>Agreal</p>
            <p style={{ color: MUTED, fontSize: 9, margin: 0 }}>Admin Panel</p>
          </div>
        </aside>

        {/* Centre */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <header style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: MUTED }}>
              <span>Dashboards</span><span>/</span>
              <span style={{ color: TEXT, textTransform: "capitalize" }}>{section}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ color: MUTED, fontSize: 12 }}>{dateString}</span>
              <button onClick={fetchAll} style={{ background: "rgba(74,222,128,0.07)", border: `1px solid ${BORDER}`, color: GREEN, padding: "4px 12px", borderRadius: 7, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>↻</button>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0a1f12" }}>{initials(adminUser?.name)}</div>
            </div>
          </header>

          <div style={{ display: "flex", flex: 1 }}>
            <div style={{ flex: 1, padding: "18px 20px", overflowX: "hidden", minWidth: 0 }}>
              <div style={{ marginBottom: 16 }}>
                <h1 style={{ color: TEXT, fontSize: 20, fontWeight: 700, fontFamily: "'Sora',sans-serif", textTransform: "capitalize", margin: "0 0 3px" }}>{section}</h1>
                <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>
                  {section === "overview"   && "Platform overview and key metrics"}
                  {section === "ecommerce"  && "Manage and moderate product listings"}
                  {section === "analytics"  && "Orders, revenue and platform reports"}
                  {section === "customers"  && "Registered users and subscriptions"}
                  {section === "settings"   && "Admin account and platform configuration"}
                </p>
              </div>
              {renderContent()}
            </div>
            <div style={{ width: 265, flexShrink: 0, padding: "18px 14px 18px 0", overflowY: "auto", borderLeft: `1px solid ${BORDER}` }}>
              <RightPanel />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}