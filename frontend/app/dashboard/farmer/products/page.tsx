// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useRouter } from "next/navigation";
// // // import { authAPI } from "@/lib/axios-proxy";

// // // // ── Types ──────────────────────────────────────────────────
// // // interface Product {
// // //   _id: string;
// // //   cropName: string;
// // //   category: string;
// // //   type: string;
// // //   price: number;
// // //   stock: number;
// // //   harvestDate?: string;
// // //   organicTreatmentHistory?: string;
// // //   trustScore: number;
// // //   status: "Active" | "Out of Stock" | "Inactive";
// // // }

// // // const CATEGORIES = ["Leafy Green","Root","Fruit","Grain","Herb","Other"];
// // // const TYPES      = ["Organic","Conventional"];
// // // const API        = "http://localhost:5000/api";

// // // // ── Add/Edit Modal ─────────────────────────────────────────
// // // function ProductModal({
// // //   product, token, onClose, onSaved,
// // // }: {
// // //   product: Product | null;
// // //   token: string;
// // //   onClose: () => void;
// // //   onSaved: () => void;
// // // }) {
// // //   const isEdit = !!product;
// // //   const [form, setForm] = useState({
// // //     cropName:                product?.cropName                || "",
// // //     category:                product?.category                || "",
// // //     type:                    product?.type                    || "",
// // //     price:                   product?.price?.toString()       || "",
// // //     stock:                   product?.stock?.toString()       || "",
// // //     harvestDate:             product?.harvestDate             || "",
// // //     organicTreatmentHistory: product?.organicTreatmentHistory || "",
// // //   });
// // //   const [loading, setLoad] = useState(false);
// // //   const [error, setError]  = useState("");

// // //   const handleSave = async () => {
// // //     if (!form.cropName || !form.category || !form.type || !form.price || !form.stock) {
// // //       setError("Please fill all required fields."); return;
// // //     }
// // //     setLoad(true); setError("");
// // //     try {
// // //       const body = {
// // //         cropName:  form.cropName,
// // //         category:  form.category,
// // //         type:      form.type,
// // //         price:     Number(form.price),
// // //         stock:     Number(form.stock),
// // //         harvestDate: form.harvestDate || undefined,
// // //         organicTreatmentHistory: form.organicTreatmentHistory || undefined,
// // //       };
// // //       const url    = isEdit ? `${API}/products/${product!._id}` : `${API}/products`;
// // //       const method = isEdit ? "PUT" : "POST";
// // //       const res    = await fetch(url, {
// // //         method,
// // //         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
// // //         body: JSON.stringify(body),
// // //       });
// // //       const data = await res.json();
// // //       if (!res.ok) { setError(data.message || "Failed to save product."); return; }
// // //       onSaved();
// // //       onClose();
// // //     } catch {
// // //       setError("Cannot connect to server.");
// // //     } finally { setLoad(false); }
// // //   };

// // //   return (
// // //     <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
// // //       onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
// // //       <div style={{ background:"#f9f7f3", borderRadius:"18px", padding:"32px", width:"100%", maxWidth:"560px", maxHeight:"90vh", overflowY:"auto" }}>
// // //         {/* Header */}
// // //         <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
// // //           <h2 style={{ fontSize:"20px", fontWeight:700, color:"#1a3a2a" }}>
// // //             {isEdit ? "Edit Product" : "Add New Product"}
// // //           </h2>
// // //           <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer", color:"#6b8070" }}>✕</button>
// // //         </div>

// // //         {error && (
// // //           <div style={{ background:"#fff1f1", border:"1px solid #fcd0d0", borderRadius:"10px", padding:"10px 14px", color:"#c0392b", fontSize:"13px", marginBottom:"16px" }}>
// // //             ⚠️ {error}
// // //           </div>
// // //         )}

// // //         {/* Form grid */}
// // //         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
// // //           {/* Crop Name */}
// // //           <div>
// // //             <label style={labelStyle}>Crop Name *</label>
// // //             <input
// // //               type="text" placeholder="e.g. Organic Spinach"
// // //               value={form.cropName} onChange={e => setForm({...form, cropName:e.target.value})}
// // //               style={inputStyle}
// // //             />
// // //           </div>
// // //           {/* Category */}
// // //           <div>
// // //             <label style={labelStyle}>Category *</label>
// // //             <select value={form.category} onChange={e => setForm({...form, category:e.target.value})} style={inputStyle}>
// // //               <option value="">Select</option>
// // //               {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
// // //             </select>
// // //           </div>
// // //           {/* Price */}
// // //           <div>
// // //             <label style={labelStyle}>Price (Rs/kg) *</label>
// // //             <input
// // //               type="number" placeholder="150"
// // //               value={form.price} onChange={e => setForm({...form, price:e.target.value})}
// // //               style={inputStyle}
// // //             />
// // //           </div>
// // //           {/* Stock */}
// // //           <div>
// // //             <label style={labelStyle}>Available Quantity (kg) *</label>
// // //             <input
// // //               type="number" placeholder="25"
// // //               value={form.stock} onChange={e => setForm({...form, stock:e.target.value})}
// // //               style={inputStyle}
// // //             />
// // //           </div>
// // //           {/* Harvest Date */}
// // //           <div>
// // //             <label style={labelStyle}>Harvest Date</label>
// // //             <input
// // //               type="date"
// // //               value={form.harvestDate} onChange={e => setForm({...form, harvestDate:e.target.value})}
// // //               style={inputStyle}
// // //             />
// // //           </div>
// // //           {/* Type */}
// // //           <div>
// // //             <label style={labelStyle}>Type *</label>
// // //             <select value={form.type} onChange={e => setForm({...form, type:e.target.value})} style={inputStyle}>
// // //               <option value="">Select</option>
// // //               {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
// // //             </select>
// // //           </div>
// // //         </div>

// // //         {/* Organic Treatment */}
// // //         <div style={{ marginBottom:"24px" }}>
// // //           <label style={labelStyle}>Organic Treatment History (optional)</label>
// // //           <textarea
// // //             placeholder="Describe treatments used..."
// // //             value={form.organicTreatmentHistory}
// // //             onChange={e => setForm({...form, organicTreatmentHistory:e.target.value})}
// // //             rows={3}
// // //             style={{ ...inputStyle, resize:"none", height:"auto" }}
// // //           />
// // //         </div>

// // //         {/* Submit */}
// // //         <button onClick={handleSave} disabled={loading} style={{
// // //           width:"100%", padding:"13px",
// // //           background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d6a35)",
// // //           color:"white", border:"none", borderRadius:"10px",
// // //           fontFamily:"'DM Sans',sans-serif", fontSize:"15px", fontWeight:700,
// // //           cursor: loading ? "not-allowed" : "pointer",
// // //         }}>
// // //           {loading ? "Saving…" : isEdit ? "Save Changes" : "List Product"}
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // const labelStyle: React.CSSProperties = {
// // //   fontSize:"11px", fontWeight:700, color:"#6b8070",
// // //   textTransform:"uppercase", letterSpacing:"0.06em",
// // //   display:"block", marginBottom:"6px",
// // // };
// // // const inputStyle: React.CSSProperties = {
// // //   width:"100%", padding:"10px 14px",
// // //   border:"1.5px solid #e0ddd6", borderRadius:"10px",
// // //   fontFamily:"'DM Sans',sans-serif", fontSize:"14px",
// // //   color:"#1a3a2a", background:"white", outline:"none",
// // // };

// // // // ── Main Page ──────────────────────────────────────────────
// // // export default function MyProductsPage() {
// // //   const router = useRouter();
// // //   const [token, setToken]     = useState("");
// // //   const [products, setProds]  = useState<Product[]>([]);
// // //   const [loading, setLoad]    = useState(true);
// // //   const [search, setSearch]   = useState("");
// // //   const [modal, setModal]     = useState<"add" | "edit" | null>(null);
// // //   const [selected, setSelected] = useState<Product | null>(null);
// // //   const [deleting, setDeleting] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     const t = localStorage.getItem("agriai_token");
// // //     if (!t) { router.push("/"); return; }
// // //     setToken(t);
// // //     fetchProducts(t);
// // //   }, []);

// // //   const fetchProducts = async (t: string) => {
// // //     setLoad(true);
// // //     try {
// // //       const res  = await fetch(`${API}/products/my/list`, {
// // //         headers: { Authorization: `Bearer ${t}` },
// // //       });
// // //       const data = await res.json();
// // //       if (res.ok) setProds(Array.isArray(data) ? data : data.products || []);
// // //     } catch {}
// // //     setLoad(false);
// // //   };

// // //   const handleDelete = async (id: string) => {
// // //     if (!confirm("Delete this product?")) return;
// // //     setDeleting(id);
// // //     try {
// // //       await fetch(`${API}/products/${id}`, {
// // //         method: "DELETE",
// // //         headers: { Authorization: `Bearer ${token}` },
// // //       });
// // //       setProds(prev => prev.filter(p => p._id !== id));
// // //     } catch {}
// // //     setDeleting(null);
// // //   };

// // //   const filtered = products.filter(p =>
// // //     p.cropName.toLowerCase().includes(search.toLowerCase())
// // //   );

// // //   const CROP_ICONS: Record<string,string> = {
// // //     "Leafy Green":"🥬", "Root":"🥕", "Fruit":"🍅",
// // //     "Grain":"🌾", "Herb":"🌿", "Other":"🌱",
// // //   };

// // //   return (
// // //     <div style={{ minHeight:"100vh", background:"#f4f0e8", fontFamily:"'DM Sans',sans-serif", padding:"28px 32px" }}>

// // //       {/* Header */}
// // //       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" }}>
// // //         <div>
// // //           <h1 style={{ fontSize:"24px", fontWeight:700, color:"#1a3a2a" }}>My Products</h1>
// // //           <p style={{ fontSize:"14px", color:"#6b8070", marginTop:"4px" }}>
// // //             Manage your listed produce on the marketplace
// // //           </p>
// // //         </div>
// // //         <button
// // //           onClick={() => { setSelected(null); setModal("add"); }}
// // //           style={{ display:"flex", alignItems:"center", gap:"8px", padding:"11px 20px", background:"linear-gradient(135deg,#1a3a2a,#2d6a35)", color:"white", border:"none", borderRadius:"100px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", fontWeight:600, cursor:"pointer" }}
// // //         >
// // //           + Add Product
// // //         </button>
// // //       </div>

// // //       {/* Search + Filter */}
// // //       <div style={{ display:"flex", gap:"12px", marginBottom:"24px" }}>
// // //         <div style={{ flex:1, position:"relative" }}>
// // //           <span style={{ position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", fontSize:"16px" }}>🔍</span>
// // //           <input
// // //             type="text" placeholder="Search products..."
// // //             value={search} onChange={e => setSearch(e.target.value)}
// // //             style={{ width:"100%", padding:"11px 14px 11px 42px", border:"1.5px solid #e0ddd6", borderRadius:"12px", fontFamily:"'DM Sans',sans-serif", fontSize:"14px", background:"white", outline:"none" }}
// // //           />
// // //         </div>
// // //         <button style={{ padding:"11px 16px", background:"white", border:"1.5px solid #e0ddd6", borderRadius:"12px", cursor:"pointer", fontSize:"18px" }}>
// // //           ⚗️
// // //         </button>
// // //       </div>

// // //       {/* Products grid */}
// // //       {loading ? (
// // //         <div style={{ textAlign:"center", padding:"60px", color:"#6b8070" }}>Loading products…</div>
// // //       ) : filtered.length === 0 ? (
// // //         <div style={{ textAlign:"center", padding:"60px", color:"#c0bdb5" }}>
// // //           <div style={{ fontSize:"48px", marginBottom:"12px" }}>🌱</div>
// // //           <div style={{ fontSize:"16px" }}>No products yet. Click Add Product to get started.</div>
// // //         </div>
// // //       ) : (
// // //         <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"18px" }}>
// // //           {filtered.map(p => (
// // //             <div key={p._id} style={{ background:"white", borderRadius:"16px", padding:"22px", border:"1px solid #e8e4dc", position:"relative" }}>
// // //               {/* Organic badge */}
// // //               {p.type === "Organic" && (
// // //                 <div style={{ position:"absolute", top:"16px", right:"16px", background:"#e8f5e9", color:"#2d6a35", fontSize:"11px", fontWeight:700, padding:"3px 10px", borderRadius:"100px", display:"flex", alignItems:"center", gap:"4px" }}>
// // //                   🌿 Organic
// // //                 </div>
// // //               )}

