"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios-proxy";
import { 
  LayoutDashboard, Users, ShoppingBag, BarChart3, PieChart, 
  Bell, Search, Settings, LogOut, Filter, Plus, Trash2, 
  CheckCircle, XCircle, MoreVertical, TrendingUp, AlertTriangle, 
  Package, Clock, ChevronRight, Activity, ShieldAlert
} from "lucide-react";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface User { _id:string; name:string; email:string; role:string; createdAt:string; status?:string; }
interface Product { _id:string; cropName?:string; name?:string; farmerId?:{name:string;email:string}|string; price:number; category:string; stock:number; description:string; status:string; createdAt:string; }
interface Order { _id:string; consumerId:{name:string;email:string}|string; farmerId:{name:string;email:string}|string; totalAmount:number; status:string; createdAt:string; }
interface Disease { _id:string; userId:{name:string}|string; cropName:string; diagnosis:string; createdAt:string; status:string; }
interface WeatherAlert { _id:string; district:string; message:string; severity:string; createdAt:string; }

type Section = "dashboard"|"users"|"marketplace"|"reports"|"settings";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:       "#090b0c",
  sidebar:  "#0d1011",
  card:     "#141819",
  card2:    "#1a2021",
  border:   "rgba(255,255,255,0.04)",
  accent:   "#a3e635",
  text:     "#f4f0e8",
  muted:    "#94a3b8",
  subtle:   "#475569",
  green:    "#22c55e",
  red:      "#ef4444",
  amber:    "#f59e0b"
};

const sectionMeta: Record<Section, { title: string; sub: string }> = {
  dashboard:   { title: "Overview",       sub: "Platform-wide analytics and system health." },
  users:       { title: "User Directory", sub: "Manage registered farmers, consumers and staff." },
  marketplace: { title: "Marketplace",    sub: "Monitor listings, orders and product health." },
  reports:     { title: "AI Reports",     sub: "Review diagnosis history and advisory accuracy." },
  settings:    { title: "System Config",  sub: "Adjust platform parameters and security." }
};

// ─── Components ─────────────────────────────────────────────────────────────

const Avatar = ({ name, size = 32 }: { name: string; size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg, #a3e635 0%, #65a30d 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#000", fontSize: size / 2.5
  }}>
    {name?.charAt(0).toUpperCase() || "A"}
  </div>
);

