// "use client";

// import { useState, useEffect } from "react";
// import ConsumerLayout from "@/app/components/ConsumerLayout";
// import { productAPI, orderAPI } from "@/lib/axios-proxy";

// const CROP_EMOJI: Record<string, string> = {
//   "Spinach":"🥬","Carrot":"🥕","Broccoli":"🥦","Bell Pepper":"🫑","Tomato":"🍅",
//   "Kale":"🥬","Sweet Potato":"🍠","Cucumber":"🥒","Onion":"🧅","Potato":"🥔",
//   "Corn":"🌽","Beans":"🫘","Cabbage":"🥬","Beetroot":"🫚","Chili":"🌶️","Mango":"🥭",
// };

// const NUTRIENT_TAGS: Record<string, string[]> = {
//   "Spinach":["Iron","Vitamin A","Fiber"],"Carrot":["Vitamin A","Beta Carotene"],
//   "Broccoli":["Vitamin C","Fiber","Iron"],"Bell Pepper":["Vitamin C","Vitamin B6"],
//   "Tomato":["Lycopene","Vitamin C"],"Kale":["Iron","Calcium","Vitamin K"],
// };

// interface CartItem { product: any; qty: number; }

// const BACKEND_URL = "http://localhost:5000";

// // ── Product image with emoji fallback ─────────────────────
// function ProductImage({ product, height = 140 }: { product: any; height?: number }) {
//   const [imgFailed, setImgFailed] = useState(false);
//   const emoji = CROP_EMOJI[product.cropName] || "🥬";
//   const showImage = product.imageUrl && !imgFailed;

//   return (
//     <div style={{
//       height, width: "100%", overflow: "hidden",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       background: "#f0fdf4", position: "relative",
//     }}>
//       {showImage ? (
//         <img
//           src={`${BACKEND_URL}${product.imageUrl}`}
//           alt={product.cropName}
//           onError={() => setImgFailed(true)}
//           style={{ width: "100%", height: "100%", objectFit: "cover" }}
//         />
//       ) : (
//         <span style={{ fontSize: height > 80 ? 64 : 28 }}>{emoji}</span>
//       )}
//     </div>
//   );
// }

// export default function MarketplacePage() {
//   const [products,     setProducts]     = useState<any[]>([]);
//   const [filtered,     setFiltered]     = useState<any[]>([]);
//   const [loading,      setLoading]      = useState(true);
//   const [search,       setSearch]       = useState("");
//   const [typeFilter,   setType]         = useState("All");
//   const [sortBy,       setSort]         = useState("newest");
//   const [cart,         setCart]         = useState<Record<string, CartItem>>({});
//   const [cartOpen,     setCartOpen]     = useState(false);
//   const [checkoutOpen, setCheckoutOpen] = useState(false);
//   const [placing,      setPlacing]      = useState(false);
//   const [orderMsg,     setOrderMsg]     = useState("");
//   const [orderForm,    setOrderForm]    = useState({
//     street: "", city: "", district: "", phone: "", paymentMethod: "COD",
//   });

//   useEffect(() => { loadProducts(); }, []);
//   useEffect(() => { applyFilters(); }, [search, typeFilter, sortBy, products]);

//   const loadProducts = async () => {
//     try {
//       const { data } = await productAPI.getAll();
//       setProducts(Array.isArray(data) ? data : data.products || []);
//     } catch {}
//     setLoading(false);
//   };

//   const applyFilters = () => {
//     let list = [...products];
//     if (search)               list = list.filter(p => p.cropName?.toLowerCase().includes(search.toLowerCase()));
//     if (typeFilter !== "All") list = list.filter(p => p.type === typeFilter);
//     if (sortBy === "price-asc")  list.sort((a, b) => a.price - b.price);
//     if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
//     if (sortBy === "rating")     list.sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0));
//     setFiltered(list);
//   };

//   const addToCart = (product: any) => {
//     setCart(prev => ({
//       ...prev,
//       [product._id]: { product, qty: (prev[product._id]?.qty || 0) + 1 },
//     }));
//   };

//   const updateQty = (id: string, delta: number) => {
//     setCart(prev => {
//       const next = (prev[id]?.qty || 0) + delta;
//       if (next <= 0) { const u = { ...prev }; delete u[id]; return u; }
//       return { ...prev, [id]: { ...prev[id], qty: next } };
//     });
//   };

//   const removeFromCart = (id: string) => {
//     setCart(prev => { const u = { ...prev }; delete u[id]; return u; });
//   };

//   const cartItems = Object.values(cart);
//   const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
//   const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0);

//   const handlePlaceOrder = async () => {
//     if (!orderForm.street || !orderForm.city || !orderForm.phone) {
//       setOrderMsg("Please fill all delivery fields."); return;
//     }
//     if (cartItems.length === 0) { setOrderMsg("Your cart is empty."); return; }
//     setPlacing(true); setOrderMsg("");
//     try {
//       await Promise.all(
//         cartItems.map(({ product, qty }) =>
//           orderAPI.create({
//             productId: product._id, quantity: qty,
//             deliveryAddress: {
//               street: orderForm.street, city: orderForm.city,
//               district: orderForm.district, phone: orderForm.phone,
//             },
//             paymentMethod: orderForm.paymentMethod,
//           })
//         )
//       );
//       setOrderMsg("✅ All orders placed successfully!");
//       setCart({});
//       setTimeout(() => {
//         setCheckoutOpen(false); setOrderMsg("");
//         setOrderForm({ street: "", city: "", district: "", phone: "", paymentMethod: "COD" });
//       }, 2000);
//     } catch (e: any) {
//       setOrderMsg("❌ " + (e.response?.data?.message || "Order failed."));
//     } finally { setPlacing(false); }
//   };

//   const inCart = (id: string) => !!cart[id];

//   return (
//     <ConsumerLayout>