// // //               {/* Crop name + category */}
// // //               <div style={{ marginBottom:"12px" }}>
// // //                 <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
// // //                   <span style={{ fontSize:"22px" }}>{CROP_ICONS[p.category] || "🌱"}</span>
// // //                   <span style={{ fontSize:"16px", fontWeight:700, color:"#1a3a2a" }}>{p.cropName}</span>
// // //                 </div>
// // //                 <div style={{ fontSize:"13px", color:"#6b8070", marginLeft:"30px" }}>{p.category}</div>
// // //               </div>

// // //               {/* Trust score */}
// // //               {p.trustScore > 0 && (
// // //                 <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"12px" }}>
// // //                   <span style={{ fontSize:"13px" }}>🌿</span>
// // //                   <span style={{ fontSize:"13px", color:"#6b8070" }}>Trust Score:</span>
// // //                   <span style={{ fontSize:"13px", fontWeight:700, color:"#2d6a35" }}>{p.trustScore}%</span>
// // //                 </div>
// // //               )}

// // //               {/* Price + Stock */}
// // //               <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
// // //                 <div>
// // //                   <div style={{ fontSize:"11px", color:"#9b9b9b", marginBottom:"2px" }}>Price</div>
// // //                   <div style={{ fontSize:"15px", fontWeight:700, color:"#1a3a2a" }}>Rs. {p.price}/kg</div>
// // //                 </div>
// // //                 <div>
// // //                   <div style={{ fontSize:"11px", color:"#9b9b9b", marginBottom:"2px" }}>Stock</div>
// // //                   <div style={{ fontSize:"15px", fontWeight:700, color:"#1a3a2a" }}>{p.stock} kg</div>
// // //                 </div>
// // //               </div>

// // //               {/* Status + Actions */}
// // //               <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
// // //                 <span style={{
// // //                   fontSize:"12px", fontWeight:700, padding:"4px 14px", borderRadius:"100px",
// // //                   background: p.status === "Active" ? "#e8f5e9" : p.status === "Out of Stock" ? "#f4f0e8" : "#fce4ec",
// // //                   color: p.status === "Active" ? "#2d6a35" : p.status === "Out of Stock" ? "#6b8070" : "#c62828",
// // //                   border: p.status === "Active" ? "1px solid #c8e6c9" : p.status === "Out of Stock" ? "1px solid #e0ddd6" : "1px solid #f48fb1",
// // //                 }}>
// // //                   {p.status}
// // //                 </span>
// // //                 <div style={{ display:"flex", gap:"8px" }}>
// // //                   <button
// // //                     onClick={() => { setSelected(p); setModal("edit"); }}
// // //                     style={{ width:"32px", height:"32px", borderRadius:"8px", border:"1px solid #e0ddd6", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px" }}
// // //                     title="Edit"
// // //                   >✏️</button>
// // //                   <button
// // //                     onClick={() => handleDelete(p._id)}
// // //                     disabled={deleting === p._id}
// // //                     style={{ width:"32px", height:"32px", borderRadius:"8px", border:"1px solid #fcd0d0", background:"#fff5f5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px" }}
// // //                     title="Delete"
// // //                   >🗑️</button>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       {/* Modal */}
// // //       {(modal === "add" || modal === "edit") && (
// // //         <ProductModal
// // //           product={modal === "edit" ? selected : null}
// // //           token={token}
// // //           onClose={() => { setModal(null); setSelected(null); }}
// // //           onSaved={() => fetchProducts(token)}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useRouter } from "next/navigation";
// // // import { productAPI } from "@/lib/axios-proxy";
// // // import { usePathname } from "next/navigation";

// // // // ── Types ──────────────────────────────────────────────────
// // // interface Product {
// // //   _id: string;
// // //   cropName: string;
// // //   category: string;
// // //   type: string;
// // //   price: number;
// // //   stock: number;
// // //   harvestDate?: string;
// // //   organicTreatmentHistory?: string;
// // //   trustScore: number;
// // //   status: "Active" | "Out of Stock" | "Inactive";
// // // }

// // // const CATEGORIES = ["Leafy Green", "Root", "Fruit", "Grain", "Herb", "Other"];
// // // const TYPES      = ["Organic", "Conventional"];

// // // // const NAV = [
// // // //   { icon: "🏠", label: "Overview",    href: "/dashboard/farmer",             section: "FARMING" },
// // // //   { icon: "🔬", label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor", section: ""        },
// // // //   { icon: "🌾", label: "My Products", href: "/dashboard/farmer/products",    section: ""        },
// // // //   { icon: "📦", label: "Orders",      href: "/dashboard/farmer/orders",      section: ""        },
// // // //   { icon: "⛈️", label: "Weather",     href: "/dashboard/farmer/weather",     section: ""        },
// // // // ];
// // // const NAV = [
// // //   { icon: "🏠", label: "Overview",    href: "/dashboard/farmer" },
// // //   { icon: "🔬", label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor" },
// // //   { icon: "🌾", label: "My Products", href: "/dashboard/farmer/products" },
// // //   { icon: "📦", label: "Orders",      href: "/dashboard/farmer/orders" },
// // //   { icon: "⛈️", label: "Weather",     href: "/dashboard/farmer/weather" },
// // // ];
// // // const CROP_ICONS: Record<string, string> = {
// // //   "Leafy Green": "🥬", Root: "🥕", Fruit: "🍅",
// // //   Grain: "🌾", Herb: "🌿", Other: "🌱",
// // // };

// // // const labelStyle: React.CSSProperties = {
// // //   fontSize: "11px", fontWeight: 700, color: "#6b8070",
// // //   textTransform: "uppercase", letterSpacing: "0.06em",
// // //   display: "block", marginBottom: "6px",
// // // };
// // // const inputStyle: React.CSSProperties = {
// // //   width: "100%", padding: "10px 14px",
// // //   border: "1.5px solid #e0ddd6", borderRadius: "10px",
// // //   fontFamily: "'DM Sans',sans-serif", fontSize: "14px",
// // //   color: "#1a3a2a", background: "white", outline: "none",
// // //   boxSizing: "border-box",
// // // };

// // // // ── Image upload helper — sends multipart/form-data ────────
// // // async function saveProduct(data: {
// // //   cropName: string; category: string; type: string;
// // //   price: string; stock: string; harvestDate: string;
// // //   organicTreatmentHistory: string; imageFile: File | null;
// // // }, productId?: string) {
// // //   const form = new FormData();
// // //   form.append("cropName",  data.cropName);
// // //   form.append("category",  data.category);
// // //   form.append("type",      data.type);
// // //   form.append("price",     data.price);
// // //   form.append("stock",     data.stock);
// // //   if (data.harvestDate)             form.append("harvestDate",             data.harvestDate);
// // //   if (data.organicTreatmentHistory) form.append("organicTreatmentHistory", data.organicTreatmentHistory);
// // //   if (data.imageFile)               form.append("image", data.imageFile);
 
// // //   if (productId) {
// // //     return api.put(`/products/${productId}`, form, {
// // //       headers: { "Content-Type": "multipart/form-data" },
// // //     });
// // //   }
// // //   return api.post("/products", form, {
// // //     headers: { "Content-Type": "multipart/form-data" },
// // //   });
// // // }

// // // // ── Add / Edit Modal ───────────────────────────────────────
// // // function ProductModal({
// // //   product, onClose, onSaved,
// // // }: {
// // //   product: Product | null;
// // //   onClose: () => void;
// // //   onSaved: () => void;
// // // }) {
// // //   const isEdit = !!product;
// // //   const [form, setForm] = useState({
// // //     cropName:                product?.cropName                  || "",
// // //     category:                product?.category                  || "",
// // //     type:                    product?.type                      || "",
// // //     price:                   product?.price?.toString()         || "",
// // //     stock:                   product?.stock?.toString()         || "",
// // //     harvestDate:             product?.harvestDate?.slice(0, 10) || "",
// // //     organicTreatmentHistory: product?.organicTreatmentHistory   || "",
// // //   });
// // //   const [loading, setLoading] = useState(false);
// // //   const [error,   setError]   = useState("");

// // //   const set = (key: string, value: string) =>
// // //     setForm(prev => ({ ...prev, [key]: value }));

// // //   const handleSave = async () => {
// // //     if (!form.cropName || !form.category || !form.type || !form.price || !form.stock) {
// // //       setError("Please fill all required fields."); return;
// // //     }
// // //     setLoading(true); setError("");
// // //     try {
// // //       const body = {
// // //         cropName:  form.cropName,
// // //         category:  form.category,
// // //         type:      form.type,
// // //         price:     Number(form.price),
// // //         stock:     Number(form.stock),
// // //         harvestDate:             form.harvestDate             || undefined,
// // //         organicTreatmentHistory: form.organicTreatmentHistory || undefined,
// // //       };
// // //       if (isEdit) {
// // //         await productAPI.update(product!._id, body);
// // //       } else {
// // //         await productAPI.create(body);
// // //       }
// // //       onSaved();
// // //       onClose();
// // //     } catch (err: any) {
// // //       setError(err.response?.data?.message || "Failed to save product.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div
// // //       style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200,
// // //         display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
// // //       onClick={e => { if (e.target === e.currentTarget) onClose(); }}
// // //     >
// // //       <div style={{ background: "#f9f7f3", borderRadius: "18px", padding: "32px",
// // //         width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>

// // //         {/* Header */}
// // //         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
// // //           <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>
// // //             {isEdit ? "Edit Product" : "Add New Product"}
// // //           </h2>
// // //           <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b8070" }}>✕</button>
// // //         </div>

// // //         {error && (
// // //           <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "10px",
// // //             padding: "10px 14px", color: "#c0392b", fontSize: "13px", marginBottom: "16px" }}>
// // //             ⚠️ {error}
// // //           </div>
// // //         )}

// // //          {/* ── Image Upload ── */}
// // //         <div style={{ marginBottom: "20px" }}>
// // //           <label style={labelStyle}>Product Image (optional)</label>
// // //           <div
// // //             onClick={() => fileInputRef.current?.click()}
// // //             style={{
// // //               border: "2px dashed #c8e6c9", borderRadius: "12px",
// // //               padding: "16px", cursor: "pointer", textAlign: "center",
// // //               background: imagePreview ? "#f0fdf4" : "#fff",
// // //               transition: "all 0.2s",
// // //               position: "relative", overflow: "hidden",
// // //               minHeight: imagePreview ? "160px" : "100px",
// // //               display: "flex", alignItems: "center", justifyContent: "center",
// // //             }}
// // //           >
// // //             {imagePreview ? (
// // //               <div style={{ position: "relative", width: "100%" }}>
// // //                 <img
// // //                   src={imagePreview} alt="preview"
// // //                   style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain", borderRadius: "8px" }}
// // //                 />
// // //                 <div style={{ position: "absolute", top: 4, right: 4, background: "#1a3a2a",
// // //                   color: "#fff", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: 700 }}>
// // //                   Click to change
// // //                 </div>
// // //               </div>
// // //             ) : (
// // //               <div>
// // //                 <div style={{ fontSize: "32px", marginBottom: "6px" }}>📷</div>
// // //                 <div style={{ fontSize: "13px", color: "#6b8070", fontWeight: 600 }}>
// // //                   Click to upload image
// // //                 </div>
// // //                 <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
// // //                   JPG, PNG or WebP · Max 5MB
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //           <input
// // //             ref={fileInputRef}
// // //             type="file"
// // //             accept="image/jpeg,image/png,image/webp"
// // //             onChange={handleImageChange}
// // //             style={{ display: "none" }}
// // //           />
// // //           {imageFile && (
// // //             <div style={{ fontSize: "11px", color: "#6b8070", marginTop: "4px" }}>
// // //               📎 {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
// // //               <button
// // //                 onClick={() => { setImageFile(null); setImagePreview(product?.imageUrl ? `http://localhost:5000${product.imageUrl}` : ""); }}
// // //                 style={{ marginLeft: "8px", background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "11px" }}
// // //               >Remove</button>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Form */}
// // //         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
// // //           <div>
// // //             <label style={labelStyle}>Crop Name *</label>
// // //             <input type="text" placeholder="e.g. Organic Spinach"
// // //               value={form.cropName} onChange={e => set("cropName", e.target.value)} style={inputStyle} />
// // //           </div>
// // //           <div>
// // //             <label style={labelStyle}>Category *</label>
// // //             <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
// // //               <option value="">Select</option>
// // //               {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
// // //             </select>
// // //           </div>
// // //           <div>
// // //             <label style={labelStyle}>Price (Rs/kg) *</label>
// // //             <input type="number" placeholder="150" min="1"
// // //               value={form.price} onChange={e => set("price", e.target.value)} style={inputStyle} />
// // //           </div>
// // //           <div>
// // //             <label style={labelStyle}>Stock (kg) *</label>
// // //             <input type="number" placeholder="25" min="0"
// // //               value={form.stock} onChange={e => set("stock", e.target.value)} style={inputStyle} />
// // //           </div>
// // //           <div>
// // //             <label style={labelStyle}>Harvest Date</label>
// // //             <input type="date"
// // //               value={form.harvestDate} onChange={e => set("harvestDate", e.target.value)} style={inputStyle} />
// // //           </div>
// // //           <div>
// // //             <label style={labelStyle}>Type *</label>
// // //             <select value={form.type} onChange={e => set("type", e.target.value)} style={inputStyle}>
// // //               <option value="">Select</option>
// // //               {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
// // //             </select>
// // //           </div>
// // //         </div>

