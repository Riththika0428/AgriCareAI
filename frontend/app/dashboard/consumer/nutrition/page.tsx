// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import ConsumerLayout from "@/app/components/ConsumerLayout";
// import { nutritionAPI } from "@/lib/axios-proxy";

// const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// export default function NutritionPage() {
//   const router = useRouter();
//   const [todayLog, setToday]    = useState<any>(null);
//   const [weekly,   setWeekly]   = useState<any[]>([]);
//   const [veggies,  setVeggies]  = useState<any[]>([]);
//   const [loading,  setLoading]  = useState(true);
//   const [showModal, setModal]   = useState(false);
//   const [selVeg,   setSelVeg]   = useState("");
//   const [grams,    setGrams]    = useState("100");
//   const [adding,   setAdding]   = useState(false);
//   const [error,    setError]    = useState("");

//   useEffect(() => { loadData(); }, []);

//   const loadData = async () => {
//     try {
//       const [todayRes, weeklyRes, veggieRes] = await Promise.all([
//         nutritionAPI.getToday(),
//         nutritionAPI.getWeekly(),
//         nutritionAPI.getVeggies(),
//       ]);
//       setToday(todayRes.data);
//       setWeekly(weeklyRes.data);
//       setVeggies(veggieRes.data);
//     } catch {}
//     setLoading(false);
//   };

//   const handleAdd = async () => {
//     if (!selVeg || !grams) { setError("Select a vegetable and enter grams."); return; }
//     setAdding(true); setError("");
//     try {
//       const { data } = await nutritionAPI.addEntry(selVeg, Number(grams));
//       setToday(data.log);
//       setModal(false); setSelVeg(""); setGrams("100");
//     } catch (e:any) {
//       setError(e.response?.data?.message || "Failed to add entry.");
//     } finally { setAdding(false); }
//   };

//   const handleRemove = async (entryId: string) => {
//     try {
//       const { data } = await nutritionAPI.removeEntry(entryId);
//       setToday(data.log);
//     } catch {}
//   };

//   const entries  = todayLog?.entries || [];
//   const score    = todayLog?.nutrientScore || 0;
//   const calories = todayLog?.totalCalories || 0;
//   const streak   = 4;

//   // Nutrient totals
//   const totals: Record<string,number> = {};
//   entries.forEach((e:any) => {
//     if (e.nutrients) Object.entries(e.nutrients).forEach(([k,v]) => {
//       totals[k] = (totals[k]||0) + (v as number);
//     });
//   });

//   const NUTRIENTS = [
//     { key:"vitaminA", label:"Vitamin A" },
//     { key:"vitaminC", label:"Vitamin C" },
//     { key:"iron",     label:"Iron" },
//     { key:"calcium",  label:"Calcium" },
//     { key:"fiber",    label:"Fiber" },
//     { key:"protein",  label:"Protein" },
//   ];

//   const getBarColor = (v:number) => v>=70?"#22c55e":v>=40?"#f59e0b":"#ef4444";

//   if (loading) return (
//     <ConsumerLayout>
//       <div style={{ textAlign:"center", padding:"80px", color:"#6b7280" }}>
//         <div style={{ fontSize:36, marginBottom:12 }}>🥗</div>
//         <div style={{ fontWeight:600 }}>Loading nutrition data…</div>
//       </div>
//     </ConsumerLayout>
//   );

//   return (
//     <ConsumerLayout>

//       {/* Header */}
//       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
//         <div>
//           <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:0,
//             display:"flex", alignItems:"center", gap:10 }}>
//             🍅 Nutrition Tracker
//           </h1>
//           <p style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>
//             Log your daily intake and get AI-powered suggestions
//           </p>
//         </div>
//         <button onClick={() => setModal(true)} style={{
//           background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
//           border:"none", borderRadius:10, padding:"10px 20px",
//           fontSize:14, fontWeight:700, cursor:"pointer",
//         }}>+ Log Food</button>
//       </div>

