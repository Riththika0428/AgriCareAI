"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { nutritionAPI, orderAPI, productAPI } from "@/lib/axios-proxy";
import api from "@/lib/axios-proxy";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const AI_RECS = ["Corn","Orange","Bell Pepper","Almonds","Broccoli"];

const PACKAGES = [
  { id:"free",    name:"Free Trial", price:0,    period:"7 days", highlight:false,
    features:["Nutrition tracking","Browse marketplace","5 orders/month","Basic AI tips"] },
  { id:"basic",   name:"Basic",      price:499,  period:"month",  highlight:false,
    features:["Unlimited orders","Full nutrition log","Weekly AI insights","Order tracking"] },
  { id:"premium", name:"Premium",    price:999,  period:"month",  highlight:true,
    features:["Everything in Basic","AI meal planning","Priority delivery","Personalized health report","Premium support"] },
];

const COLOR = { green:"#22c55e", dark:"#1a3a2a", mid:"#2d5a3d", amber:"#f59e0b", red:"#ef4444", text:"#111827", muted:"#6b7280", border:"#e8ede8", bg:"#f4f0e8" };

const getScore = (v:number) => v>=70?{c:"#22c55e",bg:"#f0fdf4",label:"On track"}:v>=40?{c:"#f59e0b",bg:"#fffbeb",label:"Moderate"}:{c:"#ef4444",bg:"#fff1f1",label:"Low"};