// // //         <div style={{ marginBottom: "24px" }}>
// // //           <label style={labelStyle}>Organic Treatment History (optional)</label>
// // //           <textarea placeholder="Describe treatments used..."
// // //             value={form.organicTreatmentHistory}
// // //             onChange={e => set("organicTreatmentHistory", e.target.value)}
// // //             rows={3}
// // //             style={{ ...inputStyle, resize: "vertical", height: "auto" }}
// // //           />
// // //         </div>

// // //         <button onClick={handleSave} disabled={loading} style={{
// // //           width: "100%", padding: "13px",
// // //           background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
// // //           color: "white", border: "none", borderRadius: "10px",
// // //           fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 700,
// // //           cursor: loading ? "not-allowed" : "pointer",
// // //         }}>
// // //           {loading ? "Saving…" : isEdit ? "Save Changes" : "List Product"}
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // ── Main Page ──────────────────────────────────────────────
// // // export default function MyProductsPage() {
// // //   const router = useRouter();
// // //   const [user, setUser]         = useState<{ name: string } | null>(null);
// // //   const [products, setProducts] = useState<Product[]>([]);
// // //   const [loading, setLoading]   = useState(true);
// // //   const [search, setSearch]     = useState("");
// // //   const [modal, setModal]       = useState<"add" | "edit" | null>(null);
// // //   const [selected, setSelected] = useState<Product | null>(null);
// // //   const [deleting, setDeleting] = useState<string | null>(null);
// // //   const [error, setError]       = useState("");
// // //    const pathname = usePathname()
// // // //   const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

// // //   // ── Auth guard ─────────────────────────────────────────
// // //   useEffect(() => {
// // //     const stored = localStorage.getItem("agriai_user");
// // //     const token  = localStorage.getItem("agriai_token");
// // //     if (!stored || !token) { router.push("/"); return; }
// // //     const u = JSON.parse(stored);
// // //     if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
// // //     setUser(u);
// // //     fetchProducts();
// // //   }, []);

// // //   // ── Fetch products via productAPI ──────────────────────
// // //   const fetchProducts = async () => {
// // //     setLoading(true); setError("");
// // //     try {
// // //       const { data } = await productAPI.getMyProducts();
// // //       // Backend may return array or { products: [...] }
// // //       setProducts(Array.isArray(data) ? data : data.products || []);
// // //     } catch (err: any) {
// // //       setError(err.response?.data?.message || "Failed to load products. Is the backend running?");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ── Delete via productAPI ──────────────────────────────
// // //   const handleDelete = async (id: string) => {
// // //     if (!confirm("Delete this product? This cannot be undone.")) return;
// // //     setDeleting(id);
// // //     try {
// // //       await productAPI.remove(id);
// // //       setProducts(prev => prev.filter(p => p._id !== id));
// // //     } catch (err: any) {
// // //       alert(err.response?.data?.message || "Delete failed.");
// // //     } finally {
// // //       setDeleting(null);
// // //     }
// // //   };

// // //   const handleLogout = () => {
// // //     localStorage.removeItem("agriai_token");
// // //     localStorage.removeItem("agriai_user");
// // //     router.push("/");
// // //   };

// // //   const filtered = products.filter(p =>
// // //     p.cropName.toLowerCase().includes(search.toLowerCase())
// // //   );

// // //   const getInitial = () => (user?.name || "F")[0].toUpperCase();

// // //   return (
// // //     <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#f4f0e8" }}>

// // //       {/* ══ SIDEBAR ══ */}
// // //       <aside style={{ width: 190, background: "linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
// // //         display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>

// // //         <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
// // //           <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>
// // //             Agri<span style={{ color: "#6aaa78" }}>AI</span>
// // //           </div>
// // //         </div>

// // //         <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
// // //           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// // //             <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#6aaa78",
// // //               display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>
// // //               {getInitial()}
// // //             </div>
// // //             <div>
// // //               <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
// // //               <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11 }}>My Farm</div>
// // //             </div>
// // //           </div>
// // //         </div>

        
// // //         <nav style={{ flex:1, padding:"12px 0", overflowY:"auto" }}>
// // //   {NAV.map((item, i) => {
// // //     const isActive = pathname === item.href;

// // //     return (
// // //       <div key={item.href}>
// // //         <button
// // //           onClick={() => router.push(item.href)}
// // //           style={{
// // //             width:"100%", display:"flex", alignItems:"center", gap:10,
// // //             padding:"10px 20px", border:"none",
// // //             background: isActive ? "rgba(106,170,120,.2)" : "transparent",
// // //             borderLeft: isActive ? "3px solid #6aaa78" : "3px solid transparent",
// // //             color: isActive ? "#fff" : "rgba(255,255,255,.55)",
// // //             fontSize:13, fontWeight: isActive ? 600 : 400,
// // //             cursor:"pointer", transition:"all .2s", textAlign:"left",
// // //           }}
// // //         >
// // //           <span>{item.icon}</span>{item.label}
// // //         </button>
// // //       </div>
// // //     );
// // //   })}
// // // </nav>

// // //         <div style={{ padding: "12px 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
// // //           <a href="/dashboard/farmer/settings" style={{ display: "flex", alignItems: "center", gap: 10,
// // //             padding: "10px 20px", textDecoration: "none", color: "rgba(255,255,255,.45)", fontSize: 13 }}>
// // //             ⚙️ Settings
// // //           </a>
// // //           <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10,
// // //             padding: "10px 20px", border: "none", background: "transparent",
// // //             color: "#ef4444", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
// // //             🚪 Sign Out
// // //           </button>
// // //         </div>
// // //       </aside>

// // //       {/* ══ MAIN ══ */}
// // //       <main style={{ marginLeft: 190, flex: 1, padding: "28px 32px" }}>

// // //         {/* Page header */}
// // //         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
// // //           <div>
// // //             <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>My Products</h1>
// // //             <p style={{ fontSize: "14px", color: "#6b8070", marginTop: "4px" }}>
// // //               Manage your produce listings · {products.length} product{products.length !== 1 ? "s" : ""}
// // //             </p>
// // //           </div>
// // //           <button
// // //             onClick={() => { setSelected(null); setModal("add"); }}
// // //             style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px",
// // //               background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "white", border: "none",
// // //               borderRadius: "100px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px",
// // //               fontWeight: 600, cursor: "pointer" }}
// // //           >
// // //             + Add Product
// // //           </button>
// // //         </div>

// // //         {/* Search */}
// // //         <div style={{ marginBottom: "24px", position: "relative", maxWidth: "420px" }}>
// // //           <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
// // //           <input type="text" placeholder="Search products…"
// // //             value={search} onChange={e => setSearch(e.target.value)}
// // //             style={{ width: "100%", padding: "11px 14px 11px 42px", border: "1.5px solid #e0ddd6",
// // //               borderRadius: "12px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px",
// // //               background: "white", outline: "none", boxSizing: "border-box" }}
// // //           />
// // //         </div>

// // //         {/* Error banner */}
// // //         {error && (
// // //           <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "12px",
// // //             padding: "14px 18px", color: "#c0392b", fontSize: "14px", marginBottom: "20px",
// // //             display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// // //             <span>⚠️ {error}</span>
// // //             <button onClick={fetchProducts} style={{ background: "#1a3a2a", color: "#fff", border: "none",
// // //               borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
// // //               Retry
// // //             </button>
// // //           </div>
// // //         )}

// // //         {/* Products grid */}
// // //         {loading ? (
// // //           <div style={{ textAlign: "center", padding: "80px", color: "#6b8070" }}>
// // //             <div style={{ fontSize: 36, marginBottom: 12 }}>🌾</div>
// // //             <div style={{ fontWeight: 600 }}>Loading products…</div>
// // //           </div>
// // //         ) : filtered.length === 0 ? (
// // //           <div style={{ textAlign: "center", padding: "80px", color: "#c0bdb5" }}>
// // //             <div style={{ fontSize: "52px", marginBottom: "14px" }}>🌱</div>
// // //             <div style={{ fontSize: "16px", color: "#6b8070", fontWeight: 500 }}>
// // //               {search ? `No products match "${search}"` : "No products yet. Click + Add Product to start selling."}
// // //             </div>
// // //           </div>
// // //         ) : (
// // //           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px" }}>
// // //             {filtered.map(p => (
// // //               <div key={p._id} style={{ background: "white", borderRadius: "16px", padding: "22px",
// // //                 border: "1px solid #e8e4dc", position: "relative",
// // //                 boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>

// // //                    {/* ── Product Image ── */}
// // //                 <div style={{ height: "140px", background: "#f0fdf4",
// // //                   display: "flex", alignItems: "center", justifyContent: "center",
// // //                   overflow: "hidden", position: "relative" }}>
// // //                   {p.imageUrl ? (
// // //                     <img
// // //                       src={`http://localhost:5000${p.imageUrl}`}
// // //                       alt={p.cropName}
// // //                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
// // //                       onError={e => {
// // //                         (e.target as HTMLImageElement).style.display = "none";
// // //                         (e.target as HTMLImageElement).nextElementSibling?.setAttribute("style", "display:flex");
// // //                       }}
// // //                     />
// // //                   ) : null}
// // //                   <div style={{
// // //                     display: p.imageUrl ? "none" : "flex",
// // //                     alignItems: "center", justifyContent: "center",
// // //                     width: "100%", height: "100%",
// // //                     fontSize: "52px",
// // //                   }}>
// // //                     {CROP_ICONS[p.category] || "🌱"}
// // //                   </div>

// // //                 {/* Organic badge */}
// // //                 {p.type === "Organic" && (
// // //                   <div style={{ position: "absolute", top: "16px", right: "16px", background: "#e8f5e9",
// // //                     color: "#2d6a35", fontSize: "11px", fontWeight: 700, padding: "3px 10px",
// // //                     borderRadius: "100px" }}>
// // //                     🌿 Organic
// // //                   </div>
// // //                 )}

// // //                 {/* Crop name */}
// // //                 <div style={{ marginBottom: "14px" }}>
// // //                   <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
// // //                     <span style={{ fontSize: "22px" }}>{CROP_ICONS[p.category] || "🌱"}</span>
// // //                     <span style={{ fontSize: "16px", fontWeight: 700, color: "#1a3a2a" }}>{p.cropName}</span>
// // //                   </div>
// // //                   <div style={{ fontSize: "13px", color: "#6b8070", marginLeft: "30px" }}>{p.category}</div>
// // //                 </div>