//       {/* Stat cards */}
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
//         {[
//           { icon:"🔥", num:calories, label:"Calories Today" },
//           { icon:"🎯", num:`${score}%`, label:"Nutrient Score" },
//           { icon:"📈", num:`${streak} days`, label:"Current Streak" },
//         ].map(s => (
//           <div key={s.label} style={{ background:"#fff", borderRadius:14, padding:"20px 22px",
//             border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)",
//             display:"flex", alignItems:"center", gap:14 }}>
//             <div style={{ width:48, height:48, borderRadius:12, background:"#f0fdf4",
//               display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
//               {s.icon}
//             </div>
//             <div>
//               <div style={{ fontSize:28, fontWeight:800, color:"#111827",
//                 fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.num}</div>
//               <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{s.label}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Today's Intake + Nutrient Breakdown */}
//       <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>

//         {/* Today's Intake */}
//         <div style={{ background:"#fff", borderRadius:16, padding:"22px",
//           border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
//           <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:14 }}>Today's Intake</div>
//           {entries.length === 0 ? (
//             <div style={{ textAlign:"center", padding:"30px", color:"#9ca3af" }}>
//               <div style={{ fontSize:32, marginBottom:8 }}>🥬</div>
//               <div>No entries yet. Log your first vegetable!</div>
//             </div>
//           ) : (
//             <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
//               {entries.map((e:any, i:number) => (
//                 <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
//                   padding:"10px 12px", background:"#f8faf8", borderRadius:10 }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//                     <span style={{ fontSize:22 }}>{e.emoji}</span>
//                     <div>
//                       <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{e.vegetable}</div>
//                       <div style={{ fontSize:11, color:"#6b7280" }}>{e.grams}g · {e.calories} kcal</div>
//                     </div>
//                   </div>
//                   <button onClick={() => handleRemove(e._id)}
//                     style={{ background:"none", border:"none", color:"#9ca3af",
//                     cursor:"pointer", fontSize:16, padding:"4px" }}>×</button>
//                 </div>
//               ))}
//             </div>
//           )}
//           <button onClick={() => setModal(true)} style={{
//             width:"100%", marginTop:14, padding:"10px",
//             border:"2px dashed #22c55e", borderRadius:10,
//             background:"transparent", color:"#22c55e",
//             fontSize:13, fontWeight:600, cursor:"pointer",
//           }}>+ Add Food</button>
//         </div>

//         {/* Nutrient Breakdown */}
//         <div style={{ background:"#fff", borderRadius:16, padding:"22px",
//           border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
//           <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:14 }}>Nutrient Breakdown</div>
//           <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
//             {NUTRIENTS.map(n => {
//               const val = Math.min(totals[n.key]||0, 100);
//               return (
//                 <div key={n.key}>
//                   <div style={{ display:"flex", justifyContent:"space-between",
//                     alignItems:"center", marginBottom:4 }}>
//                     <span style={{ fontSize:13, fontWeight:500, color:"#374151" }}>{n.label}</span>
//                     <div style={{ display:"flex", alignItems:"center", gap:6 }}>
//                       <span style={{ fontSize:13, fontWeight:700, color:getBarColor(val) }}>{val}%</span>
//                       {val < 40 && (
//                         <span style={{ background:"#fee2e2", color:"#dc2626",
//                           fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:99 }}>Low</span>
//                       )}
//                     </div>
//                   </div>
//                   <div style={{ background:"#f0f4f0", borderRadius:4, height:8, overflow:"hidden" }}>
//                     <div style={{ height:"100%", width:`${val}%`,
//                       background:getBarColor(val), borderRadius:4, transition:"width .4s" }} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Weekly Score */}
//       <div style={{ background:"#fff", borderRadius:16, padding:"22px",
//         border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
//         <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:16 }}>
//           Weekly Nutrition Score
//         </div>
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10 }}>
//           {(weekly.length > 0 ? weekly : DAYS.map(d=>({date:d,nutrientScore:0}))).map((w:any,i:number) => {
//             const val = w.nutrientScore||0;
//             const day = w.date ? new Date(w.date).toLocaleDateString("en-US",{weekday:"short"}) : DAYS[i];
//             return (
//               <div key={i} style={{ textAlign:"center" }}>
//                 <div style={{ fontSize:11, color:"#6b7280", marginBottom:6 }}>{day}</div>
//                 <div style={{ height:80, background:"#f0f4f0", borderRadius:8,
//                   position:"relative", overflow:"hidden" }}>
//                   <div style={{ position:"absolute", bottom:0, left:0, right:0,
//                     height:`${val}%`, background:getBarColor(val),
//                     borderRadius:"6px 6px 0 0", transition:"height .4s" }} />
//                 </div>
//                 <div style={{ fontSize:11, fontWeight:600, marginTop:4,
//                   color: val>0?getBarColor(val):"#9ca3af" }}>
//                   {val > 0 ? `${val}%` : "–"}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Add Food Modal */}
//       {showModal && (
//         <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:200,
//           display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
//           onClick={e => { if(e.target===e.currentTarget) setModal(false); }}>
//           <div style={{ background:"#fff", borderRadius:18, padding:"28px 32px",
//             width:"100%", maxWidth:"440px" }}>
//             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
//               <h2 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:0 }}>Log Food</h2>
//               <button onClick={() => setModal(false)}
//                 style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#6b7280" }}>✕</button>
//             </div>