//       {/* Header */}
//       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
//         <div>
//           <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:0, display:"flex", alignItems:"center", gap:10 }}>
//             🛒 Marketplace
//           </h1>
//           <p style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>Browse fresh produce from verified farmers</p>
//         </div>
//         <button onClick={() => setCartOpen(true)} style={{
//           position:"relative", background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
//           color:"#fff", border:"none", borderRadius:12, padding:"10px 20px",
//           fontSize:14, fontWeight:700, cursor:"pointer",
//           display:"flex", alignItems:"center", gap:8,
//         }}>
//           🛒 Cart
//           {cartCount > 0 && (
//             <span style={{
//               background:"#ef4444", color:"#fff", borderRadius:"50%",
//               width:20, height:20, fontSize:11, fontWeight:800,
//               display:"flex", alignItems:"center", justifyContent:"center",
//               position:"absolute", top:-8, right:-8,
//             }}>{cartCount}</span>
//           )}
//         </button>
//       </div>

//       {/* Filters */}
//       <div style={{ display:"flex", gap:12, marginBottom:22, alignItems:"center" }}>
//         <div style={{ flex:1, position:"relative" }}>
//           <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }}>🔍</span>
//           <input type="text" placeholder="Search vegetables, fruits..."
//             value={search} onChange={e => setSearch(e.target.value)}
//             style={{ width:"100%", padding:"10px 14px 10px 36px", border:"1.5px solid #e5e7eb",
//               borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:14,
//               outline:"none", boxSizing:"border-box" as const }} />
//         </div>
//         <select value={typeFilter} onChange={e => setType(e.target.value)} style={{
//           padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
//           fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", cursor:"pointer" }}>
//           <option value="All">All Types</option>
//           <option value="Organic">Organic</option>
//           <option value="Conventional">Conventional</option>
//         </select>
//         <select value={sortBy} onChange={e => setSort(e.target.value)} style={{
//           padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:10,
//           fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", cursor:"pointer" }}>
//           <option value="newest">Newest</option>
//           <option value="price-asc">Price: Low to High</option>
//           <option value="price-desc">Price: High to Low</option>
//           <option value="rating">Top Rated</option>
//         </select>
//       </div>

//       {/* Cart banner */}
//       {cartCount > 0 && (
//         <div style={{
//           background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:12,
//           padding:"12px 18px", marginBottom:20,
//           display:"flex", justifyContent:"space-between", alignItems:"center",
//         }}>
//           <div style={{ fontSize:14, fontWeight:600, color:"#166534" }}>
//             🛒 {cartCount} item{cartCount > 1 ? "s" : ""} in cart · <strong>Rs. {cartTotal.toLocaleString()}</strong> total
//           </div>
//           <div style={{ display:"flex", gap:10 }}>
//             <button onClick={() => setCartOpen(true)} style={{
//               background:"none", border:"1.5px solid #22c55e", color:"#166534",
//               borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
//               View Cart
//             </button>
//             <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} style={{
//               background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
//               border:"none", borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
//               Checkout →
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Products grid */}
//       {loading ? (
//         <div style={{ textAlign:"center", padding:"80px", color:"#6b7280" }}>
//           <div style={{ fontSize:36, marginBottom:12 }}>🌿</div>
//           <div style={{ fontWeight:600 }}>Loading fresh produce…</div>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div style={{ textAlign:"center", padding:"80px", color:"#9ca3af" }}>
//           <div style={{ fontSize:48, marginBottom:12 }}>🛒</div>
//           <div>No products found.</div>
//         </div>
//       ) : (
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
//           {filtered.map((p: any) => {
//             const tags  = NUTRIENT_TAGS[p.cropName] || [];
//             const added = inCart(p._id);
//             const qty   = cart[p._id]?.qty || 0;

//             return (
//               <div key={p._id} style={{
//                 background:"#fff", borderRadius:16,
//                 border:`1.5px solid ${added ? "#bbf7d0" : "#e8ede8"}`,
//                 overflow:"hidden",
//                 boxShadow: added ? "0 4px 16px rgba(34,197,94,.15)" : "0 2px 8px rgba(0,0,0,.04)",
//                 transition:"transform .2s",
//               }}
//                 onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
//                 onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
//               >
//                 {/* ── Real image OR emoji fallback ── */}
//                 <div style={{ position: "relative" }}>
//                   <ProductImage product={p} height={160} />

//                   {/* In-cart badge */}
//                   {added && (
//                     <div style={{
//                       position:"absolute", top:10, left:10,
//                       background:"#22c55e", color:"#fff", borderRadius:99,
//                       fontSize:11, fontWeight:700, padding:"3px 10px", zIndex:2,
//                     }}>✓ In Cart ({qty}kg)</div>
//                   )}

//                   {/* Wishlist button */}
//                   <button style={{
//                     position:"absolute", top:10, right:10, background:"#fff",
//                     border:"1px solid #e5e7eb", borderRadius:"50%",
//                     width:28, height:28, cursor:"pointer", fontSize:14,
//                     display:"flex", alignItems:"center", justifyContent:"center", zIndex:2,
//                   }}>🤍</button>
//                 </div>

//                 <div style={{ padding:"14px 16px" }}>
//                   <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:2 }}>{p.cropName}</div>
//                   <div style={{ fontSize:12, color:"#6b7280", marginBottom:8, display:"flex", alignItems:"center", gap:4 }}>
//                     <span style={{ color:"#22c55e" }}>📍</span>
//                     {p.farmer?.name || "Local Farmer"} · {p.district || "Sri Lanka"}
//                   </div>

//                   {p.type === "Organic" && (
//                     <div style={{ display:"inline-flex", alignItems:"center", gap:4,
//                       background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:99,
//                       padding:"3px 10px", fontSize:11, fontWeight:700, color:"#166534", marginBottom:8 }}>
//                       🌿 Organic · Trust Score: {p.trustScore || 88}%
//                     </div>
//                   )}

