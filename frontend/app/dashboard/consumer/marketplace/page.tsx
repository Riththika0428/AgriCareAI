"use client";

import { useState, useEffect } from "react";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { productAPI, orderAPI } from "@/lib/axios-proxy";

const CROP_EMOJI: Record<string, string> = {
  "Spinach":"🥬","Carrot":"🥕","Broccoli":"🥦","Bell Pepper":"🫑","Tomato":"🍅",
  "Kale":"🥬","Sweet Potato":"🍠","Cucumber":"🥒","Onion":"🧅","Potato":"🥔",
  "Corn":"🌽","Beans":"🫘","Cabbage":"🥬","Beetroot":"🫚","Chili":"🌶️","Mango":"🥭",
};

const NUTRIENT_TAGS: Record<string, string[]> = {
  "Spinach":["Iron","Vitamin A","Fiber"],"Carrot":["Vitamin A","Beta Carotene"],
  "Broccoli":["Vitamin C","Fiber","Iron"],"Bell Pepper":["Vitamin C","Vitamin B6"],
  "Tomato":["Lycopene","Vitamin C"],"Kale":["Iron","Calcium","Vitamin K"],
};

interface CartItem { product: any; qty: number; }

const BACKEND_URL = "http://localhost:5000";

// ── Product image with emoji fallback ─────────────────────
function ProductImage({ product, height = 140 }: { product: any; height?: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const emoji = CROP_EMOJI[product.cropName] || "🥬";
  const showImage = product.imageUrl && !imgFailed;

  return (
    <div style={{
      height, width: "100%", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f0fdf4", position: "relative",
    }}>
      {showImage ? (
        <img
          src={`${BACKEND_URL}${product.imageUrl}`}
          alt={product.cropName}
          onError={() => setImgFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: height > 80 ? 64 : 28 }}>{emoji}</span>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  const [products,     setProducts]     = useState<any[]>([]);
  const [filtered,     setFiltered]     = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setType]         = useState("All");
  const [sortBy,       setSort]         = useState("newest");
  const [cart,         setCart]         = useState<Record<string, CartItem>>({});
  const [cartOpen,     setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placing,      setPlacing]      = useState(false);
  const [orderMsg,     setOrderMsg]     = useState("");
  const [orderForm,    setOrderForm]    = useState({
    street: "", city: "", district: "", phone: "", paymentMethod: "COD",
  });

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
    if (search)               list = list.filter(p => p.cropName?.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== "All") list = list.filter(p => p.type === typeFilter);
    if (sortBy === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating")     list.sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0));
    setFiltered(list);
  };

  const addToCart = (product: any) => {
    setCart(prev => ({
      ...prev,
      [product._id]: { product, qty: (prev[product._id]?.qty || 0) + 1 },
    }));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => {
      const next = (prev[id]?.qty || 0) + delta;
      if (next <= 0) { const u = { ...prev }; delete u[id]; return u; }
      return { ...prev, [id]: { ...prev[id], qty: next } };
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => { const u = { ...prev }; delete u[id]; return u; });
  };

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0);

  const handlePlaceOrder = async () => {
    if (!orderForm.street || !orderForm.city || !orderForm.phone) {
      setOrderMsg("Please fill all delivery fields."); return;
    }
    if (cartItems.length === 0) { setOrderMsg("Your cart is empty."); return; }
    setPlacing(true); setOrderMsg("");
    try {
      await Promise.all(
        cartItems.map(({ product, qty }) =>
          orderAPI.create({
            productId: product._id, quantity: qty,
            deliveryAddress: {
              street: orderForm.street, city: orderForm.city,
              district: orderForm.district, phone: orderForm.phone,
            },
            paymentMethod: orderForm.paymentMethod,
          })
        )
      );
      setOrderMsg("✅ All orders placed successfully!");
      setCart({});
      setTimeout(() => {
        setCheckoutOpen(false); setOrderMsg("");
        setOrderForm({ street: "", city: "", district: "", phone: "", paymentMethod: "COD" });
      }, 2000);
    } catch (e: any) {
      setOrderMsg("❌ " + (e.response?.data?.message || "Order failed."));
    } finally { setPlacing(false); }
  };

  const inCart = (id: string) => !!cart[id];

  return (
    <ConsumerLayout>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:0, display:"flex", alignItems:"center", gap:10 }}>
            🛒 Marketplace
          </h1>
          <p style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>Browse fresh produce from verified farmers</p>
        </div>
        <button onClick={() => setCartOpen(true)} style={{
          position:"relative", background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
          color:"#fff", border:"none", borderRadius:12, padding:"10px 20px",
          fontSize:14, fontWeight:700, cursor:"pointer",
          display:"flex", alignItems:"center", gap:8,
        }}>
          🛒 Cart
          {cartCount > 0 && (
            <span style={{
              background:"#ef4444", color:"#fff", borderRadius:"50%",
              width:20, height:20, fontSize:11, fontWeight:800,
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"absolute", top:-8, right:-8,
            }}>{cartCount}</span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:12, marginBottom:22, alignItems:"center" }}>
        <div style={{ flex:1, position:"relative" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }}>🔍</span>
          <input type="text" placeholder="Search vegetables, fruits..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"10px 14px 10px 36px", border:"1.5px solid #e5e7eb",
              borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14,
              outline:"none", boxSizing:"border-box" as const }} />
        </div>
        <select value={typeFilter} onChange={e => setType(e.target.value)} style={{
          padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
          fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", cursor:"pointer" }}>
          <option value="All">All Types</option>
          <option value="Organic">Organic</option>
          <option value="Conventional">Conventional</option>
        </select>
        <select value={sortBy} onChange={e => setSort(e.target.value)} style={{
          padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
          fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", cursor:"pointer" }}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Cart banner */}
      {cartCount > 0 && (
        <div style={{
          background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:12,
          padding:"12px 18px", marginBottom:20,
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div style={{ fontSize:14, fontWeight:600, color:"#166534" }}>
            🛒 {cartCount} item{cartCount > 1 ? "s" : ""} in cart · <strong>Rs. {cartTotal.toLocaleString()}</strong> total
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => setCartOpen(true)} style={{
              background:"none", border:"1.5px solid #22c55e", color:"#166534",
              borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              View Cart
            </button>
            <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} style={{
              background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
              border:"none", borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              Checkout →
            </button>
          </div>
        </div>
      )}

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
          {filtered.map((p: any) => {
            const tags  = NUTRIENT_TAGS[p.cropName] || [];
            const added = inCart(p._id);
            const qty   = cart[p._id]?.qty || 0;

            return (
              <div key={p._id} style={{
                background:"#fff", borderRadius:16,
                border:`1.5px solid ${added ? "#bbf7d0" : "#e8ede8"}`,
                overflow:"hidden",
                boxShadow: added ? "0 4px 16px rgba(34,197,94,.15)" : "0 2px 8px rgba(0,0,0,.04)",
                transition:"transform .2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {/* ── Real image OR emoji fallback ── */}
                <div style={{ position: "relative" }}>
                  <ProductImage product={p} height={160} />

                  {/* In-cart badge */}
                  {added && (
                    <div style={{
                      position:"absolute", top:10, left:10,
                      background:"#22c55e", color:"#fff", borderRadius:99,
                      fontSize:11, fontWeight:700, padding:"3px 10px", zIndex:2,
                    }}>✓ In Cart ({qty}kg)</div>
                  )}

                  {/* Wishlist button */}
                  <button style={{
                    position:"absolute", top:10, right:10, background:"#fff",
                    border:"1px solid #e5e7eb", borderRadius:"50%",
                    width:28, height:28, cursor:"pointer", fontSize:14,
                    display:"flex", alignItems:"center", justifyContent:"center", zIndex:2,
                  }}>🤍</button>
                </div>

                <div style={{ padding:"14px 16px" }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:2 }}>{p.cropName}</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:8, display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ color:"#22c55e" }}>📍</span>
                    {p.farmer?.name || "Local Farmer"} · {p.district || "Sri Lanka"}
                  </div>

                  {p.type === "Organic" && (
                    <div style={{ display:"inline-flex", alignItems:"center", gap:4,
                      background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:99,
                      padding:"3px 10px", fontSize:11, fontWeight:700, color:"#166534", marginBottom:8 }}>
                      🌿 Organic · Trust Score: {p.trustScore || 88}%
                    </div>
                  )}

                  {p.harvestDate && (
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:4 }}>
                      ⏱ Harvested {new Date(p.harvestDate).toLocaleDateString("en-CA")}
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div style={{ fontSize:11, color:"#6b7280", marginBottom:10 }}>🌿 {tags.join(", ")}</div>
                  )}

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <div>
                      <div style={{ fontSize:16, fontWeight:800, color:"#111827" }}>Rs. {p.price}/kg</div>
                      {p.trustScore > 0 && (
                        <div style={{ fontSize:11, color:"#f59e0b" }}>★ {(p.trustScore / 20).toFixed(1)}</div>
                      )}
                    </div>

                    {added ? (
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <button onClick={() => updateQty(p._id, -1)} style={{
                          width:30, height:30, borderRadius:8, border:"1.5px solid #e5e7eb",
                          background:"#fff", fontSize:16, cursor:"pointer", fontWeight:700 }}>−</button>
                        <span style={{ fontSize:14, fontWeight:700, minWidth:20, textAlign:"center" }}>{qty}</span>
                        <button onClick={() => updateQty(p._id, 1)} style={{
                          width:30, height:30, borderRadius:8, border:"1.5px solid #22c55e",
                          background:"#f0fdf4", fontSize:16, cursor:"pointer", fontWeight:700, color:"#166534" }}>+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(p)} style={{
                        background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
                        color:"#fff", border:"none", borderRadius:9,
                        padding:"8px 18px", fontSize:13, fontWeight:700,
                        cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                      }}>🛒 Add</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CART SIDEBAR ── */}
      {cartOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200,
          display:"flex", justifyContent:"flex-end" }}
          onClick={e => { if (e.target === e.currentTarget) setCartOpen(false); }}>
          <div style={{ background:"#fff", width:"100%", maxWidth:420, height:"100%",
            display:"flex", flexDirection:"column" }}>

            <div style={{ padding:"22px 24px 16px", borderBottom:"1px solid #e5e7eb",
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <h2 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:0 }}>🛒 Your Cart</h2>
                <p style={{ fontSize:12, color:"#6b7280", margin:"2px 0 0" }}>{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => setCartOpen(false)}
                style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#6b7280" }}>✕</button>
            </div>

            <div style={{ flex:1, padding:"16px 24px", overflowY:"auto" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>🛒</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>Your cart is empty</div>
                  <div style={{ fontSize:13, marginTop:4 }}>Browse the marketplace and add products</div>
                </div>
              ) : cartItems.map(({ product: p, qty }) => (
                <div key={p._id} style={{ display:"flex", alignItems:"center", gap:14,
                  padding:"14px 0", borderBottom:"1px solid #f3f4f6" }}>

                  {/* Cart item — image or emoji */}
                  <div style={{ width:52, height:52, borderRadius:12, overflow:"hidden",
                    background:"#f0fdf4", flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <ProductImage product={p} height={52} />
                  </div>

                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{p.cropName}</div>
                    <div style={{ fontSize:12, color:"#6b7280" }}>Rs. {p.price}/kg</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#22c55e", marginTop:2 }}>
                      Rs. {(qty * p.price).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <button onClick={() => updateQty(p._id, -1)} style={{
                      width:28, height:28, borderRadius:7, border:"1.5px solid #e5e7eb",
                      background:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>−</button>
                    <span style={{ fontSize:14, fontWeight:700, minWidth:22, textAlign:"center" }}>{qty}</span>
                    <button onClick={() => updateQty(p._id, 1)} style={{
                      width:28, height:28, borderRadius:7, border:"1.5px solid #22c55e",
                      background:"#f0fdf4", fontSize:14, cursor:"pointer", fontWeight:700, color:"#166534" }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(p._id)} style={{
                    background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:16, padding:"4px" }}>🗑</button>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && (
              <div style={{ padding:"16px 24px", borderTop:"1px solid #e5e7eb" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <span style={{ fontSize:15, fontWeight:600, color:"#374151" }}>Total</span>
                  <span style={{ fontSize:20, fontWeight:800, color:"#111827" }}>Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} style={{
                  width:"100%", padding:"13px", background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
                  color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  Proceed to Checkout →
                </button>
                <button onClick={() => setCart({})} style={{
                  width:"100%", marginTop:8, padding:"10px",
                  background:"none", border:"1.5px solid #e5e7eb", color:"#6b7280",
                  borderRadius:10, fontSize:13, cursor:"pointer" }}>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHECKOUT MODAL ── */}
      {checkoutOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
          onClick={e => { if (e.target === e.currentTarget) { setCheckoutOpen(false); setOrderMsg(""); } }}>
          <div style={{ background:"#fff", borderRadius:18, padding:"28px 32px",
            width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto" }}>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:0 }}>Checkout</h2>
              <button onClick={() => { setCheckoutOpen(false); setOrderMsg(""); }}
                style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#6b7280" }}>✕</button>
            </div>

            {/* Order summary with images */}
            <div style={{ background:"#f9fafb", borderRadius:12, padding:"14px 16px", marginBottom:18 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:10 }}>Order Summary</div>
              {cartItems.map(({ product: p, qty }) => (
                <div key={p._id} style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {/* Checkout item image */}
                    <div style={{ width:36, height:36, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                      <ProductImage product={p} height={36} />
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{p.cropName}</div>
                      <div style={{ fontSize:11, color:"#6b7280" }}>{qty} kg × Rs. {p.price}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#22c55e" }}>
                    Rs. {(qty * p.price).toLocaleString()}
                  </div>
                </div>
              ))}
              <div style={{ borderTop:"1px solid #e5e7eb", marginTop:10, paddingTop:10,
                display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>Total</span>
                <span style={{ fontSize:16, fontWeight:800, color:"#111827" }}>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery form */}
            <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:12 }}>Delivery Details</div>
            {[
              ["Street Address", "street",   "123 Main St"],
              ["City",           "city",     "Colombo"],
              ["District",       "district", "Western"],
              ["Phone",          "phone",    "+94 77 000 0000"],
            ].map(([label, field, ph]) => (
              <div key={field} style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
                  textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>
                  {label}
                </label>
                <input type="text" placeholder={ph}
                  value={(orderForm as any)[field]}
                  onChange={e => setOrderForm(prev => ({ ...prev, [field]: e.target.value }))}
                  style={{ width:"100%", padding:"10px 13px", border:"1.5px solid #e5e7eb",
                    borderRadius:9, fontSize:13, fontFamily:"'DM Sans',sans-serif",
                    outline:"none", boxSizing:"border-box" as const }} />
              </div>
            ))}

            <div style={{ marginBottom:20, padding:"12px 14px",
              background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#166534",
                display:"flex", alignItems:"center", gap:8 }}>
                💵 Cash on Delivery (COD)
                <span style={{ background:"#22c55e", color:"#fff", fontSize:10, fontWeight:700,
                  padding:"2px 8px", borderRadius:99 }}>Only option</span>
              </div>
              <div style={{ fontSize:12, color:"#374151", marginTop:4 }}>
                Pay in cash when your order is delivered to your door
              </div>
            </div>

            {orderMsg && (
              <div style={{ padding:"10px 14px", borderRadius:8, marginBottom:14,
                background: orderMsg.startsWith("✅") ? "#f0fdf4" : "#fff1f1",
                color: orderMsg.startsWith("✅") ? "#166534" : "#dc2626",
                fontSize:13, fontWeight:600 }}>{orderMsg}</div>
            )}

            <button onClick={handlePlaceOrder} disabled={placing} style={{
              width:"100%", padding:"13px",
              background: placing ? "#a7f3d0" : "linear-gradient(135deg,#1a3a2a,#22c55e)",
              color:"#fff", border:"none", borderRadius:10,
              fontSize:14, fontWeight:700, cursor: placing ? "not-allowed" : "pointer",
            }}>
              {placing ? "Placing Orders…" : `✓ Place Order (${cartItems.length} item${cartItems.length > 1 ? "s" : ""})`}
            </button>
          </div>
        </div>
      )}

    </ConsumerLayout>
  );
}