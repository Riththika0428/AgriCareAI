"use client";

import { useState, useEffect } from "react";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { orderAPI } from "@/lib/axios-proxy";

const COLOR = { green:"#22c55e", dark:"#1a3a2a", text:"#111827", muted:"#6b7280", border:"#e8ede8" };

const STATUS_MAP: Record<string,{bg:string;color:string;border:string;label:string}> = {
  Placed:    { bg:"#f4f0e8", color:"#6b7280", border:"#e0ddd6", label:"Placed"     },
  Confirmed: { bg:"#fff8e6", color:"#a07000", border:"#ffe09a", label:"Confirmed"  },
  Packed:    { bg:"#eff6ff", color:"#1565c0", border:"#bfdbfe", label:"Packed"     },
  Shipped:   { bg:"#fff8e6", color:"#a07000", border:"#ffe09a", label:"Shipped"    },
  Delivered: { bg:"#f0fdf4", color:"#166534", border:"#bbf7d0", label:"Delivered"  },
  Cancelled: { bg:"#fce4ec", color:"#c62828", border:"#f48fb1", label:"Cancelled"  },
};

const TABS = ["All", "Active", "Delivered", "Cancelled"];

// Group orders by date (Today / Yesterday / Day name / older)
function groupByDate(orders: any[]) {
  const groups: Record<string, any[]> = {};
  const now   = new Date();
  const today = now.toDateString();
  const yest  = new Date(now.setDate(now.getDate()-1)).toDateString();

  orders.forEach(o => {
    const d = new Date(o.createdAt);
    let key: string;
    if      (d.toDateString()===today) key="Today";
    else if (d.toDateString()===yest)  key="Yesterday";
    else {
      const diffDays = Math.floor((Date.now()-d.getTime())/(86400000));
      if(diffDays<7) key=d.toLocaleDateString("en-US",{weekday:"long"});
      else           key=d.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
    }
    if(!groups[key]) groups[key]=[];
    groups[key].push(o);
  });
  return groups;
}

const fmt = (d:string) => new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const fmtTime = (d:string) => new Date(d).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});

// Order timeline steps
function OrderTimeline({ status }: { status: string }) {
  const steps = ["Placed","Confirmed","Packed","Delivered"];
  const idx   = steps.indexOf(status);
  const cancelled = status==="Cancelled";
  return(
    <div style={{display:"flex",alignItems:"center",gap:0,marginTop:12,marginBottom:4}}>
      {steps.map((s,i)=>(
        <div key={s} style={{display:"flex",alignItems:"center",flex:i<steps.length-1?1:undefined}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
              background:cancelled?"#fce4ec":i<=idx?"#22c55e":"#f0f4f0",
              border:`2px solid ${cancelled?"#f48fb1":i<=idx?"#22c55e":"#e0ddd6"}`,
              flexShrink:0}}>
              {!cancelled&&i<=idx&&(
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
              )}
            </div>
            <div style={{fontSize:8,color:cancelled?"#c62828":i<=idx?"#22c55e":COLOR.muted,fontWeight:i===idx?700:400,textAlign:"center",width:44}}>{s}</div>
          </div>
          {i<steps.length-1&&(
            <div style={{flex:1,height:2,background:!cancelled&&i<idx?"#22c55e":"#f0f4f0",margin:"0 2px",marginBottom:18}}/>
          )}
        </div>
      ))}
    </div>
  );
}