// // //                 {/* Trust score */}
// // //                 {p.trustScore > 0 && (
// // //                   <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
// // //                     <span style={{ fontSize: "13px" }}>⭐</span>
// // //                     <span style={{ fontSize: "13px", color: "#6b8070" }}>Trust Score:</span>
// // //                     <span style={{ fontSize: "13px", fontWeight: 700, color: "#2d5a3d" }}>{p.trustScore}%</span>
// // //                   </div>
// // //                 )}

// // //                 {/* Price + Stock */}
// // //                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
// // //                   <div>
// // //                     <div style={{ fontSize: "11px", color: "#9b9b9b", marginBottom: "2px" }}>Price</div>
// // //                     <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a3a2a" }}>Rs. {p.price}/kg</div>
// // //                   </div>
// // //                   <div>
// // //                     <div style={{ fontSize: "11px", color: "#9b9b9b", marginBottom: "2px" }}>Stock</div>
// // //                     <div style={{ fontSize: "15px", fontWeight: 700, color: p.stock === 0 ? "#ef4444" : "#1a3a2a" }}>
// // //                       {p.stock} kg
// // //                     </div>
// // //                   </div>
// // //                 </div>

// // //                 {/* Harvest date */}
// // //                 {p.harvestDate && (
// // //                   <div style={{ fontSize: "12px", color: "#6b8070", marginBottom: "12px" }}>
// // //                     🗓 {new Date(p.harvestDate).toLocaleDateString("en-CA")}
// // //                   </div>
// // //                 )}

// // //                 {/* Status + Actions */}
// // //                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// // //                   <span style={{
// // //                     fontSize: "12px", fontWeight: 700, padding: "4px 14px", borderRadius: "100px",
// // //                     background: p.status === "Active" ? "#e8f5e9" : p.status === "Out of Stock" ? "#f4f0e8" : "#fce4ec",
// // //                     color:      p.status === "Active" ? "#2d6a35" : p.status === "Out of Stock" ? "#6b8070" : "#c62828",
// // //                     border:     p.status === "Active" ? "1px solid #c8e6c9" : p.status === "Out of Stock" ? "1px solid #e0ddd6" : "1px solid #f48fb1",
// // //                   }}>
// // //                     {p.status}
// // //                   </span>
// // //                   <div style={{ display: "flex", gap: "8px" }}>
// // //                     <button onClick={() => { setSelected(p); setModal("edit"); }}
// // //                       title="Edit"
// // //                       style={{ width: "32px", height: "32px", borderRadius: "8px",
// // //                         border: "1px solid #e0ddd6", background: "white", cursor: "pointer",
// // //                         display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>
// // //                       ✏️
// // //                     </button>
// // //                     <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
// // //                       title="Delete"
// // //                       style={{ width: "32px", height: "32px", borderRadius: "8px",
// // //                         border: "1px solid #fcd0d0", background: "#fff5f5", cursor: "pointer",
// // //                         display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
// // //                         opacity: deleting === p._id ? 0.5 : 1 }}>
// // //                       🗑️
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </main>

// // //       {/* Modal */}
// // //       {(modal === "add" || modal === "edit") && (
// // //         <ProductModal
// // //           product={modal === "edit" ? selected : null}
// // //           onClose={() => { setModal(null); setSelected(null); }}
// // //           onSaved={fetchProducts}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useState, useEffect, useRef } from "react";
// // import { useRouter } from "next/navigation";
// // import { usePathname } from "next/navigation";
// // import api, { productAPI } from "@/lib/axios-proxy";

// // // ── Types ──────────────────────────────────────────────────
// // interface Product {
// //   _id: string;
// //   cropName: string;
// //   category: string;
// //   type: string;
// //   price: number;
// //   stock: number;
// //   harvestDate?: string;
// //   organicTreatmentHistory?: string;
// //   trustScore: number;
// //   status: "Active" | "Out of Stock" | "Inactive";
// //   imageUrl?: string;
// // }

// // const CATEGORIES = ["Leafy Green", "Root", "Fruit", "Grain", "Herb", "Other"];
// // const TYPES      = ["Organic", "Conventional"];
// // const NAV = [
// //   { icon: "🏠", label: "Overview",    href: "/dashboard/farmer" },
// //   { icon: "🔬", label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor" },
// //   { icon: "🌾", label: "My Products", href: "/dashboard/farmer/products" },
// //   { icon: "📦", label: "Orders",      href: "/dashboard/farmer/orders" },
// //   { icon: "⛈️", label: "Weather",     href: "/dashboard/farmer/weather" },
// // ];
// // const CROP_ICONS: Record<string, string> = {
// //   "Leafy Green": "🥬", Root: "🥕", Fruit: "🍅",
// //   Grain: "🌾", Herb: "🌿", Other: "🌱",
// // };
// // const labelStyle: React.CSSProperties = {
// //   fontSize: "11px", fontWeight: 700, color: "#6b8070",
// //   textTransform: "uppercase", letterSpacing: "0.06em",
// //   display: "block", marginBottom: "6px",
// // };
// // const inputStyle: React.CSSProperties = {
// //   width: "100%", padding: "10px 14px",
// //   border: "1.5px solid #e0ddd6", borderRadius: "10px",
// //   fontFamily: "'DM Sans',sans-serif", fontSize: "14px",
// //   color: "#1a3a2a", background: "white", outline: "none",
// //   boxSizing: "border-box",
// // };

// // // ── Save product with multipart/form-data ──────────────────
// // async function saveProduct(
// //   data: {
// //     cropName: string; category: string; type: string;
// //     price: string; stock: string; harvestDate: string;
// //     organicTreatmentHistory: string; imageFile: File | null;
// //   },
// //   productId?: string
// // ) {
// //   const form = new FormData();
// //   form.append("cropName", data.cropName);
// //   form.append("category", data.category);
// //   form.append("type",     data.type);
// //   form.append("price",    data.price);
// //   form.append("stock",    data.stock);
// //   if (data.harvestDate)             form.append("harvestDate",             data.harvestDate);
// //   if (data.organicTreatmentHistory) form.append("organicTreatmentHistory", data.organicTreatmentHistory);
// //   if (data.imageFile)               form.append("image", data.imageFile);

// //   const config = { headers: { "Content-Type": "multipart/form-data" } };
// //   return productId
// //     ? api.put(`/products/${productId}`, form, config)
// //     : api.post("/products", form, config);
// // }

// // // ── Add / Edit Modal ───────────────────────────────────────
// // function ProductModal({
// //   product, onClose, onSaved,
// // }: {
// //   product: Product | null;
// //   onClose: () => void;
// //   onSaved: () => void;
// // }) {
// //   const isEdit       = !!product;
// //   const fileInputRef = useRef<HTMLInputElement>(null);   // ✅ declared here

// //   const [form, setForm] = useState({
// //     cropName:                product?.cropName                  || "",
// //     category:                product?.category                  || "",
// //     type:                    product?.type                      || "",
// //     price:                   product?.price?.toString()         || "",
// //     stock:                   product?.stock?.toString()         || "",
// //     harvestDate:             product?.harvestDate?.slice(0, 10) || "",
// //     organicTreatmentHistory: product?.organicTreatmentHistory   || "",
// //   });

// //   // ✅ imageFile and imagePreview declared here inside the modal
// //   const [imageFile,    setImageFile]    = useState<File | null>(null);
// //   const [imagePreview, setImagePreview] = useState<string>(
// //     product?.imageUrl ? `http://localhost:5000${product.imageUrl}` : ""
// //   );
// //   const [loading, setLoading] = useState(false);
// //   const [error,   setError]   = useState("");

// //   const set = (key: string, value: string) =>
// //     setForm(prev => ({ ...prev, [key]: value }));

// //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;
// //     setImageFile(file);
// //     setImagePreview(URL.createObjectURL(file));
// //   };

// //   const handleSave = async () => {
// //     if (!form.cropName || !form.category || !form.type || !form.price || !form.stock) {
// //       setError("Please fill all required fields."); return;
// //     }
// //     setLoading(true); setError("");
// //     try {
// //       await saveProduct({ ...form, imageFile }, isEdit ? product!._id : undefined);
// //       onSaved();
// //       onClose();
// //     } catch (err: any) {
// //       setError(err.response?.data?.message || "Failed to save product.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div
// //       style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200,
// //         display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
// //       onClick={e => { if (e.target === e.currentTarget) onClose(); }}
// //     >
// //       <div style={{ background: "#f9f7f3", borderRadius: "18px", padding: "32px",
// //         width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto" }}>

// //         {/* Header */}
// //         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
// //           <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>
// //             {isEdit ? "Edit Product" : "Add New Product"}
// //           </h2>
// //           <button onClick={onClose}
// //             style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b8070" }}>
// //             ✕
// //           </button>
// //         </div>

// //         {error && (
// //           <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "10px",
// //             padding: "10px 14px", color: "#c0392b", fontSize: "13px", marginBottom: "16px" }}>
// //             ⚠️ {error}
// //           </div>
// //         )}

// //         {/* Image Upload */}
// //         <div style={{ marginBottom: "20px" }}>
// //           <label style={labelStyle}>Product Image (optional)</label>
// //           <div
// //             onClick={() => fileInputRef.current?.click()}
// //             style={{
// //               border: "2px dashed #c8e6c9", borderRadius: "12px", padding: "16px",
// //               cursor: "pointer", textAlign: "center",
// //               background: imagePreview ? "#f0fdf4" : "#fff",
// //               minHeight: imagePreview ? "160px" : "100px",
// //               display: "flex", alignItems: "center", justifyContent: "center",
// //               position: "relative", overflow: "hidden",
// //             }}
// //           >
// //             {imagePreview ? (
// //               <div style={{ position: "relative", width: "100%" }}>
// //                 <img src={imagePreview} alt="preview"
// //                   style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain", borderRadius: "8px" }} />
// //                 <div style={{ position: "absolute", top: 4, right: 4, background: "#1a3a2a",
// //                   color: "#fff", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: 700 }}>
// //                   Click to change
// //                 </div>
// //               </div>
// //             ) : (
// //               <div>
// //                 <div style={{ fontSize: "32px", marginBottom: "6px" }}>📷</div>
// //                 <div style={{ fontSize: "13px", color: "#6b8070", fontWeight: 600 }}>Click to upload image</div>
// //                 <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>JPG, PNG or WebP · Max 5MB</div>
// //               </div>
// //             )}
// //           </div>
// //           <input
// //             ref={fileInputRef}
// //             type="file"
// //             accept="image/jpeg,image/png,image/webp"
// //             onChange={handleImageChange}
// //             style={{ display: "none" }}
// //           />
// //           {imageFile && (
// //             <div style={{ fontSize: "11px", color: "#6b8070", marginTop: "4px" }}>
// //               📎 {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
// //               <button
// //                 onClick={() => {
// //                   setImageFile(null);
// //                   setImagePreview(product?.imageUrl ? `http://localhost:5000${product.imageUrl}` : "");
// //                 }}
// //                 style={{ marginLeft: "8px", background: "none", border: "none",
// //                   color: "#ef4444", cursor: "pointer", fontSize: "11px" }}>
// //                 Remove
// //               </button>
// //             </div>
// //           )}
// //         </div>

// //         {/* Form grid */}
// //         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
// //           <div>
// //             <label style={labelStyle}>Crop Name *</label>
// //             <input type="text" placeholder="e.g. Organic Spinach"
// //               value={form.cropName} onChange={e => set("cropName", e.target.value)} style={inputStyle} />
// //           </div>
// //           <div>
// //             <label style={labelStyle}>Category *</label>
// //             <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
// //               <option value="">Select</option>
// //               {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
// //             </select>
// //           </div>
// //           <div>
// //             <label style={labelStyle}>Price (Rs/kg) *</label>
// //             <input type="number" placeholder="150" min="1"
// //               value={form.price} onChange={e => set("price", e.target.value)} style={inputStyle} />
// //           </div>
// //           <div>
// //             <label style={labelStyle}>Stock (kg) *</label>
// //             <input type="number" placeholder="25" min="0"
// //               value={form.stock} onChange={e => set("stock", e.target.value)} style={inputStyle} />
// //           </div>
// //           <div>
// //             <label style={labelStyle}>Harvest Date</label>
// //             <input type="date"
// //               value={form.harvestDate} onChange={e => set("harvestDate", e.target.value)} style={inputStyle} />
// //           </div>
// //           <div>
// //             <label style={labelStyle}>Type *</label>
// //             <select value={form.type} onChange={e => set("type", e.target.value)} style={inputStyle}>
// //               <option value="">Select</option>
// //               {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
// //             </select>
// //           </div>
// //         </div>