//                   {p.harvestDate && (
//                     <div style={{ fontSize:11, color:"#6b7280", marginBottom:4 }}>
//                       ⏱ Harvested {new Date(p.harvestDate).toLocaleDateString("en-CA")}
//                     </div>
//                   )}

//                   {tags.length > 0 && (
//                     <div style={{ fontSize:11, color:"#6b7280", marginBottom:10 }}>🌿 {tags.join(", ")}</div>
//                   )}

//                   <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
//                     <div>
//                       <div style={{ fontSize:16, fontWeight:800, color:"#111827" }}>Rs. {p.price}/kg</div>
//                       {p.trustScore > 0 && (
//                         <div style={{ fontSize:11, color:"#f59e0b" }}>★ {(p.trustScore / 20).toFixed(1)}</div>
//                       )}
//                     </div>

//                     {added ? (
//                       <div style={{ display:"flex", alignItems:"center", gap:6 }}>
//                         <button onClick={() => updateQty(p._id, -1)} style={{
//                           width:30, height:30, borderRadius:8, border:"1.5px solid #e5e7eb",
//                           background:"#fff", fontSize:16, cursor:"pointer", fontWeight:700 }}>−</button>
//                         <span style={{ fontSize:14, fontWeight:700, minWidth:20, textAlign:"center" }}>{qty}</span>
//                         <button onClick={() => updateQty(p._id, 1)} style={{
//                           width:30, height:30, borderRadius:8, border:"1.5px solid #22c55e",
//                           background:"#f0fdf4", fontSize:16, cursor:"pointer", fontWeight:700, color:"#166534" }}>+</button>
//                       </div>
//                     ) : (
//                       <button onClick={() => addToCart(p)} style={{
//                         background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
//                         color:"#fff", border:"none", borderRadius:9,
//                         padding:"8px 18px", fontSize:13, fontWeight:700,
//                         cursor:"pointer", display:"flex", alignItems:"center", gap:6,
//                       }}>🛒 Add</button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* ── CART SIDEBAR ── */}
//       {cartOpen && (
//         <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:200,
//           display:"flex", justifyContent:"flex-end" }}
//           onClick={e => { if (e.target === e.currentTarget) setCartOpen(false); }}>
//           <div style={{ background:"#fff", width:"100%", maxWidth:420, height:"100%",
//             display:"flex", flexDirection:"column" }}>

//             <div style={{ padding:"22px 24px 16px", borderBottom:"1px solid #e5e7eb",
//               display:"flex", justifyContent:"space-between", alignItems:"center" }}>
//               <div>
//                 <h2 style={{ fontSize:18, fontWeight:800, color:"#111827", margin:0 }}>🛒 Your Cart</h2>
//                 <p style={{ fontSize:12, color:"#6b7280", margin:"2px 0 0" }}>{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
//               </div>
//               <button onClick={() => setCartOpen(false)}
//                 style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#6b7280" }}>✕</button>
//             </div>

//             <div style={{ flex:1, padding:"16px 24px", overflowY:"auto" }}>
//               {cartItems.length === 0 ? (
//                 <div style={{ textAlign:"center", padding:"60px 0", color:"#9ca3af" }}>
//                   <div style={{ fontSize:48, marginBottom:12 }}>🛒</div>
//                   <div style={{ fontSize:14, fontWeight:600 }}>Your cart is empty</div>
//                   <div style={{ fontSize:13, marginTop:4 }}>Browse the marketplace and add products</div>
//                 </div>
//               ) : cartItems.map(({ product: p, qty }) => (
//                 <div key={p._id} style={{ display:"flex", alignItems:"center", gap:14,
//                   padding:"14px 0", borderBottom:"1px solid #f3f4f6" }}>

//                   {/* Cart item — image or emoji */}
//                   <div style={{ width:52, height:52, borderRadius:12, overflow:"hidden",
//                     background:"#f0fdf4", flexShrink:0,
//                     display:"flex", alignItems:"center", justifyContent:"center" }}>
//                     <ProductImage product={p} height={52} />
//                   </div>

//                   <div style={{ flex:1 }}>
//                     <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{p.cropName}</div>
//                     <div style={{ fontSize:12, color:"#6b7280" }}>Rs. {p.price}/kg</div>
//                     <div style={{ fontSize:13, fontWeight:700, color:"#22c55e", marginTop:2 }}>
//                       Rs. {(qty * p.price).toLocaleString()}
//                     </div>
//                   </div>
//                   <div style={{ display:"flex", alignItems:"center", gap:6 }}>
//                     <button onClick={() => updateQty(p._id, -1)} style={{
//                       width:28, height:28, borderRadius:7, border:"1.5px solid #e5e7eb",
//                       background:"#fff", fontSize:14, cursor:"pointer", fontWeight:700 }}>−</button>
//                     <span style={{ fontSize:14, fontWeight:700, minWidth:22, textAlign:"center" }}>{qty}</span>
//                     <button onClick={() => updateQty(p._id, 1)} style={{
//                       width:28, height:28, borderRadius:7, border:"1.5px solid #22c55e",
//                       background:"#f0fdf4", fontSize:14, cursor:"pointer", fontWeight:700, color:"#166534" }}>+</button>
//                   </div>
//                   <button onClick={() => removeFromCart(p._id)} style={{
//                     background:"none", border:"none", color:"#ef4444", cursor:"pointer", fontSize:16, padding:"4px" }}>🗑</button>
//                 </div>
//               ))}
//             </div>