//             {error && (
//               <div style={{ background:"#fff1f1", border:"1px solid #fcd0d0", borderRadius:8,
//                 padding:"8px 12px", color:"#dc2626", fontSize:13, marginBottom:14 }}>
//                 ⚠️ {error}
//               </div>
//             )}

//             <div style={{ marginBottom:14 }}>
//               <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
//                 textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
//                 Vegetable
//               </label>
//               <select value={selVeg} onChange={e => setSelVeg(e.target.value)} style={{
//                 width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb",
//                 borderRadius:10, fontSize:14, fontFamily:"'DM Sans',sans-serif",
//                 color:"#111827", background:"#fff", outline:"none",
//               }}>
//                 <option value="">Select vegetable…</option>
//                 {veggies.map((v:any) => (
//                   <option key={v.name} value={v.name}>{v.emoji} {v.name} ({v.cal} kcal/100g)</option>
//                 ))}
//               </select>
//             </div>

//             <div style={{ marginBottom:22 }}>
//               <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
//                 textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
//                 Amount (grams)
//               </label>
//               <input type="number" value={grams} onChange={e => setGrams(e.target.value)}
//                 placeholder="100" min="1" max="1000" style={{
//                   width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb",
//                   borderRadius:10, fontSize:14, fontFamily:"'DM Sans',sans-serif",
//                   color:"#111827", outline:"none", boxSizing:"border-box" as const,
//                 }} />
//             </div>

//             <button onClick={handleAdd} disabled={adding} style={{
//               width:"100%", padding:"12px",
//               background: adding?"#a7f3d0":"linear-gradient(135deg,#1a3a2a,#22c55e)",
//               color:"#fff", border:"none", borderRadius:10,
//               fontSize:14, fontWeight:700, cursor:"pointer",
//             }}>
//               {adding ? "Adding…" : "✓ Log Entry"}
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
import { nutritionAPI } from "@/lib/axios-proxy";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const COLOR = { green:"#22c55e",dark:"#1a3a2a",text:"#111827",muted:"#6b7280",border:"#e8ede8" };