// //         <div style={{ marginBottom: "24px" }}>
// //           <label style={labelStyle}>Organic Treatment History (optional)</label>
// //           <textarea placeholder="Describe treatments used..."
// //             value={form.organicTreatmentHistory}
// //             onChange={e => set("organicTreatmentHistory", e.target.value)}
// //             rows={3}
// //             style={{ ...inputStyle, resize: "vertical", height: "auto" }}
// //           />
// //         </div>

// //         <button onClick={handleSave} disabled={loading} style={{
// //           width: "100%", padding: "13px",
// //           background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
// //           color: "white", border: "none", borderRadius: "10px",
// //           fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 700,
// //           cursor: loading ? "not-allowed" : "pointer",
// //         }}>
// //           {loading ? "Saving…" : isEdit ? "Save Changes" : "List Product"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // // ── Main Page ──────────────────────────────────────────────
// // export default function MyProductsPage() {
// //   const router   = useRouter();
// //   const pathname = usePathname();
// //   const [user,     setUser]     = useState<{ name: string } | null>(null);
// //   const [products, setProducts] = useState<Product[]>([]);
// //   const [loading,  setLoading]  = useState(true);
// //   const [search,   setSearch]   = useState("");
// //   const [modal,    setModal]    = useState<"add" | "edit" | null>(null);
// //   const [selected, setSelected] = useState<Product | null>(null);
// //   const [deleting, setDeleting] = useState<string | null>(null);
// //   const [error,    setError]    = useState("");

// //   useEffect(() => {
// //     const stored = localStorage.getItem("agriai_user");
// //     const token  = localStorage.getItem("agriai_token");
// //     if (!stored || !token) { router.push("/"); return; }
// //     const u = JSON.parse(stored);
// //     if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
// //     setUser(u);
// //     fetchProducts();
// //   }, []);

// //   const fetchProducts = async () => {
// //     setLoading(true); setError("");
// //     try {
// //       const { data } = await productAPI.getMyProducts();
// //       setProducts(Array.isArray(data) ? data : data.products || []);
// //     } catch (err: any) {
// //       setError(err.response?.data?.message || "Failed to load products.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async (id: string) => {
// //     if (!confirm("Delete this product? This cannot be undone.")) return;
// //     setDeleting(id);
// //     try {
// //       await productAPI.remove(id);
// //       setProducts(prev => prev.filter(p => p._id !== id));
// //     } catch (err: any) {
// //       alert(err.response?.data?.message || "Delete failed.");
// //     } finally {
// //       setDeleting(null);
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("agriai_token");
// //     localStorage.removeItem("agriai_user");
// //     router.push("/");
// //   };

// //   const filtered = products.filter(p =>
// //     p.cropName.toLowerCase().includes(search.toLowerCase())
// //   );

// //   const getInitial = () => (user?.name || "F")[0].toUpperCase();

// //   return (
// //     <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#f4f0e8" }}>

// //       {/* ══ SIDEBAR ══ */}
// //       <aside style={{ width: 190, background: "linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
// //         display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>

// //         <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
// //           <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>
// //             Agri<span style={{ color: "#6aaa78" }}>AI</span>
// //           </div>
// //         </div>

// //         <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
// //           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
// //             <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#6aaa78",
// //               display: "flex", alignItems: "center", justifyContent: "center",
// //               fontSize: 16, fontWeight: 700, color: "#fff" }}>
// //               {getInitial()}
// //             </div>
// //             <div>
// //               <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
// //               <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11 }}>My Farm</div>
// //             </div>
// //           </div>
// //         </div>

// //         <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
// //           {NAV.map(item => {
// //             const isActive = pathname === item.href;
// //             return (
// //               <button key={item.href} onClick={() => router.push(item.href)} style={{
// //                 width: "100%", display: "flex", alignItems: "center", gap: 10,
// //                 padding: "10px 20px", border: "none",
// //                 background: isActive ? "rgba(106,170,120,.2)" : "transparent",
// //                 borderLeft: isActive ? "3px solid #6aaa78" : "3px solid transparent",
// //                 color: isActive ? "#fff" : "rgba(255,255,255,.55)",
// //                 fontSize: 13, fontWeight: isActive ? 600 : 400,
// //                 cursor: "pointer", transition: "all .2s", textAlign: "left",
// //               }}>
// //                 <span>{item.icon}</span>{item.label}
// //               </button>
// //             );
// //           })}
// //         </nav>

// //         <div style={{ padding: "12px 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
// //           <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10,
// //             padding: "10px 20px", border: "none", background: "transparent",
// //             color: "#ef4444", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
// //             🚪 Sign Out
// //           </button>
// //         </div>
// //       </aside>

// //       {/* ══ MAIN ══ */}
// //       <main style={{ marginLeft: 190, flex: 1, padding: "28px 32px" }}>

// //         {/* Header */}
// //         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
// //           <div>
// //             <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>My Products</h1>
// //             <p style={{ fontSize: "14px", color: "#6b8070", marginTop: "4px" }}>
// //               Manage your produce listings · {products.length} product{products.length !== 1 ? "s" : ""}
// //             </p>
// //           </div>
// //           <button onClick={() => { setSelected(null); setModal("add"); }} style={{
// //             display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px",
// //             background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "white",
// //             border: "none", borderRadius: "100px", fontFamily: "'DM Sans',sans-serif",
// //             fontSize: "14px", fontWeight: 600, cursor: "pointer",
// //           }}>
// //             + Add Product
// //           </button>
// //         </div>

// //         {/* Search */}
// //         <div style={{ marginBottom: "24px", position: "relative", maxWidth: "420px" }}>
// //           <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
// //           <input type="text" placeholder="Search products…"
// //             value={search} onChange={e => setSearch(e.target.value)}
// //             style={{ width: "100%", padding: "11px 14px 11px 42px", border: "1.5px solid #e0ddd6",
// //               borderRadius: "12px", fontFamily: "'DM Sans',sans-serif", fontSize: "14px",
// //               background: "white", outline: "none", boxSizing: "border-box" }}
// //           />
// //         </div>

// //         {/* Error */}
// //         {error && (
// //           <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "12px",
// //             padding: "14px 18px", color: "#c0392b", fontSize: "14px", marginBottom: "20px",
// //             display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //             <span>⚠️ {error}</span>
// //             <button onClick={fetchProducts} style={{ background: "#1a3a2a", color: "#fff",
// //               border: "none", borderRadius: "8px", padding: "6px 14px",
// //               fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
// //               Retry
// //             </button>
// //           </div>
// //         )}

// //         {/* Grid */}
// //         {loading ? (
// //           <div style={{ textAlign: "center", padding: "80px", color: "#6b8070" }}>
// //             <div style={{ fontSize: 36, marginBottom: 12 }}>🌾</div>
// //             <div style={{ fontWeight: 600 }}>Loading products…</div>
// //           </div>
// //         ) : filtered.length === 0 ? (
// //           <div style={{ textAlign: "center", padding: "80px", color: "#c0bdb5" }}>
// //             <div style={{ fontSize: "52px", marginBottom: "14px" }}>🌱</div>
// //             <div style={{ fontSize: "16px", color: "#6b8070", fontWeight: 500 }}>
// //               {search ? `No products match "${search}"` : "No products yet. Click + Add Product to start selling."}
// //             </div>
// //           </div>
// //         ) : (
// //           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px" }}>
// //             {filtered.map(p => (
// //               <div key={p._id} style={{
// //                 background: "white", borderRadius: "16px",
// //                 border: "1px solid #e8e4dc", overflow: "hidden",
// //                 boxShadow: "0 2px 10px rgba(0,0,0,.05)", position: "relative",
// //               }}>

// //                 {/* ── Image area ── */}
// //                 <div style={{ height: "140px", background: "#f0fdf4", position: "relative",
// //                   display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
// //                   {p.imageUrl ? (
// //                     <img
// //                       src={`http://localhost:5000${p.imageUrl}`}
// //                       alt={p.cropName}
// //                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
// //                       onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
// //                     />
// //                   ) : (
// //                     <span style={{ fontSize: "52px" }}>{CROP_ICONS[p.category] || "🌱"}</span>
// //                   )}

// //                   {/* Organic badge on image */}
// //                   {p.type === "Organic" && (
// //                     <div style={{ position: "absolute", top: "10px", right: "10px",
// //                       background: "#e8f5e9", color: "#2d6a35", fontSize: "11px",
// //                       fontWeight: 700, padding: "3px 10px", borderRadius: "100px" }}>
// //                       🌿 Organic
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* ── Card body ── */}
// //                 <div style={{ padding: "16px" }}>
// //                   <div style={{ marginBottom: "12px" }}>
// //                     <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a3a2a" }}>{p.cropName}</div>
// //                     <div style={{ fontSize: "13px", color: "#6b8070" }}>{p.category}</div>
// //                   </div>

// //                   {p.trustScore > 0 && (
// //                     <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
// //                       <span style={{ fontSize: "13px" }}>⭐</span>
// //                       <span style={{ fontSize: "13px", color: "#6b8070" }}>Trust Score:</span>
// //                       <span style={{ fontSize: "13px", fontWeight: 700, color: "#2d5a3d" }}>{p.trustScore}%</span>
// //                     </div>
// //                   )}

