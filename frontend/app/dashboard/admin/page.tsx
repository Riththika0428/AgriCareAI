"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios-proxy";

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  location?: string;
  createdAt: string;
  status?: string;
}

interface Subscription {
  _id: string;
  userId: { _id: string; name: string; email: string };
  status: "active" | "trialing" | "canceled" | "past_due";
  currentPeriodEnd: string;
  createdAt: string;
}

interface Order {
  _id: string;
  consumerId: { name: string; email: string };
  farmerId: { name: string };
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: { productId: { name: string }; quantity: number; price: number }[];
}

interface Product {
  _id: string;
  name: string;
  farmerId: { name: string; email: string };
  price: number;
  category: string;
  isOrganic: boolean;
  status?: string;
  createdAt: string;
}

interface Disease {
  _id: string;
  userId: { name: string };
  cropName: string;
  diagnosis: string;
  confidence: number;
  createdAt: string;
}

interface WeatherAlert {
  _id: string;
  district: string;
  alertType: string;
  message: string;
  createdAt: string;
}

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞", group: "OVERVIEW" },
  { id: "users",     label: "Users",     icon: "👥", group: "OVERVIEW" },
  { id: "marketplace", label: "Marketplace", icon: "🛒", group: "MANAGEMENT" },
  { id: "reports",   label: "Reports",   icon: "⚠️", group: "MANAGEMENT" },
  { id: "settings",  label: "Settings",  icon: "⚙️", group: "MANAGEMENT" },
];