// Food categories with items
const FOOD_CATEGORIES = [
  { id:"vegetables", label:"Vegetables", color:"#22c55e", bg:"#f0fdf4", border:"#bbf7d0",
    items:["Carrot","Spinach","Broccoli","Bell Pepper","Tomato","Kale","Cucumber","Onion","Potato","Cabbage","Beetroot","Corn"] },
  { id:"fruits", label:"Fruits", color:"#f59e0b", bg:"#fffbeb", border:"#fde68a",
    items:["Mango","Banana","Apple","Orange","Papaya","Pineapple","Watermelon","Grapes","Strawberry","Avocado"] },
  { id:"seafood", label:"Seafood", color:"#3b82f6", bg:"#eff6ff", border:"#bfdbfe",
    items:["Tuna","Salmon","Sardines","Prawns","Crab","Squid","Mackerel","Tilapia"] },
  { id:"eggs", label:"Eggs & Dairy", color:"#8b5cf6", bg:"#f5f3ff", border:"#ddd6fe",
    items:["Chicken Egg","Duck Egg","Milk","Yogurt","Cheese","Butter"] },
  { id:"others", label:"Others", color:"#6b7280", bg:"#f9fafb", border:"#e5e7eb",
    items:["Rice","Oats","Lentils","Chickpeas","Almonds","Walnuts","Tofu","Tempeh"] },
];

const getBarColor = (v:number) => v>=70?"#22c55e":v>=40?"#f59e0b":"#ef4444";
const getBg       = (v:number) => v>=70?"#f0fdf4":v>=40?"#fffbeb":"#fff1f1";
const getTextC    = (v:number) => v>=70?"#166534":v>=40?"#92400e":"#dc2626";