export default function ConsumerOverview() {
  const router = useRouter();
  const [todayLog,  setTodayLog]  = useState<any>(null);
  const [weekly,    setWeekly]    = useState<any[]>([]);
  const [orders,    setOrders]    = useState<any[]>([]);
  const [products,  setProducts]  = useState<any[]>([]);
  const [nutrients, setNutrients] = useState<Record<string,number>>({});
  const [loading,   setLoading]   = useState(true);
  const [sub,       setSub]       = useState<any>(null);
  const [showPkgs,  setShowPkgs]  = useState(false);
  const [user,      setUser]      = useState<any>(null);

  useEffect(()=>{
    const stored = localStorage.getItem("agriai_user");
    if(!stored){ router.push("/"); return; }
    setUser(JSON.parse(stored));
    loadAll();
  },[]);

  const loadAll = async () => {
    try {
      const [todayR,weeklyR,ordersR,prodsR,subR] = await Promise.allSettled([
        nutritionAPI.getToday(), nutritionAPI.getWeekly(),
        orderAPI.getMyOrders(), productAPI.getAll(),
        api.get("/subscriptions/my"),
      ]);
      if(todayR.status==="fulfilled"){ const d=todayR.value.data; setTodayLog(d); const t:Record<string,number>={}; (d?.entries||[]).forEach((e:any)=>{ if(e.nutrients) Object.entries(e.nutrients).forEach(([k,v])=>{ t[k]=(t[k]||0)+(v as number); }); }); setNutrients(t); }
      if(weeklyR.status==="fulfilled") setWeekly(weeklyR.value.data||[]);
      if(ordersR.status==="fulfilled") setOrders(ordersR.value.data?.slice(0,5)||[]);
      if(prodsR.status==="fulfilled")  setProducts((prodsR.value.data?.products||prodsR.value.data||[]).slice(0,4));
      if(subR.status==="fulfilled")    setSub(subR.value.data);
    } catch{}
    setLoading(false);
  };

  const score    = todayLog?.nutrientScore||0;
  const calories = todayLog?.totalCalories||0;
  const entries  = todayLog?.entries||[];
  const streak   = weekly.filter((w:any)=>w.nutrientScore>0).length||4;

  const NUTRIENTS = [
    {key:"vitaminA",label:"Vitamin A"},{key:"vitaminC",label:"Vitamin C"},
    {key:"iron",label:"Iron"},{key:"calcium",label:"Calcium"},
    {key:"vitaminD",label:"Vitamin D"},{key:"fiber",label:"Fiber"},
  ];

  const activeOrders    = orders.filter(o=>!["Delivered","Cancelled"].includes(o.orderStatus));
  const deliveredOrders = orders.filter(o=>o.orderStatus==="Delivered");

  if(loading) return(
    <ConsumerLayout>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:400,flexDirection:"column",gap:14}}>
        <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#1a3a2a,#22c55e)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div style={{color:COLOR.dark,fontWeight:700,fontSize:15}}>Loading your dashboard…</div>
      </div>
    </ConsumerLayout>
  );

  return(
    <ConsumerLayout>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .3s ease both}
        .fu1{animation-delay:.05s}.fu2{animation-delay:.1s}.fu3{animation-delay:.15s}.fu4{animation-delay:.2s}
        .card-h:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(26,58,42,.1)!important;transition:all .22s}
        .btn-h:hover{opacity:.85}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* ── Hero Score Banner ── */}
      <div className="fu" style={{background:"linear-gradient(135deg,#1a3a2a 0%,#2d5a3d 60%,#3a6a4a 100%)",borderRadius:20,padding:"26px 30px",marginBottom:22,color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(34,197,94,.08)"}}/>
        <div style={{position:"absolute",bottom:-30,right:180,width:120,height:120,borderRadius:"50%",background:"rgba(34,197,94,.06)"}}/>
        <div style={{position:"relative",flex:1}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Today's Nutrition Score</div>
          <div style={{fontSize:26,fontWeight:800,fontFamily:"'Playfair Display',serif",lineHeight:1.2,marginBottom:10}}>
            {score>0?`You're ${score}% toward your daily goal`:"Start logging your vegetables today"}
          </div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.7)",lineHeight:1.6,maxWidth:480}}>
            {entries.length>0
              ?`Logged: ${entries.slice(0,2).map((e:any)=>e.vegetable).join(", ")}. Add Bell Pepper and Broccoli to boost Vitamin C.`
              :"Log your first meal to get personalised AI nutrition recommendations."}
          </div>
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button className="btn-h" onClick={()=>router.push("/dashboard/consumer/nutrition")} style={{background:"#22c55e",color:"#fff",border:"none",borderRadius:9,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Log Food</button>
            <button className="btn-h" onClick={()=>setShowPkgs(true)} style={{background:"rgba(255,255,255,.12)",color:"#fff",border:"1px solid rgba(255,255,255,.2)",borderRadius:9,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>View Plans</button>
          </div>
        </div>
        {/* Score ring */}
        <div style={{position:"relative",width:96,height:96,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="8"/>
            <circle cx="48" cy="48" r="40" fill="none" stroke="#22c55e" strokeWidth="8"
              strokeDasharray={`${2*Math.PI*40*score/100} ${2*Math.PI*40}`}
              strokeLinecap="round" transform="rotate(-90 48 48)"/>
          </svg>
          <div style={{position:"absolute",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{score}%</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,.55)"}}>daily goal</div>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        {[
          {label:"Veggies Today",  value:`${entries.length}/5`, sub:"Daily target",          accent:"#22c55e", href:"/dashboard/consumer/nutrition"},
          {label:"Calories",       value:calories||"—",         sub:"kcal logged",           accent:"#f59e0b", href:"/dashboard/consumer/nutrition"},
          {label:"Active Orders",  value:activeOrders.length,   sub:`${orders.length} total`,accent:"#3b82f6", href:"/dashboard/consumer/orders"},
          {label:"Streak",         value:`${streak}d`,          sub:"Logging streak",        accent:"#a855f7", href:"/dashboard/consumer/nutrition"},
        ].map((s,i)=>(
          <div key={s.label} className={`card-h fu fu${i+1}`}
            onClick={()=>router.push(s.href)}
            style={{background:"#fff",borderRadius:16,padding:"18px 20px",border:"1px solid #eeebe4",boxShadow:"0 2px 8px rgba(0,0,0,.04)",cursor:"pointer",transition:"all .22s",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.accent,borderRadius:"16px 16px 0 0"}}/>
            <div style={{fontSize:11,fontWeight:700,color:COLOR.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:28,fontWeight:800,color:COLOR.text,fontFamily:"'Playfair Display',serif",lineHeight:1,marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:11,color:"#9b9590"}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Middle: Log + Nutrients ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:20}}>

        {/* Today's Log */}
        <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
          <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f4f0ec",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:15,fontWeight:700,color:COLOR.text}}>Today's Nutrition Log</div>
            <button className="btn-h" onClick={()=>router.push("/dashboard/consumer/nutrition")} style={{background:"none",border:"none",fontSize:12,color:"#22c55e",fontWeight:600,cursor:"pointer"}}>Full log →</button>
          </div>
          <div style={{padding:"14px 22px"}}>
            {entries.length===0?(
              <div style={{textAlign:"center",padding:"28px 0",color:"#9b9590"}}>
                <div style={{width:48,height:48,borderRadius:14,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div style={{fontSize:13}}>No entries yet</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                {entries.slice(0,3).map((e:any,i:number)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"#f8faf8",borderRadius:10}}>
                    <span style={{fontSize:22}}>{e.emoji||"🥬"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:COLOR.text}}>{e.vegetable} · {e.grams}g</div>
                      <div style={{fontSize:11,color:COLOR.muted}}>{e.calories} kcal</div>
                    </div>
                    <span style={{fontSize:10,fontWeight:700,color:"#16a34a",background:"#f0fdf4",padding:"2px 8px",borderRadius:99}}>Logged</span>
                  </div>
                ))}
              </div>
            )}
            {/* AI Recommends */}
            <div style={{padding:"12px 14px",background:"#f0fdf4",borderRadius:10,border:"1px solid #bbf7d0"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#166534",marginBottom:7,display:"flex",alignItems:"center",gap:6}}>
                <span style={{background:"#22c55e",color:"#fff",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:99}}>AI</span>
                Recommended for tomorrow
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {AI_RECS.map(r=>(
                  <span key={r} style={{background:"#fff",border:"1px solid #bbf7d0",color:"#166534",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:99}}>{r}</span>
                ))}
              </div>
            </div>
            <button className="btn-h" onClick={()=>router.push("/dashboard/consumer/nutrition")}
              style={{width:"100%",marginTop:12,padding:"10px",border:"2px dashed #22c55e",borderRadius:10,background:"transparent",color:"#22c55e",fontSize:13,fontWeight:600,cursor:"pointer"}}>
              + Log a Vegetable
            </button>
          </div>
        </div>

        {/* Nutrient Status */}
        <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
          <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f4f0ec",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:15,fontWeight:700,color:COLOR.text}}>Nutrient Status</div>
            <button className="btn-h" onClick={()=>router.push("/dashboard/consumer/nutrition")} style={{background:"none",border:"none",fontSize:12,color:"#22c55e",fontWeight:600,cursor:"pointer"}}>Details →</button>
          </div>
          <div style={{padding:"14px 22px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
              {NUTRIENTS.map(n=>{
                const val=Math.min(nutrients[n.key]||0,100);
                const {c,bg,label}=getScore(val);
                return(
                  <div key={n.key} style={{background:bg,borderRadius:10,padding:"11px 8px",textAlign:"center"}}>
                    <div style={{fontSize:18,fontWeight:800,color:c}}>{val}%</div>
                    <div style={{fontSize:10,fontWeight:600,color:COLOR.text,marginTop:2}}>{n.label}</div>
                    <div style={{fontSize:9,color:c,marginTop:2}}>{label}</div>
                  </div>
                );
              })}
            </div>
            {/* Streak dots */}
            <div style={{borderTop:"1px solid #f0f4f0",paddingTop:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:700,color:COLOR.text}}>Logging Streak</div>
                <span style={{fontSize:12,color:"#f59e0b",fontWeight:700}}>🔥 {streak} days</span>
              </div>
              <div style={{display:"flex",gap:6}}>
                {DAYS.map((d,i)=>(
                  <div key={d} style={{flex:1,textAlign:"center"}}>
                    <div style={{width:"100%",aspectRatio:"1",borderRadius:"50%",background:i<streak%7?"#22c55e":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:3}}>
                      {i<streak%7&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <div style={{fontSize:9,color:COLOR.muted}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom: Products + Orders + Weekly ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18}}>

        {/* Fresh Nearby */}
        <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
          <div style={{padding:"16px 20px 12px",borderBottom:"1px solid #f4f0ec",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:14,fontWeight:700,color:COLOR.text}}>Fresh Nearby</div>
            <button className="btn-h" onClick={()=>router.push("/dashboard/consumer/marketplace")} style={{background:"none",border:"none",fontSize:12,color:"#22c55e",fontWeight:600,cursor:"pointer"}}>Browse →</button>
          </div>
          <div style={{padding:"14px 18px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {(products.length>0?products:[
              {cropName:"Broccoli",price:120,farmer:{name:"Nimal"},_id:"1"},{cropName:"Carrot",price:95,farmer:{name:"Kumari"},_id:"2"},
              {cropName:"Tomatoes",price:140,farmer:{name:"Asanka"},_id:"3"},{cropName:"Bell Pepper",price:160,farmer:{name:"Priya"},_id:"4"},
            ]).slice(0,4).map((p:any,i:number)=>(
              <div key={p._id||i} className="card-h" style={{background:"#f8faf8",borderRadius:10,padding:"10px 10px 8px",border:"1px solid #eeebe4",cursor:"pointer",transition:"all .22s"}}>
                <div style={{height:52,background:"#f0fdf4",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,fontSize:28,overflow:"hidden"}}>
                  {p.imageUrl?<img src={`http://localhost:5000${p.imageUrl}`} alt={p.cropName} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"🥬"}
                </div>
                <div style={{fontSize:12,fontWeight:700,color:COLOR.text,marginBottom:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.cropName}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,fontWeight:700,color:COLOR.dark}}>Rs.{p.price}</span>
                  <button className="btn-h" onClick={()=>router.push("/dashboard/consumer/marketplace")} style={{background:"#1a3a2a",color:"#fff",border:"none",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,cursor:"pointer"}}>Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
          <div style={{padding:"16px 20px 12px",borderBottom:"1px solid #f4f0ec",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:14,fontWeight:700,color:COLOR.text}}>Recent Orders</div>
            <button className="btn-h" onClick={()=>router.push("/dashboard/consumer/orders")} style={{background:"none",border:"none",fontSize:12,color:"#22c55e",fontWeight:600,cursor:"pointer"}}>View all →</button>
          </div>
          <div style={{padding:"10px 18px"}}>
            {orders.length===0?(
              <div style={{padding:"24px 0",textAlign:"center",color:"#9b9590",fontSize:13}}>No orders yet</div>
            ):orders.slice(0,5).map((o:any,i:number)=>{
              const sc=o.orderStatus==="Delivered"?{c:"#16a34a",bg:"#f0fdf4"}:o.orderStatus==="Cancelled"?{c:"#dc2626",bg:"#fff1f1"}:{c:"#d97706",bg:"#fffbeb"};
              return(
                <div key={o._id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<Math.min(orders.length,5)-1?"1px solid #f8f5f0":"none"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"#f0f8f4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:COLOR.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{o.cropName} · {o.quantity}kg</div>
                    <div style={{fontSize:11,color:COLOR.muted}}>Rs.{o.totalPrice?.toLocaleString()}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:99,background:sc.bg,color:sc.c,whiteSpace:"nowrap"}}>{o.orderStatus}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
          <div style={{padding:"16px 20px 12px",borderBottom:"1px solid #f4f0ec",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:14,fontWeight:700,color:COLOR.text}}>Weekly Nutrition</div>
            <button className="btn-h" onClick={()=>router.push("/dashboard/consumer/nutrition")} style={{background:"none",border:"none",fontSize:12,color:"#22c55e",fontWeight:600,cursor:"pointer"}}>Report →</button>
          </div>
          <div style={{padding:"14px 18px"}}>
            <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:16}}>
              {(weekly.length>0?weekly:DAYS.map((d,i)=>({date:d,nutrientScore:[88,72,95,42,60,78,0][i]||0}))).slice(0,7).map((w:any,i:number)=>{
                const val=w.nutrientScore||0;
                const day=w.date?new Date(w.date).toLocaleDateString("en-US",{weekday:"short"}):DAYS[i];
                const bc=val>=70?"#22c55e":val>=40?"#f59e0b":"#ef4444";
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:30,fontSize:11,color:COLOR.muted,flexShrink:0}}>{day}</div>
                    <div style={{flex:1,background:"#f0f4f0",borderRadius:4,height:7,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${val}%`,background:bc,borderRadius:4,transition:"width .4s"}}/>
                    </div>
                    <div style={{width:34,fontSize:11,fontWeight:600,color:val>0?bc:COLOR.muted,textAlign:"right"}}>{val>0?`${val}%`:"—"}</div>
                  </div>
                );
              })}
            </div>
            <div style={{background:"#fffbeb",borderRadius:10,padding:"11px 13px",border:"1px solid #fde68a"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#92400e",marginBottom:4,display:"flex",alignItems:"center",gap:5}}>
                <span style={{background:"#f59e0b",color:"#fff",fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:99}}>AI</span>
                Weekly Insight
              </div>
              <div style={{fontSize:11,color:"#78350f",lineHeight:1.5}}>Your Vitamin C has been low this week. Add 1 orange or bell pepper daily to improve.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Packages Modal ── */}
      {showPkgs&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
          onClick={e=>{if(e.target===e.currentTarget)setShowPkgs(false);}}>
          <div style={{background:"#f9f7f3",borderRadius:22,padding:"34px",width:"100%",maxWidth:680,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.22)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div>
                <h2 style={{fontSize:22,fontWeight:800,color:"#1a3a2a",margin:0,fontFamily:"'Playfair Display',serif"}}>Consumer Plans</h2>
                <p style={{color:COLOR.muted,fontSize:13,marginTop:5}}>Start free. Upgrade for full nutrition insights and priority orders.</p>
              </div>
              <button onClick={()=>setShowPkgs(false)} style={{background:"#f4f0e8",border:"none",width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:COLOR.muted,fontSize:18}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:22}}>
              {PACKAGES.map(pkg=>(
                <div key={pkg.id} className="card-h" style={{background:pkg.highlight?"linear-gradient(145deg,#1a3a2a,#2d5a3d)":"#fff",borderRadius:16,padding:"22px 18px",border:pkg.highlight?"2px solid rgba(34,197,94,.3)":"1.5px solid #e8e4dc",position:"relative",transition:"all .22s"}}>
                  {pkg.highlight&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,#d4a853,#f0c96b)",color:"#1a3a2a",fontSize:10,fontWeight:800,padding:"3px 14px",borderRadius:99,whiteSpace:"nowrap"}}>Most Popular</div>}
                  <div style={{fontSize:11,fontWeight:700,color:pkg.highlight?"rgba(255,255,255,.5)":"#9b9590",textTransform:"uppercase",letterSpacing:".08em",marginBottom:7}}>{pkg.name}</div>
                  <div style={{marginBottom:16}}>
                    <span style={{fontSize:28,fontWeight:800,color:pkg.highlight?"#22c55e":"#1a3a2a",fontFamily:"'Playfair Display',serif"}}>{pkg.price===0?"Free":`Rs.${pkg.price.toLocaleString()}`}</span>
                    {pkg.price>0&&<span style={{fontSize:12,color:pkg.highlight?"rgba(255,255,255,.45)":"#9b9590"}}>/{pkg.period}</span>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:18}}>
                    {pkg.features.map(f=>(
                      <div key={f} style={{display:"flex",alignItems:"flex-start",gap:8,fontSize:12,color:pkg.highlight?"rgba(255,255,255,.75)":"#6b7280"}}>
                        <div style={{width:15,height:15,borderRadius:"50%",flexShrink:0,marginTop:1,background:pkg.highlight?"rgba(34,197,94,.2)":"#e8f5e9",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={pkg.highlight?"#22c55e":"#16a34a"} strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <button className="btn-h" onClick={()=>router.push(pkg.price===0?"/dashboard/consumer":"/subscription")} style={{width:"100%",padding:"10px",background:pkg.highlight?"#22c55e":pkg.id==="free"?"#f4f0e8":"linear-gradient(135deg,#1a3a2a,#2d5a3d)",color:pkg.id==="free"&&!pkg.highlight?"#1a3a2a":"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                    {pkg.price===0?"Start Free Trial":"Get Started"}
                  </button>
                </div>
              ))}
            </div>
            <p style={{textAlign:"center",fontSize:11,color:"#b0ada8",marginTop:18}}>7-day free trial on all plans. Cancel anytime. Prices in LKR.</p>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}