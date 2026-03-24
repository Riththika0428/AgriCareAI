"use client";

import { useState, useEffect } from "react";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { orderAPI } from "@/lib/axios-proxy";

const STATUS_STYLE: Record<string,{bg:string;color:string;border:string}> = {
  Placed:    { bg:"#f4f0e8", color:"#6b7280",  border:"#e0ddd6" },
  Confirmed: { bg:"#fff8e6", color:"#a07000",  border:"#ffe09a" },
  Packed:    { bg:"#e3f2fd", color:"#1565c0",  border:"#bbdefb" },
  Shipped:   { bg:"#fff8e6", color:"#a07000",  border:"#ffe09a" },
  Delivered: { bg:"#f0fdf4", color:"#166534",  border:"#bbf7d0" },
  Cancelled: { bg:"#fce4ec", color:"#c62828",  border:"#f48fb1" },
};

const STATUS_ICON: Record<string,string> = {
  Placed:"🕐", Confirmed:"✅", Packed:"📦", Shipped:"🚚", Delivered:"🎁", Cancelled:"❌",
};

const TABS = ["All","Active","Delivered"];

export default function MyOrdersPage() {
  const [orders,  setOrders]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("All");
  const [selected, setSel]    = useState<any>(null);
  const [search,  setSearch]  = useState("");
  const [cancelling, setCanc] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const { data } = await orderAPI.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this order?")) return;
    setCanc(true);
    try {
      await orderAPI.cancel(id);
      setOrders(prev => prev.map(o => o._id===id ? {...o,orderStatus:"Cancelled"} : o));
      setSel((prev:any) => prev?._id===id ? {...prev,orderStatus:"Cancelled"} : prev);
    } catch {}
    setCanc(false);
  };

  const filtered = orders.filter(o => {
    const matchTab = tab==="All" || (tab==="Active" && !["Delivered","Cancelled"].includes(o.orderStatus)) || (tab==="Delivered" && o.orderStatus==="Delivered");
    const matchSearch = o.cropName?.toLowerCase().includes(search.toLowerCase()) || String(o.orderNumber).includes(search);
    return matchTab && matchSearch;
  });

  const active    = orders.filter(o => !["Delivered","Cancelled"].includes(o.orderStatus)).length;
  const completed = orders.filter(o => o.orderStatus==="Delivered").length;
  const totalSpent= orders.filter(o=>o.orderStatus!=="Cancelled").reduce((s,o)=>s+o.totalPrice,0);

  const fmt = (d:string) => new Date(d).toLocaleDateString("en-CA");

  return (
    <ConsumerLayout>

      {/* Header */}
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:0,
          display:"flex", alignItems:"center", gap:10 }}>
          📦 My Orders
        </h1>
        <p style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>Track your purchases and order history</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
        {[
          { icon:"⏰", num:active,      label:"Active Orders" },
          { icon:"✅", num:completed,   label:"Completed" },
          { icon:"⭐", num:`Rs. ${totalSpent.toLocaleString()}`, label:"Total Spent" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:14, padding:"20px 22px",
            border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)",
            display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:"#f0fdf4",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize:28, fontWeight:800, color:"#111827",
                fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Order History */}
      <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e8ede8",
        overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>

        {/* Header */}
        <div style={{ padding:"18px 22px", borderBottom:"1px solid #f0f4f0",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#111827" }}>Order History</div>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:10, top:"50%",
              transform:"translateY(-50%)", fontSize:13, color:"#9ca3af" }}>🔍</span>
            <input type="text" placeholder="Search orders…" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding:"8px 12px 8px 30px", border:"1.5px solid #e5e7eb",
              borderRadius:9, fontFamily:"'DM Sans',sans-serif", fontSize:13,
              outline:"none", width:180 }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:6, padding:"10px 22px", borderBottom:"1px solid #f0f4f0" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:"6px 16px", borderRadius:99, border:"1.5px solid",
              borderColor: tab===t?"#1a3a2a":"#e5e7eb",
              background: tab===t?"#1a3a2a":"transparent",
              color: tab===t?"#fff":"#6b7280",
              fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer",
            }}>{t}</button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px", color:"#6b7280" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>📦</div>
            Loading orders…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px", color:"#9ca3af" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>📦</div>
            No orders found.
          </div>
        ) : (
          <div>
            {filtered.map((o:any) => (
              <div key={o._id} style={{ padding:"16px 22px", borderTop:"1px solid #f8faf8" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ flex:1 }}>
                    {/* Order badges */}
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:"#6b7280" }}>#{o.orderNumber}</span>
                      <span style={{
                        fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99,
                        background:STATUS_STYLE[o.orderStatus]?.bg||"#f4f0e8",
                        color:STATUS_STYLE[o.orderStatus]?.color||"#6b7280",
                        border:`1px solid ${STATUS_STYLE[o.orderStatus]?.border||"#e0ddd6"}`,
                      }}>
                        {STATUS_ICON[o.orderStatus]} {o.orderStatus}
                      </span>
                      {o.type==="Organic" && (
                        <span style={{ background:"#f0fdf4", color:"#166534",
                          fontSize:11, fontWeight:700, padding:"3px 10px",
                          borderRadius:99, border:"1px solid #bbf7d0" }}>
                          🌿 Organic
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:4 }}>
                      {o.cropName} ({o.quantity}kg)
                    </div>
                    <div style={{ fontSize:12, color:"#6b7280", display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ color:"#22c55e" }}>📍</span>
                      {o.farmer?.name || "Local Farm"} · {o.deliveryAddress?.city || "Sri Lanka"}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display:"flex", gap:8, marginTop:10 }}>
                      <button onClick={() => setSel(o)} style={{
                        padding:"5px 14px", borderRadius:7,
                        border:"1.5px solid #e5e7eb", background:"#fff",
                        color:"#374151", fontSize:12, fontWeight:600, cursor:"pointer",
                        display:"flex", alignItems:"center", gap:4,
                      }}>📋 Details</button>
                      {!["Delivered","Cancelled"].includes(o.orderStatus) && (
                        <button style={{
                          padding:"5px 14px", borderRadius:7,
                          border:"1.5px solid #bbf7d0", background:"#f0fdf4",
                          color:"#166534", fontSize:12, fontWeight:600, cursor:"pointer",
                          display:"flex", alignItems:"center", gap:4,
                        }}>🚚 Track</button>
                      )}
                      {o.orderStatus === "Delivered" && (
                        <button style={{
                          padding:"5px 14px", borderRadius:7,
                          border:"1.5px solid #fde68a", background:"#fffbeb",
                          color:"#92400e", fontSize:12, fontWeight:600, cursor:"pointer",
                          display:"flex", alignItems:"center", gap:4,
                        }}>⭐ Rate</button>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:15, fontWeight:800, color:"#111827" }}>
                      Rs. {o.totalPrice?.toLocaleString()}
                    </div>
                    <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>
                      {o.createdAt ? fmt(o.createdAt) : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Panel */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:100,
          display:"flex", justifyContent:"flex-end" }}
          onClick={e => { if(e.target===e.currentTarget) setSel(null); }}>
          <div style={{ width:400, background:"#fff", height:"100vh",
            overflowY:"auto", boxShadow:"-4px 0 24px rgba(0,0,0,.1)" }}>

            <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
              padding:"22px 24px", color:"#fff" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <h2 style={{ fontSize:17, fontWeight:700, margin:0 }}>Order #{selected.orderNumber}</h2>
                <button onClick={() => setSel(null)}
                  style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff",
                  width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:13 }}>✕</button>
              </div>
              <span style={{
                fontSize:12, fontWeight:700, padding:"4px 14px", borderRadius:99,
                background:STATUS_STYLE[selected.orderStatus]?.bg,
                color:STATUS_STYLE[selected.orderStatus]?.color,
                border:`1px solid ${STATUS_STYLE[selected.orderStatus]?.border}`,
              }}>
                {STATUS_ICON[selected.orderStatus]} {selected.orderStatus}
              </span>
            </div>

            <div style={{ padding:"22px 24px" }}>
              {[
                ["Product",  `${selected.cropName} · ${selected.quantity} kg`],
                ["Total",    `Rs. ${selected.totalPrice?.toLocaleString()}`],
                ["Payment",  `${selected.paymentMethod} · ${selected.paymentStatus}`],
                ["Farmer",   selected.farmer?.name],
                ["Date",     selected.createdAt ? fmt(selected.createdAt) : ""],
                ["Address",  selected.deliveryAddress ? `${selected.deliveryAddress.street}, ${selected.deliveryAddress.city}` : "—"],
                ["Phone",    selected.deliveryAddress?.phone || "—"],
              ].map(([label,value]) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between",
                  padding:"10px 0", borderBottom:"1px solid #f0f4f0" }}>
                  <span style={{ fontSize:13, color:"#9ca3af" }}>{label}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:"#111827",
                    textAlign:"right", maxWidth:"220px", wordBreak:"break-word" }}>{value}</span>
                </div>
              ))}

              {selected.orderStatus === "Placed" && (
                <button onClick={() => handleCancel(selected._id)} disabled={cancelling}
                  style={{ width:"100%", marginTop:20, padding:"11px",
                  background:"transparent", border:"1.5px solid #fcd0d0",
                  borderRadius:10, color:"#dc2626", fontSize:13,
                  fontWeight:600, cursor:"pointer" }}>
                  {cancelling ? "Cancelling…" : "Cancel Order"}
                </button>
              )}

              {selected.orderStatus === "Delivered" && (
                <div style={{ marginTop:20, background:"#f0fdf4", borderRadius:10,
                  padding:"14px", textAlign:"center" }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>🎉</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#166534" }}>Delivered!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}