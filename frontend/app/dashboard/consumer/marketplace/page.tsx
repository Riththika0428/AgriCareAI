"use client";

import { useState, useEffect } from "react";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { productAPI, orderAPI } from "@/lib/axios-proxy";

const BACKEND = "http://localhost:5000";
const C = {
  green:"#22c55e", dark:"#1a3a2a", mid:"#2d5a3d",
  text:"#111827", muted:"#6b7280", border:"#e8ede8", bg:"#f8faf8",
};

const NUTRIENT_TAGS: Record<string,string[]> = {
  "Spinach":["Iron","Vit A","Fiber"], "Carrot":["Vit A","Beta Carotene"],
  "Broccoli":["Vit C","Fiber","Iron"], "Bell Pepper":["Vit C","Vit B6"],
  "Tomato":["Lycopene","Vit C"], "Kale":["Iron","Calcium","Vit K"],
};

function ProductImg({ product, h=160 }: { product:any; h?:number }) {
  const [fail, setFail] = useState(false);
  if (product.imageUrl && !fail) return (
    <img src={`${BACKEND}${product.imageUrl}`} alt={product.cropName}
      onError={() => setFail(true)}
      style={{ width:"100%", height:"100%", objectFit:"cover" }} />
  );
  return (
    <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",
      display:"flex", alignItems:"center", justifyContent:"center", fontSize:h>80?52:28 }}>
      🥬
    </div>
  );
}

interface CartItem { product:any; qty:number; }

const PACKAGES = [
  { id:"free",    name:"Free Trial", price:0,   period:"7 days", highlight:false, features:["5 orders/month","Basic tracking","Marketplace access"] },
  { id:"basic",   name:"Basic",      price:499, period:"month",  highlight:false, features:["Unlimited orders","Full nutrition log","Order tracking","Email support"] },
  { id:"premium", name:"Premium",    price:999, period:"month",  highlight:true,  features:["Everything in Basic","Priority delivery","AI meal planning","Personalised reports","Premium support"] },
];