// ─── Safe array helper ────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArray<T>(data: any, key?: string): T[] {
  if (Array.isArray(data)) return data as T[];
  if (key && data && Array.isArray(data[key])) return data[key] as T[];
  return [];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}K`
    : String(n);

const fmtRs = (n: number) =>
  n >= 1_000_000
    ? `Rs.${(n / 1_000_000).toFixed(1)}M`
    : `Rs.${(n / 1_000).toFixed(0)}K`;

const dateFmt = (d: string) => new Date(d).toLocaleDateString("en-LK");

const statusColor = (s: string) => {
  const map: Record<string, string> = {
    active:     "#6aaa78",
    trialing:   "#d4a853",
    canceled:   "#e05252",
    past_due:   "#e05252",
    pending:    "#d4a853",
    delivered:  "#6aaa78",
    cancelled:  "#e05252",
    processing: "#6aaa78",
    approved:   "#6aaa78",
    rejected:   "#e05252",
    flagged:    "#d4a853",
  };
  return map[s?.toLowerCase()] ?? "#888";
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, badge, badgeColor,
}: {
  icon: string; label: string; value: string | number; badge?: string; badgeColor?: string;
}) {
  return (
    <div style={{
      background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12,
      padding: "22px 24px", flex: 1, minWidth: 180, position: "relative", overflow: "hidden",
    }}>
      {badge && (
        <span style={{
          position: "absolute", top: 14, right: 14,
          background: badgeColor ?? "#6aaa7830",
          color: badgeColor ? "#fff" : "#6aaa78",
          fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
        }}>{badge}</span>
      )}
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700,
        color: "#f4f0e8", letterSpacing: -1,
      }}>{value}</div>
      <div style={{ fontSize: 13, color: "#a8d5b5", marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data }: { data: { label: string; farmers: number; orders: number }[] }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.farmers, d.orders]), 1);
  return (
    <div style={{ width: "100%", paddingTop: 8 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", width: "100%" }}>
              <div style={{
                flex: 1, height: `${(d.farmers / maxVal) * 100}px`,
                background: "#6aaa78", borderRadius: "3px 3px 0 0", minHeight: 4, transition: "height 0.6s ease",
              }} />
              <div style={{
                flex: 1, height: `${(d.orders / maxVal) * 100}px`,
                background: "#d4a853", borderRadius: "3px 3px 0 0", minHeight: 4, transition: "height 0.6s ease",
              }} />
            </div>
            <div style={{ fontSize: 10, color: "#a8d5b5", textAlign: "center" }}>{d.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a8d5b5" }}>
          <span style={{ width: 10, height: 10, background: "#6aaa78", borderRadius: 2, display: "inline-block" }} />Farmers
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#a8d5b5" }}>
          <span style={{ width: 10, height: 10, background: "#d4a853", borderRadius: 2, display: "inline-block" }} />Orders
        </span>
      </div>
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ farmers, consumers }: { farmers: number; consumers: number }) {
  const total = farmers + consumers || 1;
  const r = 50;
  const circ = 2 * Math.PI * r;
  const fArc = (farmers / total) * circ;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={130} height={130} viewBox="0 0 130 130">
        <circle cx={65} cy={65} r={r} fill="none" stroke="#2d5a3d" strokeWidth={18} />
        <circle cx={65} cy={65} r={r} fill="none" stroke="#d4a853" strokeWidth={18}
          strokeDasharray={circ} strokeDashoffset={0} strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "65px 65px" }} />
        <circle cx={65} cy={65} r={r} fill="none" stroke="#6aaa78" strokeWidth={18}
          strokeDasharray={`${fArc} ${circ - fArc}`} strokeDashoffset={0} strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "65px 65px" }} />
        <text x={65} y={60} textAnchor="middle" fill="#f4f0e8" fontSize={16} fontWeight={700} fontFamily="Playfair Display, serif">
          {fmt(total)}
        </text>
        <text x={65} y={76} textAnchor="middle" fill="#a8d5b5" fontSize={10}>users</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#f4f0e8" }}>
          <span style={{ width: 10, height: 10, background: "#6aaa78", borderRadius: 2, flexShrink: 0 }} />
          Farmers&nbsp;<span style={{ color: "#6aaa78", fontWeight: 700 }}>{fmt(farmers)}</span>
          &nbsp;<span style={{ color: "#a8d5b5" }}>({((farmers / total) * 100).toFixed(0)}%)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#f4f0e8" }}>
          <span style={{ width: 10, height: 10, background: "#d4a853", borderRadius: 2, flexShrink: 0 }} />
          Consumers&nbsp;<span style={{ color: "#d4a853", fontWeight: 700 }}>{fmt(consumers)}</span>
          &nbsp;<span style={{ color: "#a8d5b5" }}>({((consumers / total) * 100).toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({
  users, subscriptions, orders, diseases, weatherAlerts,
}: {
  users: User[]; subscriptions: Subscription[]; orders: Order[];
  diseases: Disease[]; weatherAlerts: WeatherAlert[];
}) {
  const farmers   = users.filter((u) => u.role === "farmer");
  const consumers = users.filter((u) => u.role === "user" || u.role === "consumer");
  const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trialing");
  const totalRevenue = activeSubs.length * 9.99 * 375;

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return { label: d.toLocaleDateString("en-LK", { month: "short" }), month: d.getMonth(), year: d.getFullYear() };
  });

  const chartData = months.map(({ label, month, year }) => ({
    label,
    farmers: farmers.filter((u) => { const d = new Date(u.createdAt); return d.getMonth() === month && d.getFullYear() === year; }).length,
    orders:  orders.filter((o)  => { const d = new Date(o.createdAt); return d.getMonth() === month && d.getFullYear() === year; }).length,
  }));

  const recentUsers = [...users].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);

  const topDiseases = diseases.reduce<Record<string, { count: number; crop: string }>>((acc, d) => {
    const key = d.diagnosis ?? "Unknown";
    if (!acc[key]) acc[key] = { count: 0, crop: d.cropName };
    acc[key].count++;
    return acc;
  }, {});

  const topDiseaseList = Object.entries(topDiseases).sort((a, b) => b[1].count - a[1].count).slice(0, 4);

  const DISEASE_ICONS: Record<string, string> = { blight: "🍅", mildew: "🌶️", rust: "🌽", spot: "🥬", default: "🌿" };
  const diseaseIcon = (name: string) => {
    const lower = name.toLowerCase();
    for (const [k, v] of Object.entries(DISEASE_ICONS)) { if (lower.includes(k)) return v; }
    return DISEASE_ICONS.default;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Registered Users" value={fmt(users.length)} badge="+8.2%" />
        <StatCard icon="🧑‍🌾" label="Active Farmers" value={fmt(farmers.length)} badge="+5.4%" />
        <StatCard icon="🔬" label="Disease Scans Today" value={fmt(diseases.length)} badge="+14%" />
        <StatCard icon="💰" label="Platform Revenue (Month)" value={fmtRs(totalRevenue)} badge="-2.1%" badgeColor="#e05252" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700 }}>User Registration &amp; Activity</div>
            <span style={{ color: "#6aaa78", fontSize: 13, cursor: "pointer" }}>View Report →</span>
          </div>
          <MiniBarChart data={chartData} />
        </div>

        <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700 }}>System Alerts</div>
            <span style={{ color: "#6aaa78", fontSize: 13, cursor: "pointer" }}>All Alerts</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {weatherAlerts.slice(0, 3).map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i === 0 ? "#e05252" : i === 1 ? "#d4a853" : "#6aaa78",
                  marginTop: 5, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>{a.alertType}</div>
                  <div style={{ fontSize: 12, color: "#a8d5b5", marginTop: 2 }}>{a.message?.slice(0, 60)}…</div>
                  <div style={{ fontSize: 11, color: "#6aaa78", marginTop: 2 }}>{dateFmt(a.createdAt)}</div>
                </div>
              </div>
            ))}
            {weatherAlerts.length === 0 && <div style={{ fontSize: 13, color: "#a8d5b5" }}>No active alerts</div>}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6aaa78", marginTop: 5, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>System Health: All OK</div>
                <div style={{ fontSize: 12, color: "#a8d5b5", marginTop: 2 }}>All microservices running normally</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700, marginBottom: 16 }}>User Breakdown</div>
          <DonutChart farmers={farmers.length} consumers={consumers.length} />
        </div>

        <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700 }}>Top Disease Reports</div>
            <span style={{ color: "#6aaa78", fontSize: 13, cursor: "pointer" }}>View All</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {topDiseaseList.map(([name, info], i) => (
              <div key={i} style={{ background: "#162318", borderRadius: 8, padding: "12px 14px" }}>
                <div style={{ fontSize: 22 }}>{diseaseIcon(name)}</div>
                <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600, marginTop: 6 }}>{name}</div>
                <div style={{ fontSize: 11, color: "#a8d5b5" }}>{info.crop}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#6aaa78", fontWeight: 700, marginTop: 4 }}>{info.count}</div>
              </div>
            ))}
            {topDiseaseList.length === 0 && <div style={{ fontSize: 13, color: "#a8d5b5", gridColumn: "1/-1" }}>No disease reports yet</div>}
          </div>
        </div>

        <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700 }}>Recent Registrations</div>
            <span style={{ color: "#6aaa78", fontSize: 13, cursor: "pointer" }}>Manage →</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentUsers.map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: "#2d5a3d",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#6aaa78", flexShrink: 0,
                  }}>{u.name?.[0]?.toUpperCase() ?? "?"}</div>
                  <div>
                    <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "#a8d5b5" }}>{u.role === "farmer" ? "Farmer" : "Consumer"} · {u.location ?? "—"}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: statusColor(u.status ?? "active"),
                  background: `${statusColor(u.status ?? "active")}22`,
                  padding: "3px 8px", borderRadius: 20,
                }}>{u.status ?? "Active"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── USERS VIEW ───────────────────────────────────────────────────────────────
function UsersView({ users, subscriptions }: { users: User[]; subscriptions: Subscription[] }) {
  const [search, setSearch]           = useState("");
  const [roleFilter, setRoleFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const farmers   = users.filter((u) => u.role === "farmer");
  const consumers = users.filter((u) => u.role === "user" || u.role === "consumer");
  const admins    = users.filter((u) => u.role === "admin");
  const subMap    = Object.fromEntries(subscriptions.map((s) => [s.userId?._id, s.status]));

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      roleFilter === "All" ||
      (roleFilter === "Farmer"   && u.role === "farmer") ||
      (roleFilter === "Consumer" && (u.role === "user" || u.role === "consumer")) ||
      (roleFilter === "Admin"    && u.role === "admin");
    const matchStatus = statusFilter === "All" || (u.status ?? "active").toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Users"  value={fmt(users.length)} />
        <StatCard icon="🧑‍🌾" label="Farmers"    value={fmt(farmers.length)} />
        <StatCard icon="🛍️" label="Consumers"  value={fmt(consumers.length)} />
        <StatCard icon="🔑" label="Admins"      value={fmt(admins.length)} />
      </div>

      <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search users by name or email..."
            style={{ flex: 1, minWidth: 220, background: "#162318", border: "1px solid #2d5a3d", borderRadius: 8, padding: "10px 14px", color: "#f4f0e8", fontSize: 13, outline: "none" }}
          />
          {["All", "Farmer", "Consumer", "Admin"].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              padding: "8px 14px", borderRadius: 8, border: "1px solid #2d5a3d",
              background: roleFilter === r ? "#6aaa78" : "#162318",
              color: roleFilter === r ? "#fff" : "#a8d5b5",
              fontSize: 12, cursor: "pointer", fontWeight: roleFilter === r ? 700 : 400,
            }}>{r}</button>
          ))}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{
            background: "#162318", border: "1px solid #2d5a3d", borderRadius: 8,
            padding: "8px 14px", color: "#a8d5b5", fontSize: 12, cursor: "pointer",
          }}>
            {["All", "Active", "Pending", "Suspended"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
              {["USER", "ROLE", "LOCATION", "JOINED", "SUBSCRIPTION", "STATUS", "ACTIONS"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map((u, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2d5a3d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#6aaa78", flexShrink: 0 }}>
                      {u.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: "#a8d5b5" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, textTransform: "capitalize",
                    color: u.role === "farmer" ? "#6aaa78" : u.role === "admin" ? "#d4a853" : "#a8d5b5",
                    background: u.role === "farmer" ? "#6aaa7822" : u.role === "admin" ? "#d4a85322" : "#a8d5b522",
                    padding: "3px 8px", borderRadius: 20,
                  }}>{u.role === "user" ? "Consumer" : u.role}</span>
                </td>
                <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{u.location ?? "—"}</td>
                <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{dateFmt(u.createdAt)}</td>
                <td style={{ padding: "12px" }}>
                  {u.role === "farmer" ? (
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: statusColor(subMap[u._id] ?? "canceled"), background: `${statusColor(subMap[u._id] ?? "canceled")}22`, padding: "3px 8px", borderRadius: 20 }}>
                      {subMap[u._id] ?? "None"}
                    </span>
                  ) : <span style={{ color: "#a8d5b5", fontSize: 12 }}>—</span>}
                </td>
                <td style={{ padding: "12px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: statusColor(u.status ?? "active"), background: `${statusColor(u.status ?? "active")}22`, padding: "3px 8px", borderRadius: 20 }}>
                    {u.status ?? "Active"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <button style={{ background: "none", border: "none", color: "#a8d5b5", cursor: "pointer", fontSize: 18, padding: "4px 6px" }}>···</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#a8d5b5", fontSize: 14 }}>No users found</div>}
      </div>
    </div>
  );
}

// ─── MARKETPLACE VIEW ─────────────────────────────────────────────────────────
function MarketplaceView({ products, orders }: { products: Product[]; orders: Order[] }) {
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [tab, setTab] = useState<"products" | "orders">("products");

  const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
  const pending = products.filter((p) => !p.status || p.status === "pending").length;
  const organic = products.filter((p) => p.isOrganic).length;
  const filteredOrders = orderStatusFilter === "All" ? orders : orders.filter((o) => o.status?.toLowerCase() === orderStatusFilter.toLowerCase());

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="📦" label="Total Products"    value={fmt(products.length)} />
        <StatCard icon="🌿" label="Organic Listed"    value={fmt(organic)} badge={`${((organic / (products.length || 1)) * 100).toFixed(0)}% of total`} />
        <StatCard icon="⏳" label="Pending Approval"  value={fmt(pending)} badge="Needs review" badgeColor="#d4a853" />
        <StatCard icon="💰" label="Total Revenue"     value={fmtRs(totalRevenue)} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["products", "orders"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", borderRadius: 8,
            border: `1px solid ${tab === t ? "#6aaa78" : "#2d5a3d"}`,
            background: tab === t ? "#6aaa7822" : "transparent",
            color: tab === t ? "#6aaa78" : "#a8d5b5",
            fontSize: 13, fontWeight: tab === t ? 700 : 400, cursor: "pointer", textTransform: "capitalize",
          }}>{t === "products" ? "Product Listings" : "Orders"}</button>
        ))}
        {tab === "orders" && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {["All", "Pending", "Processing", "Delivered", "Cancelled"].map((s) => (
              <button key={s} onClick={() => setOrderStatusFilter(s)} style={{
                padding: "6px 12px", borderRadius: 8,
                border: `1px solid ${orderStatusFilter === s ? "#6aaa78" : "#2d5a3d"}`,
                background: orderStatusFilter === s ? "#6aaa78" : "transparent",
                color: orderStatusFilter === s ? "#fff" : "#a8d5b5",
                fontSize: 11, cursor: "pointer",
              }}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
        {tab === "products" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
                {["PRODUCT", "FARMER", "PRICE", "TYPE", "STATUS", "ACTIONS"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 20).map((p, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td style={{ padding: "12px", fontSize: 13, color: "#f4f0e8", fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{p.farmerId?.name ?? "—"}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#d4a853" }}>Rs. {p.price}/kg</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: p.isOrganic ? "#6aaa78" : "#a8d5b5", background: p.isOrganic ? "#6aaa7822" : "#a8d5b522", padding: "3px 8px", borderRadius: 20 }}>
                      {p.isOrganic ? "🌿 Organic" : "Conventional"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: statusColor(p.status ?? "active"), background: `${statusColor(p.status ?? "active")}22`, padding: "3px 8px", borderRadius: 20 }}>
                      {p.status ?? "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", display: "flex", gap: 8 }}>
                    <button style={{ background: "none", border: "none", color: "#6aaa78", cursor: "pointer", fontSize: 16 }} title="Approve">✓</button>
                    <button style={{ background: "none", border: "none", color: "#e05252", cursor: "pointer", fontSize: 16 }} title="Reject">⊘</button>
                    <button style={{ background: "none", border: "none", color: "#a8d5b5", cursor: "pointer", fontSize: 16 }} title="View">👁</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
                {["ORDER ID", "CONSUMER", "FARMER", "AMOUNT", "STATUS", "DATE"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 20).map((o, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td style={{ padding: "12px", fontSize: 12, color: "#a8d5b5", fontFamily: "monospace" }}>#{o._id.slice(-8)}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#f4f0e8" }}>{o.consumerId?.name ?? "—"}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{o.farmerId?.name ?? "—"}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#d4a853", fontWeight: 700 }}>Rs. {o.totalAmount?.toLocaleString()}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "capitalize", color: statusColor(o.status), background: `${statusColor(o.status)}22`, padding: "3px 8px", borderRadius: 20 }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", fontSize: 12, color: "#a8d5b5" }}>{dateFmt(o.createdAt)}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#a8d5b5" }}>No orders found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── REPORTS VIEW ─────────────────────────────────────────────────────────────
function ReportsView({ diseases, weatherAlerts }: { diseases: Disease[]; weatherAlerts: WeatherAlert[] }) {
  const [tab, setTab] = useState<"reports" | "disease">("reports");

  const mockReports = [
    { type: "Product", desc: "Fake organic claim on listing #234",         reporter: "Amara S.", priority: "High",   status: "Open",          date: "2026-03-05" },
    { type: "User",    desc: "Suspicious bulk orders from new account",     reporter: "System",   priority: "Medium", status: "Investigating", date: "2026-03-04" },
    { type: "System",  desc: "API rate limit exceeded for weather service", reporter: "System",   priority: "Medium", status: "Resolved",      date: "2026-03-01" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="📋" label="Open Reports"    value={mockReports.filter((r) => r.status === "Open").length} />
        <StatCard icon="🔴" label="High Priority"   value={mockReports.filter((r) => r.priority === "High").length} />
        <StatCard icon="🔬" label="Disease Alerts"  value={diseases.length} />
        <StatCard icon="🌦️" label="Weather Alerts" value={weatherAlerts.length} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["reports", "disease"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", borderRadius: 8,
            border: `1px solid ${tab === t ? "#6aaa78" : "#2d5a3d"}`,
            background: tab === t ? "#6aaa7822" : "transparent",
            color: tab === t ? "#6aaa78" : "#a8d5b5",
            fontSize: 13, fontWeight: tab === t ? 700 : 400, cursor: "pointer",
          }}>{t === "reports" ? "Reports" : "Disease Alerts"}</button>
        ))}
      </div>

      <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24 }}>
        {tab === "reports" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
                {["TYPE", "DESCRIPTION", "REPORTER", "PRIORITY", "STATUS", "ACTIONS"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockReports.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td style={{ padding: "12px" }}>
                    <span style={{ background: "#2d5a3d", color: "#a8d5b5", padding: "3px 8px", borderRadius: 6, fontSize: 11 }}>{r.type}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ fontSize: 13, color: "#f4f0e8" }}>{r.desc}</div>
                    <div style={{ fontSize: 11, color: "#a8d5b5" }}>{r.date}</div>
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{r.reporter}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: r.priority === "High" ? "#e05252" : r.priority === "Medium" ? "#d4a853" : "#6aaa78",
                      background: r.priority === "High" ? "#e0525222" : r.priority === "Medium" ? "#d4a85322" : "#6aaa7822",
                      padding: "3px 8px", borderRadius: 20,
                    }}>{r.priority}</span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: 11, color: statusColor(r.status), background: `${statusColor(r.status)}22`, padding: "3px 8px", borderRadius: 20 }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button style={{ background: "none", border: "none", color: "#a8d5b5", cursor: "pointer", fontSize: 16 }}>👁</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2d5a3d" }}>
                {["FARMER", "CROP", "DIAGNOSIS", "CONFIDENCE", "DATE"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6aaa78", fontWeight: 700, letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {diseases.slice(0, 20).map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a2e1e" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#162318")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td style={{ padding: "12px", fontSize: 13, color: "#f4f0e8" }}>{d.userId?.name ?? "—"}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#a8d5b5" }}>{d.cropName}</td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#f4f0e8" }}>{d.diagnosis}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#2d5a3d", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${d.confidence ?? 0}%`, height: "100%", background: d.confidence > 70 ? "#6aaa78" : "#d4a853", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#a8d5b5", width: 36 }}>{d.confidence}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontSize: 12, color: "#a8d5b5" }}>{dateFmt(d.createdAt)}</td>
                </tr>
              ))}
              {diseases.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#a8d5b5" }}>No disease reports</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
function SettingsView() {
  const [settings, setSettings] = useState({
    platformName: "AgriCare AI", supportEmail: "support@agriai.lk",
    maintenanceMode: false, diseaseAlerts: true, weatherAlerts: true,
    newUserNotifications: true, nutritionReminders: false,
  });

  const toggle = (key: keyof typeof settings) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: value ? "#6aaa78" : "#2d5a3d", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </div>
  );

  const Section = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
    <div style={{ background: "#1e2e24", border: "1px solid #2d5a3d", borderRadius: 12, padding: 24, marginBottom: 16 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f4f0e8", fontWeight: 700, marginBottom: 20 }}>{icon} {title}</div>
      {children}
    </div>
  );

  const Row = ({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1a2e1e" }}>
      <div>
        <div style={{ fontSize: 14, color: "#f4f0e8" }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: "#a8d5b5", marginTop: 2 }}>{sublabel}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: 780 }}>
      <Section icon="🌐" title="General">
        <Row label="Platform Name">
          <input value={settings.platformName} onChange={(e) => setSettings((s) => ({ ...s, platformName: e.target.value }))}
            style={{ background: "#162318", border: "1px solid #2d5a3d", borderRadius: 8, padding: "8px 14px", color: "#f4f0e8", fontSize: 13, width: 220, outline: "none" }} />
        </Row>
        <Row label="Support Email">
          <input value={settings.supportEmail} onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))}
            style={{ background: "#162318", border: "1px solid #2d5a3d", borderRadius: 8, padding: "8px 14px", color: "#f4f0e8", fontSize: 13, width: 220, outline: "none" }} />
        </Row>
        <Row label="Maintenance Mode" sublabel="Temporarily disable platform access">
          <Toggle value={settings.maintenanceMode} onToggle={() => toggle("maintenanceMode")} />
        </Row>
      </Section>

      <Section icon="🔔" title="Notifications">
        <Row label="Disease Outbreak Alerts" sublabel="Auto-notify farmers in affected regions">
          <Toggle value={settings.diseaseAlerts} onToggle={() => toggle("diseaseAlerts")} />
        </Row>
        <Row label="Weather Alerts" sublabel="Send location-based weather notifications">
          <Toggle value={settings.weatherAlerts} onToggle={() => toggle("weatherAlerts")} />
        </Row>
        <Row label="New User Notifications" sublabel="Alert admins on new farmer registrations">
          <Toggle value={settings.newUserNotifications} onToggle={() => toggle("newUserNotifications")} />
        </Row>
        <Row label="Consumer Nutrition Reminders" sublabel="Daily nudge for consumers to log intake">
          <Toggle value={settings.nutritionReminders} onToggle={() => toggle("nutritionReminders")} />
        </Row>
      </Section>

      <button style={{ background: "#6aaa78", border: "none", borderRadius: 10, padding: "12px 28px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
        Save Settings
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeNav, setActiveNav]       = useState("dashboard");
  const [users, setUsers]               = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [orders, setOrders]             = useState<Order[]>([]);
  const [products, setProducts]         = useState<Product[]>([]);
  const [diseases, setDiseases]         = useState<Disease[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading]           = useState(true);
  const [adminUser, setAdminUser]       = useState<{ name: string; email: string } | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    if (!stored) { router.replace("/"); return; }
    try {
      const parsed = JSON.parse(stored);
      if (parsed.role !== "admin") { router.replace("/"); return; }
      setAdminUser(parsed);
    } catch {
      router.replace("/");
      return;
    }
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [u, s, o, p, d, w] = await Promise.allSettled([
        api.get("/auth/users"),
        api.get("/subscriptions/admin/all"),
        api.get("/orders/admin/all"),
        api.get("/products/admin/all"),
        api.get("/diseases/admin/all"),
        api.get("/weather/admin/all"),
      ]);

      // ── Safe array parsing — handles any response shape ──────────────────
      if (u.status === "fulfilled") setUsers(toArray<User>(u.value.data, "users"));
      if (s.status === "fulfilled") setSubscriptions(toArray<Subscription>(s.value.data, "subscriptions"));
      if (o.status === "fulfilled") setOrders(toArray<Order>(o.value.data, "orders"));
      if (p.status === "fulfilled") setProducts(toArray<Product>(p.value.data, "products"));
      if (d.status === "fulfilled") setDiseases(toArray<Disease>(d.value.data, "diseases"));
      if (w.status === "fulfilled") setWeatherAlerts(toArray<WeatherAlert>(w.value.data, "alerts"));
    } catch (err) {
      console.error("Admin fetch error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const VIEW_TITLES: Record<string, { icon: string; title: string; sub: string }> = {
    dashboard:   { icon: "⊞", title: "Admin Dashboard",         sub: "Platform overview and key metrics" },
    users:       { icon: "👥", title: "User Management",         sub: "View and manage all platform users" },
    marketplace: { icon: "🛒", title: "Marketplace Management",  sub: "Monitor product listings, compliance, and revenue" },
    reports:     { icon: "⚠️", title: "Reports & Alerts",        sub: "Review reports, disease outbreaks, and system alerts" },
    settings:    { icon: "⚙️", title: "Platform Settings",       sub: "Configure platform-wide settings and preferences" },
  };

  const currentView = VIEW_TITLES[activeNav];
  const today = new Date().toLocaleDateString("en-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const groups = ["OVERVIEW", "MANAGEMENT"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a3a2a; }
        ::-webkit-scrollbar-thumb { background: #2d5a3d; border-radius: 3px; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: "#f4f0e8", overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 185, minWidth: 185, background: "#1a3a2a", display: "flex", flexDirection: "column", padding: "20px 0", position: "relative", zIndex: 10 }}>
          <div style={{ padding: "0 20px 24px" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#f4f0e8", letterSpacing: -0.5 }}>
              <span style={{ color: "#6aaa78" }}>Ag</span>real
            </div>
            <div style={{ marginTop: 6, background: "#2d5a3d", color: "#6aaa78", fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: "2px 8px", borderRadius: 4, display: "inline-block" }}>ADMIN</div>
          </div>

          {groups.map((group) => {
            const items = NAV.filter((n) => n.group === group);
            return (
              <div key={group} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: "#6aaa7888", fontWeight: 700, letterSpacing: 1.5, padding: "0 20px 6px" }}>{group}</div>
                {items.map((item) => {
                  const isActive = activeNav === item.id;
                  const pendingCount = item.id === "reports" ? 5 : item.id === "users" ? 12 : 0;
                  return (
                    <button key={item.id} onClick={() => setActiveNav(item.id)} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 20px",
                      background: isActive ? "#2d5a3d" : "transparent", border: "none",
                      borderLeft: isActive ? "3px solid #6aaa78" : "3px solid transparent",
                      color: isActive ? "#f4f0e8" : "#a8d5b5",
                      fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: "pointer",
                      textAlign: "left", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
                    }}>
                      <span style={{ fontSize: 15 }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {pendingCount > 0 && (
                        <span style={{ background: item.id === "reports" ? "#e05252" : "#6aaa78", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px" }}>
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          <div style={{ flex: 1 }} />

          <div style={{ padding: "16px 20px", borderTop: "1px solid #2d5a3d" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#6aaa78", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1a3a2a", flexShrink: 0 }}>
                {adminUser?.name?.[0]?.toUpperCase() ?? "S"}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, color: "#f4f0e8", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminUser?.name ?? "Super Admin"}</div>
                <div style={{ fontSize: 11, color: "#a8d5b5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminUser?.email ?? "admin@agriai.lk"}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <header style={{ background: "#1a3a2a", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #2d5a3d", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#f4f0e8" }}>Admin Dashboard</div>
              <div style={{ fontSize: 11, color: "#a8d5b5" }}>{today} · <span style={{ color: "#6aaa78" }}>All systems operational</span></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#2d5a3d", borderRadius: 8, padding: "7px 14px", border: "1px solid #3d7a52" }}>
                <span style={{ color: "#6aaa78", fontSize: 13 }}>🔍</span>
                <input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Search users, orders..."
                  style={{ background: "none", border: "none", outline: "none", color: "#f4f0e8", fontSize: 12, width: 180 }} />
              </div>
              <button style={{ background: "#2d5a3d", border: "1px solid #3d7a52", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#f4f0e8", fontSize: 16 }}>🔔</button>
              <button style={{ background: "#2d5a3d", border: "1px solid #3d7a52", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#f4f0e8", fontSize: 16 }}>⚙️</button>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#6aaa78", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1a3a2a", cursor: "pointer" }}>
                {adminUser?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
            </div>
          </header>

          <main style={{ flex: 1, overflow: "auto", padding: 28, background: "#162318" }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: "#f4f0e8", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{currentView?.icon}</span>{currentView?.title}
              </h1>
              <p style={{ color: "#a8d5b5", fontSize: 13, marginTop: 4 }}>{currentView?.sub}</p>
            </div>

            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 16 }}>
                <div style={{ width: 40, height: 40, border: "3px solid #2d5a3d", borderTop: "3px solid #6aaa78", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ color: "#a8d5b5", fontSize: 14 }}>Loading dashboard data…</div>
              </div>
            ) : (
              <>
                {activeNav === "dashboard"   && <DashboardView users={users} subscriptions={subscriptions} orders={orders} diseases={diseases} weatherAlerts={weatherAlerts} />}
                {activeNav === "users"       && <UsersView users={users} subscriptions={subscriptions} />}
                {activeNav === "marketplace" && <MarketplaceView products={products} orders={orders} />}
                {activeNav === "reports"     && <ReportsView diseases={diseases} weatherAlerts={weatherAlerts} />}
                {activeNav === "settings"    && <SettingsView />}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}