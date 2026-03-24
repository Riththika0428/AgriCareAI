"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { productAPI, orderAPI } from "@/lib/axios-proxy";

const CROP_EMOJI: Record<string,string> = {
  "Spinach":"🥬","Carrot":"🥕","Broccoli":"🥦","Bell Pepper":"🫑","Tomato":"🍅",
  "Kale":"🥬","Sweet Potato":"🍠","Cucumber":"🥒","Onion":"🧅","Potato":"🥔",
  "Corn":"🌽","Beans":"🫘","Cabbage":"🥬","Beetroot":"🫚","Chili":"🌶️","Mango":"🥭",
};

const NUTRIENT_TAGS: Record<string,string[]> = {
  "Spinach":["Iron","Vitamin A","Fiber"],"Carrot":["Vitamin A","Beta Carotene"],"Broccoli":["Vitamin C","Fiber","Iron"],
  "Bell Pepper":["Vitamin C","Vitamin B6"],"Tomato":["Lycopene","Vitamin C"],"Kale":["Iron","Calcium","Vitamin K"],
};

export default function MarketplacePage() {
  const router = useRouter();
  const [products,  setProducts]  = useState<any[]>([]);
  const [filtered,  setFiltered]  = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [typeFilter, setType]     = useState("All");
  const [sortBy,    setSort]      = useState("newest");
  const [cart,      setCart]      = useState<Record<string,number>>({});
  const [orderModal, setOrderModal] = useState<any>(null);
  const [placing,   setPlacing]   = useState(false);
  const [orderForm, setOrderForm] = useState({ street:"", city:"", district:"", phone:"", paymentMethod:"COD" }); // COD only
  const [orderMsg,  setOrderMsg]  = useState("");

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { applyFilters(); }, [search, typeFilter, sortBy, products]);

  const loadProducts = async () => {
    try {
      const { data } = await productAPI.getAll();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch {}
    setLoading(false);
  };

  const applyFilters = () => {
    let list = [...products];
    if (search)           list = list.filter(p => p.cropName.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== "All") list = list.filter(p => p.type === typeFilter);
    if (sortBy === "price-asc")  list.sort((a,b) => a.price-b.price);
    if (sortBy === "price-desc") list.sort((a,b) => b.price-a.price);
    if (sortBy === "rating")     list.sort((a,b) => (b.trustScore||0)-(a.trustScore||0));
    setFiltered(list);
  };

  const handlePlaceOrder = async () => {
    if (!orderForm.street || !orderForm.city || !orderForm.phone) {
      setOrderMsg("Please fill all delivery fields."); return;
    }
    setPlacing(true); setOrderMsg("");
    try {
      await orderAPI.create({
        productId: orderModal._id,
        quantity: cart[orderModal._id] || 1,
        deliveryAddress: { street:orderForm.street, city:orderForm.city, district:orderForm.district, phone:orderForm.phone },
        paymentMethod: orderForm.paymentMethod,
      });
      setOrderMsg("✅ Order placed successfully!");
      setCart(prev => { const n={...prev}; delete n[orderModal._id]; return n; });
      setTimeout(() => { setOrderModal(null); setOrderMsg(""); }, 1500);
    } catch (e:any) {
      setOrderMsg("❌ " + (e.response?.data?.message || "Order failed."));
    } finally { setPlacing(false); }
  };

  return (
    <ConsumerLayout>

      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:0,
          display:"flex", alignItems:"center", gap:10 }}>
          🛒 Marketplace
        </h1>
        <p style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>Browse fresh produce from verified farmers</p>
      </div>

      {/* Search + Filters */}
      <div style={{ display:"flex", gap:12, marginBottom:22, alignItems:"center" }}>
        <div style={{ flex:1, position:"relative" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }}>🔍</span>
          <input type="text" placeholder="Search vegetables, fruits..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"10px 14px 10px 36px",
              border:"1.5px solid #e5e7eb", borderRadius:10,
              fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none",
              boxSizing:"border-box" as const }} />
        </div>
        {["All","Type","Sort by","Location"].map((label,i) => (
          i === 1 ? (
            <select key={label} value={typeFilter} onChange={e => setType(e.target.value)} style={{
              padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
              fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", cursor:"pointer" }}>
              <option value="All">All Types</option>
              <option value="Organic">Organic</option>
              <option value="Conventional">Conventional</option>
            </select>
          ) : i === 2 ? (
            <select key={label} value={sortBy} onChange={e => setSort(e.target.value)} style={{
              padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
              fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", cursor:"pointer" }}>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          ) : null
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"80px", color:"#6b7280" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🌿</div>
          <div style={{ fontWeight:600 }}>Loading fresh produce…</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px", color:"#9ca3af" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🛒</div>
          <div>No products found.</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {filtered.map((p:any) => {
            const emoji  = CROP_EMOJI[p.cropName] || "🥬";
            const tags   = NUTRIENT_TAGS[p.cropName] || [];
            const qty    = cart[p._id] || 1;
            return (
              <div key={p._id} style={{ background:"#fff", borderRadius:16,
                border:"1px solid #e8ede8", overflow:"hidden",
                boxShadow:"0 2px 8px rgba(0,0,0,.04)",
                transition:"transform .2s, box-shadow .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 6px 20px rgba(0,0,0,.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow="0 2px 8px rgba(0,0,0,.04)"; }}>

                {/* Image area */}
                <div style={{ background:"#f0fdf4", height:140,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  position:"relative" }}>
                  <span style={{ fontSize:64 }}>{emoji}</span>
                  <button style={{ position:"absolute", top:10, right:10,
                    background:"#fff", border:"1px solid #e5e7eb", borderRadius:"50%",
                    width:28, height:28, cursor:"pointer", fontSize:14,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    🤍
                  </button>
                </div>

                <div style={{ padding:"14px 16px" }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:2 }}>{p.cropName}</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:8,
                    display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ color:"#22c55e" }}>📍</span>
                    {p.farmer?.name || "Local Farmer"} · {p.district || "Sri Lanka"}
                  </div>

                  {/* Organic + trust badge */}
                  {p.type === "Organic" && (
                    <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                      background:"#f0fdf4", border:"1px solid #bbf7d0",
                      borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700,
                      color:"#166534", marginBottom:8 }}>
                      🌿 Organic · Trust Score: {p.trustScore||88}%
                    </div>
                  )}

                  {/* Harvest */}
                  {p.harvestDate && (
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:4 }}>
                      ⏱ Harvested {new Date(p.harvestDate).toLocaleDateString("en-CA")}
                    </div>
                  )}

                  {/* Nutrient tags */}
                  {tags.length > 0 && (
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:10 }}>
                      🌿 {tags.join(", ")}
                    </div>
                  )}

                  {/* Price + Add button */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <div>
                      <div style={{ fontSize:16, fontWeight:800, color:"#111827" }}>
                        Rs. {p.price}/kg
                      </div>
                      {p.trustScore > 0 && (
                        <div style={{ fontSize:11, color:"#f59e0b" }}>★ {(p.trustScore/20).toFixed(1)}</div>
                      )}
                    </div>
                    <button onClick={() => setOrderModal(p)} style={{
                      background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
                      color:"#fff", border:"none", borderRadius:9,
                      padding:"8px 18px", fontSize:13, fontWeight:700,
                      cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                    }}>🛒 Add</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Modal */}
      {orderModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:200,
          display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
          onClick={e => { if(e.target===e.currentTarget){ setOrderModal(null); setOrderMsg(""); } }}>
          <div style={{ background:"#fff", borderRadius:18, padding:"28px 32px",
            width:"100%", maxWidth:"480px", maxHeight:"90vh", overflowY:"auto" }}>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:0 }}>
                Order {orderModal.cropName}
              </h2>
              <button onClick={() => { setOrderModal(null); setOrderMsg(""); }}
                style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#6b7280" }}>✕</button>
            </div>

            {/* Product info */}
            <div style={{ background:"#f0fdf4", borderRadius:10, padding:"12px 14px", marginBottom:18,
              display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:32 }}>{CROP_EMOJI[orderModal.cropName]||"🥬"}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{orderModal.cropName}</div>
                <div style={{ fontSize:12, color:"#6b7280" }}>Rs. {orderModal.price}/kg · {orderModal.stock} kg available</div>
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
                textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
                Quantity (kg)
              </label>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={() => setCart(p=>({...p,[orderModal._id]:Math.max(1,(p[orderModal._id]||1)-1)}))}
                  style={{ width:36, height:36, borderRadius:8, border:"1.5px solid #e5e7eb",
                  background:"#fff", fontSize:18, cursor:"pointer" }}>−</button>
                <span style={{ fontSize:16, fontWeight:700, minWidth:30, textAlign:"center" }}>
                  {cart[orderModal._id]||1}
                </span>
                <button onClick={() => setCart(p=>({...p,[orderModal._id]:(p[orderModal._id]||1)+1}))}
                  style={{ width:36, height:36, borderRadius:8, border:"1.5px solid #e5e7eb",
                  background:"#fff", fontSize:18, cursor:"pointer" }}>+</button>
                <span style={{ fontSize:14, fontWeight:700, color:"#22c55e", marginLeft:8 }}>
                  = Rs. {(cart[orderModal._id]||1) * orderModal.price}
                </span>
              </div>
            </div>

            {/* Delivery form */}
            {[
              ["Street Address","street","123 Main St"],
              ["City","city","Colombo"],
              ["District","district","Western"],
              ["Phone","phone","+94 77 000 0000"],
            ].map(([label,field,ph]) => (
              <div key={field} style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
                  textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>
                  {label}
                </label>
                <input type="text" placeholder={ph}
                  value={(orderForm as any)[field]}
                  onChange={e => setOrderForm(p=>({...p,[field]:e.target.value}))}
                  style={{ width:"100%", padding:"10px 13px", border:"1.5px solid #e5e7eb",
                  borderRadius:9, fontSize:13, fontFamily:"'DM Sans',sans-serif",
                  outline:"none", boxSizing:"border-box" as const }} />
              </div>
            ))}

                          {/* Payment method — COD only */}
              <div style={{ marginBottom:20, padding:"12px 14px",
                background:"#f0fdf4", border:"1px solid #bbf7d0",
                borderRadius:10 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#166534",
                  display:"flex", alignItems:"center", gap:8 }}>
                  💵 Cash on Delivery (COD)
                  <span style={{ background:"#22c55e", color:"#fff",
                    fontSize:10, fontWeight:700, padding:"2px 8px",
                    borderRadius:99 }}>Only option</span>
                </div>
                <div style={{ fontSize:12, color:"#374151", marginTop:4 }}>
                  Pay in cash when your order is delivered to your door
                </div>
              </div>

            {orderMsg && (
              <div style={{ padding:"10px 14px", borderRadius:8, marginBottom:14,
                background:orderMsg.startsWith("✅")?"#f0fdf4":"#fff1f1",
                color:orderMsg.startsWith("✅")?"#166534":"#dc2626",
                fontSize:13, fontWeight:600 }}>{orderMsg}</div>
            )}

            <button onClick={handlePlaceOrder} disabled={placing} style={{
              width:"100%", padding:"13px",
              background:placing?"#a7f3d0":"linear-gradient(135deg,#1a3a2a,#22c55e)",
              color:"#fff", border:"none", borderRadius:10,
              fontSize:14, fontWeight:700, cursor:"pointer",
            }}>
              {placing ? "Placing Order…" : "✓ Place Order"}
            </button>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}