export default function MarketplacePage() {
  const [products,     setProducts]     = useState<any[]>([]);
  const [filtered,     setFiltered]     = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setType]         = useState("All");
  const [catFilter,    setCat]          = useState("All");
  const [sortBy,       setSort]         = useState("newest");
  const [cart,         setCart]         = useState<Record<string,CartItem>>({});
  const [selected,     setSelected]     = useState<Set<string>>(new Set());
  const [bulkMode,     setBulkMode]     = useState(false);
  const [cartOpen,     setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placing,      setPlacing]      = useState(false);
  const [orderMsg,     setOrderMsg]     = useState("");
  const [showPkgs,     setShowPkgs]     = useState(false);
  const [orderForm,    setOrderForm]    = useState({ street:"", city:"", district:"", phone:"", paymentMethod:"COD" });

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { applyFilters(); }, [search, typeFilter, catFilter, sortBy, products]);

  const loadProducts = async () => {
    try {
      const { data } = await productAPI.getAll();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch {}
    setLoading(false);
  };

  const applyFilters = () => {
    let list = [...products];
    // Safety net: hide out-of-stock / inactive products on the consumer side
    list = list.filter(p => p.stock > 0 && p.status !== "Out of Stock" && p.status !== "Inactive");
    if (search)             list = list.filter(p => p.cropName?.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== "All") list = list.filter(p => p.type === typeFilter);
    if (catFilter  !== "All") list = list.filter(p => p.category === catFilter);
    if (sortBy === "price-asc")  list.sort((a,b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a,b) => b.price - a.price);
    if (sortBy === "rating")     list.sort((a,b) => (b.trustScore||0) - (a.trustScore||0));
    setFiltered(list);
  };

  const addToCart     = (product:any, qty=1) => {
    if (product.stock <= 0) return;  // prevent adding out-of-stock items
    setCart(prev => {
      const newQty = Math.min((prev[product._id]?.qty || 0) + qty, product.stock);
      return { ...prev, [product._id]: { product, qty: newQty } };
    });
  };
  const updateQty     = (id:string, delta:number) =>
    setCart(prev => {
      const item = prev[id]; if (!item) return prev;
      const next = item.qty + delta;
      if (next <= 0) { const u = { ...prev }; delete u[id]; return u; }
      const capped = Math.min(next, item.product.stock);  // don't exceed available stock
      return { ...prev, [id]: { ...prev[id], qty: capped } };
    });
  const removeFromCart = (id:string) =>
    setCart(prev => { const u={...prev}; delete u[id]; return u; });
  const addBulkToCart  = () => {
    filtered.filter(p => selected.has(p._id)).forEach(p => addToCart(p, 1));
    setSelected(new Set()); setBulkMode(false); setCartOpen(true);
  };
  const toggleSelect = (id:string) =>
    setSelected(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cartItems.reduce((s,i) => s+i.qty*i.product.price, 0);

  const handlePlaceOrder = async () => {
    if (!orderForm.street||!orderForm.city||!orderForm.phone) { setOrderMsg("Fill all delivery fields."); return; }
    if (cartItems.length===0) { setOrderMsg("Cart is empty."); return; }
    setPlacing(true); setOrderMsg("");
    try {
      await Promise.all(cartItems.map(({ product, qty }) =>
        orderAPI.create({ productId:product._id, quantity:qty,
          deliveryAddress:{ street:orderForm.street, city:orderForm.city, district:orderForm.district, phone:orderForm.phone },
          paymentMethod:"COD" })
      ));
      setOrderMsg("Orders placed successfully!");
      setCart({});
      // Reload products so stock levels update & out-of-stock items disappear
      loadProducts();
      setTimeout(() => { setCheckoutOpen(false); setOrderMsg(""); setOrderForm({ street:"",city:"",district:"",phone:"",paymentMethod:"COD" }); }, 2000);
    } catch(e:any) { setOrderMsg(e.response?.data?.message || "Order failed."); }
    finally { setPlacing(false); }
  };

  const categories = ["All", ...Array.from(new Set(products.map((p:any) => p.category).filter(Boolean)))];

  return (
    <ConsumerLayout>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fu  { animation: fadeUp .3s ease both; }
        .c-h:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(26,58,42,.12)!important; }
        .b-h:hover { opacity:.82; }
        .sel-card  { outline:2.5px solid #22c55e; outline-offset:2px; }
        .p-card    { transition:all .22s; cursor:pointer; }
      `}</style>

      {/* ── Page title — exactly matches My Orders header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>
            Marketplace
          </h1>
          <p style={{ fontSize:13, color:"#6b7280", marginTop:3 }}>
            {filtered.length} products from verified farmers
            {bulkMode && selected.size>0 && (
              <span style={{ marginLeft:8, color:C.green, fontWeight:700 }}>· {selected.size} selected</span>
            )}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {bulkMode && selected.size>0 && (
            <button className="b-h" onClick={addBulkToCart}
              style={{ background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
                border:"none", borderRadius:10, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Add {selected.size} to Cart
            </button>
          )}
          <button className="b-h" onClick={() => { setBulkMode(p=>!p); setSelected(new Set()); }}
            style={{ background:bulkMode?"#f0fdf4":"#f4f0e8",
              color:bulkMode?"#166534":C.dark,
              border:`1.5px solid ${bulkMode?"#bbf7d0":C.border}`,
              borderRadius:10, padding:"9px 14px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
            {bulkMode ? "Exit Select" : "Bulk Select"}
          </button>
          <button className="b-h" onClick={() => setCartOpen(true)}
            style={{ position:"relative", background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
              color:"#fff", border:"none", borderRadius:10, padding:"9px 18px",
              fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Cart
            {cartCount>0 && (
              <span style={{ background:"#ef4444", color:"#fff", borderRadius:"50%",
                width:18, height:18, fontSize:10, fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center",
                position:"absolute", top:-7, right:-7 }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ background:"#fff", borderRadius:14, border:"1px solid #eeebe4",
        padding:"14px 18px", marginBottom:20,
        display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:180, position:"relative" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
            style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)" }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search products…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"9px 12px 9px 34px", border:"1.5px solid #e5e7eb",
              borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {categories.slice(0,5).map(cat => (
            <button key={cat} onClick={() => setCat(cat)} className="b-h"
              style={{ padding:"6px 13px", borderRadius:99, border:"1.5px solid",
                borderColor:catFilter===cat?"#1a3a2a":"#e0ddd6",
                background:catFilter===cat?"#1a3a2a":"transparent",
                color:catFilter===cat?"#fff":C.muted, fontSize:12, fontWeight:600, cursor:"pointer" }}>
              {cat}
            </button>
          ))}
        </div>
        <select value={typeFilter} onChange={e => setType(e.target.value)}
          style={{ padding:"8px 12px", border:"1.5px solid #e5e7eb", borderRadius:9,
            fontFamily:"'DM Sans',sans-serif", fontSize:12, outline:"none", cursor:"pointer", color:C.muted }}>
          <option value="All">All Types</option>
          <option value="Organic">Organic</option>
          <option value="Conventional">Conventional</option>
        </select>
        <select value={sortBy} onChange={e => setSort(e.target.value)}
          style={{ padding:"8px 12px", border:"1.5px solid #e5e7eb", borderRadius:9,
            fontFamily:"'DM Sans',sans-serif", fontSize:12, outline:"none", cursor:"pointer", color:C.muted }}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* ── Bulk banner ── */}
      {bulkMode && (
        <div style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:12,
          padding:"12px 18px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#166534", fontFamily:"'DM Sans',sans-serif" }}>
            Tap products to select them, then add all at once.
            {selected.size>0 && <span style={{ marginLeft:8 }}>· <strong>{selected.size} selected</strong></span>}
          </div>
          {selected.size>0 && (
            <div style={{ display:"flex", gap:8 }}>
              <button className="b-h" onClick={() => setSelected(new Set())}
                style={{ background:"none", border:"1.5px solid #bbf7d0", color:"#166534",
                  borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer" }}>Clear</button>
              <button className="b-h" onClick={addBulkToCart}
                style={{ background:"#22c55e", color:"#fff", border:"none",
                  borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                Add {selected.size} to Cart →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Cart banner ── */}
      {cartCount>0 && !bulkMode && (
        <div style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:12,
          padding:"11px 18px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#166534", fontFamily:"'DM Sans',sans-serif" }}>
            {cartCount} item{cartCount>1?"s":""} in cart · <strong>Rs.{cartTotal.toLocaleString()}</strong>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="b-h" onClick={() => setCartOpen(true)}
              style={{ background:"none", border:"1.5px solid #22c55e", color:"#166634",
                borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>View Cart</button>
            <button className="b-h" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
              style={{ background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
                border:"none", borderRadius:8, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              Checkout →
            </button>
          </div>
        </div>
      )}

      {/* ── Product grid ── */}
      {loading ? (
        <div style={{ textAlign:"center", padding:80, color:C.muted, fontFamily:"'DM Sans',sans-serif" }}>
          Loading fresh produce…
        </div>
      ) : filtered.length===0 ? (
        <div style={{ textAlign:"center", padding:80, color:"#9ca3af" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🛒</div>
          <div style={{ fontSize:14, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>No products found</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>Try adjusting your filters</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:18 }}>
          {filtered.map((p:any, idx:number) => {
            const inC  = !!cart[p._id];
            const qty  = cart[p._id]?.qty || 0;
            const isSel = selected.has(p._id);
            const tags  = NUTRIENT_TAGS[p.cropName] || [];
            return (
              <div key={p._id}
                className={`p-card c-h fu ${isSel?"sel-card":""}`}
                style={{ background:"#fff", borderRadius:16,
                  border:`1.5px solid ${inC?"#bbf7d0":isSel?"#22c55e":"#eeebe4"}`,
                  overflow:"hidden",
                  boxShadow:inC?"0 4px 18px rgba(34,197,94,.12)":"0 2px 8px rgba(0,0,0,.04)",
                  animationDelay:`${idx*0.03}s` }}
                onClick={() => bulkMode ? toggleSelect(p._id) : undefined}>

                {/* Image */}
                <div style={{ height:160, position:"relative", overflow:"hidden" }}>
                  <ProductImg product={p} h={160}/>
                  {bulkMode && (
                    <div style={{ position:"absolute", top:10, left:10, width:24, height:24, borderRadius:7,
                      background:isSel?"#22c55e":"rgba(255,255,255,.9)",
                      border:`2px solid ${isSel?"#22c55e":"#d1d5db"}`,
                      display:"flex", alignItems:"center", justifyContent:"center", zIndex:3 }}>
                      {isSel && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                    </div>
                  )}
                  {inC && !bulkMode && (
                    <div style={{ position:"absolute", top:10, left:10, background:"#22c55e", color:"#fff",
                      borderRadius:99, fontSize:10, fontWeight:700, padding:"3px 9px", zIndex:2 }}>
                      In Cart ({qty})
                    </div>
                  )}
                  {/* Low-stock warning badge */}
                  {p.stock > 0 && p.stock <= 5 && !inC && !bulkMode && (
                    <div style={{ position:"absolute", top:10, left:10, background:"#fef3c7",
                      border:"1px solid #fbbf24", color:"#92400e",
                      fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:99, zIndex:2 }}>
                      Only {p.stock} left
                    </div>
                  )}
                  {p.type==="Organic" && (
                    <div style={{ position:"absolute", top:10, right:10, background:"#f0fdf4",
                      border:"1px solid #bbf7d0", color:"#166534",
                      fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:99, zIndex:2 }}>
                      Organic
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding:"14px 16px" }}>
                  {/* Product name — Playfair Display */}
                  <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:2,
                    fontFamily:"'Playfair Display', serif" }}>
                    {p.cropName}
                  </div>
                  <div style={{ fontSize:11, color:C.muted, marginBottom:8,
                    display:"flex", alignItems:"center", gap:4, fontFamily:"'DM Sans',sans-serif" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {p.farmer?.name || "Local Farmer"} · {p.district || "Sri Lanka"}
                  </div>

                  {tags.length>0 && (
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
                      {tags.map(t => (
                        <span key={t} style={{ background:"#f0fdf4", color:"#166534",
                          fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:99,
                          border:"1px solid #bbf7d0", fontFamily:"'DM Sans',sans-serif" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {p.trustScore>0 && (
                    <div style={{ fontSize:11, color:"#f59e0b", marginBottom:8 }}>
                      {"★".repeat(Math.round(p.trustScore/20))} {(p.trustScore/20).toFixed(1)}
                    </div>
                  )}

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <div>
                      <div style={{ fontSize:16, fontWeight:800, color:C.text, fontFamily:"'Playfair Display',serif" }}>
                        Rs.{p.price}
                        <span style={{ fontSize:11, fontWeight:400, color:C.muted, fontFamily:"'DM Sans',sans-serif" }}>/kg</span>
                      </div>
                      <div style={{ fontSize:10, color:C.muted, fontFamily:"'DM Sans',sans-serif" }}>
                        {p.stock}kg available
                      </div>
                    </div>

                    {!bulkMode && (
                      inC ? (
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <button onClick={() => updateQty(p._id,-1)}
                            style={{ width:28, height:28, borderRadius:7, border:"1.5px solid #e5e7eb",
                              background:"#fff", fontSize:15, cursor:"pointer", fontWeight:700,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                          <span style={{ fontSize:14, fontWeight:700, minWidth:18, textAlign:"center" }}>{qty}</span>
                          <button onClick={() => updateQty(p._id,1)}
                            style={{ width:28, height:28, borderRadius:7, border:"1.5px solid #22c55e",
                              background:"#f0fdf4", fontSize:15, cursor:"pointer", fontWeight:700, color:"#166534",
                              display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                        </div>
                      ) : (
                        <button className="b-h" onClick={() => addToCart(p)}
                          style={{ background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
                            border:"none", borderRadius:9, padding:"8px 14px",
                            fontSize:12, fontWeight:700, cursor:"pointer",
                            display:"flex", alignItems:"center", gap:6, fontFamily:"'DM Sans',sans-serif" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 5v14M5 12h14"/>
                          </svg>
                          Add
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Cart sidebar ── */}
      {cartOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200,
          display:"flex", justifyContent:"flex-end" }}
          onClick={e => { if(e.target===e.currentTarget) setCartOpen(false); }}>
          <div style={{ background:"#fff", width:420, height:"100%", display:"flex", flexDirection:"column",
            boxShadow:"-8px 0 32px rgba(0,0,0,.15)" }}>
            <div style={{ padding:"22px 24px 16px", borderBottom:"1px solid #f0ede8",
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <h2 style={{ fontSize:18, fontWeight:800, color:C.text, margin:0, fontFamily:"'Playfair Display',serif" }}>
                  Your Cart
                </h2>
                <p style={{ fontSize:12, color:C.muted, margin:"2px 0 0", fontFamily:"'DM Sans',sans-serif" }}>
                  {cartCount} item{cartCount!==1?"s":""}
                </p>
              </div>
              <button onClick={() => setCartOpen(false)}
                style={{ background:"#f4f0e8", border:"none", width:30, height:30, borderRadius:"50%",
                  cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", color:C.muted }}>
                ✕
              </button>
            </div>
            <div style={{ flex:1, padding:"14px 24px", overflowY:"auto" }}>
              {cartItems.length===0 ? (
                <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af", fontFamily:"'DM Sans',sans-serif" }}>
                  <div style={{ fontSize:14, fontWeight:600 }}>Cart is empty</div>
                </div>
              ) : cartItems.map(({ product:p, qty }) => (
                <div key={p._id} style={{ display:"flex", alignItems:"center", gap:13,
                  padding:"13px 0", borderBottom:"1px solid #f8f5f0" }}>
                  <div style={{ width:52, height:52, borderRadius:11, overflow:"hidden", flexShrink:0 }}>
                    <ProductImg product={p} h={52}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.text, fontFamily:"'Playfair Display',serif",
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.cropName}</div>
                    <div style={{ fontSize:12, color:C.muted, fontFamily:"'DM Sans',sans-serif" }}>Rs.{p.price}/kg</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#22c55e" }}>Rs.{(qty*p.price).toLocaleString()}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <button onClick={() => updateQty(p._id,-1)}
                      style={{ width:26, height:26, borderRadius:7, border:"1.5px solid #e5e7eb",
                        background:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>−</button>
                    <span style={{ fontSize:14, fontWeight:700, minWidth:20, textAlign:"center" }}>{qty}</span>
                    <button onClick={() => updateQty(p._id,1)}
                      style={{ width:26, height:26, borderRadius:7, border:"1.5px solid #22c55e",
                        background:"#f0fdf4", fontSize:14, cursor:"pointer", fontWeight:700, color:"#166634" }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(p._id)}
                    style={{ background:"none", border:"none", color:"#ef4444", cursor:"pointer",
                      padding:4, display:"flex", alignItems:"center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {cartItems.length>0 && (
              <div style={{ padding:"16px 24px", borderTop:"1px solid #f0ede8" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:"#374151", fontFamily:"'DM Sans',sans-serif" }}>Total</span>
                  <span style={{ fontSize:20, fontWeight:800, color:C.text, fontFamily:"'Playfair Display',serif" }}>
                    Rs.{cartTotal.toLocaleString()}
                  </span>
                </div>
                <button className="b-h" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                  style={{ width:"100%", padding:"12px", background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
                    color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif" }}>
                  Proceed to Checkout →
                </button>
                <button className="b-h" onClick={() => setCart({})}
                  style={{ width:"100%", marginTop:8, padding:"9px", background:"none",
                    border:"1.5px solid #e0ddd6", color:C.muted, borderRadius:10, fontSize:13,
                    cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Checkout modal ── */}
      {checkoutOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={e => { if(e.target===e.currentTarget){ setCheckoutOpen(false); setOrderMsg(""); } }}>
          <div style={{ background:"#fff", borderRadius:20, padding:"28px 30px", width:"100%", maxWidth:520,
            maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,.18)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:C.dark, margin:0, fontFamily:"'Playfair Display',serif" }}>
                Checkout
              </h2>
              <button onClick={() => { setCheckoutOpen(false); setOrderMsg(""); }}
                style={{ background:"#f4f0e8", border:"none", width:30, height:30, borderRadius:"50%",
                  cursor:"pointer", fontSize:15, color:C.muted, display:"flex", alignItems:"center", justifyContent:"center" }}>
                ✕
              </button>
            </div>

            {/* Order summary */}
            <div style={{ background:"#f9fafb", borderRadius:12, padding:"14px 16px", marginBottom:18 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}>
                Order Summary ({cartItems.length} items)
              </div>
              {cartItems.map(({ product:p, qty }) => (
                <div key={p._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                      <ProductImg product={p} h={34}/>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.text, fontFamily:"'Playfair Display',serif" }}>{p.cropName}</div>
                      <div style={{ fontSize:11, color:C.muted, fontFamily:"'DM Sans',sans-serif" }}>{qty}kg × Rs.{p.price}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#22c55e" }}>Rs.{(qty*p.price).toLocaleString()}</div>
                </div>
              ))}
              <div style={{ borderTop:"1px solid #e5e7eb", marginTop:10, paddingTop:10,
                display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:14, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>Total</span>
                <span style={{ fontSize:16, fontWeight:800, fontFamily:"'Playfair Display',serif" }}>
                  Rs.{cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery form */}
            <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>
              Delivery Details
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              {([["Street Address","street","123 Main St"],["City","city","Colombo"],["District","district","Western"],["Phone","phone","+94 77 000 0000"]] as [string,string,string][]).map(([label,field,ph]) => (
                <div key={field} style={{ gridColumn:field==="street"?"1/-1":undefined }}>
                  <label style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase",
                    letterSpacing:".06em", display:"block", marginBottom:4, fontFamily:"'DM Sans',sans-serif" }}>
                    {label}
                  </label>
                  <input type="text" placeholder={ph} value={(orderForm as any)[field]}
                    onChange={e => setOrderForm(prev => ({ ...prev, [field]:e.target.value }))}
                    style={{ width:"100%", padding:"9px 12px", border:"1.5px solid #e5e7eb",
                      borderRadius:9, fontSize:13, fontFamily:"'DM Sans',sans-serif",
                      outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:16, padding:"11px 14px", background:"#f0fdf4",
              border:"1px solid #bbf7d0", borderRadius:10 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#166534",
                display:"flex", alignItems:"center", gap:8, fontFamily:"'DM Sans',sans-serif" }}>
                Cash on Delivery
                <span style={{ background:"#22c55e", color:"#fff", fontSize:10, fontWeight:700,
                  padding:"2px 8px", borderRadius:99 }}>Only option</span>
              </div>
              <div style={{ fontSize:12, color:"#374151", marginTop:3, fontFamily:"'DM Sans',sans-serif" }}>
                Pay in cash when your order arrives
              </div>
            </div>

            {orderMsg && (
              <div style={{ padding:"10px 13px", borderRadius:8, marginBottom:14,
                background:orderMsg.includes("success")?"#f0fdf4":"#fff1f1",
                color:orderMsg.includes("success")?"#166534":"#dc2626",
                fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
                {orderMsg}
              </div>
            )}

            <button className="b-h" onClick={handlePlaceOrder} disabled={placing}
              style={{ width:"100%", padding:"13px",
                background:placing?"#a7f3d0":"linear-gradient(135deg,#1a3a2a,#22c55e)",
                color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700,
                cursor:placing?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif" }}>
              {placing ? "Placing Orders…" : `Place Order · ${cartItems.length} item${cartItems.length>1?"s":""}`}
            </button>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}