//             {cartItems.length > 0 && (
//               <div style={{ padding:"16px 24px", borderTop:"1px solid #e5e7eb" }}>
//                 <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
//                   <span style={{ fontSize:15, fontWeight:600, color:"#374151" }}>Total</span>
//                   <span style={{ fontSize:20, fontWeight:800, color:"#111827" }}>Rs. {cartTotal.toLocaleString()}</span>
//                 </div>
//                 <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} style={{
//                   width:"100%", padding:"13px", background:"linear-gradient(135deg,#1a3a2a,#22c55e)",
//                   color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer" }}>
//                   Proceed to Checkout →
//                 </button>
//                 <button onClick={() => setCart({})} style={{
//                   width:"100%", marginTop:8, padding:"10px",
//                   background:"none", border:"1.5px solid #e5e7eb", color:"#6b7280",
//                   borderRadius:10, fontSize:13, cursor:"pointer" }}>
//                   Clear Cart
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── CHECKOUT MODAL ── */}
//       {checkoutOpen && (
//         <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300,
//           display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
//           onClick={e => { if (e.target === e.currentTarget) { setCheckoutOpen(false); setOrderMsg(""); } }}>
//           <div style={{ background:"#fff", borderRadius:18, padding:"28px 32px",
//             width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto" }}>

//             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
//               <h2 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:0 }}>Checkout</h2>
//               <button onClick={() => { setCheckoutOpen(false); setOrderMsg(""); }}
//                 style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#6b7280" }}>✕</button>
//             </div>

//             {/* Order summary with images */}
//             <div style={{ background:"#f9fafb", borderRadius:12, padding:"14px 16px", marginBottom:18 }}>
//               <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:10 }}>Order Summary</div>
//               {cartItems.map(({ product: p, qty }) => (
//                 <div key={p._id} style={{ display:"flex", justifyContent:"space-between",
//                   alignItems:"center", marginBottom:8 }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                     {/* Checkout item image */}
//                     <div style={{ width:36, height:36, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
//                       <ProductImage product={p} height={36} />
//                     </div>
//                     <div>
//                       <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{p.cropName}</div>
//                       <div style={{ fontSize:11, color:"#6b7280" }}>{qty} kg × Rs. {p.price}</div>
//                     </div>
//                   </div>
//                   <div style={{ fontSize:13, fontWeight:700, color:"#22c55e" }}>
//                     Rs. {(qty * p.price).toLocaleString()}
//                   </div>
//                 </div>
//               ))}
//               <div style={{ borderTop:"1px solid #e5e7eb", marginTop:10, paddingTop:10,
//                 display:"flex", justifyContent:"space-between" }}>
//                 <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>Total</span>
//                 <span style={{ fontSize:16, fontWeight:800, color:"#111827" }}>Rs. {cartTotal.toLocaleString()}</span>
//               </div>
//             </div>

//             {/* Delivery form */}
//             <div style={{ fontSize:13, fontWeight:700, color:"#374151", marginBottom:12 }}>Delivery Details</div>
//             {[
//               ["Street Address", "street",   "123 Main St"],
//               ["City",           "city",     "Colombo"],
//               ["District",       "district", "Western"],
//               ["Phone",          "phone",    "+94 77 000 0000"],
//             ].map(([label, field, ph]) => (
//               <div key={field} style={{ marginBottom:12 }}>
//                 <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
//                   textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:5 }}>
//                   {label}
//                 </label>
//                 <input type="text" placeholder={ph}
//                   value={(orderForm as any)[field]}
//                   onChange={e => setOrderForm(prev => ({ ...prev, [field]: e.target.value }))}
//                   style={{ width:"100%", padding:"10px 13px", border:"1.5px solid #e5e7eb",
//                     borderRadius:9, fontSize:13, fontFamily:"'DM Sans',sans-serif",
//                     outline:"none", boxSizing:"border-box" as const }} />
//               </div>
//             ))}

//             <div style={{ marginBottom:20, padding:"12px 14px",
//               background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10 }}>
//               <div style={{ fontSize:13, fontWeight:700, color:"#166534",
//                 display:"flex", alignItems:"center", gap:8 }}>
//                 💵 Cash on Delivery (COD)
//                 <span style={{ background:"#22c55e", color:"#fff", fontSize:10, fontWeight:700,
//                   padding:"2px 8px", borderRadius:99 }}>Only option</span>
//               </div>
//               <div style={{ fontSize:12, color:"#374151", marginTop:4 }}>
//                 Pay in cash when your order is delivered to your door
//               </div>
//             </div>

//             {orderMsg && (
//               <div style={{ padding:"10px 14px", borderRadius:8, marginBottom:14,
//                 background: orderMsg.startsWith("✅") ? "#f0fdf4" : "#fff1f1",
//                 color: orderMsg.startsWith("✅") ? "#166534" : "#dc2626",
//                 fontSize:13, fontWeight:600 }}>{orderMsg}</div>
//             )}

//             <button onClick={handlePlaceOrder} disabled={placing} style={{
//               width:"100%", padding:"13px",
//               background: placing ? "#a7f3d0" : "linear-gradient(135deg,#1a3a2a,#22c55e)",
//               color:"#fff", border:"none", borderRadius:10,
//               fontSize:14, fontWeight:700, cursor: placing ? "not-allowed" : "pointer",
//             }}>
//               {placing ? "Placing Orders…" : `✓ Place Order (${cartItems.length} item${cartItems.length > 1 ? "s" : ""})`}
//             </button>
//           </div>
//         </div>
//       )}

//     </ConsumerLayout>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { productAPI, orderAPI } from "@/lib/axios-proxy";

const BACKEND = "http://localhost:5000";
const COLOR = { green:"#22c55e", dark:"#1a3a2a", mid:"#2d5a3d", text:"#111827", muted:"#6b7280", border:"#e8ede8", bg:"#f8faf8" };

const NUTRIENT_TAGS: Record<string,string[]> = {
  "Spinach":["Iron","Vit A","Fiber"],"Carrot":["Vit A","Beta Carotene"],"Broccoli":["Vit C","Fiber","Iron"],
  "Bell Pepper":["Vit C","Vit B6"],"Tomato":["Lycopene","Vit C"],"Kale":["Iron","Calcium","Vit K"],
};