// //                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
// //                     <div>
// //                       <div style={{ fontSize: "11px", color: "#9b9b9b", marginBottom: "2px" }}>Price</div>
// //                       <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a3a2a" }}>Rs. {p.price}/kg</div>
// //                     </div>
// //                     <div>
// //                       <div style={{ fontSize: "11px", color: "#9b9b9b", marginBottom: "2px" }}>Stock</div>
// //                       <div style={{ fontSize: "15px", fontWeight: 700, color: p.stock === 0 ? "#ef4444" : "#1a3a2a" }}>
// //                         {p.stock} kg
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {p.harvestDate && (
// //                     <div style={{ fontSize: "12px", color: "#6b8070", marginBottom: "12px" }}>
// //                       🗓 {new Date(p.harvestDate).toLocaleDateString("en-CA")}
// //                     </div>
// //                   )}

// //                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //                     <span style={{
// //                       fontSize: "12px", fontWeight: 700, padding: "4px 14px", borderRadius: "100px",
// //                       background: p.status === "Active" ? "#e8f5e9" : p.status === "Out of Stock" ? "#f4f0e8" : "#fce4ec",
// //                       color:      p.status === "Active" ? "#2d6a35" : p.status === "Out of Stock" ? "#6b8070" : "#c62828",
// //                       border:     p.status === "Active" ? "1px solid #c8e6c9" : p.status === "Out of Stock" ? "1px solid #e0ddd6" : "1px solid #f48fb1",
// //                     }}>
// //                       {p.status}
// //                     </span>
// //                     <div style={{ display: "flex", gap: "8px" }}>
// //                       <button onClick={() => { setSelected(p); setModal("edit"); }} title="Edit"
// //                         style={{ width: "32px", height: "32px", borderRadius: "8px",
// //                           border: "1px solid #e0ddd6", background: "white", cursor: "pointer",
// //                           display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>
// //                         ✏️
// //                       </button>
// //                       <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} title="Delete"
// //                         style={{ width: "32px", height: "32px", borderRadius: "8px",
// //                           border: "1px solid #fcd0d0", background: "#fff5f5", cursor: "pointer",
// //                           display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
// //                           opacity: deleting === p._id ? 0.5 : 1 }}>
// //                         🗑️
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </main>

// //       {/* Modal */}
// //       {(modal === "add" || modal === "edit") && (
// //         <ProductModal
// //           product={modal === "edit" ? selected : null}
// //           onClose={() => { setModal(null); setSelected(null); }}
// //           onSaved={fetchProducts}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import api, { productAPI } from "@/lib/axios-proxy";

// // ── Types ──────────────────────────────────────────────────
// interface Product {
//   _id: string; cropName: string; category: string; type: string;
//   price: number; stock: number; harvestDate?: string;
//   organicTreatmentHistory?: string; trustScore: number;
//   status: "Active" | "Out of Stock" | "Inactive";
//   imageUrl?: string;
// }

// const CATEGORIES = ["Leafy Green", "Root", "Fruit", "Grain", "Herb", "Other"];
// const TYPES      = ["Organic", "Conventional"];

// const NAV = [
//   { label: "Overview",    href: "/dashboard/farmer"             },
//   { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor" },
//   { label: "My Products", href: "/dashboard/farmer/products"    },
//   { label: "Orders",      href: "/dashboard/farmer/orders"      },
//   { label: "Weather",     href: "/dashboard/farmer/weather"     },
// ];

// const labelStyle: React.CSSProperties = {
//   fontSize: "11px", fontWeight: 700, color: "#6b8070",
//   textTransform: "uppercase", letterSpacing: "0.06em",
//   display: "block", marginBottom: "5px",
// };
// const inputStyle: React.CSSProperties = {
//   width: "100%", padding: "10px 13px",
//   border: "1.5px solid #e0ddd6", borderRadius: "9px",
//   fontFamily: "'DM Sans',sans-serif", fontSize: "13px",
//   color: "#1a3a2a", background: "white", outline: "none",
//   boxSizing: "border-box",
// };

// async function saveProduct(
//   data: { cropName: string; category: string; type: string; price: string; stock: string; harvestDate: string; organicTreatmentHistory: string; imageFile: File | null; },
//   productId?: string
// ) {
//   const form = new FormData();
//   form.append("cropName", data.cropName);
//   form.append("category", data.category);
//   form.append("type",     data.type);
//   form.append("price",    data.price);
//   form.append("stock",    data.stock);
//   if (data.harvestDate)             form.append("harvestDate",             data.harvestDate);
//   if (data.organicTreatmentHistory) form.append("organicTreatmentHistory", data.organicTreatmentHistory);
//   if (data.imageFile)               form.append("image", data.imageFile);
//   const config = { headers: { "Content-Type": "multipart/form-data" } };
//   return productId
//     ? api.put(`/products/${productId}`, form, config)
//     : api.post("/products", form, config);
// }

// // ── Add / Edit Modal ───────────────────────────────────────
// function ProductModal({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void; }) {
//   const isEdit       = !!product;
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [form, setForm] = useState({
//     cropName:                product?.cropName                  || "",
//     category:                product?.category                  || "",
//     type:                    product?.type                      || "",
//     price:                   product?.price?.toString()         || "",
//     stock:                   product?.stock?.toString()         || "",
//     harvestDate:             product?.harvestDate?.slice(0, 10) || "",
//     organicTreatmentHistory: product?.organicTreatmentHistory   || "",
//   });
//   const [imageFile,    setImageFile]    = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>(
//     product?.imageUrl ? `http://localhost:5000${product.imageUrl}` : ""
//   );
//   const [loading, setLoading] = useState(false);
//   const [error,   setError]   = useState("");

//   const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleSave = async () => {
//     if (!form.cropName || !form.category || !form.type || !form.price || !form.stock) {
//       setError("Please fill all required fields."); return;
//     }
//     setLoading(true); setError("");
//     try {
//       await saveProduct({ ...form, imageFile }, isEdit ? product!._id : undefined);
//       onSaved(); onClose();
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to save product.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200,
//       display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
//       onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
//       <div style={{ background: "#f9f7f3", borderRadius: "18px", padding: "28px",
//         width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>

//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
//           <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>
//             {isEdit ? "Edit Product" : "Add New Product"}
//           </h2>
//           <button onClick={onClose}
//             style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b8070" }}>✕</button>
//         </div>

//         {error && (
//           <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "9px",
//             padding: "10px 13px", color: "#c0392b", fontSize: "13px", marginBottom: "14px" }}>
//             {error}
//           </div>
//         )}

//         {/* Image Upload */}
//         <div style={{ marginBottom: "18px" }}>
//           <label style={labelStyle}>Product Image (optional)</label>
//           <div onClick={() => fileInputRef.current?.click()}
//             style={{ border: "2px dashed #c8e6c9", borderRadius: "12px", padding: "14px",
//               cursor: "pointer", textAlign: "center", background: imagePreview ? "#f0fdf4" : "#fff",
//               height: "120px", display: "flex", alignItems: "center", justifyContent: "center",
//               position: "relative", overflow: "hidden" }}>
//             {imagePreview ? (
//               <div style={{ position: "relative", width: "100%", height: "100%" }}>
//                 <img src={imagePreview} alt="preview"
//                   style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
//                 <div style={{ position: "absolute", top: 4, right: 4, background: "#1a3a2a",
//                   color: "#fff", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: 700 }}>
//                   Change
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <div style={{ fontSize: "13px", color: "#6b8070", fontWeight: 600 }}>Click to upload image</div>
//                 <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "3px" }}>JPG, PNG or WebP · Max 5MB</div>
//               </div>
//             )}
//           </div>
//           <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
//             onChange={handleImageChange} style={{ display: "none" }} />
//           {imageFile && (
//             <div style={{ fontSize: "11px", color: "#6b8070", marginTop: "4px", display: "flex", alignItems: "center", gap: 6 }}>
//               {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
//               <button onClick={() => { setImageFile(null); setImagePreview(product?.imageUrl ? `http://localhost:5000${product.imageUrl}` : ""); }}
//                 style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "11px" }}>
//                 Remove
//               </button>
//             </div>
//           )}
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
//           <div>
//             <label style={labelStyle}>Crop Name *</label>
//             <input type="text" placeholder="e.g. Organic Spinach"
//               value={form.cropName} onChange={e => set("cropName", e.target.value)} style={inputStyle} />
//           </div>
//           <div>
//             <label style={labelStyle}>Category *</label>
//             <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
//               <option value="">Select</option>
//               {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
//             </select>
//           </div>
//           <div>
//             <label style={labelStyle}>Price (Rs/kg) *</label>
//             <input type="number" placeholder="150" min="1"
//               value={form.price} onChange={e => set("price", e.target.value)} style={inputStyle} />
//           </div>
//           <div>
//             <label style={labelStyle}>Stock (kg) *</label>
//             <input type="number" placeholder="25" min="0"
//               value={form.stock} onChange={e => set("stock", e.target.value)} style={inputStyle} />
//           </div>
//           <div>
//             <label style={labelStyle}>Harvest Date</label>
//             <input type="date" value={form.harvestDate}
//               onChange={e => set("harvestDate", e.target.value)} style={inputStyle} />
//           </div>
//           <div>
//             <label style={labelStyle}>Type *</label>
//             <select value={form.type} onChange={e => set("type", e.target.value)} style={inputStyle}>
//               <option value="">Select</option>
//               {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
//             </select>
//           </div>
//         </div>

//         <div style={{ marginBottom: "22px" }}>
//           <label style={labelStyle}>Organic Treatment History (optional)</label>
//           <textarea placeholder="Describe treatments used..."
//             value={form.organicTreatmentHistory}
//             onChange={e => set("organicTreatmentHistory", e.target.value)}
//             rows={3} style={{ ...inputStyle, resize: "vertical", height: "auto" }} />
//         </div>

//         <button onClick={handleSave} disabled={loading} style={{
//           width: "100%", padding: "12px",
//           background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
//           color: "white", border: "none", borderRadius: "9px",
//           fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 700,
//           cursor: loading ? "not-allowed" : "pointer",
//         }}>
//           {loading ? "Saving…" : isEdit ? "Save Changes" : "List Product"}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ──────────────────────────────────────────────
// export default function MyProductsPage() {
//   const router   = useRouter();
//   const pathname = usePathname();

//   const [user,     setUser]     = useState<{ name: string } | null>(null);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading,  setLoading]  = useState(true);
//   const [search,   setSearch]   = useState("");
//   const [modal,    setModal]    = useState<"add" | "edit" | null>(null);
//   const [selected, setSelected] = useState<Product | null>(null);
//   const [deleting, setDeleting] = useState<string | null>(null);
//   const [error,    setError]    = useState("");

//   useEffect(() => {
//     const stored = localStorage.getItem("agriai_user");
//     const token  = localStorage.getItem("agriai_token");
//     if (!stored || !token) { router.push("/"); return; }
//     const u = JSON.parse(stored);
//     if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
//     setUser(u);
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true); setError("");
//     try {
//       const { data } = await productAPI.getMyProducts();
//       setProducts(Array.isArray(data) ? data : data.products || []);
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to load products.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this product? This cannot be undone.")) return;
//     setDeleting(id);
//     try {
//       await productAPI.remove(id);
//       setProducts(prev => prev.filter(p => p._id !== id));
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Delete failed.");
//     } finally {
//       setDeleting(null);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("agriai_token");
//     localStorage.removeItem("agriai_user");
//     router.push("/");
//   };

//   const filtered  = products.filter(p => p.cropName.toLowerCase().includes(search.toLowerCase()));
//   const getInitial = () => (user?.name || "F")[0].toUpperCase();

//   const statusStyle = (s: string) => ({
//     background: s === "Active" ? "#e8f5e9" : s === "Out of Stock" ? "#f4f0e8" : "#fce4ec",
//     color:      s === "Active" ? "#2d6a35" : s === "Out of Stock" ? "#6b8070" : "#c62828",
//     border:     `1px solid ${s === "Active" ? "#c8e6c9" : s === "Out of Stock" ? "#e0ddd6" : "#f48fb1"}`,
//   });

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#f4f0e8" }}>

//       {/* ══ SIDEBAR ══ */}
//       <aside style={{ width: 190, background: "linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
//         display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
//         <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
//           <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>
//             Ag<span style={{ color: "#6aaa78" }}>real</span>
//           </div>
//         </div>
//         <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#6aaa78",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: 15, fontWeight: 700, color: "#fff" }}>
//               {getInitial()}
//             </div>
//             <div>
//               <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
//               <div style={{ color: "rgba(255,255,255,.45)", fontSize: 11 }}>My Farm</div>
//             </div>
//           </div>
//         </div>
//         <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
//           {NAV.map(item => {
//             const isActive = pathname === item.href;
//             return (
//               <button key={item.href} onClick={() => router.push(item.href)} style={{
//                 width: "100%", display: "flex", alignItems: "center",
//                 padding: "10px 20px", border: "none",
//                 background: isActive ? "rgba(106,170,120,.2)" : "transparent",
//                 borderLeft: isActive ? "3px solid #6aaa78" : "3px solid transparent",
//                 color: isActive ? "#fff" : "rgba(255,255,255,.55)",
//                 fontSize: 13, fontWeight: isActive ? 600 : 400,
//                 cursor: "pointer", transition: "all .2s", textAlign: "left",
//               }}>
//                 {item.label}
//               </button>
//             );
//           })}
//         </nav>
//         <div style={{ padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
//           <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center",
//             padding: "10px 20px", border: "none", background: "transparent",
//             color: "#ef4444", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
//             Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* ══ MAIN ══ */}
//       <main style={{ marginLeft: 190, flex: 1, padding: "28px 32px" }}>

//         {/* Header */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "22px" }}>
//           <div>
//             <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>My Products</h1>
//             <p style={{ fontSize: "13px", color: "#6b8070", marginTop: "3px" }}>
//               {products.length} product{products.length !== 1 ? "s" : ""} · {products.filter(p => p.status === "Active").length} active
//             </p>
//           </div>
//           <button onClick={() => { setSelected(null); setModal("add"); }} style={{
//             padding: "10px 20px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
//             color: "white", border: "none", borderRadius: "100px",
//             fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer",
//           }}>
//             + Add Product
//           </button>
//         </div>

//         {/* Search */}
//         <div style={{ marginBottom: "22px", position: "relative", maxWidth: "380px" }}>
//           <input type="text" placeholder="Search products…"
//             value={search} onChange={e => setSearch(e.target.value)}
//             style={{ width: "100%", padding: "10px 14px 10px 14px", border: "1.5px solid #e0ddd6",
//               borderRadius: "10px", fontFamily: "'DM Sans',sans-serif", fontSize: "13px",
//               background: "white", outline: "none", boxSizing: "border-box" }} />
//         </div>

//         {/* Error */}
//         {error && (
//           <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "10px",
//             padding: "12px 16px", color: "#c0392b", fontSize: "13px", marginBottom: "18px",
//             display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <span>{error}</span>
//             <button onClick={fetchProducts} style={{ background: "#1a3a2a", color: "#fff",
//               border: "none", borderRadius: "7px", padding: "5px 12px", fontSize: "12px",
//               fontWeight: 600, cursor: "pointer" }}>Retry</button>
//           </div>
//         )}

//         {/* Grid — standardized cards */}
//         {loading ? (
//           <div style={{ textAlign: "center", padding: "80px", color: "#6b8070" }}>
//             <div style={{ fontWeight: 600 }}>Loading products…</div>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div style={{ textAlign: "center", padding: "80px", color: "#c0bdb5" }}>
//             <div style={{ fontSize: "15px", color: "#6b8070", fontWeight: 500 }}>
//               {search ? `No products match "${search}"` : "No products yet. Click + Add Product to start selling."}
//             </div>
//           </div>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
//             {filtered.map(p => (
//               <div key={p._id} style={{
//                 background: "white", borderRadius: "14px",
//                 border: "1px solid #e8e4dc", overflow: "hidden",
//                 boxShadow: "0 1px 6px rgba(0,0,0,.05)",
//                 display: "flex", flexDirection: "column",
//               }}>
//                 {/* ── Image — fixed 160px, consistent aspect ratio ── */}
//                 <div style={{ height: "160px", background: "#f0fdf4", position: "relative",
//                   flexShrink: 0, overflow: "hidden" }}>
//                   {p.imageUrl ? (
//                     <img src={`http://localhost:5000${p.imageUrl}`} alt={p.cropName}
//                       style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
//                       onError={e => {
//                         (e.target as HTMLImageElement).style.display = "none";
//                         (e.target as HTMLImageElement).parentElement!.style.background = "#f4f0e8";
//                       }} />
//                   ) : (
//                     <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center",
//                       justifyContent: "center", background: "#f0fdf4" }}>
//                       <span style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>No image</span>
//                     </div>
//                   )}
//                   {p.type === "Organic" && (
//                     <div style={{ position: "absolute", top: "8px", right: "8px",
//                       background: "#e8f5e9", color: "#2d6a35", fontSize: "10px",
//                       fontWeight: 700, padding: "3px 9px", borderRadius: "100px",
//                       border: "1px solid #c8e6c9" }}>
//                       Organic
//                     </div>
//                   )}
//                 </div>

//                 {/* ── Card body ── */}
//                 <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
//                   <div style={{ marginBottom: "10px" }}>
//                     <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a3a2a",
//                       whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                       {p.cropName}
//                     </div>
//                     <div style={{ fontSize: "11px", color: "#9b9b9b", marginTop: "1px" }}>{p.category}</div>
//                   </div>

//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
//                     <div>
//                       <div style={{ fontSize: "10px", color: "#b0ada8" }}>Price</div>
//                       <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a3a2a" }}>Rs.{p.price}<span style={{ fontSize: "10px", fontWeight: 400, color: "#9b9b9b" }}>/kg</span></div>
//                     </div>
//                     <div>
//                       <div style={{ fontSize: "10px", color: "#b0ada8" }}>Stock</div>
//                       <div style={{ fontSize: "14px", fontWeight: 700, color: p.stock === 0 ? "#ef4444" : "#1a3a2a" }}>
//                         {p.stock}<span style={{ fontSize: "10px", fontWeight: 400, color: "#9b9b9b" }}>kg</span>
//                       </div>
//                     </div>
//                   </div>

//                   {p.harvestDate && (
//                     <div style={{ fontSize: "11px", color: "#9b9b9b", marginBottom: "10px" }}>
//                       Harvest: {new Date(p.harvestDate).toLocaleDateString("en-CA")}
//                     </div>
//                   )}

//                   {p.trustScore > 0 && (
//                     <div style={{ fontSize: "11px", color: "#6b8070", marginBottom: "10px" }}>
//                       Trust Score: <span style={{ fontWeight: 700, color: "#2d5a3d" }}>{p.trustScore}%</span>
//                     </div>
//                   )}

//                   {/* Footer */}
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
//                     <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "100px",
//                       ...statusStyle(p.status) }}>
//                       {p.status}
//                     </span>
//                     <div style={{ display: "flex", gap: "6px" }}>
//                       <button onClick={() => { setSelected(p); setModal("edit"); }}
//                         style={{ height: "28px", padding: "0 10px", borderRadius: "7px",
//                           border: "1px solid #e0ddd6", background: "white", cursor: "pointer",
//                           fontSize: "11px", fontWeight: 600, color: "#1a3a2a" }}>
//                         Edit
//                       </button>
//                       <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
//                         style={{ height: "28px", padding: "0 10px", borderRadius: "7px",
//                           border: "1px solid #fcd0d0", background: "#fff5f5", cursor: "pointer",
//                           fontSize: "11px", fontWeight: 600, color: "#c0392b",
//                           opacity: deleting === p._id ? 0.5 : 1 }}>
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Modal */}
//       {(modal === "add" || modal === "edit") && (
//         <ProductModal
//           product={modal === "edit" ? selected : null}
//           onClose={() => { setModal(null); setSelected(null); }}
//           onSaved={fetchProducts}
//         />
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import api, { productAPI } from "@/lib/axios-proxy";

// ── Types ──────────────────────────────────────────────────
interface Product {
  _id: string; cropName: string; category: string; type: string;
  price: number; stock: number; harvestDate?: string;
  organicTreatmentHistory?: string; trustScore: number;
  status: "Active" | "Out of Stock" | "Inactive";
  imageUrl?: string;
}

const CATEGORIES = ["Leafy Green", "Root", "Fruit", "Grain", "Herb", "Other"];
const TYPES      = ["Organic", "Conventional"];

const NAV = [
  { label: "Overview",    href: "/dashboard/farmer",              icon: "⌂" },
  { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor",  icon: "✦" },
  { label: "My Products", href: "/dashboard/farmer/products",     icon: "❧" },
  { label: "Orders",      href: "/dashboard/farmer/orders",       icon: "◈" },
  { label: "Weather",     href: "/dashboard/farmer/weather",      icon: "◎" },
  { label: "Earnings",    href: "/dashboard/farmer/earnings",     icon: "◇" },
];

const labelStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: 700, color: "#6b8070",
  textTransform: "uppercase", letterSpacing: "0.06em",
  display: "block", marginBottom: "5px",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 13px",
  border: "1.5px solid #e0ddd6", borderRadius: "9px",
  fontFamily: "'DM Sans',sans-serif", fontSize: "13px",
  color: "#1a3a2a", background: "white", outline: "none",
  boxSizing: "border-box",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getDateStr() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

async function saveProduct(
  data: { cropName: string; category: string; type: string; price: string; stock: string; harvestDate: string; organicTreatmentHistory: string; imageFile: File | null },
  productId?: string
) {
  const form = new FormData();
  form.append("cropName", data.cropName);
  form.append("category", data.category);
  form.append("type",     data.type);
  form.append("price",    data.price);
  form.append("stock",    data.stock);
  if (data.harvestDate)             form.append("harvestDate",             data.harvestDate);
  if (data.organicTreatmentHistory) form.append("organicTreatmentHistory", data.organicTreatmentHistory);
  if (data.imageFile)               form.append("image", data.imageFile);
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return productId
    ? api.put(`/products/${productId}`, form, config)
    : api.post("/products", form, config);
}

// ── Add / Edit Modal ───────────────────────────────────────
function ProductModal({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const isEdit       = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    cropName:                product?.cropName                  || "",
    category:                product?.category                  || "",
    type:                    product?.type                      || "",
    price:                   product?.price?.toString()         || "",
    stock:                   product?.stock?.toString()         || "",
    harvestDate:             product?.harvestDate?.slice(0, 10) || "",
    organicTreatmentHistory: product?.organicTreatmentHistory   || "",
  });
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    product?.imageUrl ? `http://localhost:5000${product.imageUrl}` : ""
  );
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.cropName || !form.category || !form.type || !form.price || !form.stock) {
      setError("Please fill all required fields."); return;
    }
    setLoading(true); setError("");
    try {
      await saveProduct({ ...form, imageFile }, isEdit ? product!._id : undefined);
      onSaved(); onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,36,24,.65)", zIndex: 200,
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#f9f7f3", borderRadius: "20px", padding: "32px",
        width: "100%", maxWidth: "580px", maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1a3a2a", margin: 0 }}>
              {isEdit ? "Edit Product" : "List New Product"}
            </h2>
            <p style={{ fontSize: "12px", color: "#9b9b9b", margin: "3px 0 0" }}>
              {isEdit ? "Update your listing details" : "Add a crop to your marketplace"}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "#f0ede8", border: "none", fontSize: "16px",
            cursor: "pointer", color: "#6b8070", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {error && (
          <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "10px",
            padding: "10px 14px", color: "#c0392b", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {/* Image Upload */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Product Image (optional)</label>
          <div onClick={() => fileInputRef.current?.click()} style={{
            border: "2px dashed #c8e6c9", borderRadius: "14px",
            cursor: "pointer", textAlign: "center", background: imagePreview ? "#f0fdf4" : "#fafaf8",
            height: "130px", display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden", transition: "all .2s",
          }}>
            {imagePreview ? (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src={imagePreview} alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
                <div style={{ position: "absolute", top: 8, right: 8, background: "#1a3a2a",
                  color: "#fff", borderRadius: "7px", padding: "3px 10px", fontSize: "11px", fontWeight: 700 }}>
                  Change
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "26px", marginBottom: "6px" }}>📷</div>
                <div style={{ fontSize: "13px", color: "#6b8070", fontWeight: 600 }}>Click to upload image</div>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>JPG, PNG or WebP · Max 5MB</div>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange} style={{ display: "none" }} />
          {imageFile && (
            <div style={{ fontSize: "11px", color: "#6b8070", marginTop: "5px", display: "flex", alignItems: "center", gap: 6 }}>
              {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
              <button onClick={() => { setImageFile(null); setImagePreview(product?.imageUrl ? `http://localhost:5000${product.imageUrl}` : ""); }}
                style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "11px" }}>
                Remove
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label style={labelStyle}>Crop Name *</label>
            <input type="text" placeholder="e.g. Organic Spinach"
              value={form.cropName} onChange={e => set("cropName", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Category *</label>
            <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
              <option value="">Select</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Price (Rs/kg) *</label>
            <input type="number" placeholder="150" min="1"
              value={form.price} onChange={e => set("price", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Stock (kg) *</label>
            <input type="number" placeholder="25" min="0"
              value={form.stock} onChange={e => set("stock", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Harvest Date</label>
            <input type="date" value={form.harvestDate}
              onChange={e => set("harvestDate", e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Type *</label>
            <select value={form.type} onChange={e => set("type", e.target.value)} style={inputStyle}>
              <option value="">Select</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Organic Treatment History (optional)</label>
          <textarea placeholder="Describe treatments used..."
            value={form.organicTreatmentHistory}
            onChange={e => set("organicTreatmentHistory", e.target.value)}
            rows={3} style={{ ...inputStyle, resize: "vertical", height: "auto" }} />
        </div>

        <button onClick={handleSave} disabled={loading} style={{
          width: "100%", padding: "13px",
          background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
          color: "white", border: "none", borderRadius: "10px",
          fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: "0.02em",
        }}>
          {loading ? "Saving…" : isEdit ? "Save Changes" : "List Product"}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function MyProductsPage() {
  const router   = useRouter();
  const pathname = usePathname();

  const [user,        setUser]        = useState<{ name: string } | null>(null);
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [filterType,  setFilterType]  = useState<string>("All");
  const [modal,       setModal]       = useState<"add" | "edit" | null>(null);
  const [selected,    setSelected]    = useState<Product | null>(null);
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [error,       setError]       = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
    setUser(u);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await productAPI.getMyProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await productAPI.remove(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agriai_token");
    localStorage.removeItem("agriai_user");
    router.push("/");
  };

  const filtered = products
    .filter(p => p.cropName.toLowerCase().includes(search.toLowerCase()))
    .filter(p => filterType === "All" || p.type === filterType || p.status === filterType);

  const getInitial = () => (user?.name || "F")[0].toUpperCase();

  const activeCount   = products.filter(p => p.status === "Active").length;
  const outOfStock    = products.filter(p => p.status === "Out of Stock").length;
  const totalValue    = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const statusStyle = (s: string) => ({
    background: s === "Active" ? "#e8f5e9" : s === "Out of Stock" ? "#f4f0e8" : "#fce4ec",
    color:      s === "Active" ? "#2d6a35" : s === "Out of Stock" ? "#6b8070" : "#c62828",
    border:     `1px solid ${s === "Active" ? "#c8e6c9" : s === "Out of Stock" ? "#e0ddd6" : "#f48fb1"}`,
  });

  const FILTER_TABS = ["All", "Active", "Out of Stock", "Organic", "Conventional"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#f4f0e8" }}>

      {/* ══ SIDEBAR ══ */}
      <aside style={{
        width: 200, background: "linear-gradient(180deg,#1a3a2a 0%,#0f2418 100%)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 22px 18px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 24, color: "#fff" }}>
            Ag<span style={{ color: "#6aaa78" }}>real</span>
          </div>
        </div>

        {/* User */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6aaa78,#2d5a3d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: "#fff",
              boxShadow: "0 2px 8px rgba(106,170,120,.4)",
            }}>
              {getInitial()}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
              <div style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>My Farm</div>
            </div>
          </div>
        </div>

        {/* Nav label */}
        <div style={{ padding: "16px 22px 6px", fontSize: "10px", fontWeight: 700,
          color: "rgba(255,255,255,.25)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Navigation
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "4px 10px", overflowY: "auto" }}>
          {NAV.map(item => {
            const isActive = pathname === item.href;
            return (
              <button key={item.href} onClick={() => router.push(item.href)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", border: "none", borderRadius: "10px",
                marginBottom: "2px",
                background: isActive ? "rgba(106,170,120,.18)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,.5)",
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                cursor: "pointer", transition: "all .18s", textAlign: "left",
                position: "relative",
              }}>
                {isActive && (
                  <div style={{
                    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                    width: 3, height: 20, background: "#6aaa78", borderRadius: "0 3px 3px 0",
                  }} />
                )}
                <span style={{ fontSize: "15px", opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <button onClick={handleLogout} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", border: "none", background: "transparent",
            color: "#ef4444", fontSize: 13, cursor: "pointer", fontWeight: 600,
            borderRadius: "10px",
          }}>
            <span>⎋</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main style={{ marginLeft: 200, flex: 1, display: "flex", flexDirection: "column" }}>

        {/* ── TOP NAVBAR (like Overview) ── */}
        <div style={{
          position: "sticky", top: 0, zIndex: 40,
          background: "rgba(244,240,232,.92)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,.06)",
          padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "64px",
        }}>
          {/* Left: greeting */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "18px", fontWeight: 400, color: "#4a6358" }}>{getGreeting()},</span>
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#1a3a2a" }}>{user?.name || "Farmer"}</span>
            </div>
            <div style={{ fontSize: "12px", color: "#9b9b9b", marginTop: "1px" }}>
              {getDateStr()} · My Products
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Search bar */}
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                fontSize: "13px", color: "#9b9b9b" }}>🔍</span>
              <input type="text" placeholder="Search crops…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{
                  padding: "8px 14px 8px 34px", border: "1.5px solid #e0ddd6",
                  borderRadius: "100px", fontFamily: "'DM Sans',sans-serif", fontSize: "13px",
                  background: "white", outline: "none", width: "200px", color: "#1a3a2a",
                }} />
            </div>

            {/* Add Product button */}
            <button onClick={() => { setSelected(null); setModal("add"); }} style={{
              padding: "9px 18px",
              background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
              color: "white", border: "none", borderRadius: "100px",
              fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              boxShadow: "0 2px 10px rgba(26,58,42,.25)",
            }}>
              <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> Add Product
            </button>

            {/* Avatar */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg,#6aaa78,#2d5a3d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: 700, color: "#fff",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(106,170,120,.35)",
            }}>
              {getInitial()}
            </div>
          </div>
        </div>

        {/* ── PAGE BODY ── */}
        <div style={{ padding: "28px 32px", flex: 1 }}>

          {/* ── Stats strip ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "26px" }}>
            {[
              { label: "Total Products", value: products.length, sub: "Listed crops", dot: "#6aaa78" },
              { label: "Active Listings", value: activeCount, sub: "Selling now", dot: "#2d6a35" },
              { label: "Out of Stock",   value: outOfStock,  sub: "Need restocking", dot: "#e0a800" },
              { label: "Inventory Value", value: `Rs.${(totalValue/1000).toFixed(1)}K`, sub: "Est. total value", dot: "#6b8070" },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "white", borderRadius: "14px", padding: "16px 18px",
                border: "1px solid #e8e4dc", boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                display: "flex", flexDirection: "column", gap: "4px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "4px" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: stat.dot }} />
                  <span style={{ fontSize: "11px", color: "#9b9b9b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {stat.label}
                  </span>
                </div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#1a3a2a", lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: "11px", color: "#b0ada8" }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Filter tabs ── */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            {FILTER_TABS.map(tab => (
              <button key={tab} onClick={() => setFilterType(tab)} style={{
                padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: 600,
                border: filterType === tab ? "none" : "1.5px solid #e0ddd6",
                background: filterType === tab ? "#1a3a2a" : "white",
                color: filterType === tab ? "white" : "#6b8070",
                cursor: "pointer", transition: "all .15s",
              }}>
                {tab}
              </button>
            ))}
            <div style={{ marginLeft: "auto", fontSize: "12px", color: "#9b9b9b", display: "flex", alignItems: "center" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "10px",
              padding: "12px 16px", color: "#c0392b", fontSize: "13px", marginBottom: "18px",
              display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{error}</span>
              <button onClick={fetchProducts} style={{ background: "#1a3a2a", color: "#fff",
                border: "none", borderRadius: "7px", padding: "5px 12px", fontSize: "12px",
                fontWeight: 600, cursor: "pointer" }}>Retry</button>
            </div>
          )}

          {/* ── Grid ── */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "16px" }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ background: "white", borderRadius: "16px", height: "300px",
                  border: "1px solid #e8e4dc", overflow: "hidden" }}>
                  <div style={{ height: "165px", background: "linear-gradient(90deg,#f0ede8 25%,#e8e4dc 50%,#f0ede8 75%)",
                    backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                  <div style={{ padding: "14px" }}>
                    {[80,50,60].map((w,j) => (
                      <div key={j} style={{ height: "12px", borderRadius: "6px", marginBottom: "10px",
                        background: "#f0ede8", width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌱</div>
              <div style={{ fontSize: "15px", color: "#6b8070", fontWeight: 600, marginBottom: "6px" }}>
                {search ? `No products match "${search}"` : "No products yet"}
              </div>
              <div style={{ fontSize: "13px", color: "#b0ada8", marginBottom: "20px" }}>
                {!search && "Start by listing your first crop on the marketplace"}
              </div>
              {!search && (
                <button onClick={() => { setSelected(null); setModal("add"); }} style={{
                  padding: "10px 22px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
                  color: "white", border: "none", borderRadius: "100px", fontSize: "13px",
                  fontWeight: 600, cursor: "pointer",
                }}>+ Add Your First Product</button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "16px" }}>
              {filtered.map(p => (
                <div key={p._id} style={{
                  background: "white", borderRadius: "16px",
                  border: "1px solid #e8e4dc", overflow: "hidden",
                  boxShadow: "0 1px 6px rgba(0,0,0,.05)",
                  display: "flex", flexDirection: "column",
                  transition: "box-shadow .2s, transform .2s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,.1)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 6px rgba(0,0,0,.05)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  {/* Image */}
                  <div style={{ height: "165px", background: "#f0fdf4", position: "relative",
                    flexShrink: 0, overflow: "hidden" }}>
                    {p.imageUrl ? (
                      <img src={`http://localhost:5000${p.imageUrl}`} alt={p.cropName}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                          transition: "transform .3s" }}
                        onMouseEnter={e => (e.target as HTMLImageElement).style.transform = "scale(1.04)"}
                        onMouseLeave={e => (e.target as HTMLImageElement).style.transform = "scale(1)"}
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).parentElement!.style.background = "#f4f0e8";
                        }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", background: "#f0fdf4", gap: "6px" }}>
                        <span style={{ fontSize: "28px" }}>🌿</span>
                        <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 500 }}>No image</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                      {p.type === "Organic" && (
                        <div style={{ background: "#e8f5e9", color: "#2d6a35", fontSize: "10px",
                          fontWeight: 700, padding: "3px 9px", borderRadius: "100px",
                          border: "1px solid #c8e6c9", backdropFilter: "blur(4px)" }}>
                          Organic
                        </div>
                      )}
                    </div>

                    {/* Status dot overlay */}
                    <div style={{ position: "absolute", top: "10px", left: "10px" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", border: "2px solid white",
                        background: p.status === "Active" ? "#4caf50" : p.status === "Out of Stock" ? "#ff9800" : "#f44336",
                        boxShadow: "0 0 0 2px rgba(0,0,0,.08)" }} />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Name & category */}
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a3a2a",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.cropName}
                      </div>
                      <div style={{ fontSize: "11px", color: "#b0ada8", marginTop: "2px" }}>
                        {p.category}
                      </div>
                    </div>

                    {/* Price & stock */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                      marginBottom: "10px", padding: "10px 12px", background: "#f8f6f2",
                      borderRadius: "10px" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "#b0ada8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Price</div>
                        <div style={{ fontSize: "17px", fontWeight: 800, color: "#1a3a2a", lineHeight: 1.2 }}>
                          Rs.{p.price}<span style={{ fontSize: "10px", fontWeight: 400, color: "#9b9b9b" }}>/kg</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "10px", color: "#b0ada8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Stock</div>
                        <div style={{ fontSize: "17px", fontWeight: 800, lineHeight: 1.2,
                          color: p.stock === 0 ? "#ef4444" : "#1a3a2a" }}>
                          {p.stock}<span style={{ fontSize: "10px", fontWeight: 400, color: "#9b9b9b" }}>kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Meta info */}
                    {(p.harvestDate || p.trustScore > 0) && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                        {p.harvestDate && (
                          <div style={{ fontSize: "11px", color: "#9b9b9b" }}>
                            🗓 {new Date(p.harvestDate).toLocaleDateString("en-CA")}
                          </div>
                        )}
                        {p.trustScore > 0 && (
                          <div style={{ fontSize: "11px", color: "#6b8070", fontWeight: 600 }}>
                            ★ {p.trustScore}%
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px",
                        ...statusStyle(p.status) }}>
                        {p.status}
                      </span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => { setSelected(p); setModal("edit"); }}
                          style={{ height: "30px", padding: "0 12px", borderRadius: "8px",
                            border: "1.5px solid #e0ddd6", background: "white", cursor: "pointer",
                            fontSize: "12px", fontWeight: 600, color: "#1a3a2a",
                            transition: "all .15s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f0ede8"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "white"; }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id}
                          style={{ height: "30px", padding: "0 12px", borderRadius: "8px",
                            border: "1.5px solid #fcd0d0", background: "#fff5f5", cursor: "pointer",
                            fontSize: "12px", fontWeight: 600, color: "#c0392b",
                            opacity: deleting === p._id ? 0.5 : 1, transition: "all .15s" }}>
                          {deleting === p._id ? "…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {(modal === "add" || modal === "edit") && (
        <ProductModal
          product={modal === "edit" ? selected : null}
          onClose={() => { setModal(null); setSelected(null); }}
          onSaved={fetchProducts}
        />
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}