export default function NutritionPage() {
  const [todayLog,  setToday]    = useState<any>(null);
  const [weekly,    setWeekly]   = useState<any[]>([]);
  const [veggies,   setVeggies]  = useState<any[]>([]);
  const [loading,   setLoading]  = useState(true);
  const [showModal, setModal]    = useState(false);
  const [adding,    setAdding]   = useState(false);
  const [error,     setError]    = useState("");

  // Multi-select state
  const [activeTab, setActiveTab]   = useState("vegetables");
  const [selections, setSelections] = useState<Record<string,string>>({}); // itemName -> grams
  const [pendingGrams, setPendingGrams] = useState("100");

  useEffect(()=>{ loadData(); },[]);

  const loadData = async () => {
    try {
      const [tR,wR,vR] = await Promise.all([nutritionAPI.getToday(),nutritionAPI.getWeekly(),nutritionAPI.getVeggies()]);
      setToday(tR.data); setWeekly(wR.data); setVeggies(vR.data);
    } catch{}
    setLoading(false);
  };

  const toggleItem = (item:string) => {
    setSelections(prev=>{
      const n={...prev};
      if(n[item]) delete n[item]; else n[item]=pendingGrams||"100";
      return n;
    });
  };

  const handleAddAll = async () => {
    const items = Object.entries(selections);
    if(items.length===0){setError("Select at least one food item.");return;}
    setAdding(true); setError("");
    try {
      // Match against veggies list, add each selected item
      for(const [name,grams] of items){
        const veg = veggies.find((v:any)=>v.name.toLowerCase()===name.toLowerCase());
        if(veg){
          const {data}=await nutritionAPI.addEntry(veg.name,Number(grams));
          setToday(data.log);
        }
      }
      setSelections({}); setModal(false);
    } catch(e:any){
      setError(e.response?.data?.message||"Some items could not be added.");
    } finally{setAdding(false);}
  };

  const handleRemove = async (entryId:string) => {
    try{const {data}=await nutritionAPI.removeEntry(entryId);setToday(data.log);}catch{}
  };

  const entries  = todayLog?.entries||[];
  const score    = todayLog?.nutrientScore||0;
  const calories = todayLog?.totalCalories||0;
  const streak   = weekly.filter((w:any)=>w.nutrientScore>0).length||4;

  const totals:Record<string,number>={};
  entries.forEach((e:any)=>{if(e.nutrients)Object.entries(e.nutrients).forEach(([k,v])=>{totals[k]=(totals[k]||0)+(v as number);});});

  const NUTRIENTS=[{key:"vitaminA",label:"Vitamin A"},{key:"vitaminC",label:"Vitamin C"},{key:"iron",label:"Iron"},{key:"calcium",label:"Calcium"},{key:"fiber",label:"Fiber"},{key:"protein",label:"Protein"}];

  const activeCat = FOOD_CATEGORIES.find(c=>c.id===activeTab)!;
  const selCount  = Object.keys(selections).length;

  if(loading) return(
    <ConsumerLayout>
      <div style={{textAlign:"center",padding:"80px",color:COLOR.muted,fontSize:14,fontWeight:600}}>Loading nutrition data…</div>
    </ConsumerLayout>
  );

  return(
    <ConsumerLayout>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .3s ease both}
        .card-h:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.09)!important;transition:all .2s}
        .btn-h:hover{opacity:.85}
        .food-chip:hover{transform:scale(1.03);transition:all .15s}
      `}</style>

      {/* ── Header ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:800,color:COLOR.text,margin:0}}>Nutrition Tracker</h1>
          <p style={{fontSize:13,color:COLOR.muted,marginTop:3}}>Log your daily intake and get AI-powered suggestions</p>
        </div>
        <button className="btn-h" onClick={()=>setModal(true)}
          style={{background:"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Log Food
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
        {[
          {label:"Calories Today", value:calories||"—", sub:"kcal",         accent:"#f59e0b"},
          {label:"Nutrient Score", value:`${score}%`,   sub:"daily goal",   accent:"#22c55e"},
          {label:"Logging Streak", value:`${streak}d`,  sub:"consecutive",  accent:"#8b5cf6"},
        ].map((s,i)=>(
          <div key={s.label} className="card-h fu" style={{background:"#fff",borderRadius:16,padding:"20px 22px",border:"1px solid #eeebe4",boxShadow:"0 2px 8px rgba(0,0,0,.04)",position:"relative",overflow:"hidden",animationDelay:`${i*.06}s`}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.accent,borderRadius:"16px 16px 0 0"}}/>
            <div style={{fontSize:11,fontWeight:700,color:COLOR.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:28,fontWeight:800,color:COLOR.text,fontFamily:"'Playfair Display',serif",lineHeight:1,marginBottom:3}}>{s.value}</div>
            <div style={{fontSize:11,color:"#9b9590"}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Score arc ── */}
      <div className="fu" style={{background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",borderRadius:18,padding:"22px 28px",marginBottom:22,display:"flex",alignItems:"center",gap:24,color:"#fff",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(34,197,94,.08)"}}/>
        <div style={{position:"relative",width:80,height:80,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="7"/>
            <circle cx="40" cy="40" r="32" fill="none" stroke="#22c55e" strokeWidth="7"
              strokeDasharray={`${2*Math.PI*32*score/100} ${2*Math.PI*32}`}
              strokeLinecap="round" transform="rotate(-90 40 40)"/>
          </svg>
          <div style={{position:"absolute",textAlign:"center"}}>
            <div style={{fontSize:17,fontWeight:800,color:"#fff"}}>{score}%</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:16,fontWeight:700,marginBottom:5}}>
            {score>=70?"Great progress today!":score>0?`${score}% of your daily goal`:"Start logging to track your nutrition"}
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.6}}>
            {entries.length>0?`Logged: ${entries.slice(0,3).map((e:any)=>e.vegetable).join(", ")}. Keep going!`:"Log your first food item using the button above."}
          </div>
        </div>
        <button className="btn-h" onClick={()=>setModal(true)} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",borderRadius:9,padding:"9px 16px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>+ Log Food</button>
      </div>

      {/* ── Today + Nutrients ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:20}}>

        {/* Today's Intake */}
        <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
          <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f4f0ec",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:15,fontWeight:700,color:COLOR.text}}>Today's Intake</div>
            <span style={{fontSize:11,color:COLOR.muted}}>{entries.length} item{entries.length!==1?"s":""} logged</span>
          </div>
          <div style={{padding:"14px 22px"}}>
            {entries.length===0?(
              <div style={{textAlign:"center",padding:"28px 0",color:"#9b9590"}}>
                <div style={{width:48,height:48,borderRadius:14,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:22}}>🥬</div>
                <div style={{fontSize:13}}>No entries yet</div>
                <button className="btn-h" onClick={()=>setModal(true)} style={{marginTop:10,background:"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Log first item</button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {entries.map((e:any,i:number)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"#f8faf8",borderRadius:10}}>
                    <span style={{fontSize:22,flexShrink:0}}>{e.emoji||"🥬"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:COLOR.text}}>{e.vegetable}</div>
                      <div style={{fontSize:11,color:COLOR.muted}}>{e.grams}g · {e.calories} kcal</div>
                    </div>
                    <button onClick={()=>handleRemove(e._id)} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer",fontSize:14,padding:"2px",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button className="btn-h" onClick={()=>setModal(true)} style={{width:"100%",marginTop:12,padding:"9px",border:"2px dashed #22c55e",borderRadius:10,background:"transparent",color:"#22c55e",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add More Food
            </button>
          </div>
        </div>

        {/* Nutrient Breakdown */}
        <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
          <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f4f0ec"}}>
            <div style={{fontSize:15,fontWeight:700,color:COLOR.text}}>Nutrient Breakdown</div>
          </div>
          <div style={{padding:"14px 22px",display:"flex",flexDirection:"column",gap:12}}>
            {NUTRIENTS.map(n=>{
              const val=Math.min(totals[n.key]||0,100);
              return(
                <div key={n.key}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <span style={{fontSize:13,fontWeight:500,color:"#374151"}}>{n.label}</span>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:13,fontWeight:700,color:getBarColor(val)}}>{val}%</span>
                      {val<40&&<span style={{background:"#fee2e2",color:"#dc2626",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:99}}>Low</span>}
                    </div>
                  </div>
                  <div style={{background:"#f0f4f0",borderRadius:4,height:7,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${val}%`,background:getBarColor(val),borderRadius:4,transition:"width .4s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Weekly Chart ── */}
      <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
        <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f4f0ec"}}>
          <div style={{fontSize:15,fontWeight:700,color:COLOR.text}}>Weekly Nutrition Score</div>
        </div>
        <div style={{padding:"18px 22px",display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:10}}>
          {(weekly.length>0?weekly:DAYS.map((d,i)=>({date:d,nutrientScore:[0,0,0,0,0,0,0][i]}))).map((w:any,i:number)=>{
            const val=w.nutrientScore||0;
            const day=w.date?new Date(w.date).toLocaleDateString("en-US",{weekday:"short"}):DAYS[i];
            return(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:COLOR.muted,marginBottom:6}}>{day}</div>
                <div style={{height:80,background:"#f0f4f0",borderRadius:8,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:`${val}%`,background:getBarColor(val),borderRadius:"6px 6px 0 0",transition:"height .4s"}}/>
                </div>
                <div style={{fontSize:11,fontWeight:600,marginTop:4,color:val>0?getBarColor(val):"#9ca3af"}}>{val>0?`${val}%`:"–"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════ ADD FOOD MODAL ══════════ */}
      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget){setModal(false);setSelections({});setError("");}}}>
          <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:620,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.18)"}}>

            {/* Modal header */}
            <div style={{padding:"22px 26px 16px",borderBottom:"1px solid #f0ede8",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <h2 style={{fontSize:17,fontWeight:800,color:COLOR.text,margin:0}}>Log Food</h2>
                <p style={{fontSize:12,color:COLOR.muted,margin:"3px 0 0"}}>Select multiple items — they'll all be logged at once</p>
              </div>
              <button onClick={()=>{setModal(false);setSelections({});setError("");}} style={{background:"#f4f0e8",border:"none",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:15,color:COLOR.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>

            {/* Category tabs */}
            <div style={{display:"flex",gap:6,padding:"14px 26px 10px",borderBottom:"1px solid #f4f0ec",overflowX:"auto"}}>
              {FOOD_CATEGORIES.map(cat=>(
                <button key={cat.id} onClick={()=>setActiveTab(cat.id)}
                  style={{padding:"7px 16px",borderRadius:99,border:`1.5px solid ${activeTab===cat.id?cat.color:COLOR.border}`,background:activeTab===cat.id?cat.bg:"transparent",color:activeTab===cat.id?cat.color:COLOR.muted,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{padding:"16px 26px"}}>
              {/* Grams input */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:"11px 14px",background:"#f9f7f4",borderRadius:10,border:"1px solid #eeebe4"}}>
                <div style={{fontSize:13,fontWeight:600,color:COLOR.text,flexShrink:0}}>Serving size (grams):</div>
                <input type="number" value={pendingGrams}
                  onChange={e=>{setPendingGrams(e.target.value); setSelections(prev=>{ const n={...prev}; Object.keys(n).forEach(k=>n[k]=e.target.value); return n;});}}
                  min="10" max="1000" placeholder="100"
                  style={{width:80,padding:"6px 10px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",textAlign:"center"}}/>
                <div style={{fontSize:12,color:COLOR.muted}}>grams per item selected</div>
              </div>

              {/* Food chips grid */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:700,color:activeCat.color,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:activeCat.color}}/>
                  {activeCat.label}
                  <span style={{color:COLOR.muted,fontWeight:400,textTransform:"none"}}>— tap to select, tap again to deselect</span>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {activeCat.items.map(item=>{
                    const isSel=!!selections[item];
                    // Check if backend has this veggie
                    const hasData=veggies.some((v:any)=>v.name.toLowerCase()===item.toLowerCase());
                    return(
                      <button key={item} className="food-chip btn-h"
                        onClick={()=>{ if(hasData||true) toggleItem(item); }}
                        style={{
                          padding:"8px 14px",borderRadius:99,border:`2px solid ${isSel?activeCat.color:COLOR.border}`,
                          background:isSel?activeCat.bg:"#fff",color:isSel?activeCat.color:COLOR.muted,
                          fontSize:13,fontWeight:isSel?700:500,cursor:"pointer",transition:"all .15s",
                          display:"flex",alignItems:"center",gap:6,
                        }}>
                        {isSel&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
                        {item}
                        {isSel&&<span style={{fontSize:10,color:activeCat.color,background:"rgba(0,0,0,.06)",padding:"1px 6px",borderRadius:99}}>{selections[item]}g</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected summary */}
              {selCount>0&&(
                <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"11px 14px",marginBottom:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#166534",marginBottom:7}}>
                    {selCount} item{selCount>1?"s":""} selected to log:
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {Object.entries(selections).map(([item,grams])=>(
                      <span key={item} style={{background:"#fff",border:"1px solid #bbf7d0",color:"#166534",fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:99,display:"flex",alignItems:"center",gap:5}}>
                        {item} · {grams}g
                        <button onClick={()=>toggleItem(item)} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer",padding:0,display:"flex",alignItems:"center"}}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {error&&<div style={{padding:"10px 13px",borderRadius:8,marginBottom:12,background:"#fff1f1",color:"#dc2626",fontSize:13,fontWeight:600}}>{error}</div>}

              <div style={{display:"flex",gap:10}}>
                <button className="btn-h" onClick={()=>{setModal(false);setSelections({});setError("");}} style={{flex:1,padding:"11px",background:"#f4f0e8",border:"none",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer",color:COLOR.muted}}>Cancel</button>
                <button className="btn-h" onClick={handleAddAll} disabled={adding||selCount===0}
                  style={{flex:2,padding:"11px",background:selCount===0||adding?"#a7f3d0":"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:selCount===0||adding?"not-allowed":"pointer"}}>
                  {adding?"Logging…":`Log ${selCount} item${selCount>1?"s":""}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}