function ProductImg({ product, h=160 }: { product:any; h?:number }) {
  const [fail, setFail] = useState(false);
  if (product.imageUrl && !fail) return(
    <img src={`${BACKEND}${product.imageUrl}`} alt={product.cropName} onError={()=>setFail(true)}
      style={{ width:"100%", height:"100%", objectFit:"cover" }} />
  );
  return <div style={{ width:"100%", height:"100%", background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: h>80?52:28 }}>🥬</div>;
}

interface CartItem { product:any; qty:number; }

const PACKAGES = [
  { id:"free",    name:"Free Trial", price:0,    period:"7 days", highlight:false, features:["5 orders/month","Basic tracking","Marketplace access"] },
  { id:"basic",   name:"Basic",      price:499,  period:"month",  highlight:false, features:["Unlimited orders","Full nutrition log","Order tracking","Email support"] },
  { id:"premium", name:"Premium",    price:999,  period:"month",  highlight:true,  features:["Everything in Basic","Priority delivery","AI meal planning","Personalized reports","Premium support"] },
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
  const [selected,     setSelected]     = useState<Set<string>>(new Set()); // bulk selection
  const [bulkMode,     setBulkMode]     = useState(false);
  const [cartOpen,     setCartOpen]     = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placing,      setPlacing]      = useState(false);
  const [orderMsg,     setOrderMsg]     = useState("");
  const [showPkgs,     setShowPkgs]     = useState(false);
  const [orderForm,    setOrderForm]    = useState({ street:"", city:"", district:"", phone:"", paymentMethod:"COD" });

  useEffect(()=>{ loadProducts(); },[]);
  useEffect(()=>{ applyFilters(); },[search,typeFilter,catFilter,sortBy,products]);

  const loadProducts = async () => {
    try { const {data}=await productAPI.getAll(); setProducts(Array.isArray(data)?data:data.products||[]); }
    catch{} setLoading(false);
  };

  const applyFilters = () => {
    let list=[...products];
    if(search)              list=list.filter(p=>p.cropName?.toLowerCase().includes(search.toLowerCase()));
    if(typeFilter!=="All")  list=list.filter(p=>p.type===typeFilter);
    if(catFilter!=="All")   list=list.filter(p=>p.category===catFilter);
    if(sortBy==="price-asc")  list.sort((a,b)=>a.price-b.price);
    if(sortBy==="price-desc") list.sort((a,b)=>b.price-a.price);
    if(sortBy==="rating")     list.sort((a,b)=>(b.trustScore||0)-(a.trustScore||0));
    setFiltered(list);
  };

  const addToCart = (product:any, qty=1) => {
    setCart(prev=>({...prev,[product._id]:{product,qty:(prev[product._id]?.qty||0)+qty}}));
  };

  const updateQty = (id:string, delta:number) => {
    setCart(prev=>{ const next=(prev[id]?.qty||0)+delta; if(next<=0){const u={...prev};delete u[id];return u;} return{...prev,[id]:{...prev[id],qty:next}}; });
  };

  const removeFromCart = (id:string) => { setCart(prev=>{const u={...prev};delete u[id];return u;}); };

  // Bulk add selected to cart
  const addBulkToCart = () => {
    const toAdd = filtered.filter(p=>selected.has(p._id));
    toAdd.forEach(p=>addToCart(p,1));
    setSelected(new Set()); setBulkMode(false);
    setCartOpen(true);
  };

  const toggleSelect = (id:string) => {
    setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  };

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s,i)=>s+i.qty,0);
  const cartTotal = cartItems.reduce((s,i)=>s+i.qty*i.product.price,0);

  const handlePlaceOrder = async () => {
    if(!orderForm.street||!orderForm.city||!orderForm.phone){setOrderMsg("Fill all delivery fields.");return;}
    if(cartItems.length===0){setOrderMsg("Cart is empty.");return;}
    setPlacing(true); setOrderMsg("");
    try {
      await Promise.all(cartItems.map(({product,qty})=>
        orderAPI.create({productId:product._id,quantity:qty,deliveryAddress:{street:orderForm.street,city:orderForm.city,district:orderForm.district,phone:orderForm.phone},paymentMethod:"COD"})
      ));
      setOrderMsg("Orders placed successfully!");
      setCart({});
      setTimeout(()=>{setCheckoutOpen(false);setOrderMsg("");setOrderForm({street:"",city:"",district:"",phone:"",paymentMethod:"COD"});},2000);
    } catch(e:any){setOrderMsg(e.response?.data?.message||"Order failed.");}
    finally{setPlacing(false);}
  };

  const categories = ["All",...Array.from(new Set(products.map((p:any)=>p.category).filter(Boolean)))];

  return(
    <ConsumerLayout>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .3s ease both}
        .card-h:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(26,58,42,.12)!important}
        .btn-h:hover{opacity:.85}
        .sel-card{outline:2.5px solid #22c55e;outline-offset:2px;}
        .product-card{transition:all .22s;cursor:pointer;}
      `}</style>

      {/* ── Header ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,color:COLOR.text,margin:0}}>Marketplace</h1>
          <p style={{fontSize:13,color:COLOR.muted,marginTop:3}}>
            {filtered.length} products from verified farmers
            {bulkMode&&selected.size>0&&<span style={{marginLeft:8,color:"#22c55e",fontWeight:700}}> · {selected.size} selected</span>}
          </p>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {bulkMode&&selected.size>0&&(
            <button className="btn-h" onClick={addBulkToCart}
              style={{background:"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              Add {selected.size} to Cart
            </button>
          )}
          <button className="btn-h" onClick={()=>{setBulkMode(p=>!p);setSelected(new Set());}}
            style={{background:bulkMode?"#f0fdf4":"#f4f0e8",color:bulkMode?"#166534":COLOR.dark,border:`1.5px solid ${bulkMode?"#bbf7d0":COLOR.border}`,borderRadius:10,padding:"9px 14px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            {bulkMode?"Exit Select":"Bulk Select"}
          </button>
          {/* Cart button */}
          <button className="btn-h" onClick={()=>setCartOpen(true)} style={{position:"relative",background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",color:"#fff",border:"none",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Cart
            {cartCount>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",position:"absolute",top:-7,right:-7}}>{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #eeebe4",padding:"14px 18px",marginBottom:20,display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:180,position:"relative"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:"100%",padding:"9px 12px 9px 34px",border:"1.5px solid #e5e7eb",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        {/* Category chips */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {categories.slice(0,5).map(c=>(
            <button key={c} onClick={()=>setCat(c)} className="btn-h"
              style={{padding:"6px 13px",borderRadius:99,border:"1.5px solid",borderColor:catFilter===c?"#1a3a2a":"#e0ddd6",background:catFilter===c?"#1a3a2a":"transparent",color:catFilter===c?"#fff":COLOR.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
              {c}
            </button>
          ))}
        </div>
        <select value={typeFilter} onChange={e=>setType(e.target.value)} style={{padding:"8px 12px",border:"1.5px solid #e5e7eb",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:12,outline:"none",cursor:"pointer",color:COLOR.muted}}>
          <option value="All">All Types</option>
          <option value="Organic">Organic</option>
          <option value="Conventional">Conventional</option>
        </select>
        <select value={sortBy} onChange={e=>setSort(e.target.value)} style={{padding:"8px 12px",border:"1.5px solid #e5e7eb",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:12,outline:"none",cursor:"pointer",color:COLOR.muted}}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* ── Bulk Mode Banner ── */}
      {bulkMode&&(
        <div style={{background:"#f0fdf4",border:"1.5px solid #bbf7d0",borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:13,fontWeight:600,color:"#166534"}}>
            Tap products to select them, then add all at once.
            {selected.size>0&&<span style={{marginLeft:8}}>· <strong>{selected.size} selected</strong></span>}
          </div>
          {selected.size>0&&(
            <div style={{display:"flex",gap:8}}>
              <button className="btn-h" onClick={()=>setSelected(new Set())} style={{background:"none",border:"1.5px solid #bbf7d0",color:"#166534",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Clear</button>
              <button className="btn-h" onClick={addBulkToCart} style={{background:"#22c55e",color:"#fff",border:"none",borderRadius:8,padding:"5px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Add {selected.size} to Cart →</button>
            </div>
          )}
        </div>
      )}

      {/* ── Cart Banner ── */}
      {cartCount>0&&!bulkMode&&(
        <div style={{background:"#f0fdf4",border:"1.5px solid #bbf7d0",borderRadius:12,padding:"11px 18px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:13,fontWeight:600,color:"#166534"}}>
            {cartCount} item{cartCount>1?"s":""} in cart · <strong>Rs.{cartTotal.toLocaleString()}</strong>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-h" onClick={()=>setCartOpen(true)} style={{background:"none",border:"1.5px solid #22c55e",color:"#166534",borderRadius:8,padding:"5px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>View Cart</button>
            <button className="btn-h" onClick={()=>{setCartOpen(false);setCheckoutOpen(true);}} style={{background:"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:8,padding:"5px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Checkout →</button>
          </div>
        </div>
      )}

      {/* ── Product Grid ── */}
      {loading?(
        <div style={{textAlign:"center",padding:"80px",color:COLOR.muted}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#1a3a2a,#22c55e)",margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/></svg>
          </div>
          <div style={{fontWeight:600,fontSize:14}}>Loading fresh produce…</div>
        </div>
      ):filtered.length===0?(
        <div style={{textAlign:"center",padding:"80px",color:"#9ca3af"}}>
          <div style={{fontSize:48,marginBottom:12}}>🛒</div>
          <div style={{fontSize:14,fontWeight:600}}>No products found</div>
          <div style={{fontSize:12,color:COLOR.muted,marginTop:4}}>Try adjusting your filters</div>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:18}}>
          {filtered.map((p:any,idx:number)=>{
            const inC=!!cart[p._id];
            const qty=cart[p._id]?.qty||0;
            const isSel=selected.has(p._id);
            const tags=NUTRIENT_TAGS[p.cropName]||[];
            return(
              <div key={p._id}
                className={`product-card card-h fu ${isSel?"sel-card":""}`}
                style={{background:"#fff",borderRadius:16,border:`1.5px solid ${inC?"#bbf7d0":isSel?"#22c55e":"#eeebe4"}`,overflow:"hidden",boxShadow:inC?"0 4px 18px rgba(34,197,94,.12)":isSel?"0 4px 18px rgba(34,197,94,.15)":"0 2px 8px rgba(0,0,0,.04)",animationDelay:`${idx*0.03}s`}}
                onClick={()=>bulkMode?toggleSelect(p._id):undefined}>

                {/* Image */}
                <div style={{height:160,position:"relative",overflow:"hidden"}}>
                  <ProductImg product={p} h={160}/>
                  {/* Bulk select checkbox */}
                  {bulkMode&&(
                    <div style={{position:"absolute",top:10,left:10,width:24,height:24,borderRadius:7,background:isSel?"#22c55e":"rgba(255,255,255,.9)",border:`2px solid ${isSel?"#22c55e":"#d1d5db"}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:3}}>
                      {isSel&&<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                    </div>
                  )}
                  {inC&&!bulkMode&&(
                    <div style={{position:"absolute",top:10,left:10,background:"#22c55e",color:"#fff",borderRadius:99,fontSize:10,fontWeight:700,padding:"3px 9px",zIndex:2}}>
                      In Cart ({qty})
                    </div>
                  )}
                  {p.type==="Organic"&&(
                    <div style={{position:"absolute",top:10,right:10,background:"#f0fdf4",border:"1px solid #bbf7d0",color:"#166534",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,zIndex:2}}>
                      Organic
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{padding:"14px 16px"}}>
                  <div style={{fontSize:15,fontWeight:700,color:COLOR.text,marginBottom:2}}>{p.cropName}</div>
                  <div style={{fontSize:11,color:COLOR.muted,marginBottom:8,display:"flex",alignItems:"center",gap:4}}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {p.farmer?.name||"Local Farmer"} · {p.district||"Sri Lanka"}
                  </div>

                  {tags.length>0&&(
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                      {tags.map(t=>(
                        <span key={t} style={{background:"#f0fdf4",color:"#166534",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:99,border:"1px solid #bbf7d0"}}>{t}</span>
                      ))}
                    </div>
                  )}

                  {p.harvestDate&&(
                    <div style={{fontSize:10,color:COLOR.muted,marginBottom:8}}>
                      Harvested {new Date(p.harvestDate).toLocaleDateString("en-CA")}
                    </div>
                  )}

                  {p.trustScore>0&&(
                    <div style={{fontSize:11,color:"#f59e0b",marginBottom:8}}>
                      {"★".repeat(Math.round(p.trustScore/20))} {(p.trustScore/20).toFixed(1)}
                    </div>
                  )}

                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                    <div>
                      <div style={{fontSize:16,fontWeight:800,color:COLOR.text}}>Rs.{p.price}<span style={{fontSize:11,fontWeight:400,color:COLOR.muted}}>/kg</span></div>
                      <div style={{fontSize:10,color:COLOR.muted}}>{p.stock}kg available</div>
                    </div>
                    {!bulkMode&&(
                      inC?(
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <button onClick={()=>updateQty(p._id,-1)} style={{width:28,height:28,borderRadius:7,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:15,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                          <span style={{fontSize:14,fontWeight:700,minWidth:18,textAlign:"center"}}>{qty}</span>
                          <button onClick={()=>updateQty(p._id,1)} style={{width:28,height:28,borderRadius:7,border:"1.5px solid #22c55e",background:"#f0fdf4",fontSize:15,cursor:"pointer",fontWeight:700,color:"#166534",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                        </div>
                      ):(
                        <button className="btn-h" onClick={()=>addToCart(p)}
                          style={{background:"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:9,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                          Add
                        </button>
                      )
                    )}
                    {bulkMode&&isSel&&(
                      <div style={{width:28,height:28,borderRadius:"50%",background:"#22c55e",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CART SIDEBAR ── */}
      {cartOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:200,display:"flex",justifyContent:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)setCartOpen(false);}}>
          <div style={{background:"#fff",width:420,height:"100%",display:"flex",flexDirection:"column",boxShadow:"-8px 0 32px rgba(0,0,0,.15)"}}>
            <div style={{padding:"22px 24px 16px",borderBottom:"1px solid #f0ede8",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <h2 style={{fontSize:17,fontWeight:800,color:COLOR.text,margin:0}}>Your Cart</h2>
                <p style={{fontSize:12,color:COLOR.muted,margin:"2px 0 0"}}>{cartCount} item{cartCount!==1?"s":""}</p>
              </div>
              <button onClick={()=>setCartOpen(false)} style={{background:"#f4f0e8",border:"none",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:COLOR.muted}}>✕</button>
            </div>
            <div style={{flex:1,padding:"14px 24px",overflowY:"auto"}}>
              {cartItems.length===0?(
                <div style={{textAlign:"center",padding:"60px 0",color:"#9ca3af"}}>
                  <div style={{width:52,height:52,borderRadius:16,background:"#f4f0e8",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0bdb5" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  </div>
                  <div style={{fontSize:14,fontWeight:600}}>Cart is empty</div>
                  <div style={{fontSize:12,marginTop:4}}>Browse and add products</div>
                </div>
              ):cartItems.map(({product:p,qty})=>(
                <div key={p._id} style={{display:"flex",alignItems:"center",gap:13,padding:"13px 0",borderBottom:"1px solid #f8f5f0"}}>
                  <div style={{width:52,height:52,borderRadius:11,overflow:"hidden",flexShrink:0}}>
                    <ProductImg product={p} h={52}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:COLOR.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.cropName}</div>
                    <div style={{fontSize:12,color:COLOR.muted}}>Rs.{p.price}/kg</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#22c55e"}}>Rs.{(qty*p.price).toLocaleString()}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <button onClick={()=>updateQty(p._id,-1)} style={{width:26,height:26,borderRadius:7,border:"1.5px solid #e5e7eb",background:"#fff",fontSize:14,cursor:"pointer",fontWeight:700}}>−</button>
                    <span style={{fontSize:14,fontWeight:700,minWidth:20,textAlign:"center"}}>{qty}</span>
                    <button onClick={()=>updateQty(p._id,1)} style={{width:26,height:26,borderRadius:7,border:"1.5px solid #22c55e",background:"#f0fdf4",fontSize:14,cursor:"pointer",fontWeight:700,color:"#166634"}}>+</button>
                  </div>
                  <button onClick={()=>removeFromCart(p._id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:"4px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              ))}
            </div>
            {cartItems.length>0&&(
              <div style={{padding:"16px 24px",borderTop:"1px solid #f0ede8"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <span style={{fontSize:14,fontWeight:600,color:"#374151"}}>Total</span>
                  <span style={{fontSize:20,fontWeight:800,color:COLOR.text}}>Rs.{cartTotal.toLocaleString()}</span>
                </div>
                <button className="btn-h" onClick={()=>{setCartOpen(false);setCheckoutOpen(true);}} style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}}>Proceed to Checkout →</button>
                <button className="btn-h" onClick={()=>setCart({})} style={{width:"100%",marginTop:8,padding:"9px",background:"none",border:"1.5px solid #e0ddd6",color:COLOR.muted,borderRadius:10,fontSize:13,cursor:"pointer"}}>Clear Cart</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHECKOUT MODAL ── */}
      {checkoutOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget){setCheckoutOpen(false);setOrderMsg("");}}}>
          <div style={{background:"#fff",borderRadius:20,padding:"28px 30px",width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.18)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontSize:18,fontWeight:800,color:COLOR.text,margin:0}}>Checkout</h2>
              <button onClick={()=>{setCheckoutOpen(false);setOrderMsg("");}} style={{background:"#f4f0e8",border:"none",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:15,color:COLOR.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>

            {/* Order summary */}
            <div style={{background:"#f9fafb",borderRadius:12,padding:"14px 16px",marginBottom:18}}>
              <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:10}}>Order Summary ({cartItems.length} items)</div>
              {cartItems.map(({product:p,qty})=>(
                <div key={p._id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:8,overflow:"hidden",flexShrink:0}}><ProductImg product={p} h={34}/></div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:COLOR.text}}>{p.cropName}</div>
                      <div style={{fontSize:11,color:COLOR.muted}}>{qty}kg × Rs.{p.price}</div>
                    </div>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:"#22c55e"}}>Rs.{(qty*p.price).toLocaleString()}</div>
                </div>
              ))}
              <div style={{borderTop:"1px solid #e5e7eb",marginTop:10,paddingTop:10,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:14,fontWeight:700}}>Total</span>
                <span style={{fontSize:16,fontWeight:800}}>Rs.{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery form */}
            <div style={{fontSize:13,fontWeight:700,color:"#374151",marginBottom:12}}>Delivery Details</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              {([["Street Address","street","123 Main St"],["City","city","Colombo"],["District","district","Western"],["Phone","phone","+94 77 000 0000"]] as [string,string,string][]).map(([label,field,ph])=>(
                <div key={field} style={{gridColumn:field==="street"?"1/-1":undefined}}>
                  <label style={{fontSize:10,fontWeight:700,color:COLOR.muted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:4}}>{label}</label>
                  <input type="text" placeholder={ph} value={(orderForm as any)[field]} onChange={e=>setOrderForm(prev=>({...prev,[field]:e.target.value}))}
                    style={{width:"100%",padding:"9px 12px",border:"1.5px solid #e5e7eb",borderRadius:9,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"}}/>
                </div>
              ))}
            </div>

            {/* COD notice */}
            <div style={{marginBottom:16,padding:"11px 14px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10}}>
              <div style={{fontSize:13,fontWeight:700,color:"#166534",display:"flex",alignItems:"center",gap:8}}>
                Cash on Delivery
                <span style={{background:"#22c55e",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:99}}>Only option</span>
              </div>
              <div style={{fontSize:12,color:"#374151",marginTop:3}}>Pay in cash when your order arrives</div>
            </div>

            {orderMsg&&(
              <div style={{padding:"10px 13px",borderRadius:8,marginBottom:14,background:orderMsg.includes("success")?"#f0fdf4":"#fff1f1",color:orderMsg.includes("success")?"#166534":"#dc2626",fontSize:13,fontWeight:600}}>{orderMsg}</div>
            )}

            <button className="btn-h" onClick={handlePlaceOrder} disabled={placing}
              style={{width:"100%",padding:"13px",background:placing?"#a7f3d0":"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:placing?"not-allowed":"pointer"}}>
              {placing?"Placing Orders…":`Place Order · ${cartItems.length} item${cartItems.length>1?"s":""}`}
            </button>
          </div>
        </div>
      )}

      {/* ── Packages Modal ── */}
      {showPkgs&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)setShowPkgs(false);}}>
          <div style={{background:"#f9f7f3",borderRadius:22,padding:"34px",width:"100%",maxWidth:640,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:22}}>
              <div>
                <h2 style={{fontSize:20,fontWeight:800,color:"#1a3a2a",margin:0,fontFamily:"'Playfair Display',serif"}}>Consumer Plans</h2>
                <p style={{color:COLOR.muted,fontSize:12,marginTop:5}}>Start free, upgrade anytime</p>
              </div>
              <button onClick={()=>setShowPkgs(false)} style={{background:"#f4f0e8",border:"none",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:17,color:COLOR.muted}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
              {PACKAGES.map(pkg=>(
                <div key={pkg.id} style={{background:pkg.highlight?"linear-gradient(145deg,#1a3a2a,#2d5a3d)":"#fff",borderRadius:16,padding:"20px 18px",border:pkg.highlight?"2px solid rgba(34,197,94,.3)":"1.5px solid #e8e4dc",position:"relative"}}>
                  {pkg.highlight&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,#d4a853,#f0c96b)",color:"#1a3a2a",fontSize:10,fontWeight:800,padding:"3px 14px",borderRadius:99,whiteSpace:"nowrap"}}>Most Popular</div>}
                  <div style={{fontSize:11,fontWeight:700,color:pkg.highlight?"rgba(255,255,255,.5)":"#9b9590",textTransform:"uppercase",letterSpacing:".08em",marginBottom:7}}>{pkg.name}</div>
                  <div style={{marginBottom:14}}>
                    <span style={{fontSize:26,fontWeight:800,color:pkg.highlight?"#22c55e":"#1a3a2a",fontFamily:"'Playfair Display',serif"}}>{pkg.price===0?"Free":`Rs.${pkg.price.toLocaleString()}`}</span>
                    {pkg.price>0&&<span style={{fontSize:11,color:pkg.highlight?"rgba(255,255,255,.45)":"#9b9590"}}>/{pkg.period}</span>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
                    {pkg.features.map(f=>(
                      <div key={f} style={{display:"flex",gap:7,fontSize:12,color:pkg.highlight?"rgba(255,255,255,.75)":"#6b7280"}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={pkg.highlight?"#22c55e":"#22c55e"} strokeWidth="3" style={{flexShrink:0,marginTop:1}}><path d="M5 13l4 4L19 7"/></svg>
                        {f}
                      </div>
                    ))}
                  </div>
                  <button className="btn-h" style={{width:"100%",padding:"10px",background:pkg.highlight?"#22c55e":pkg.id==="free"?"#f4f0e8":"linear-gradient(135deg,#1a3a2a,#2d5a3d)",color:pkg.id==="free"&&!pkg.highlight?"#1a3a2a":"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                    {pkg.price===0?"Start Free Trial":"Get Started"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}