export default function MyOrdersPage() {
  const [orders,    setOrders]   = useState<any[]>([]);
  const [loading,   setLoading]  = useState(true);
  const [tab,       setTab]      = useState("All");
  const [selected,  setSelected] = useState<any>(null);
  const [search,    setSearch]   = useState("");
  const [cancelling,setCanc]     = useState(false);
  const [expanded,  setExpanded] = useState<Set<string>>(new Set());

  useEffect(()=>{ loadOrders(); },[]);

  const loadOrders = async () => {
    try{ const {data}=await orderAPI.getMyOrders(); setOrders(Array.isArray(data)?data:[]); }
    catch{} setLoading(false);
  };

  const handleCancel = async (id:string) => {
    if(!confirm("Cancel this order?")) return;
    setCanc(true);
    try{
      await orderAPI.cancel(id);
      setOrders(prev=>prev.map(o=>o._id===id?{...o,orderStatus:"Cancelled"}:o));
      setSelected((prev:any)=>prev?._id===id?{...prev,orderStatus:"Cancelled"}:prev);
    } catch{} setCanc(false);
  };

  const toggleExpand = (id:string) => {
    setExpanded(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  };

  const filtered = orders.filter(o=>{
    const mTab = tab==="All"||(tab==="Active"&&!["Delivered","Cancelled"].includes(o.orderStatus))||(tab==="Delivered"&&o.orderStatus==="Delivered")||(tab==="Cancelled"&&o.orderStatus==="Cancelled");
    const mSearch = o.cropName?.toLowerCase().includes(search.toLowerCase())||String(o.orderNumber).includes(search);
    return mTab&&mSearch;
  });

  const grouped = groupByDate(filtered);
  const groupKeys = Object.keys(grouped);

  const activeCount    = orders.filter(o=>!["Delivered","Cancelled"].includes(o.orderStatus)).length;
  const deliveredCount = orders.filter(o=>o.orderStatus==="Delivered").length;
  const totalSpent     = orders.filter(o=>o.orderStatus!=="Cancelled").reduce((s,o)=>s+o.totalPrice,0);

  return(
    <ConsumerLayout>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .3s ease both}
        .card-h:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.09)!important;transition:all .2s}
        .btn-h:hover{opacity:.85}
        .order-row:hover{background:#fafaf8!important}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        .slide-in{animation:slideIn .25s ease both}
      `}</style>

      {/* ── Header ── */}
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:22,fontWeight:800,color:COLOR.text,margin:0}}>My Orders</h1>
        <p style={{fontSize:13,color:COLOR.muted,marginTop:3}}>Track and manage your purchases</p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
        {[
          {label:"Active Orders",  value:activeCount,                   accent:"#3b82f6", sub:"In progress"},
          {label:"Completed",      value:deliveredCount,                accent:"#22c55e", sub:"Successfully delivered"},
          {label:"Total Spent",    value:`Rs.${totalSpent.toLocaleString()}`, accent:"#f59e0b", sub:"Excluding cancelled"},
        ].map((s,i)=>(
          <div key={s.label} className={`card-h fu`} style={{background:"#fff",borderRadius:16,padding:"18px 20px",border:"1px solid #eeebe4",boxShadow:"0 2px 8px rgba(0,0,0,.04)",position:"relative",overflow:"hidden",animationDelay:`${i*.06}s`,cursor:"default",transition:"all .22s"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.accent,borderRadius:"16px 16px 0 0"}}/>
            <div style={{fontSize:11,fontWeight:700,color:COLOR.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:26,fontWeight:800,color:COLOR.text,fontFamily:"'Playfair Display',serif",lineHeight:1,marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:11,color:"#9b9590"}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Table card ── */}
      <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>

        {/* Card header */}
        <div style={{padding:"18px 22px",borderBottom:"1px solid #f4f0ec",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div style={{fontSize:15,fontWeight:700,color:COLOR.text}}>Order History</div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{position:"relative"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Search orders…" value={search} onChange={e=>setSearch(e.target.value)}
                style={{padding:"8px 12px 8px 30px",border:"1.5px solid #e5e7eb",borderRadius:9,fontFamily:"'DM Sans',sans-serif",fontSize:12,outline:"none",width:180,color:COLOR.text}}/>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:6,padding:"10px 22px",borderBottom:"1px solid #f4f0ec",background:"#faf9f7"}}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} className="btn-h"
              style={{padding:"6px 14px",borderRadius:99,border:"1.5px solid",borderColor:tab===t?COLOR.dark:COLOR.border,background:tab===t?COLOR.dark:"transparent",color:tab===t?"#fff":COLOR.muted,fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
              {t}
              {t==="Active"&&activeCount>0&&<span style={{marginLeft:5,background:tab===t?"rgba(255,255,255,.2)":"#f0fdf4",color:tab===t?"#fff":"#166634",fontSize:10,fontWeight:700,padding:"0px 5px",borderRadius:99}}>{activeCount}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading?(
          <div style={{textAlign:"center",padding:"60px",color:COLOR.muted}}>
            <div style={{width:48,height:48,borderRadius:14,background:"#f4f0e8",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0bdb5" strokeWidth="1.8"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/></svg>
            </div>
            <div style={{fontWeight:600,fontSize:14}}>Loading orders…</div>
          </div>
        ):filtered.length===0?(
          <div style={{textAlign:"center",padding:"60px",color:"#9ca3af"}}>
            <div style={{width:52,height:52,borderRadius:14,background:"#f4f0e8",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c0bdb5" strokeWidth="1.8"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
            </div>
            <div style={{fontSize:14,fontWeight:600}}>No orders found</div>
            <div style={{fontSize:12,marginTop:4}}>Try changing your filters</div>
          </div>
        ):(
          /* ── GROUPED BY DATE ── */
          <div>
            {groupKeys.map((groupKey,gi)=>(
              <div key={groupKey}>
                {/* Date section header */}
                <div style={{padding:"10px 22px 6px",background:"#f9f7f4",borderBottom:"1px solid #f4f0ec",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:11,fontWeight:800,color:COLOR.dark,textTransform:"uppercase",letterSpacing:".08em"}}>{groupKey}</div>
                  <div style={{flex:1,height:1,background:"#eeebe4"}}/>
                  <div style={{fontSize:11,color:COLOR.muted}}>{grouped[groupKey].length} order{grouped[groupKey].length>1?"s":""}</div>
                </div>

                {/* Orders in this group */}
                {grouped[groupKey].map((o:any,oi:number)=>{
                  const st=STATUS_MAP[o.orderStatus]||STATUS_MAP.Placed;
                  const isExp=expanded.has(o._id);
                  return(
                    <div key={o._id} style={{borderBottom:"1px solid #f8f5f0"}}>
                      {/* Main row */}
                      <div className="order-row"
                        style={{padding:"14px 22px",transition:"background .12s",cursor:"pointer",background:"transparent"}}
                        onClick={()=>toggleExpand(o._id)}>
                        <div style={{display:"flex",alignItems:"center",gap:14}}>
                          {/* Order icon */}
                          <div style={{width:42,height:42,borderRadius:12,background:st.bg,border:`1px solid ${st.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={st.color} strokeWidth="1.8">
                              {o.orderStatus==="Delivered"?<path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM12 12v4"/>:<path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>}
                            </svg>
                          </div>

                          {/* Main info */}
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                              <span style={{fontSize:13,fontWeight:700,color:COLOR.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.cropName} · {o.quantity}kg</span>
                              {o.type==="Organic"&&<span style={{background:"#f0fdf4",color:"#166634",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:99,border:"1px solid #bbf7d0",flexShrink:0}}>Organic</span>}
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:10,fontSize:11,color:COLOR.muted}}>
                              <span>#{o.orderNumber}</span>
                              <span>·</span>
                              <span>{fmtTime(o.createdAt)}</span>
                              {o.farmer?.name&&<><span>·</span><span>{o.farmer.name}</span></>}
                            </div>
                          </div>

                          {/* Status + amount */}
                          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
                            <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,background:st.bg,color:st.color,border:`1px solid ${st.border}`}}>{st.label}</span>
                            <span style={{fontSize:14,fontWeight:800,color:COLOR.text}}>Rs.{o.totalPrice?.toLocaleString()}</span>
                          </div>

                          {/* Expand chevron */}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLOR.muted} strokeWidth="2" style={{flexShrink:0,transform:isExp?"rotate(180deg)":"none",transition:"transform .2s"}}>
                            <path d="M6 9l6 6 6-6"/>
                          </svg>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isExp&&(
                        <div style={{padding:"0 22px 16px",background:"#fafaf8",borderTop:"1px solid #f4f0ec"}}>
                          {/* Timeline */}
                          <OrderTimeline status={o.orderStatus}/>

                          {/* Details grid */}
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14,marginTop:10}}>
                            {([
                              ["Payment",  `${o.paymentMethod} · ${o.paymentStatus}`],
                              ["Address",  o.deliveryAddress?`${o.deliveryAddress.city}, ${o.deliveryAddress.district}`:"—"],
                              ["Phone",    o.deliveryAddress?.phone||"—"],
                              ["Ordered",  fmt(o.createdAt)],
                            ] as [string,string][]).map(([label,value])=>(
                              <div key={label} style={{background:"#fff",borderRadius:9,padding:"9px 12px",border:"1px solid #eeebe4"}}>
                                <div style={{fontSize:10,fontWeight:700,color:COLOR.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{label}</div>
                                <div style={{fontSize:12,fontWeight:600,color:COLOR.text}}>{value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Action buttons */}
                          <div style={{display:"flex",gap:8}}>
                            <button className="btn-h" onClick={()=>setSelected(o)}
                              style={{flex:1,padding:"8px 14px",border:"1.5px solid #e5e7eb",background:"#fff",color:"#374151",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                              Full Details
                            </button>
                            {!["Delivered","Cancelled"].includes(o.orderStatus)&&(
                              <button className="btn-h"
                                style={{flex:1,padding:"8px 14px",border:"1.5px solid #bbf7d0",background:"#f0fdf4",color:"#166634",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
                                Track
                              </button>
                            )}
                            {o.orderStatus==="Delivered"&&(
                              <button className="btn-h"
                                style={{flex:1,padding:"8px 14px",border:"1.5px solid #fde68a",background:"#fffbeb",color:"#92400e",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                                Rate
                              </button>
                            )}
                            {o.orderStatus==="Placed"&&(
                              <button className="btn-h" onClick={()=>handleCancel(o._id)} disabled={cancelling}
                                style={{flex:1,padding:"8px 14px",border:"1.5px solid #fcd0d0",background:"#fff5f5",color:"#dc2626",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>
                                {cancelling?"Cancelling…":"Cancel"}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Side Panel ── */}
      {selected&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:100,display:"flex",justifyContent:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
          <div className="slide-in" style={{width:400,background:"#fff",height:"100vh",overflowY:"auto",boxShadow:"-8px 0 32px rgba(0,0,0,.15)"}}>
            <div style={{background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",padding:"22px 24px",color:"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:3}}>Order Details</div>
                  <h2 style={{fontSize:18,fontWeight:700,margin:0}}>#{selected.orderNumber}</h2>
                </div>
                <button onClick={()=>setSelected(null)} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              {(() => { const st=STATUS_MAP[selected.orderStatus]||STATUS_MAP.Placed; return(
                <span style={{fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:99,background:st.bg,color:st.color,border:`1px solid ${st.border}`}}>{st.label}</span>
              ); })()}
            </div>

            <div style={{padding:"20px 24px"}}>
              <OrderTimeline status={selected.orderStatus}/>
              <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:0}}>
                {([
                  ["Product",  `${selected.cropName} · ${selected.quantity}kg`],
                  ["Total",    `Rs.${selected.totalPrice?.toLocaleString()}`],
                  ["Payment",  `${selected.paymentMethod} · ${selected.paymentStatus}`],
                  ["Farmer",   selected.farmer?.name||"—"],
                  ["Date",     fmt(selected.createdAt)],
                  ["Address",  selected.deliveryAddress?`${selected.deliveryAddress.street}, ${selected.deliveryAddress.city}`:"—"],
                  ["District", selected.deliveryAddress?.district||"—"],
                  ["Phone",    selected.deliveryAddress?.phone||"—"],
                ] as [string,string][]).map(([label,value])=>(
                  <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f0ede8",gap:12}}>
                    <span style={{fontSize:12,color:COLOR.muted,flexShrink:0,width:72}}>{label}</span>
                    <span style={{fontSize:13,fontWeight:600,color:COLOR.text,textAlign:"right",flex:1,wordBreak:"break-word"}}>{value}</span>
                  </div>
                ))}
              </div>

              {selected.orderStatus==="Placed"&&(
                <button className="btn-h" onClick={()=>handleCancel(selected._id)} disabled={cancelling}
                  style={{width:"100%",marginTop:20,padding:"11px",background:"transparent",border:"1.5px solid #fcd0d0",borderRadius:9,color:"#dc2626",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  {cancelling?"Cancelling…":"Cancel Order"}
                </button>
              )}
              {selected.orderStatus==="Delivered"&&(
                <div style={{marginTop:20,background:"#f0fdf4",borderRadius:10,padding:"16px",textAlign:"center",border:"1px solid #bbf7d0"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#166534"}}>Successfully Delivered</div>
                  <div style={{fontSize:11,color:"#4a7a5a",marginTop:2}}>Thank you for your order!</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}