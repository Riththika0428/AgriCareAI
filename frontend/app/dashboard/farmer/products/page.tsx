"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/axios-proxy";

// ── Types ──────────────────────────────────────────────────
interface Product {
  _id: string;
  cropName: string;
  category: string;
  type: string;
  price: number;
  stock: number;
  harvestDate?: string;
  organicTreatmentHistory?: string;
  trustScore: number;
  status: "Active" | "Out of Stock" | "Inactive";
}

const CATEGORIES = ["Leafy Green","Root","Fruit","Grain","Herb","Other"];
const TYPES      = ["Organic","Conventional"];
const API        = "http://localhost:5000/api";

// ── Add/Edit Modal ─────────────────────────────────────────
function ProductModal({
  product, token, onClose, onSaved,
}: {
  product: Product | null;
  token: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    cropName:                product?.cropName                || "",
    category:                product?.category                || "",
    type:                    product?.type                    || "",
    price:                   product?.price?.toString()       || "",
    stock:                   product?.stock?.toString()       || "",
    harvestDate:             product?.harvestDate             || "",
    organicTreatmentHistory: product?.organicTreatmentHistory || "",
  });
  const [loading, setLoad] = useState(false);
  const [error, setError]  = useState("");

  const handleSave = async () => {
    if (!form.cropName || !form.category || !form.type || !form.price || !form.stock) {
      setError("Please fill all required fields."); return;
    }
    setLoad(true); setError("");
    try {
      const body = {
        cropName:  form.cropName,
        category:  form.category,
        type:      form.type,
        price:     Number(form.price),
        stock:     Number(form.stock),
        harvestDate: form.harvestDate || undefined,
        organicTreatmentHistory: form.organicTreatmentHistory || undefined,
      };
      const url    = isEdit ? `${API}/products/${product!._id}` : `${API}/products`;
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to save product."); return; }
      onSaved();
      onClose();
    } catch {
      setError("Cannot connect to server.");
    } finally { setLoad(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#f9f7f3", borderRadius:"18px", padding:"32px", width:"100%", maxWidth:"560px", maxHeight:"90vh", overflowY:"auto" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
          <h2 style={{ fontSize:"20px", fontWeight:700, color:"#1a3a2a" }}>
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer", color:"#6b8070" }}>✕</button>
        </div>

        {error && (
          <div style={{ background:"#fff1f1", border:"1px solid #fcd0d0", borderRadius:"10px", padding:"10px 14px", color:"#c0392b", fontSize:"13px", marginBottom:"16px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
          {/* Crop Name */}
          <div>
            <label style={labelStyle}>Crop Name *</label>
            <input
              type="text" placeholder="e.g. Organic Spinach"
              value={form.cropName} onChange={e => setForm({...form, cropName:e.target.value})}
              style={inputStyle}
            />
          </div>
          {/* Category */}
          <div>
            <label style={labelStyle}>Category *</label>
            <select value={form.category} onChange={e => setForm({...form, category:e.target.value})} style={inputStyle}>
              <option value="">Select</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Price */}
          <div>
            <label style={labelStyle}>Price (Rs/kg) *</label>
            <input
              type="number" placeholder="150"
              value={form.price} onChange={e => setForm({...form, price:e.target.value})}
              style={inputStyle}
            />
          </div>
          {/* Stock */}
          <div>
            <label style={labelStyle}>Available Quantity (kg) *</label>
            <input
              type="number" placeholder="25"
              value={form.stock} onChange={e => setForm({...form, stock:e.target.value})}
              style={inputStyle}
            />
          </div>
          {/* Harvest Date */}
          <div>
            <label style={labelStyle}>Harvest Date</label>
            <input
              type="date"
              value={form.harvestDate} onChange={e => setForm({...form, harvestDate:e.target.value})}
              style={inputStyle}
            />
          </div>
          {/* Type */}
          <div>
            <label style={labelStyle}>Type *</label>
            <select value={form.type} onChange={e => setForm({...form, type:e.target.value})} style={inputStyle}>
              <option value="">Select</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Organic Treatment */}
        <div style={{ marginBottom:"24px" }}>
          <label style={labelStyle}>Organic Treatment History (optional)</label>
          <textarea
            placeholder="Describe treatments used..."
            value={form.organicTreatmentHistory}
            onChange={e => setForm({...form, organicTreatmentHistory:e.target.value})}
            rows={3}
            style={{ ...inputStyle, resize:"none", height:"auto" }}
          />
        </div>

        {/* Submit */}
        <button onClick={handleSave} disabled={loading} style={{
          width:"100%", padding:"13px",
          background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d6a35)",
          color:"white", border:"none", borderRadius:"10px",
          fontFamily:"'DM Sans',sans-serif", fontSize:"15px", fontWeight:700,
          cursor: loading ? "not-allowed" : "pointer",
        }}>
          {loading ? "Saving…" : isEdit ? "Save Changes" : "List Product"}
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize:"11px", fontWeight:700, color:"#6b8070",
  textTransform:"uppercase", letterSpacing:"0.06em",
  display:"block", marginBottom:"6px",
};
const inputStyle: React.CSSProperties = {
  width:"100%", padding:"10px 14px",
  border:"1.5px solid #e0ddd6", borderRadius:"10px",
  fontFamily:"'DM Sans',sans-serif", fontSize:"14px",
  color:"#1a3a2a", background:"white", outline:"none",
};

// ── Main Page ──────────────────────────────────────────────
export default function MyProductsPage() {
  const router = useRouter();
  const [token, setToken]     = useState("");
  const [products, setProds]  = useState<Product[]>([]);
  const [loading, setLoad]    = useState(true);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("agriai_token");
    if (!t) { router.push("/"); return; }
    setToken(t);
    fetchProducts(t);
  }, []);

  const fetchProducts = async (t: string) => {
    setLoad(true);
    try {
      const res  = await fetch(`${API}/products/my/list`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (res.ok) setProds(Array.isArray(data) ? data : data.products || []);
    } catch {}
    setLoad(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProds(prev => prev.filter(p => p._id !== id));
    } catch {}
    setDeleting(null);
  };

  const filtered = products.filter(p =>
    p.cropName.toLowerCase().includes(search.toLowerCase())
  );

  const CROP_ICONS: Record<string,string> = {
    "Leafy Green":"🥬", "Root":"🥕", "Fruit":"🍅",
    "Grain":"🌾", "Herb":"🌿", "Other":"🌱",
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f4f0e8", fontFamily:"'DM Sans',sans-serif", padding:"28px 32px" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" }}>
        <div>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#1a3a2a" }}>My Products</h1>
          <p style={{ fontSize:"14px", color:"#6b8070", marginTop:"4px" }}>
            Manage your listed produce on the marketplace
          </p>
        </div>
        <button
          onClick={() => { setSelected(null); setModal("add"); }}
          style={{ display:"flex", alignItems:"center", gap:"8px", padding:"11px 20px", background:"linear-gradient(135deg,#1a3a2a,#2d6a35)", color:"white", border:"none", borderRadius:"100px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, cursor:"pointer" }}
        >
          + Add Product
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display:"flex", gap:"12px", marginBottom:"24px" }}>
        <div style={{ flex:1, position:"relative" }}>
          <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"16px" }}>🔍</span>
          <input
            type="text" placeholder="Search products..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"11px 14px 11px 42px", border:"1.5px solid #e0ddd6", borderRadius:"12px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", background:"white", outline:"none" }}
          />
        </div>
        <button style={{ padding:"11px 16px", background:"white", border:"1.5px solid #e0ddd6", borderRadius:"12px", cursor:"pointer", fontSize:"18px" }}>
          ⚗️
        </button>
      </div>

      {/* Products grid */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b8070" }}>Loading products…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#c0bdb5" }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>🌱</div>
          <div style={{ fontSize:"16px" }}>No products yet. Click Add Product to get started.</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"18px" }}>
          {filtered.map(p => (
            <div key={p._id} style={{ background:"white", borderRadius:"16px", padding:"22px", border:"1px solid #e8e4dc", position:"relative" }}>
              {/* Organic badge */}
              {p.type === "Organic" && (
                <div style={{ position:"absolute", top:"16px", right:"16px", background:"#e8f5e9", color:"#2d6a35", fontSize:"11px", fontWeight:700, padding:"3px 10px", borderRadius:"100px", display:"flex", alignItems:"center", gap:"4px" }}>
                  🌿 Organic
                </div>
              )}

              {/* Crop name + category */}
              <div style={{ marginBottom:"12px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
                  <span style={{ fontSize:"22px" }}>{CROP_ICONS[p.category] || "🌱"}</span>
                  <span style={{ fontSize:"16px", fontWeight:700, color:"#1a3a2a" }}>{p.cropName}</span>
                </div>
                <div style={{ fontSize:"13px", color:"#6b8070", marginLeft:"30px" }}>{p.category}</div>
              </div>

              {/* Trust score */}
              {p.trustScore > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"12px" }}>
                  <span style={{ fontSize:"13px" }}>🌿</span>
                  <span style={{ fontSize:"13px", color:"#6b8070" }}>Trust Score:</span>
                  <span style={{ fontSize:"13px", fontWeight:700, color:"#2d6a35" }}>{p.trustScore}%</span>
                </div>
              )}

              {/* Price + Stock */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
                <div>
                  <div style={{ fontSize:"11px", color:"#9b9b9b", marginBottom:"2px" }}>Price</div>
                  <div style={{ fontSize:"15px", fontWeight:700, color:"#1a3a2a" }}>Rs. {p.price}/kg</div>
                </div>
                <div>
                  <div style={{ fontSize:"11px", color:"#9b9b9b", marginBottom:"2px" }}>Stock</div>
                  <div style={{ fontSize:"15px", fontWeight:700, color:"#1a3a2a" }}>{p.stock} kg</div>
                </div>
              </div>

              {/* Status + Actions */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{
                  fontSize:"12px", fontWeight:700, padding:"4px 14px", borderRadius:"100px",
                  background: p.status === "Active" ? "#e8f5e9" : p.status === "Out of Stock" ? "#f4f0e8" : "#fce4ec",
                  color: p.status === "Active" ? "#2d6a35" : p.status === "Out of Stock" ? "#6b8070" : "#c62828",
                  border: p.status === "Active" ? "1px solid #c8e6c9" : p.status === "Out of Stock" ? "1px solid #e0ddd6" : "1px solid #f48fb1",
                }}>
                  {p.status}
                </span>
                <div style={{ display:"flex", gap:"8px" }}>
                  <button
                    onClick={() => { setSelected(p); setModal("edit"); }}
                    style={{ width:"32px", height:"32px", borderRadius:"8px", border:"1px solid #e0ddd6", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px" }}
                    title="Edit"
                  >✏️</button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deleting === p._id}
                    style={{ width:"32px", height:"32px", borderRadius:"8px", border:"1px solid #fcd0d0", background:"#fff5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px" }}
                    title="Delete"
                  >🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {(modal === "add" || modal === "edit") && (
        <ProductModal
          product={modal === "edit" ? selected : null}
          token={token}
          onClose={() => { setModal(null); setSelected(null); }}
          onSaved={() => fetchProducts(token)}
        />
      )}
    </div>
  );
}