const StatCard = ({ title, value, icon: Icon, delta, sub }: any) => (
  <div style={{
    background: T.card, borderRadius: 16, padding: 20, border: `1px solid ${T.border}`,
    display: "flex", flexDirection: "column"
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <div style={{ background: "rgba(163,230,53,0.08)", padding: 8, borderRadius: 10 }}>
        <Icon size={20} color={T.accent} />
      </div>
      {delta !== undefined && (
        <div style={{
          fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
          background: delta >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          color: delta >= 0 ? T.green : T.red, display: "flex", alignItems: "center", gap: 4
        }}>
          {delta >= 0 ? "↗" : "↘"} {Math.abs(delta)}%
        </div>
      )}
    </div>
    <div style={{ fontSize: 32, fontWeight: 800, color: T.text, fontFamily: "'Sora',sans-serif", lineHeight: 1, marginBottom: 8 }}>{value}</div>
    <div style={{ fontSize: 13, color: T.muted }}>{title}</div>
    {sub && <div style={{ fontSize: 11, color: T.subtle, marginTop: 4 }}>{sub}</div>}
  </div>
);

const MiniCard = ({ title, value, icon: Icon, color }: any) => (
  <div style={{ background: T.card2, borderRadius: 12, padding: "14px 16px", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 14 }}>
    <div style={{ background: `${color}15`, padding: 8, borderRadius: 8 }}>
      <Icon size={18} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 11, color: T.muted }}>{title}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{value}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("dashboard");
  const [adminUser, setAdmin] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [weather, setWeather] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals/Edit States
  const [pModal, setPModal] = useState<"create" | "edit" | null>(null);
  const [pEdit, setPEdit] = useState<Partial<Product>>({});
  const [pSaving, setPSaving] = useState(false);
  const [pError, setPError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error("Users error", e); }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/products/admin/all");
      setProducts(res.data.success && Array.isArray(res.data.products) ? res.data.products : []);
    } catch (e) { console.error("Products error", e); }
  }, []);

  const fetchDiseases = useCallback(async () => {
    try {
      const res = await api.get("/diseases/admin/all");
      setDiseases(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error("Diseases error", e); }
  }, []);

  const fetchWeather = useCallback(async () => {
    try {
      const res = await api.get("/weather/admin/all");
      setWeather(Array.isArray(res.data.alerts) ? res.data.alerts : []);
    } catch (e) { console.error("Weather error", e); }
  }, []);

  const fetchAll = useCallback(() => {
    setLoading(true);
    // Note:Stats are aggregate of current lists since no dedicated API exists
    Promise.all([fetchUsers(), fetchProducts(), fetchDiseases(), fetchWeather()])
      .finally(() => setLoading(false));
  }, [fetchUsers, fetchProducts, fetchDiseases, fetchWeather]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("agriai_token") : null;
    const userData = typeof window !== "undefined" ? localStorage.getItem("agriai_user") : null;
    let userRole = null;
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        userRole = parsed.role;
        setAdmin(parsed);
      } catch (e) { console.error("User data parse error", e); }
    }

    if (!token || userRole !== "admin") {
      router.push("/"); // Fallback if direct access
      return;
    }
    fetchAll();
  }, [router, fetchAll]);

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

  const handleProdStatus = async (id: string, current: string) => {
    const status = current === "active" ? "inactive" : "active";
    try {
      await api.patch(`/products/admin/${id}/status`, { status });
      await fetchProducts();
    } catch (e: any) { console.error("Status update failed:", e.message); }
  };

  const handleProdDelete = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => (p as any)._id !== id));
    } catch (e: any) { alert(e.response?.data?.message || "Delete failed."); }
  };

  const openCreate = () => {
    setPEdit({ name: "", category: "Seeds", price: 0, stock: 0, description: "" });
    setPError(""); setPModal("create");
  };

  const openEdit = (p: Product) => {
    setPEdit({ ...p });
    setPError(""); setPModal("edit");
  };

  const handleProdSave = async () => {
    if (!pEdit.name?.trim() || !pEdit.category || !pEdit.price) {
      setPError("Name, category, and price are required."); return;
    }
    setPSaving(true); setPError("");
    try {
      if (pModal === "create") {
        await api.post("/products", pEdit);
      } else {
        await api.put(`/products/${(pEdit as any)._id}`, pEdit);
      }
      setPModal(null);
      await fetchProducts();
    } catch (e: any) { setPError(e.response?.data?.message || "Save failed."); }
    finally { setPSaving(false); }
  };

  const renderDashboard = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
      <StatCard title="Total Platform Users" value={users.length} icon={Users} delta={12} sub="Total registered" />
      <StatCard title="Active Listings" value={products.length} icon={ShoppingBag} delta={8} sub="Marketplace items" />
      <StatCard title="Diagnosis Requests" value={diseases.length} icon={Activity} delta={-3} sub="Past 30 days" />
      <StatCard title="Weather Alerts" value={weather.length} icon={AlertTriangle} delta={2} sub="Regional active" />
      
      <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 12 }}>
        <div style={{ background: T.card, padding: 24, borderRadius: 20, border: `1px solid ${T.border}` }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <TrendingUp size={20} color={T.accent} /> Growth Trends
          </h3>
          <div style={{ height: 200, display: "flex", alignItems: "flex-end", gap: 8 }}>
            {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
              <div key={i} style={{ flex: 1, background: i === 6 ? T.accent : T.card2, height: `${h}%`, borderRadius: "4px 4px 0 0", position: "relative" }} />
            ))}
          </div>
        </div>
        <div style={{ background: T.card, padding: 24, borderRadius: 20, border: `1px solid ${T.border}` }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 20 }}>System Health</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <MiniCard title="API Response" value="124ms" icon={Activity} color={T.green} />
            <MiniCard title="Active Errors" value="0" icon={ShieldAlert} color={T.muted} />
            <MiniCard title="Server Load" value="22%" icon={BarChart3} color={T.accent} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}`, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", color: T.text }}>
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${T.border}` }}>
            <th style={{ padding: 16, textAlign: "left", fontSize: 12, color: T.muted }}>USER</th>
            <th style={{ padding: 16, textAlign: "left", fontSize: 12, color: T.muted }}>ROLE</th>
            <th style={{ padding: 16, textAlign: "left", fontSize: 12, color: T.muted }}>JOINED</th>
            <th style={{ padding: 16, textAlign: "right", fontSize: 12, color: T.muted }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} style={{ borderBottom: `1px solid ${T.border}` }}>
              <td style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar name={u.name} size={36} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>{u.email}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: 16 }}>
                <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, background: u.role === "farmer" ? "rgba(163,230,53,0.1)" : "rgba(34,197,94,0.1)", color: u.role === "farmer" ? T.accent : T.green }}>
                  {u.role ? u.role.toUpperCase() : "USER"}
                </span>
              </td>
              <td style={{ padding: 16, color: T.muted, fontSize: 13 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</td>
              <td style={{ padding: 16, textAlign: "right" }}>
                <button style={{ background: "none", border: "none", color: T.muted, cursor: "pointer" }}><MoreVertical size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMarketplace = () => (
    <div style={{ padding: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text }}>Marketplace Items</h2>
        <button onClick={openCreate} style={{ background: T.accent, color: "#000", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <Plus size={18} /> Add item
        </button>
      </div>

      <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: T.text }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${T.border}` }}>
              <th style={{ padding: 16, textAlign: "left", fontSize: 12, color: T.muted }}>PRODUCT</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 12, color: T.muted }}>CATEGORY</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 12, color: T.muted }}>PRICE</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 12, color: T.muted }}>STOCK</th>
              <th style={{ padding: 16, textAlign: "left", fontSize: 12, color: T.muted }}>STATUS</th>
              <th style={{ padding: 16, textAlign: "right", fontSize: 12, color: T.muted }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={(p as any)._id} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: 16 }}>
                  <div style={{ fontWeight: 600 }}>{p.cropName || p.name}</div>
                </td>
                <td style={{ padding: 16, color: T.muted }}>{p.category}</td>
                <td style={{ padding: 16 }}>LKR {p.price}</td>
                <td style={{ padding: 16 }}>{p.stock}</td>
                <td style={{ padding: 16 }}>
                   <button onClick={() => handleProdStatus((p as any)._id, p.status)} style={{
                     background: p.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                     color: p.status === "active" ? T.green : T.red,
                     border: "none", padding: "4px 8px", borderRadius: 6, cursor: "pointer", fontSize: 11
                   }}>
                     {p.status ? p.status.toUpperCase() : "ACTIVE"}
                   </button>
                </td>
                <td style={{ padding: 16, textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button onClick={() => openEdit(p)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer" }}><Settings size={16} /></button>
                    <button onClick={() => handleProdDelete((p as any)._id)} style={{ background: "none", border: "none", color: T.red, cursor: "pointer" }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: T.card, padding: 32, borderRadius: 24, width: 450, border: `1px solid ${T.border}` }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 20 }}>{pModal === "create" ? "Add New Product" : "Edit Product"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input type="text" placeholder="Product Name" value={pEdit.cropName || pEdit.name || ""} onChange={e => setPEdit({ ...pEdit, cropName: e.target.value })} 
                style={{ background: T.bg, border: `1px solid ${T.border}`, padding: 12, borderRadius: 10, color: T.text }} />
              <select value={pEdit.category || "Seeds"} onChange={e => setPEdit({ ...pEdit, category: e.target.value })}
                style={{ background: T.bg, border: `1px solid ${T.border}`, padding: 12, borderRadius: 10, color: T.text }}>
                <option value="Seeds">Seeds</option>
                <option value="Fertilizer">Fertilizer</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
              </select>
              <input type="number" placeholder="Price" value={pEdit.price || ""} onChange={e => setPEdit({ ...pEdit, price: parseFloat(e.target.value) })}
                style={{ background: T.bg, border: `1px solid ${T.border}`, padding: 12, borderRadius: 10, color: T.text }} />
              <input type="number" placeholder="Stock" value={pEdit.stock || ""} onChange={e => setPEdit({ ...pEdit, stock: parseInt(e.target.value) })}
                style={{ background: T.bg, border: `1px solid ${T.border}`, padding: 12, borderRadius: 10, color: T.text }} />
              <textarea placeholder="Description" value={pEdit.description || ""} onChange={e => setPEdit({ ...pEdit, description: e.target.value })}
                style={{ background: T.bg, border: `1px solid ${T.border}`, padding: 12, borderRadius: 10, color: T.text, height: 100 }} />
              
              {pError && <p style={{ color: T.red, fontSize: 13 }}>{pError}</p>}
              
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <button onClick={() => setPModal(null)} style={{ flex: 1, background: "none", border: `1px solid ${T.border}`, color: T.text, padding: 12, borderRadius: 10, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleProdSave} disabled={pSaving} style={{ flex: 1, background: T.accent, color: "#000", border: "none", padding: 12, borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
                  {pSaving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) return <div style={{ color: T.muted, textAlign: "center", padding: 40 }}>Loading platform data...</div>;
    switch (section) {
      case "dashboard": return renderDashboard();
      case "users": return renderUsers();
      case "marketplace": return renderMarketplace();
      default: return <div style={{ color: T.muted }}>Section Coming Soon: {section}</div>;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "reports", label: "Reports", icon: PieChart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.text, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 280, background: T.sidebar, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "40px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LayoutDashboard size={24} color="#000" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>AgriCare<span style={{ color: T.accent }}>.</span></span>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setSection(item.id as Section)} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer",
                background: section === item.id ? "rgba(163,230,53,0.08)" : "transparent",
                color: section === item.id ? T.accent : T.muted, transition: "0.2s"
              }}>
                <item.icon size={20} />
                <span style={{ fontWeight: 600 }}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div style={{ marginTop: "auto", padding: 24, borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Avatar name={adminUser?.name || "Admin"} size={40} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{adminUser?.name || "Administrator"}</div>
              <div style={{ fontSize: 11, color: T.muted }}>Admin Console</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%", padding: 12, borderRadius: 12, border: `1px solid ${T.border}`,
            background: "transparent", color: T.red, fontWeight: 600, cursor: "pointer"
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: 80, borderBottom: `1px solid ${T.border}`, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ position: "relative", width: 400 }}>
            <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: T.subtle }} />
            <input type="text" placeholder="Search data..." style={{
              width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, padding: "10px 16px 10px 48px", borderRadius: 12, color: T.text
            }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button style={{ position: "relative", background: "none", border: "none", color: T.muted }}>
              <Bell size={20} />
              <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: T.accent, borderRadius: "50%", border: `2px solid ${T.bg}` }} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 20, borderLeft: `1px solid ${T.border}` }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Hello, {adminUser?.name?.split(" ")[0] || "Admin"}</div>
                <div style={{ fontSize: 10, color: T.muted }}>Access: Super Admin</div>
              </div>
              <Avatar name={adminUser?.name || "A"} size={36} />
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "40px" }}>
          <p style={{color:T.muted,fontSize:12,marginBottom:18}}>{sectionMeta[section].sub}</p>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
