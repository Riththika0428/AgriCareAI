// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useRouter } from "next/navigation";
// // // import ConsumerLayout from "@/app/components/ConsumerLayout";
// // // import { nutritionAPI } from "@/lib/axios-proxy";

// // // const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// // // export default function NutritionPage() {
// // //   const router = useRouter();
// // //   const [todayLog, setToday]    = useState<any>(null);
// // //   const [weekly,   setWeekly]   = useState<any[]>([]);
// // //   const [veggies,  setVeggies]  = useState<any[]>([]);
// // //   const [loading,  setLoading]  = useState(true);
// // //   const [showModal, setModal]   = useState(false);
// // //   const [selVeg,   setSelVeg]   = useState("");
// // //   const [grams,    setGrams]    = useState("100");
// // //   const [adding,   setAdding]   = useState(false);
// // //   const [error,    setError]    = useState("");

// // //   useEffect(() => { loadData(); }, []);

// // //   const loadData = async () => {
// // //     try {
// // //       const [todayRes, weeklyRes, veggieRes] = await Promise.all([
// // //         nutritionAPI.getToday(),
// // //         nutritionAPI.getWeekly(),
// // //         nutritionAPI.getVeggies(),
// // //       ]);
// // //       setToday(todayRes.data);
// // //       setWeekly(weeklyRes.data);
// // //       setVeggies(veggieRes.data);
// // //     } catch {}
// // //     setLoading(false);
// // //   };

// // //   const handleAdd = async () => {
// // //     if (!selVeg || !grams) { setError("Select a vegetable and enter grams."); return; }
// // //     setAdding(true); setError("");
// // //     try {
// // //       const { data } = await nutritionAPI.addEntry(selVeg, Number(grams));
// // //       setToday(data.log);
// // //       setModal(false); setSelVeg(""); setGrams("100");
// // //     } catch (e:any) {
// // //       setError(e.response?.data?.message || "Failed to add entry.");
// // //     } finally { setAdding(false); }
// // //   };

// // //   const handleRemove = async (entryId: string) => {
// // //     try {
// // //       const { data } = await nutritionAPI.removeEntry(entryId);
// // //       setToday(data.log);
// // //     } catch {}
// // //   };

// // //   const entries  = todayLog?.entries || [];
// // //   const score    = todayLog?.nutrientScore || 0;
// // //   const calories = todayLog?.totalCalories || 0;
// // //   const streak   = 4;

// // //   // Nutrient totals
// // //   const totals: Record<string,number> = {};
// // //   entries.forEach((e:any) => {
// // //     if (e.nutrients) Object.entries(e.nutrients).forEach(([k,v]) => {
// // //       totals[k] = (totals[k]||0) + (v as number);
// // //     });
// // //   });

// // //   const NUTRIENTS = [
// // //     { key:"vitaminA", label:"Vitamin A" },
// // //     { key:"vitaminC", label:"Vitamin C" },
// // //     { key:"iron",     label:"Iron" },
// // //     { key:"calcium",  label:"Calcium" },
// // //     { key:"fiber",    label:"Fiber" },
// // //     { key:"protein",  label:"Protein" },
// // //   ];

// // //   const getBarColor = (v:number) => v>=70?"#22c55e":v>=40?"#f59e0b":"#ef4444";

// // //   if (loading) return (
// // //     <ConsumerLayout>
// // //       <div style={{ textAlign:"center", padding:"80px", color:"#6b7280" }}>
// // //         <div style={{ fontSize:36, marginBottom:12 }}>🥗</div>
// // //         <div style={{ fontWeight:600 }}>Loading nutrition data…</div>
// // //       </div>
// // //     </ConsumerLayout>
// // //   );

// // //   return (
// // //     <ConsumerLayout>

// // //       {/* Header */}
// // //       <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
// // //         <div>
// // //           <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:0,
// // //             display:"flex", alignItems:"center", gap:10 }}>
// // //             🍅 Nutrition Tracker
// // //           </h1>
// // //           <p style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>
// // //             Log your daily intake and get AI-powered suggestions
// // //           </p>
// // //         </div>
// // //         <button onClick={() => setModal(true)} style={{
// // //           background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
// // //           border:"none", borderRadius:10, padding:"10px 20px",
// // //           fontSize:14, fontWeight:700, cursor:"pointer",
// // //         }}>+ Log Food</button>
// // //       </div>

// // //       {/* Stat cards */}
// // //       <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
// // //         {[
// // //           { icon:"🔥", num:calories, label:"Calories Today" },
// // //           { icon:"🎯", num:`${score}%`, label:"Nutrient Score" },
// // //           { icon:"📈", num:`${streak} days`, label:"Current Streak" },
// // //         ].map(s => (
// // //           <div key={s.label} style={{ background:"#fff", borderRadius:14, padding:"20px 22px",
// // //             border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)",
// // //             display:"flex", alignItems:"center", gap:14 }}>
// // //             <div style={{ width:48, height:48, borderRadius:12, background:"#f0fdf4",
// // //               display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
// // //               {s.icon}
// // //             </div>
// // //             <div>
// // //               <div style={{ fontSize:28, fontWeight:800, color:"#111827",
// // //                 fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.num}</div>
// // //               <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{s.label}</div>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       {/* Today's Intake + Nutrient Breakdown */}
// // //       <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>

// // //         {/* Today's Intake */}
// // //         <div style={{ background:"#fff", borderRadius:16, padding:"22px",
// // //           border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
// // //           <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:14 }}>Today's Intake</div>
// // //           {entries.length === 0 ? (
// // //             <div style={{ textAlign:"center", padding:"30px", color:"#9ca3af" }}>
// // //               <div style={{ fontSize:32, marginBottom:8 }}>🥬</div>
// // //               <div>No entries yet. Log your first vegetable!</div>
// // //             </div>
// // //           ) : (
// // //             <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
// // //               {entries.map((e:any, i:number) => (
// // //                 <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
// // //                   padding:"10px 12px", background:"#f8faf8", borderRadius:10 }}>
// // //                   <div style={{ display:"flex", alignItems:"center", gap:10 }}>
// // //                     <span style={{ fontSize:22 }}>{e.emoji}</span>
// // //                     <div>
// // //                       <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{e.vegetable}</div>
// // //                       <div style={{ fontSize:11, color:"#6b7280" }}>{e.grams}g · {e.calories} kcal</div>
// // //                     </div>
// // //                   </div>
// // //                   <button onClick={() => handleRemove(e._id)}
// // //                     style={{ background:"none", border:"none", color:"#9ca3af",
// // //                     cursor:"pointer", fontSize:16, padding:"4px" }}>×</button>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //           <button onClick={() => setModal(true)} style={{
// // //             width:"100%", marginTop:14, padding:"10px",
// // //             border:"2px dashed #22c55e", borderRadius:10,
// // //             background:"transparent", color:"#22c55e",
// // //             fontSize:13, fontWeight:600, cursor:"pointer",
// // //           }}>+ Add Food</button>
// // //         </div>

// // //         {/* Nutrient Breakdown */}
// // //         <div style={{ background:"#fff", borderRadius:16, padding:"22px",
// // //           border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
// // //           <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:14 }}>Nutrient Breakdown</div>
// // //           <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
// // //             {NUTRIENTS.map(n => {
// // //               const val = Math.min(totals[n.key]||0, 100);
// // //               return (
// // //                 <div key={n.key}>
// // //                   <div style={{ display:"flex", justifyContent:"space-between",
// // //                     alignItems:"center", marginBottom:4 }}>
// // //                     <span style={{ fontSize:13, fontWeight:500, color:"#374151" }}>{n.label}</span>
// // //                     <div style={{ display:"flex", alignItems:"center", gap:6 }}>
// // //                       <span style={{ fontSize:13, fontWeight:700, color:getBarColor(val) }}>{val}%</span>
// // //                       {val < 40 && (
// // //                         <span style={{ background:"#fee2e2", color:"#dc2626",
// // //                           fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:99 }}>Low</span>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                   <div style={{ background:"#f0f4f0", borderRadius:4, height:8, overflow:"hidden" }}>
// // //                     <div style={{ height:"100%", width:`${val}%`,
// // //                       background:getBarColor(val), borderRadius:4, transition:"width .4s" }} />
// // //                   </div>
// // //                 </div>
// // //               );
// // //             })}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Weekly Score */}
// // //       <div style={{ background:"#fff", borderRadius:16, padding:"22px",
// // //         border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
// // //         <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:16 }}>
// // //           Weekly Nutrition Score
// // //         </div>
// // //         <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10 }}>
// // //           {(weekly.length > 0 ? weekly : DAYS.map(d=>({date:d,nutrientScore:0}))).map((w:any,i:number) => {
// // //             const val = w.nutrientScore||0;
// // //             const day = w.date ? new Date(w.date).toLocaleDateString("en-US",{weekday:"short"}) : DAYS[i];
// // //             return (
// // //               <div key={i} style={{ textAlign:"center" }}>
// // //                 <div style={{ fontSize:11, color:"#6b7280", marginBottom:6 }}>{day}</div>
// // //                 <div style={{ height:80, background:"#f0f4f0", borderRadius:8,
// // //                   position:"relative", overflow:"hidden" }}>
// // //                   <div style={{ position:"absolute", bottom:0, left:0, right:0,
// // //                     height:`${val}%`, background:getBarColor(val),
// // //                     borderRadius:"6px 6px 0 0", transition:"height .4s" }} />
// // //                 </div>
// // //                 <div style={{ fontSize:11, fontWeight:600, marginTop:4,
// // //                   color: val>0?getBarColor(val):"#9ca3af" }}>
// // //                   {val > 0 ? `${val}%` : "–"}
// // //                 </div>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       </div>

// // //       {/* Add Food Modal */}
// // //       {showModal && (
// // //         <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:200,
// // //           display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
// // //           onClick={e => { if(e.target===e.currentTarget) setModal(false); }}>
// // //           <div style={{ background:"#fff", borderRadius:18, padding:"28px 32px",
// // //             width:"100%", maxWidth:"440px" }}>
// // //             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
// // //               <h2 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:0 }}>Log Food</h2>
// // //               <button onClick={() => setModal(false)}
// // //                 style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#6b7280" }}>✕</button>
// // //             </div>

// // //             {error && (
// // //               <div style={{ background:"#fff1f1", border:"1px solid #fcd0d0", borderRadius:8,
// // //                 padding:"8px 12px", color:"#dc2626", fontSize:13, marginBottom:14 }}>
// // //                 ⚠️ {error}
// // //               </div>
// // //             )}

// // //             <div style={{ marginBottom:14 }}>
// // //               <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
// // //                 textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
// // //                 Vegetable
// // //               </label>
// // //               <select value={selVeg} onChange={e => setSelVeg(e.target.value)} style={{
// // //                 width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb",
// // //                 borderRadius:10, fontSize:14, fontFamily:"'DM Sans',sans-serif",
// // //                 color:"#111827", background:"#fff", outline:"none",
// // //               }}>
// // //                 <option value="">Select vegetable…</option>
// // //                 {veggies.map((v:any) => (
// // //                   <option key={v.name} value={v.name}>{v.emoji} {v.name} ({v.cal} kcal/100g)</option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             <div style={{ marginBottom:22 }}>
// // //               <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
// // //                 textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
// // //                 Amount (grams)
// // //               </label>
// // //               <input type="number" value={grams} onChange={e => setGrams(e.target.value)}
// // //                 placeholder="100" min="1" max="1000" style={{
// // //                   width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb",
// // //                   borderRadius:10, fontSize:14, fontFamily:"'DM Sans',sans-serif",
// // //                   color:"#111827", outline:"none", boxSizing:"border-box" as const,
// // //                 }} />
// // //             </div>

// // //             <button onClick={handleAdd} disabled={adding} style={{
// // //               width:"100%", padding:"12px",
// // //               background: adding?"#a7f3d0":"linear-gradient(135deg,#1a3a2a,#22c55e)",
// // //               color:"#fff", border:"none", borderRadius:10,
// // //               fontSize:14, fontWeight:700, cursor:"pointer",
// // //             }}>
// // //               {adding ? "Adding…" : "✓ Log Entry"}
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </ConsumerLayout>
// // //   );
// // // }

// // "use client";

// // import { useState, useEffect } from "react";
// // import ConsumerLayout from "@/app/components/ConsumerLayout";
// // import { nutritionAPI } from "@/lib/axios-proxy";

// // const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
// // const COLOR = { green:"#22c55e",dark:"#1a3a2a",text:"#111827",muted:"#6b7280",border:"#e8ede8" };

// // // Food categories with items
// // const FOOD_CATEGORIES = [
// //   { id:"vegetables", label:"Vegetables", color:"#22c55e", bg:"#f0fdf4", border:"#bbf7d0",
// //     items:["Carrot","Spinach","Broccoli","Bell Pepper","Tomato","Kale","Cucumber","Onion","Potato","Cabbage","Beetroot","Corn"] },
// //   { id:"fruits", label:"Fruits", color:"#f59e0b", bg:"#fffbeb", border:"#fde68a",
// //     items:["Mango","Banana","Apple","Orange","Papaya","Pineapple","Watermelon","Grapes","Strawberry","Avocado"] },
// //   { id:"seafood", label:"Seafood", color:"#3b82f6", bg:"#eff6ff", border:"#bfdbfe",
// //     items:["Tuna","Salmon","Sardines","Prawns","Crab","Squid","Mackerel","Tilapia"] },
// //   { id:"eggs", label:"Eggs & Dairy", color:"#8b5cf6", bg:"#f5f3ff", border:"#ddd6fe",
// //     items:["Chicken Egg","Duck Egg","Milk","Yogurt","Cheese","Butter"] },
// //   { id:"others", label:"Others", color:"#6b7280", bg:"#f9fafb", border:"#e5e7eb",
// //     items:["Rice","Oats","Lentils","Chickpeas","Almonds","Walnuts","Tofu","Tempeh"] },
// // ];

// // const getBarColor = (v:number) => v>=70?"#22c55e":v>=40?"#f59e0b":"#ef4444";
// // const getBg       = (v:number) => v>=70?"#f0fdf4":v>=40?"#fffbeb":"#fff1f1";
// // const getTextC    = (v:number) => v>=70?"#166534":v>=40?"#92400e":"#dc2626";

// // export default function NutritionPage() {
// //   const [todayLog,  setToday]    = useState<any>(null);
// //   const [weekly,    setWeekly]   = useState<any[]>([]);
// //   const [veggies,   setVeggies]  = useState<any[]>([]);
// //   const [loading,   setLoading]  = useState(true);
// //   const [showModal, setModal]    = useState(false);
// //   const [adding,    setAdding]   = useState(false);
// //   const [error,     setError]    = useState("");

// //   // Multi-select state
// //   const [activeTab, setActiveTab]   = useState("vegetables");
// //   const [selections, setSelections] = useState<Record<string,string>>({}); // itemName -> grams
// //   const [pendingGrams, setPendingGrams] = useState("100");

// //   useEffect(()=>{ loadData(); },[]);

// //   const loadData = async () => {
// //     try {
// //       const [tR,wR,vR] = await Promise.all([nutritionAPI.getToday(),nutritionAPI.getWeekly(),nutritionAPI.getVeggies()]);
// //       setToday(tR.data); setWeekly(wR.data); setVeggies(vR.data);
// //     } catch{}
// //     setLoading(false);
// //   };

// //   const toggleItem = (item:string) => {
// //     setSelections(prev=>{
// //       const n={...prev};
// //       if(n[item]) delete n[item]; else n[item]=pendingGrams||"100";
// //       return n;
// //     });
// //   };

// //   const handleAddAll = async () => {
// //     const items = Object.entries(selections);
// //     if(items.length===0){setError("Select at least one food item.");return;}
// //     setAdding(true); setError("");
// //     try {
// //       // Match against veggies list, add each selected item
// //       for(const [name,grams] of items){
// //         const veg = veggies.find((v:any)=>v.name.toLowerCase()===name.toLowerCase());
// //         if(veg){
// //           const {data}=await nutritionAPI.addEntry(veg.name,Number(grams));
// //           setToday(data.log);
// //         }
// //       }
// //       setSelections({}); setModal(false);
// //     } catch(e:any){
// //       setError(e.response?.data?.message||"Some items could not be added.");
// //     } finally{setAdding(false);}
// //   };

// //   const handleRemove = async (entryId:string) => {
// //     try{const {data}=await nutritionAPI.removeEntry(entryId);setToday(data.log);}catch{}
// //   };

// //   const entries  = todayLog?.entries||[];
// //   const score    = todayLog?.nutrientScore||0;
// //   const calories = todayLog?.totalCalories||0;
// //   const streak   = weekly.filter((w:any)=>w.nutrientScore>0).length||4;

// //   const totals:Record<string,number>={};
// //   entries.forEach((e:any)=>{if(e.nutrients)Object.entries(e.nutrients).forEach(([k,v])=>{totals[k]=(totals[k]||0)+(v as number);});});

// //   const NUTRIENTS=[{key:"vitaminA",label:"Vitamin A"},{key:"vitaminC",label:"Vitamin C"},{key:"iron",label:"Iron"},{key:"calcium",label:"Calcium"},{key:"fiber",label:"Fiber"},{key:"protein",label:"Protein"}];

// //   const activeCat = FOOD_CATEGORIES.find(c=>c.id===activeTab)!;
// //   const selCount  = Object.keys(selections).length;

// //   if(loading) return(
// //     <ConsumerLayout>
// //       <div style={{textAlign:"center",padding:"80px",color:COLOR.muted,fontSize:14,fontWeight:600}}>Loading nutrition data…</div>
// //     </ConsumerLayout>
// //   );

// //   return(
// //     <ConsumerLayout>
// //       <style>{`
// //         @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
// //         .fu{animation:fadeUp .3s ease both}
// //         .card-h:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.09)!important;transition:all .2s}
// //         .btn-h:hover{opacity:.85}
// //         .food-chip:hover{transform:scale(1.03);transition:all .15s}
// //       `}</style>

// //       {/* ── Header ── */}
// //       <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
// //         <div>
// //           <h1 style={{fontSize:22,fontWeight:800,color:COLOR.text,margin:0}}>Nutrition Tracker</h1>
// //           <p style={{fontSize:13,color:COLOR.muted,marginTop:3}}>Log your daily intake and get AI-powered suggestions</p>
// //         </div>
// //         <button className="btn-h" onClick={()=>setModal(true)}
// //           style={{background:"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
// //           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
// //           Log Food
// //         </button>
// //       </div>

// //       {/* ── Stat cards ── */}
// //       <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
// //         {[
// //           {label:"Calories Today", value:calories||"—", sub:"kcal",         accent:"#f59e0b"},
// //           {label:"Nutrient Score", value:`${score}%`,   sub:"daily goal",   accent:"#22c55e"},
// //           {label:"Logging Streak", value:`${streak}d`,  sub:"consecutive",  accent:"#8b5cf6"},
// //         ].map((s,i)=>(
// //           <div key={s.label} className="card-h fu" style={{background:"#fff",borderRadius:16,padding:"20px 22px",border:"1px solid #eeebe4",boxShadow:"0 2px 8px rgba(0,0,0,.04)",position:"relative",overflow:"hidden",animationDelay:`${i*.06}s`}}>
// //             <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.accent,borderRadius:"16px 16px 0 0"}}/>
// //             <div style={{fontSize:11,fontWeight:700,color:COLOR.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{s.label}</div>
// //             <div style={{fontSize:28,fontWeight:800,color:COLOR.text,fontFamily:"'Playfair Display',serif",lineHeight:1,marginBottom:3}}>{s.value}</div>
// //             <div style={{fontSize:11,color:"#9b9590"}}>{s.sub}</div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* ── Score arc ── */}
// //       <div className="fu" style={{background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",borderRadius:18,padding:"22px 28px",marginBottom:22,display:"flex",alignItems:"center",gap:24,color:"#fff",position:"relative",overflow:"hidden"}}>
// //         <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(34,197,94,.08)"}}/>
// //         <div style={{position:"relative",width:80,height:80,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
// //           <svg width="80" height="80" viewBox="0 0 80 80">
// //             <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="7"/>
// //             <circle cx="40" cy="40" r="32" fill="none" stroke="#22c55e" strokeWidth="7"
// //               strokeDasharray={`${2*Math.PI*32*score/100} ${2*Math.PI*32}`}
// //               strokeLinecap="round" transform="rotate(-90 40 40)"/>
// //           </svg>
// //           <div style={{position:"absolute",textAlign:"center"}}>
// //             <div style={{fontSize:17,fontWeight:800,color:"#fff"}}>{score}%</div>
// //           </div>
// //         </div>
// //         <div style={{flex:1}}>
// //           <div style={{fontSize:16,fontWeight:700,marginBottom:5}}>
// //             {score>=70?"Great progress today!":score>0?`${score}% of your daily goal`:"Start logging to track your nutrition"}
// //           </div>
// //           <div style={{fontSize:12,color:"rgba(255,255,255,.7)",lineHeight:1.6}}>
// //             {entries.length>0?`Logged: ${entries.slice(0,3).map((e:any)=>e.vegetable).join(", ")}. Keep going!`:"Log your first food item using the button above."}
// //           </div>
// //         </div>
// //         <button className="btn-h" onClick={()=>setModal(true)} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",borderRadius:9,padding:"9px 16px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>+ Log Food</button>
// //       </div>

// //       {/* ── Today + Nutrients ── */}
// //       <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:20}}>

// //         {/* Today's Intake */}
// //         <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
// //           <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f4f0ec",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
// //             <div style={{fontSize:15,fontWeight:700,color:COLOR.text}}>Today's Intake</div>
// //             <span style={{fontSize:11,color:COLOR.muted}}>{entries.length} item{entries.length!==1?"s":""} logged</span>
// //           </div>
// //           <div style={{padding:"14px 22px"}}>
// //             {entries.length===0?(
// //               <div style={{textAlign:"center",padding:"28px 0",color:"#9b9590"}}>
// //                 <div style={{width:48,height:48,borderRadius:14,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:22}}>🥬</div>
// //                 <div style={{fontSize:13}}>No entries yet</div>
// //                 <button className="btn-h" onClick={()=>setModal(true)} style={{marginTop:10,background:"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Log first item</button>
// //               </div>
// //             ):(
// //               <div style={{display:"flex",flexDirection:"column",gap:8}}>
// //                 {entries.map((e:any,i:number)=>(
// //                   <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"#f8faf8",borderRadius:10}}>
// //                     <span style={{fontSize:22,flexShrink:0}}>{e.emoji||"🥬"}</span>
// //                     <div style={{flex:1}}>
// //                       <div style={{fontSize:13,fontWeight:600,color:COLOR.text}}>{e.vegetable}</div>
// //                       <div style={{fontSize:11,color:COLOR.muted}}>{e.grams}g · {e.calories} kcal</div>
// //                     </div>
// //                     <button onClick={()=>handleRemove(e._id)} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer",fontSize:14,padding:"2px",display:"flex",alignItems:"center",justifyContent:"center"}}>
// //                       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //             <button className="btn-h" onClick={()=>setModal(true)} style={{width:"100%",marginTop:12,padding:"9px",border:"2px dashed #22c55e",borderRadius:10,background:"transparent",color:"#22c55e",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
// //               <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
// //               Add More Food
// //             </button>
// //           </div>
// //         </div>

// //         {/* Nutrient Breakdown */}
// //         <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
// //           <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f4f0ec"}}>
// //             <div style={{fontSize:15,fontWeight:700,color:COLOR.text}}>Nutrient Breakdown</div>
// //           </div>
// //           <div style={{padding:"14px 22px",display:"flex",flexDirection:"column",gap:12}}>
// //             {NUTRIENTS.map(n=>{
// //               const val=Math.min(totals[n.key]||0,100);
// //               return(
// //                 <div key={n.key}>
// //                   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
// //                     <span style={{fontSize:13,fontWeight:500,color:"#374151"}}>{n.label}</span>
// //                     <div style={{display:"flex",alignItems:"center",gap:6}}>
// //                       <span style={{fontSize:13,fontWeight:700,color:getBarColor(val)}}>{val}%</span>
// //                       {val<40&&<span style={{background:"#fee2e2",color:"#dc2626",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:99}}>Low</span>}
// //                     </div>
// //                   </div>
// //                   <div style={{background:"#f0f4f0",borderRadius:4,height:7,overflow:"hidden"}}>
// //                     <div style={{height:"100%",width:`${val}%`,background:getBarColor(val),borderRadius:4,transition:"width .4s"}}/>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </div>

// //       {/* ── Weekly Chart ── */}
// //       <div className="fu" style={{background:"#fff",borderRadius:18,border:"1px solid #eeebe4",boxShadow:"0 2px 10px rgba(0,0,0,.04)",overflow:"hidden"}}>
// //         <div style={{padding:"18px 22px 14px",borderBottom:"1px solid #f4f0ec"}}>
// //           <div style={{fontSize:15,fontWeight:700,color:COLOR.text}}>Weekly Nutrition Score</div>
// //         </div>
// //         <div style={{padding:"18px 22px",display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:10}}>
// //           {(weekly.length>0?weekly:DAYS.map((d,i)=>({date:d,nutrientScore:[0,0,0,0,0,0,0][i]}))).map((w:any,i:number)=>{
// //             const val=w.nutrientScore||0;
// //             const day=w.date?new Date(w.date).toLocaleDateString("en-US",{weekday:"short"}):DAYS[i];
// //             return(
// //               <div key={i} style={{textAlign:"center"}}>
// //                 <div style={{fontSize:11,color:COLOR.muted,marginBottom:6}}>{day}</div>
// //                 <div style={{height:80,background:"#f0f4f0",borderRadius:8,position:"relative",overflow:"hidden"}}>
// //                   <div style={{position:"absolute",bottom:0,left:0,right:0,height:`${val}%`,background:getBarColor(val),borderRadius:"6px 6px 0 0",transition:"height .4s"}}/>
// //                 </div>
// //                 <div style={{fontSize:11,fontWeight:600,marginTop:4,color:val>0?getBarColor(val):"#9ca3af"}}>{val>0?`${val}%`:"–"}</div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* ══════════ ADD FOOD MODAL ══════════ */}
// //       {showModal&&(
// //         <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget){setModal(false);setSelections({});setError("");}}}>
// //           <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:620,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.18)"}}>

// //             {/* Modal header */}
// //             <div style={{padding:"22px 26px 16px",borderBottom:"1px solid #f0ede8",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
// //               <div>
// //                 <h2 style={{fontSize:17,fontWeight:800,color:COLOR.text,margin:0}}>Log Food</h2>
// //                 <p style={{fontSize:12,color:COLOR.muted,margin:"3px 0 0"}}>Select multiple items — they'll all be logged at once</p>
// //               </div>
// //               <button onClick={()=>{setModal(false);setSelections({});setError("");}} style={{background:"#f4f0e8",border:"none",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:15,color:COLOR.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
// //             </div>

// //             {/* Category tabs */}
// //             <div style={{display:"flex",gap:6,padding:"14px 26px 10px",borderBottom:"1px solid #f4f0ec",overflowX:"auto"}}>
// //               {FOOD_CATEGORIES.map(cat=>(
// //                 <button key={cat.id} onClick={()=>setActiveTab(cat.id)}
// //                   style={{padding:"7px 16px",borderRadius:99,border:`1.5px solid ${activeTab===cat.id?cat.color:COLOR.border}`,background:activeTab===cat.id?cat.bg:"transparent",color:activeTab===cat.id?cat.color:COLOR.muted,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>
// //                   {cat.label}
// //                 </button>
// //               ))}
// //             </div>

// //             <div style={{padding:"16px 26px"}}>
// //               {/* Grams input */}
// //               <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:"11px 14px",background:"#f9f7f4",borderRadius:10,border:"1px solid #eeebe4"}}>
// //                 <div style={{fontSize:13,fontWeight:600,color:COLOR.text,flexShrink:0}}>Serving size (grams):</div>
// //                 <input type="number" value={pendingGrams}
// //                   onChange={e=>{setPendingGrams(e.target.value); setSelections(prev=>{ const n={...prev}; Object.keys(n).forEach(k=>n[k]=e.target.value); return n;});}}
// //                   min="10" max="1000" placeholder="100"
// //                   style={{width:80,padding:"6px 10px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:"none",textAlign:"center"}}/>
// //                 <div style={{fontSize:12,color:COLOR.muted}}>grams per item selected</div>
// //               </div>

// //               {/* Food chips grid */}
// //               <div style={{marginBottom:16}}>
// //                 <div style={{fontSize:12,fontWeight:700,color:activeCat.color,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
// //                   <div style={{width:8,height:8,borderRadius:"50%",background:activeCat.color}}/>
// //                   {activeCat.label}
// //                   <span style={{color:COLOR.muted,fontWeight:400,textTransform:"none"}}>— tap to select, tap again to deselect</span>
// //                 </div>
// //                 <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
// //                   {activeCat.items.map(item=>{
// //                     const isSel=!!selections[item];
// //                     // Check if backend has this veggie
// //                     const hasData=veggies.some((v:any)=>v.name.toLowerCase()===item.toLowerCase());
// //                     return(
// //                       <button key={item} className="food-chip btn-h"
// //                         onClick={()=>{ if(hasData||true) toggleItem(item); }}
// //                         style={{
// //                           padding:"8px 14px",borderRadius:99,border:`2px solid ${isSel?activeCat.color:COLOR.border}`,
// //                           background:isSel?activeCat.bg:"#fff",color:isSel?activeCat.color:COLOR.muted,
// //                           fontSize:13,fontWeight:isSel?700:500,cursor:"pointer",transition:"all .15s",
// //                           display:"flex",alignItems:"center",gap:6,
// //                         }}>
// //                         {isSel&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
// //                         {item}
// //                         {isSel&&<span style={{fontSize:10,color:activeCat.color,background:"rgba(0,0,0,.06)",padding:"1px 6px",borderRadius:99}}>{selections[item]}g</span>}
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
// //               </div>

// //               {/* Selected summary */}
// //               {selCount>0&&(
// //                 <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"11px 14px",marginBottom:14}}>
// //                   <div style={{fontSize:12,fontWeight:700,color:"#166534",marginBottom:7}}>
// //                     {selCount} item{selCount>1?"s":""} selected to log:
// //                   </div>
// //                   <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
// //                     {Object.entries(selections).map(([item,grams])=>(
// //                       <span key={item} style={{background:"#fff",border:"1px solid #bbf7d0",color:"#166534",fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:99,display:"flex",alignItems:"center",gap:5}}>
// //                         {item} · {grams}g
// //                         <button onClick={()=>toggleItem(item)} style={{background:"none",border:"none",color:"#9ca3af",cursor:"pointer",padding:0,display:"flex",alignItems:"center"}}>
// //                           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
// //                         </button>
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {error&&<div style={{padding:"10px 13px",borderRadius:8,marginBottom:12,background:"#fff1f1",color:"#dc2626",fontSize:13,fontWeight:600}}>{error}</div>}

// //               <div style={{display:"flex",gap:10}}>
// //                 <button className="btn-h" onClick={()=>{setModal(false);setSelections({});setError("");}} style={{flex:1,padding:"11px",background:"#f4f0e8",border:"none",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer",color:COLOR.muted}}>Cancel</button>
// //                 <button className="btn-h" onClick={handleAddAll} disabled={adding||selCount===0}
// //                   style={{flex:2,padding:"11px",background:selCount===0||adding?"#a7f3d0":"linear-gradient(135deg,#1a3a2a,#22c55e)",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:selCount===0||adding?"not-allowed":"pointer"}}>
// //                   {adding?"Logging…":`Log ${selCount} item${selCount>1?"s":""}`}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </ConsumerLayout>
// //   );
// // }

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { diseaseAPI } from "@/lib/axios-proxy";
// import { PageHeader } from "@/app/components/BackButton";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Treatment { name: string; dosage: string; instruction?: string; warning?: string; }
// interface ScanResult {
//   _id: string; cropName: string; imageUrl: string;
//   diseaseName: string; scientificName: string;
//   confidence: number; severity: "None" | "Low" | "Medium" | "High";
//   isHealthy: boolean; symptoms: string; preventionTips: string; detailedAnalysis?: string;
//   organicTreatments: Treatment[]; chemicalTreatments: Treatment[];
//   status: string; createdAt: string;
// }

// // ─── Constants ────────────────────────────────────────────────────────────────
// const SEV_COLOR: Record<string, string> = { None: "#16a34a", Low: "#16a34a", Medium: "#d97706", High: "#dc2626" };
// const SEV_BG:    Record<string, string> = { None: "#f0fdf4", Low: "#f0fdf4", Medium: "#fffbeb", High: "#fff1f1" };
// const SEV_W:     Record<string, string> = { None: "8%",     Low: "28%",     Medium: "62%",     High: "92%"     };

// const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
//   Pending:    { bg: "#fffbeb", color: "#d97706" },
//   Treated:    { bg: "#eff6ff", color: "#1d4ed8" },
//   Resolved:   { bg: "#f0fdf4", color: "#16a34a" },
//   Monitoring: { bg: "#f5f3ff", color: "#7c3aed" },
// };

// const NAV = [
//   { label: "Overview",    href: "/dashboard/farmer"             },
//   { label: "Crop Doctor", href: "/dashboard/farmer/crop-doctor" },
//   { label: "My Products", href: "/dashboard/farmer/products"    },
//   { label: "Orders",      href: "/dashboard/farmer/orders"      },
//   { label: "Weather",     href: "/dashboard/farmer/weather"     },
//   { label: "Earnings",    href: "/dashboard/farmer/earnings"    },
// ];

// const Icon = ({ d, size = 18, style }: { d: string; size?: number; style?: React.CSSProperties }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
//     strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
//     <path d={d} />
//   </svg>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// export default function CropDoctorPage() {
//   const router   = useRouter();
//   const pathname = usePathname();

//   const [user,        setUser]      = useState<{ name: string } | null>(null);
//   const [cropName,    setCropName]  = useState("");
//   // ✅ FIX 1: symptoms is now a controlled React state (was an uncontrolled DOM read via getElementById)
//   const [symptoms,    setSymptoms]  = useState("");
//   const [file,        setFile]      = useState<File | null>(null);
//   const [preview,     setPreview]   = useState("");
//   const [loading,     setLoading]   = useState(false);
//   const [error,       setError]     = useState("");
//   const [result,      setResult]    = useState<ScanResult | null>(null);
//   const [activeTab,   setActiveTab] = useState<"organic" | "chemical">("organic");
//   const [history,     setHistory]   = useState<ScanResult[]>([]);
//   const [histLoading, setHistLoad]  = useState(false);
//   const [logOpen,     setLogOpen]   = useState(false);
//   const [logNote,     setLogNote]   = useState("");
//   const [logStatus,   setLogStatus] = useState("Treated");
//   const [logSaving,   setLogSaving] = useState(false);
//   const [aiPowered,   setAiPowered] = useState(false);

//   const fileRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("agriai_user");
//     const token  = localStorage.getItem("agriai_token");
//     if (!stored || !token) { router.push("/"); return; }
//     const u = JSON.parse(stored);
//     if (u.role !== "farmer" && u.role !== "admin") { router.push("/"); return; }
//     setUser(u);
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     setHistLoad(true);
//     try {
//       const { data } = await diseaseAPI.getMy();
//       setHistory(Array.isArray(data) ? data : []);
//     } catch {}
//     setHistLoad(false);
//   };

//   const handleFile = (f: File) => {
//     setFile(f);
//     setPreview(URL.createObjectURL(f));
//     setResult(null);
//     setError("");
//     setAiPowered(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     const f = e.dataTransfer.files[0];
//     if (f && f.type.startsWith("image/")) handleFile(f);
//   };

//   // ✅ FIX 2: reads `symptoms` state directly — no more document.getElementById hack
//   // ✅ FIX 3: sends field as "notes" to match req.body.notes in diseaseController.js
//   const handleScan = async () => {
//     if (!file)            { setError("Please upload a crop photo first."); return; }
//     if (!cropName.trim()) { setError("Please enter the crop name."); return; }
//     if (!symptoms.trim()) {
//       setError("Please describe the symptoms — Cerebras AI uses this to diagnose your crop accurately.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setResult(null);

//     try {
//       const formData = new FormData();
//       formData.append("image",    file);
//       formData.append("cropName", cropName.trim());
//       formData.append("notes",    symptoms.trim()); // ✅ "notes" matches req.body.notes in controller

//       const { data } = await diseaseAPI.scan(formData);
//       setResult(data.scan);
//       setAiPowered(data.aiPowered ?? false);
//       setHistory(prev => [data.scan, ...prev.filter(s => s._id !== data.scan._id)]);
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Scan failed. Is the backend running?");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogTreatment = async () => {
//     if (!result) return;
//     setLogSaving(true);
//     try {
//       await diseaseAPI.updateStatus(result._id, logStatus, logNote);
//       setResult(prev => prev ? { ...prev, status: logStatus } : prev);
//       setHistory(prev => prev.map(s => s._id === result._id ? { ...s, status: logStatus } : s));
//       setLogOpen(false);
//       setLogNote("");
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Failed to save log.");
//     } finally {
//       setLogSaving(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("agriai_token");
//     localStorage.removeItem("agriai_user");
//     router.push("/");
//   };

//   // Clears the whole form back to initial state
//   const resetForm = () => {
//     setFile(null); setPreview(""); setResult(null);
//     setError(""); setSymptoms(""); setCropName(""); setAiPowered(false);
//   };

//   const fmtDate    = (d: string) => new Date(d).toLocaleDateString("en-CA");
//   const getInitial = () => (user?.name || "F")[0].toUpperCase();

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: "#f2efe8" }}>
//       <style>{`
//         @keyframes spin   { to { transform: rotate(360deg); } }
//         @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
//         .fu         { animation: fadeUp .3s ease both; }
//         .btn-h:hover   { opacity: .82; }
//         .card-h:hover  { transform:translateY(-2px); box-shadow:0 10px 30px rgba(26,58,42,.12)!important; transition:all .2s; }
//         .nav-btn:hover { background:rgba(106,170,120,.1)!important; color:rgba(255,255,255,.9)!important; }
//         .row-h:hover   { background:#f8f5f0!important; }
//         .spinner { width:16px;height:16px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite; }
//         .dot0 { animation:bounce .8s ease-in-out 0s infinite alternate; }
//         .dot1 { animation:bounce .8s ease-in-out .15s infinite alternate; }
//         .dot2 { animation:bounce .8s ease-in-out .3s infinite alternate; }
//         input:focus, textarea:focus, select:focus {
//           border-color:#6aaa78!important;
//           box-shadow:0 0 0 3px rgba(106,170,120,.15);
//         }
//       `}</style>

//       {/* ════ SIDEBAR ════ */}
//       <aside style={{
//         width: 200, background: "linear-gradient(185deg,#1a3a2a 0%,#0f2418 100%)",
//         display: "flex", flexDirection: "column",
//         position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
//         boxShadow: "4px 0 20px rgba(0,0,0,.15)",
//       }}>
//         <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
//           <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 22, color: "#fff" }}>
//             Ag<span style={{ color: "#6aaa78" }}>real</span>
//           </div>
//         </div>

//         <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div style={{
//               width: 36, height: 36, borderRadius: "50%",
//               background: "linear-gradient(135deg,#6aaa78,#2d5a3d)",
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: 14, fontWeight: 700, color: "#fff", border: "2px solid rgba(255,255,255,.15)",
//             }}>{getInitial()}</div>
//             <div>
//               <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.name || "Farmer"}</div>
//               <div style={{ color: "rgba(255,255,255,.4)", fontSize: 10 }}>My Farm</div>
//             </div>
//           </div>
//         </div>

//         <div style={{ padding: "10px 4px 4px 10px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.2)", textTransform: "uppercase", letterSpacing: ".1em" }}>Navigation</div>

//         <nav style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
//           {NAV.map(item => {
//             const active = pathname === item.href;
//             return (
//               <button key={item.href} onClick={() => router.push(item.href)} className="nav-btn"
//                 style={{
//                   width: "100%", display: "flex", alignItems: "center", gap: 10,
//                   padding: "9px 12px", border: "none", borderRadius: 9, marginBottom: 2,
//                   background: active ? "rgba(106,170,120,.18)" : "transparent",
//                   color: active ? "#fff" : "rgba(255,255,255,.5)",
//                   fontSize: 13, fontWeight: active ? 600 : 400,
//                   cursor: "pointer", transition: "all .15s", textAlign: "left", position: "relative",
//                 }}>
//                 {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, background: "#6aaa78", borderRadius: "0 3px 3px 0" }} />}
//                 {item.label}
//                 {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6aaa78" }} />}
//               </button>
//             );
//           })}
//         </nav>

//         <div style={{ padding: "8px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
//           <button onClick={handleLogout} className="nav-btn"
//             style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "none", background: "transparent", color: "#f87171", fontSize: 13, cursor: "pointer", fontWeight: 600, borderRadius: 9 }}>
//             <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={15} />
//             Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* ════ MAIN ════ */}
//       <main style={{ marginLeft: 200, flex: 1, padding: "28px 32px" }}>

//         {/* ── Page header ── */}
//         <div className="fu" style={{ marginBottom: 24 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={20} style={{ color: "#6aaa78" }} />
//             </div>
//             <div>
//               <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a3a2a", margin: 0 }}>
//                 <PageHeader title="Crop Doctor" backTo="/dashboard/farmer" subtitle="Upload a photo of your crop for AI diagnosis" />
//               </h1>
//               <p style={{ fontSize: 13, color: "#6b8070", margin: 0 }}>Powered by Cerebras AI — instant plant disease detection</p>
//             </div>
//             {/* ✅ FIX 4: Badge now correctly says "Cerebras AI" */}
//             <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", borderRadius: 99, padding: "5px 14px" }}>
//               <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6aaa78" }} />
//               <span style={{ fontSize: 11, fontWeight: 700, color: "#6aaa78" }}>Cerebras AI Active</span>
//             </div>
//           </div>
//         </div>

//         {/* ── 2-column grid ── */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

//           {/* ════ UPLOAD CARD ════ */}
//           <div className="fu" style={{ background: "#fff", borderRadius: 18, padding: "24px", border: "1px solid #eeebe4", boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
//               <Icon d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" size={18} style={{ color: "#6aaa78" }} />
//               <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a3a2a", margin: 0 }}>Scan Your Crop</h2>
//             </div>

//             {/* Crop name */}
//             <div style={{ marginBottom: 14 }}>
//               <label style={{ fontSize: 10, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 5 }}>
//                 Crop Name *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Tomato, Chili, Broccoli, Spinach…"
//                 value={cropName}
//                 onChange={e => setCropName(e.target.value)}
//                 style={{
//                   width: "100%", padding: "10px 13px",
//                   border: "1.5px solid #e0ddd6", borderRadius: 9,
//                   fontFamily: "'DM Sans',sans-serif", fontSize: 14,
//                   color: "#1a3a2a", background: "#f9f7f4", outline: "none",
//                   boxSizing: "border-box", transition: "border-color .15s",
//                 }}
//               />
//             </div>

//             {/* ✅ FIX 5: Fully controlled textarea — value + onChange properly wired */}
//             <div style={{ marginBottom: 14 }}>
//               <label style={{ fontSize: 10, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 5 }}>
//                 Symptoms Description *
//               </label>
//               <textarea
//                 placeholder="e.g. Yellow spots on leaves, brown edges, wilting stems, white powder on surface…"
//                 value={symptoms}
//                 onChange={e => setSymptoms(e.target.value)}
//                 rows={3}
//                 style={{
//                   width: "100%", padding: "10px 13px",
//                   border: "1.5px solid #e0ddd6", borderRadius: 9,
//                   fontFamily: "'DM Sans',sans-serif", fontSize: 13,
//                   color: "#1a3a2a", background: "#f9f7f4", outline: "none",
//                   boxSizing: "border-box", resize: "vertical", lineHeight: 1.6,
//                   transition: "border-color .15s",
//                 }}
//               />
//               <div style={{ fontSize: 11, color: "#9b9086", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
//                 <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={12} style={{ color: "#6aaa78", flexShrink: 0 }} />
//                 Cerebras AI uses this — be as specific as possible for better accuracy
//               </div>
//             </div>

//             {/* Drop zone */}
//             <div
//               onDrop={handleDrop}
//               onDragOver={e => e.preventDefault()}
//               onClick={() => !loading && fileRef.current?.click()}
//               style={{
//                 border: `2px dashed ${preview ? "#6aaa78" : "#d4d0c8"}`,
//                 borderRadius: 14, padding: preview ? "14px" : "36px 20px",
//                 textAlign: "center", cursor: loading ? "not-allowed" : "pointer",
//                 background: preview ? "#f4f8f4" : "#fafaf7",
//                 transition: "all .2s", marginBottom: 14, overflow: "hidden",
//               }}>
//               {preview ? (
//                 <div style={{ position: "relative" }}>
//                   <img src={preview} alt="crop preview"
//                     style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 10, display: "block" }} />
//                   <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(26,58,42,.85)", color: "#fff", borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700 }}>
//                     {file?.name?.slice(0, 22)}
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f0f8f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
//                     <Icon d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" size={24} style={{ color: "#6aaa78" }} />
//                   </div>
//                   <div style={{ fontSize: 14, fontWeight: 700, color: "#1a3a2a", marginBottom: 4 }}>Upload Crop Photo</div>
//                   <div style={{ fontSize: 12, color: "#9b9086" }}>Click or drag & drop — JPG, PNG, WebP · Max 5MB</div>
//                 </>
//               )}
//               <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
//                 style={{ display: "none" }}
//                 onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
//             </div>

//             {/* Action buttons */}
//             {!preview ? (
//               <button className="btn-h" onClick={() => fileRef.current?.click()}
//                 style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 9, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                 <Icon d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" size={16} />
//                 Choose Photo
//               </button>
//             ) : (
//               <button className="btn-h" onClick={handleScan} disabled={loading}
//                 style={{ width: "100%", padding: "12px", background: loading ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 9, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
//                 {loading
//                   ? <><div className="spinner" />Analyzing with Cerebras AI…</>
//                   : <><Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={16} />Analyze with Cerebras AI</>
//                 }
//               </button>
//             )}

//             {/* Thinking animation */}
//             {loading && (
//               <div style={{ marginTop: 14, padding: "12px 16px", background: "#f0f8f2", borderRadius: 10, border: "1px solid #c8e6c9", display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{ display: "flex", gap: 5 }}>
//                   <div className="dot0" style={{ width: 7, height: 7, borderRadius: "50%", background: "#6aaa78" }} />
//                   <div className="dot1" style={{ width: 7, height: 7, borderRadius: "50%", background: "#6aaa78" }} />
//                   <div className="dot2" style={{ width: 7, height: 7, borderRadius: "50%", background: "#6aaa78" }} />
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 12, fontWeight: 700, color: "#2d5a3d" }}>Cerebras is analyzing your crop…</div>
//                   <div style={{ fontSize: 11, color: "#4a7a5a" }}>Applying high-volume inference to your symptom description</div>
//                 </div>
//               </div>
//             )}

//             {/* Error message */}
//             {error && (
//               <div style={{ marginTop: 12, padding: "10px 13px", background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: 9, color: "#c0392b", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
//                 <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={15} style={{ color: "#c0392b", flexShrink: 0 }} />
//                 {error}
//               </div>
//             )}

//             {preview && (
//               <button className="btn-h" onClick={resetForm}
//                 style={{ width: "100%", marginTop: 10, padding: "9px", background: "transparent", border: "1.5px solid #e0ddd6", borderRadius: 9, color: "#9b9086", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
//                 ↺ Change Photo
//               </button>
//             )}
//           </div>

//           {/* ════ DIAGNOSIS CARD ════ */}
//           <div className="fu" style={{ background: "#fff", borderRadius: 18, padding: "24px", border: "1px solid #eeebe4", boxShadow: "0 2px 10px rgba(0,0,0,.05)", display: "flex", flexDirection: "column" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
//               <Icon d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" size={18} style={{ color: "#6aaa78" }} />
//               <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a3a2a", margin: 0 }}>AI Diagnosis</h2>
//               {/* ✅ FIX 4: Correctly reads "Cerebras AI" instead of "Gemini AI" */}
//               {aiPowered && result && (
//                 <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 99, padding: "3px 10px" }}>
//                   <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
//                   <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a" }}>Cerebras AI</span>
//                 </div>
//               )}
//             </div>

//             {/* Empty state */}
//             {!result ? (
//               <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "#c0bdb5", minHeight: 260 }}>
//                 <div style={{ width: 64, height: 64, borderRadius: 18, background: "#f4f0e8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
//                   <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={28} style={{ color: "#c0bdb5" }} />
//                 </div>
//                 <div style={{ fontSize: 14, fontWeight: 600, color: "#9b9086", marginBottom: 4 }}>No diagnosis yet</div>
//                 <div style={{ fontSize: 12, color: "#b0ada8", textAlign: "center", maxWidth: 220 }}>
//                   Fill in crop name, describe symptoms, upload a photo, then click Analyze
//                 </div>
//               </div>
//             ) : (
//               <div style={{ flex: 1, overflowY: "auto" }}>

//                 {/* Result header */}
//                 <div style={{ padding: "16px", borderRadius: 14, marginBottom: 16, background: result.isHealthy ? "#f0fdf4" : SEV_BG[result.severity] || "#fffbeb", border: `1px solid ${result.isHealthy ? "#bbf7d0" : "#e0ddd6"}` }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: result.isHealthy ? "#22c55e" : SEV_COLOR[result.severity], display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       {result.isHealthy
//                         ? <Icon d="M5 13l4 4L19 7" size={20} style={{ color: "#fff" }} />
//                         : <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={20} style={{ color: "#fff" }} />
//                       }
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: 17, fontWeight: 800, color: "#1a3a2a" }}>
//                         {result.isHealthy ? "Crop is Healthy! ✓" : result.diseaseName}
//                       </div>
//                       {result.scientificName && !result.isHealthy && (
//                         <div style={{ fontSize: 11, color: "#6b8070", fontStyle: "italic", marginTop: 1 }}>{result.scientificName}</div>
//                       )}
//                       <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
//                         <div style={{ fontSize: 11, color: "#9b9086" }}>Confidence:</div>
//                         <div style={{ flex: 1, background: "rgba(0,0,0,.06)", borderRadius: 99, height: 5, overflow: "hidden" }}>
//                           <div style={{ height: "100%", width: `${result.confidence}%`, background: result.isHealthy ? "#22c55e" : SEV_COLOR[result.severity], borderRadius: 99, transition: "width .8s ease" }} />
//                         </div>
//                         <span style={{ fontSize: 12, fontWeight: 700, color: result.isHealthy ? "#16a34a" : SEV_COLOR[result.severity] }}>{result.confidence}%</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Severity bar */}
//                 {!result.isHealthy && (
//                   <div style={{ marginBottom: 16 }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
//                       <span style={{ fontSize: 12, fontWeight: 600, color: "#1a3a2a" }}>Disease Severity</span>
//                       <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: SEV_BG[result.severity], color: SEV_COLOR[result.severity] }}>{result.severity}</span>
//                     </div>
//                     <div style={{ background: "#f0ede8", borderRadius: 99, height: 8, overflow: "hidden" }}>
//                       <div style={{ height: "100%", width: SEV_W[result.severity], background: `linear-gradient(90deg,#16a34a,${SEV_COLOR[result.severity]})`, borderRadius: 99, transition: "width 1s ease" }} />
//                     </div>
//                   </div>
//                 )}

//                 {/* Observed symptoms */}
//                 {result.symptoms && !result.isHealthy && (
//                   <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f9f7f4", borderRadius: 10, border: "1px solid #eeebe4" }}>
//                     <div style={{ fontSize: 10, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Observed Symptoms</div>
//                     <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{result.symptoms}</div>
//                   </div>
//                 )}

//                 {/* Detailed analysis */}
//                 {!result.isHealthy && result.detailedAnalysis && (
//                   <div style={{ marginBottom: 16, padding: "14px 16px", background: "#f4f8f4", borderRadius: 12, border: "1px solid #c8e6c9" }}>
//                     <div style={{ fontSize: 10, fontWeight: 700, color: "#2d5a3d", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
//                       <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={12} style={{ color: "#6aaa78" }} />
//                       Expert Analysis
//                     </div>
//                     <div style={{ fontSize: 13, color: "#1a3a2a", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{result.detailedAnalysis}</div>
//                   </div>
//                 )}

//                 {/* Treatments */}
//                 {!result.isHealthy && (
//                   <>
//                     <div style={{ marginBottom: 12 }}>
//                       <div style={{ fontSize: 12, fontWeight: 600, color: "#1a3a2a", marginBottom: 8 }}>Recommended Treatment</div>
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#f4f0e8", borderRadius: 99, padding: 3, marginBottom: 12 }}>
//                         {(["organic", "chemical"] as const).map(tab => (
//                           <button key={tab} onClick={() => setActiveTab(tab)} className="btn-h"
//                             style={{ padding: "8px", borderRadius: 99, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, background: activeTab === tab ? "#fff" : "transparent", color: activeTab === tab ? "#1a3a2a" : "#6b8070", boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,.08)" : "none", transition: "all .18s" }}>
//                             {tab === "organic" ? "🌿 Organic" : "🧪 Chemical"}
//                           </button>
//                         ))}
//                       </div>

//                       <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
//                         {(activeTab === "organic" ? result.organicTreatments : result.chemicalTreatments).map((t, i) => (
//                           <div key={i} style={{ padding: "13px", background: "#f9f7f4", borderRadius: 11, border: "1px solid #eeebe4" }}>
//                             <div style={{ fontSize: 14, fontWeight: 700, color: "#1a3a2a", marginBottom: 3 }}>{t.name}</div>
//                             <div style={{ fontSize: 12, color: "#6b8070", marginBottom: t.instruction || t.warning ? 5 : 0 }}>
//                               Dosage: <strong>{t.dosage}</strong>
//                             </div>
//                             {t.instruction && (
//                               <div style={{ fontSize: 12, color: "#2d5a3d", display: "flex", gap: 5, alignItems: "flex-start" }}>
//                                 <Icon d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={13} style={{ color: "#6aaa78", flexShrink: 0, marginTop: 1 }} />
//                                 {t.instruction}
//                               </div>
//                             )}
//                             {t.warning && (
//                               <div style={{ fontSize: 12, color: "#d97706", marginTop: 4, display: "flex", gap: 5, alignItems: "flex-start" }}>
//                                 <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={13} style={{ color: "#d97706", flexShrink: 0, marginTop: 1 }} />
//                                 {t.warning}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Prevention tips */}
//                     {result.preventionTips && (
//                       <div style={{ marginBottom: 12, padding: "12px 14px", background: "#f0f8f2", borderRadius: 10, border: "1px solid #c8e6c9" }}>
//                         <div style={{ fontSize: 10, fontWeight: 700, color: "#2d5a3d", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Prevention Tips</div>
//                         <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7 }}>{result.preventionTips}</div>
//                       </div>
//                     )}

//                     <button className="btn-h" onClick={() => setLogOpen(true)}
//                       style={{ width: "100%", padding: "10px", background: "#f4f0e8", border: "1.5px solid #d4d0c8", borderRadius: 9, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#1a3a2a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
//                       <Icon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" size={14} />
//                       Log Treatment Progress
//                     </button>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── Scan History ── */}
//         <div className="fu" style={{ background: "#fff", borderRadius: 18, padding: "22px 24px", border: "1px solid #eeebe4", boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size={17} style={{ color: "#6aaa78" }} />
//               <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a3a2a", margin: 0 }}>Scan History</h2>
//             </div>
//             <span style={{ fontSize: 12, color: "#9b9086" }}>{history.length} total scan{history.length !== 1 ? "s" : ""}</span>
//           </div>

//           {histLoading ? (
//             <div style={{ textAlign: "center", padding: "40px", color: "#9b9086" }}>Loading history…</div>
//           ) : history.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "48px", color: "#c0bdb5" }}>
//               <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f4f0e8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
//                 <Icon d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" size={24} style={{ color: "#c0bdb5" }} />
//               </div>
//               <div style={{ fontSize: 14, color: "#9b9086", fontWeight: 600 }}>No scans yet</div>
//               <div style={{ fontSize: 12, color: "#b0ada8", marginTop: 3 }}>Upload a crop photo to get started</div>
//             </div>
//           ) : (
//             <>
//               <div style={{ display: "grid", gridTemplateColumns: "96px 1fr 1fr 90px 110px", gap: 12, padding: "7px 12px", marginBottom: 4, fontSize: 10, fontWeight: 700, color: "#b0ada8", textTransform: "uppercase", letterSpacing: ".07em", borderBottom: "1px solid #f0ede8" }}>
//                 <span>Date</span><span>Crop</span><span>Disease</span><span>Severity</span><span>Status</span>
//               </div>
//               {history.map(s => (
//                 <div key={s._id} onClick={() => { setResult(s); setAiPowered(true); }} className="row-h"
//                   style={{ display: "grid", gridTemplateColumns: "96px 1fr 1fr 90px 110px", gap: 12, padding: "11px 12px", borderRadius: 9, cursor: "pointer", transition: "background .12s", alignItems: "center" }}>
//                   <span style={{ fontSize: 11, color: "#9b9086" }}>{fmtDate(s.createdAt)}</span>
//                   <div style={{ fontSize: 13, fontWeight: 600, color: "#1a3a2a" }}>{s.cropName}</div>
//                   <span style={{ fontSize: 13, color: "#6b8070", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                     {s.isHealthy ? "✓ Healthy" : s.diseaseName}
//                   </span>
//                   <span style={{ fontSize: 11, fontWeight: 700, color: SEV_COLOR[s.severity] || "#6b8070", background: SEV_BG[s.severity] || "#f9f7f4", padding: "2px 9px", borderRadius: 99, textAlign: "center" }}>
//                     {s.severity}
//                   </span>
//                   <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, display: "inline-block", background: STATUS_STYLE[s.status]?.bg || "#f4f0e8", color: STATUS_STYLE[s.status]?.color || "#6b8070" }}>
//                     {s.status}
//                   </span>
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       </main>

//       {/* ════ LOG TREATMENT MODAL ════ */}
//       {logOpen && (
//         <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
//           onClick={e => { if (e.target === e.currentTarget) setLogOpen(false); }}>
//           <div style={{ background: "#fff", borderRadius: 18, padding: "26px 28px", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,.18)" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
//               <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a3a2a", margin: 0 }}>Log Treatment Progress</h3>
//               <button onClick={() => setLogOpen(false)} style={{ background: "#f4f0e8", border: "none", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 15, color: "#9b9086", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
//             </div>

//             <div style={{ marginBottom: 14 }}>
//               <label style={{ fontSize: 10, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 5 }}>Update Status</label>
//               <select value={logStatus} onChange={e => setLogStatus(e.target.value)}
//                 style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e0ddd6", borderRadius: 9, fontFamily: "'DM Sans',sans-serif", fontSize: 14, background: "#f9f7f4", outline: "none", color: "#1a3a2a" }}>
//                 <option value="Treated">Treated</option>
//                 <option value="Monitoring">Monitoring</option>
//                 <option value="Resolved">Resolved</option>
//               </select>
//             </div>

//             <div style={{ marginBottom: 20 }}>
//               <label style={{ fontSize: 10, fontWeight: 700, color: "#9b9086", textTransform: "uppercase", letterSpacing: ".07em", display: "block", marginBottom: 5 }}>Notes (optional)</label>
//               <textarea value={logNote} onChange={e => setLogNote(e.target.value)}
//                 placeholder="e.g. Applied Neem Oil spray on all leaves…" rows={3}
//                 style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e0ddd6", borderRadius: 9, fontFamily: "'DM Sans',sans-serif", fontSize: 13, background: "#f9f7f4", outline: "none", resize: "none", boxSizing: "border-box", color: "#1a3a2a" }} />
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
//               <button className="btn-h" onClick={() => setLogOpen(false)}
//                 style={{ padding: "11px", background: "transparent", border: "1.5px solid #e0ddd6", borderRadius: 9, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#9b9086", cursor: "pointer" }}>
//                 Cancel
//               </button>
//               <button className="btn-h" onClick={handleLogTreatment} disabled={logSaving}
//                 style={{ padding: "11px", background: logSaving ? "#a8d5b5" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)", color: "#fff", border: "none", borderRadius: 9, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
//                 {logSaving ? <><div className="spinner" />Saving…</> : "Save Log"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { nutritionAPI } from "@/lib/axios-proxy";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AiAdvice {
  summary: string;
  deficiencyAlert: string | null;
  recommendations: string[];
  tomorrowPlan: { meal: string; suggestion: string; benefit: string }[];
  tipOfDay: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const FOOD_CATEGORIES = [
  { id: "vegetables", label: "Vegetables",   color: "#22c55e", bg: "#f0fdf4",
    items: ["Carrot","Spinach","Broccoli","Bell Pepper","Tomato","Kale","Cucumber","Onion","Potato","Cabbage","Beetroot","Corn","Bitter Gourd","Drumstick","Sweet Potato"] },
  { id: "fruits",     label: "Fruits",       color: "#f59e0b", bg: "#fffbeb",
    items: ["Mango","Banana","Orange","Papaya"] },
  { id: "seafood",    label: "Seafood",      color: "#3b82f6", bg: "#eff6ff",
    items: ["Tuna","Salmon","Sardines","Prawns"] },
  { id: "eggs",       label: "Eggs & Dairy", color: "#8b5cf6", bg: "#f5f3ff",
    items: ["Chicken Egg","Milk","Yogurt"] },
  { id: "others",     label: "Others",       color: "#6b7280", bg: "#f9fafb",
    items: ["Rice","Lentils","Chickpeas","Almonds","Tofu"] },
];

const NUTRIENTS = [
  { key: "vitaminA", label: "Vitamin A", icon: "🟠" },
  { key: "vitaminC", label: "Vitamin C", icon: "🟡" },
  { key: "iron",     label: "Iron",      icon: "🔴" },
  { key: "calcium",  label: "Calcium",   icon: "🟤" },
  { key: "fiber",    label: "Fiber",     icon: "🟢" },
  { key: "protein",  label: "Protein",   icon: "🔵" },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const getBarColor = (v: number) => v >= 70 ? "#22c55e" : v >= 40 ? "#f59e0b" : "#ef4444";
const C = { text: "#111827", muted: "#6b7280", border: "#e8ede8" };

// ─────────────────────────────────────────────────────────────────────────────
export default function NutritionPage() {
  const [todayLog,    setToday]     = useState<any>(null);
  const [weekly,      setWeekly]    = useState<any[]>([]);
  const [veggies,     setVeggies]   = useState<any[]>([]);
  const [loading,     setLoading]   = useState(true);
  const [showModal,   setModal]     = useState(false);
  const [adding,      setAdding]    = useState(false);
  const [formError,   setFormError] = useState("");

  const [aiAdvice,   setAiAdvice]   = useState<AiAdvice | null>(null);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [aiError,    setAiError]    = useState("");
  const [aiExpanded, setAiExpanded] = useState(true);

  const [activeTab,    setActiveTab]    = useState("vegetables");
  const [selections,   setSelections]   = useState<Record<string, string>>({});
  const [pendingGrams, setPendingGrams] = useState("100");

  // ── Load data ─────────────────────────────────────────────────────────────
  // ✅ Exact URLs from axios-proxy:
  //   getVeggies  → GET /api/nutrition/vegetables
  //   getToday    → GET /api/nutrition/today
  //   getWeekly   → GET /api/nutrition/weekly
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tR, wR, vR] = await Promise.all([
        nutritionAPI.getToday(),
        nutritionAPI.getWeekly(),
        nutritionAPI.getVeggies(),
      ]);
      setToday(tR.data);
      setWeekly(wR.data);
      setVeggies(vR.data);
    } catch (e) {
      console.error("Nutrition load failed:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Cerebras AI advice ────────────────────────────────────────────────────
  // ✅ GET /api/nutrition/ai-advice
  const fetchAiAdvice = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const { data } = await nutritionAPI.getAiAdvice();
      if (data.advice) {
        setAiAdvice(data.advice);
        if (!data.success) setAiError("Using fallback — check CEREBRAS_API_KEY in .env");
      }
    } catch (e: any) {
      setAiError(e.response?.data?.message || "AI advice failed. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // ── Food logging ──────────────────────────────────────────────────────────
  const toggleItem = (item: string) => {
    setSelections(prev => {
      const n = { ...prev };
      if (n[item]) delete n[item]; else n[item] = pendingGrams || "100";
      return n;
    });
  };

  // ✅ addEntry  → POST /api/nutrition/entry
  // ✅ removeEntry → DELETE /api/nutrition/entry/:entryId
  const handleAddAll = async () => {
    const items = Object.entries(selections);
    if (!items.length) { setFormError("Select at least one item."); return; }
    setAdding(true); setFormError("");
    try {
      let latest: any = null;
      for (const [name, grams] of items) {
        const veg = veggies.find((v: any) => v.name.toLowerCase() === name.toLowerCase());
        if (veg) {
          const { data } = await nutritionAPI.addEntry(veg.name, Number(grams));
          latest = data.log;
        }
      }
      if (latest) setToday(latest);
      setSelections({}); setModal(false); setAiAdvice(null);
    } catch (e: any) {
      setFormError(e.response?.data?.message || "Could not add some items.");
    } finally { setAdding(false); }
  };

  const handleRemove = async (entryId: string) => {
    try {
      const { data } = await nutritionAPI.removeEntry(entryId);
      setToday(data.log); setAiAdvice(null);
    } catch {}
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const entries   = todayLog?.entries      || [];
  const score     = todayLog?.nutrientScore || 0;
  const calories  = todayLog?.totalCalories || 0;
  const streak    = weekly.filter((w: any) => w.nutrientScore > 0).length || 0;
  const activeCat = FOOD_CATEGORIES.find(c => c.id === activeTab)!;
  const selCount  = Object.keys(selections).length;

  const totals: Record<string, number> = {};
  entries.forEach((e: any) => {
    if (e.nutrients) Object.entries(e.nutrients).forEach(([k, v]) => {
      totals[k] = (totals[k] || 0) + (v as number);
    });
  });

  if (loading) return (
    <ConsumerLayout>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300, color:C.muted, fontSize:14, fontWeight:600 }}>
        Loading nutrition data…
      </div>
    </ConsumerLayout>
  );

  return (
    <ConsumerLayout>
      <style>{`
        @keyframes nu-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nu-pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
        .nu-fu   { animation:nu-fadeup .3s ease both; }
        .nu-card { transition:box-shadow .18s,transform .18s; }
        .nu-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.08)!important; }
        .nu-btn:hover  { opacity:.85; }
        .nu-food:hover { transform:scale(1.03); }
        .nu-pulse { animation:nu-pulse 1.4s ease infinite; }
      `}</style>

      {/* Header */}
      <div className="nu-fu" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:C.text, margin:0 }}>Nutrition Tracker</h1>
          <p style={{ fontSize:13, color:C.muted, marginTop:3 }}>Log your daily intake and get AI-powered suggestions</p>
        </div>
        <button className="nu-btn" onClick={() => setModal(true)}
          style={{ background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
          + Log Food
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
        {[
          { label:"Calories Today", value: calories || "—", sub:"kcal",      accent:"#f59e0b" },
          { label:"Nutrient Score", value:`${score}%`,      sub:"daily goal", accent:"#22c55e" },
          { label:"Logging Streak", value:`${streak}d`,     sub:"days",       accent:"#8b5cf6" },
        ].map((s, i) => (
          <div key={s.label} className="nu-card nu-fu" style={{ background:"#fff", borderRadius:14, padding:"18px 20px", border:"1px solid #eef0ec", boxShadow:"0 2px 8px rgba(0,0,0,.04)", position:"relative", overflow:"hidden", animationDelay:`${i*.06}s` }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:s.accent, borderRadius:"14px 14px 0 0" }}/>
            <div style={{ fontSize:10, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:".07em", marginBottom:8 }}>{s.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:C.text, lineHeight:1, marginBottom:3 }}>{s.value}</div>
            <div style={{ fontSize:11, color:"#9ca3af" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Score arc banner */}
      <div className="nu-fu" style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", borderRadius:16, padding:"20px 26px", marginBottom:22, display:"flex", alignItems:"center", gap:22, color:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-28, right:-28, width:140, height:140, borderRadius:"50%", background:"rgba(34,197,94,.07)" }}/>
        <div style={{ position:"relative", width:76, height:76, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="76" height="76" viewBox="0 0 76 76">
            <circle cx="38" cy="38" r="30" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="7"/>
            <circle cx="38" cy="38" r="30" fill="none" stroke="#22c55e" strokeWidth="7"
              strokeDasharray={`${2*Math.PI*30*score/100} ${2*Math.PI*30}`}
              strokeLinecap="round" transform="rotate(-90 38 38)"/>
          </svg>
          <div style={{ position:"absolute", fontSize:16, fontWeight:800 }}>{score}%</div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>
            {score>=70 ? "Great nutrition today! 🎉" : score>0 ? `${score}% of your daily goal` : "Start logging to track your nutrition"}
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.65)", lineHeight:1.6 }}>
            {entries.length>0 ? `Logged: ${entries.slice(0,3).map((e:any)=>e.vegetable).join(", ")}. Keep going!` : "Log your first food item using the button above."}
          </div>
        </div>
        <button className="nu-btn" onClick={() => setModal(true)}
          style={{ background:"rgba(255,255,255,.14)", border:"1px solid rgba(255,255,255,.2)", color:"#fff", borderRadius:9, padding:"8px 16px", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
          + Log Food
        </button>
      </div>

      {/* Today + Nutrients */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:20 }}>

        <div className="nu-card nu-fu" style={{ background:"#fff", borderRadius:16, border:"1px solid #eef0ec", boxShadow:"0 2px 8px rgba(0,0,0,.04)", overflow:"hidden" }}>
          <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f4f4f0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Today's Intake</div>
            <span style={{ fontSize:11, color:C.muted }}>{entries.length} item{entries.length!==1?"s":""}</span>
          </div>
          <div style={{ padding:"12px 20px" }}>
            {entries.length===0 ? (
              <div style={{ textAlign:"center", padding:"24px 0", color:"#9ca3af" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🥬</div>
                <div style={{ fontSize:13 }}>No entries yet</div>
                <button className="nu-btn" onClick={() => setModal(true)}
                  style={{ marginTop:10, background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff", border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  Log first item
                </button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {entries.map((e:any, i:number) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 11px", background:"#f8faf8", borderRadius:9 }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>{e.emoji||"🥬"}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{e.vegetable}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{e.grams}g · {e.calories} kcal</div>
                    </div>
                    <button onClick={() => handleRemove(e._id)} style={{ background:"none", border:"none", color:"#d1d5db", cursor:"pointer", fontSize:18, lineHeight:1, padding:2 }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <button className="nu-btn" onClick={() => setModal(true)}
              style={{ width:"100%", marginTop:11, padding:"8px", border:"2px dashed #22c55e", borderRadius:9, background:"transparent", color:"#22c55e", fontSize:12, fontWeight:600, cursor:"pointer" }}>
              + Add More Food
            </button>
          </div>
        </div>

        <div className="nu-card nu-fu" style={{ background:"#fff", borderRadius:16, border:"1px solid #eef0ec", boxShadow:"0 2px 8px rgba(0,0,0,.04)", overflow:"hidden" }}>
          <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f4f4f0" }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Nutrient Breakdown</div>
          </div>
          <div style={{ padding:"12px 20px", display:"flex", flexDirection:"column", gap:11 }}>
            {NUTRIENTS.map(n => {
              const val = Math.min(totals[n.key]||0, 100);
              return (
                <div key={n.key}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:500, color:"#374151" }}>{n.icon} {n.label}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:getBarColor(val) }}>{val}%</span>
                      {val<40  && <span style={{ background:"#fee2e2", color:"#dc2626", fontSize:9, fontWeight:700, padding:"1px 5px", borderRadius:99 }}>Low</span>}
                      {val>=100 && <span style={{ background:"#dcfce7", color:"#166534", fontSize:9, fontWeight:700, padding:"1px 5px", borderRadius:99 }}>✓</span>}
                    </div>
                  </div>
                  <div style={{ background:"#f0f4f0", borderRadius:4, height:6, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${val}%`, background:getBarColor(val), borderRadius:4, transition:"width .4s" }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════ CEREBRAS AI ADVICE PANEL ════ */}
      <div className="nu-card nu-fu" style={{ background:"#fff", borderRadius:16, border:"1px solid #eef0ec", boxShadow:"0 2px 8px rgba(0,0,0,.04)", overflow:"hidden", marginBottom:20 }}>
        <div style={{ padding:"16px 20px 13px", borderBottom:"1px solid #f4f4f0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"linear-gradient(135deg,#f0fdf4 0%,#fff 60%)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#1a3a2a,#22c55e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🧠</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>AI Nutrition Advice</div>
              <div style={{ fontSize:11, color:C.muted }}>Powered by Cerebras · Personalised for Sri Lankan diets</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {aiAdvice && (
              <button onClick={() => setAiExpanded(!aiExpanded)}
                style={{ background:"#f4f0e8", border:"none", borderRadius:8, padding:"5px 11px", fontSize:11, fontWeight:600, color:C.muted, cursor:"pointer" }}>
                {aiExpanded ? "Collapse" : "Expand"}
              </button>
            )}
            <button onClick={fetchAiAdvice} disabled={aiLoading}
              style={{ background: aiLoading ? "#a7f3d0" : "linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff", border:"none", borderRadius:9, padding:"8px 16px", fontSize:12, fontWeight:700, cursor: aiLoading ? "not-allowed" : "pointer", display:"flex", alignItems:"center", gap:6 }}>
              {aiLoading
                ? <><div className="nu-pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#fff" }}/>Analyzing…</>
                : aiAdvice ? "↻ Refresh" : "✨ Get AI Advice"}
            </button>
          </div>
        </div>

        {!aiAdvice && !aiLoading && !aiError && (
          <div style={{ padding:"32px 20px", textAlign:"center" }}>
            <div style={{ fontSize:38, marginBottom:10 }}>🤖</div>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:5 }}>Get personalised nutrition advice</div>
            <div style={{ fontSize:12, color:C.muted, maxWidth:340, margin:"0 auto 16px" }}>
              Cerebras AI will analyse your food log and generate a personalised Sri Lankan meal plan targeting your nutrient gaps.
            </div>
            <button onClick={fetchAiAdvice}
              style={{ background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              ✨ Get My Nutrition Advice
            </button>
          </div>
        )}

        {aiLoading && (
          <div style={{ padding:"24px 20px" }}>
            {[160,110,200].map((w,i) => <div key={i} className="nu-pulse" style={{ height:13, background:"#f0f4f0", borderRadius:6, marginBottom:11, width:w }}/>)}
          </div>
        )}

        {aiError && !aiLoading && (
          <div style={{ margin:"12px 20px", padding:"11px 13px", background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:9 }}>
            <span style={{ fontSize:12, fontWeight:600, color:"#c2410c" }}>⚠ {aiError}</span>
          </div>
        )}

        {aiAdvice && aiExpanded && (
          <div style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ padding:"13px 15px", background:"#f0fdf4", borderRadius:11, borderLeft:"4px solid #22c55e" }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#166534", textTransform:"uppercase", letterSpacing:".07em", marginBottom:5 }}>Today's Summary</div>
              <div style={{ fontSize:13, color:"#14532d", lineHeight:1.7 }}>{aiAdvice.summary}</div>
            </div>

            {aiAdvice.deficiencyAlert && (
              <div style={{ padding:"13px 15px", background:"#fff1f2", borderRadius:11, borderLeft:"4px solid #ef4444", display:"flex", gap:10 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:"#dc2626", textTransform:"uppercase", letterSpacing:".07em", marginBottom:3 }}>Deficiency Alert</div>
                  <div style={{ fontSize:12, color:"#7f1d1d", lineHeight:1.6 }}>{aiAdvice.deficiencyAlert}</div>
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:9 }}>💡 Recommendations</div>
              {aiAdvice.recommendations.map((rec, i) => (
                <div key={i} style={{ display:"flex", gap:9, padding:"10px 13px", background:"#f8faf8", borderRadius:9, marginBottom:7, alignItems:"flex-start" }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{i+1}</div>
                  <div style={{ fontSize:12, color:"#374151", lineHeight:1.6 }}>{rec}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:9 }}>🍽️ Tomorrow's Meal Plan</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:9 }}>
                {aiAdvice.tomorrowPlan.map((meal, i) => {
                  const mc = [
                    { bg:"#fff7ed", border:"#fed7aa", accent:"#f59e0b", icon:"🌅" },
                    { bg:"#f0fdf4", border:"#bbf7d0", accent:"#22c55e", icon:"☀️" },
                    { bg:"#eff6ff", border:"#bfdbfe", accent:"#3b82f6", icon:"🌙" },
                  ][i]!;
                  return (
                    <div key={meal.meal} style={{ padding:"12px 13px", background:mc.bg, borderRadius:11, border:`1px solid ${mc.border}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:7 }}>
                        <span>{mc.icon}</span>
                        <div style={{ fontSize:10, fontWeight:700, color:mc.accent, textTransform:"uppercase", letterSpacing:".06em" }}>{meal.meal}</div>
                      </div>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:4, lineHeight:1.5 }}>{meal.suggestion}</div>
                      <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>{meal.benefit}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding:"13px 15px", background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)", borderRadius:11, color:"#fff", display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:20, flexShrink:0 }}>💚</span>
              <div>
                <div style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.55)", textTransform:"uppercase", letterSpacing:".07em", marginBottom:4 }}>Tip of the Day</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.9)", lineHeight:1.7 }}>{aiAdvice.tipOfDay}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Chart */}
      <div className="nu-card nu-fu" style={{ background:"#fff", borderRadius:16, border:"1px solid #eef0ec", boxShadow:"0 2px 8px rgba(0,0,0,.04)", overflow:"hidden" }}>
        <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f4f4f0" }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Weekly Nutrition Score</div>
        </div>
        <div style={{ padding:"16px 20px", display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
          {(weekly.length>0 ? weekly : DAYS.map(d=>({date:d,nutrientScore:0}))).map((w:any,i:number) => {
            const val = w.nutrientScore||0;
            const day = w.date ? new Date(w.date).toLocaleDateString("en-US",{weekday:"short"}) : DAYS[i];
            return (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, color:C.muted, marginBottom:5 }}>{day}</div>
                <div style={{ height:72, background:"#f0f4f0", borderRadius:7, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:`${val}%`, background:getBarColor(val), borderRadius:"5px 5px 0 0", transition:"height .4s" }}/>
                </div>
                <div style={{ fontSize:10, fontWeight:600, marginTop:4, color: val>0 ? getBarColor(val) : "#9ca3af" }}>
                  {val>0 ? `${val}%` : "–"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ ADD FOOD MODAL ══ */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={e => { if(e.target===e.currentTarget){setModal(false);setSelections({});setFormError("");} }}>
          <div style={{ background:"#fff", borderRadius:18, width:"100%", maxWidth:600, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 24px 60px rgba(0,0,0,.18)" }}>

            <div style={{ padding:"20px 24px 14px", borderBottom:"1px solid #f0ede8", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <h2 style={{ fontSize:16, fontWeight:800, color:C.text, margin:0 }}>Log Food</h2>
                <p style={{ fontSize:11, color:C.muted, margin:"3px 0 0" }}>Select items — all will be logged at once</p>
              </div>
              <button onClick={() => {setModal(false);setSelections({});setFormError("");}}
                style={{ background:"#f4f0e8", border:"none", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:14, color:C.muted, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
            </div>

            <div style={{ display:"flex", gap:5, padding:"12px 24px 9px", borderBottom:"1px solid #f4f0ec", overflowX:"auto" }}>
              {FOOD_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)}
                  style={{ padding:"6px 14px", borderRadius:99, border:`1.5px solid ${activeTab===cat.id?cat.color:C.border}`, background:activeTab===cat.id?cat.bg:"transparent", color:activeTab===cat.id?cat.color:C.muted, fontSize:11, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
                  {cat.label}
                </button>
              ))}
            </div>

            <div style={{ padding:"14px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, padding:"10px 13px", background:"#f9f7f4", borderRadius:9, border:"1px solid #eeebe4" }}>
                <span style={{ fontSize:12, fontWeight:600, color:C.text, flexShrink:0 }}>Serving size:</span>
                <input type="number" value={pendingGrams}
                  onChange={e => { setPendingGrams(e.target.value); setSelections(prev=>{ const n={...prev}; Object.keys(n).forEach(k=>n[k]=e.target.value); return n; }); }}
                  min="10" max="1000" placeholder="100"
                  style={{ width:70, padding:"5px 9px", border:"1.5px solid #e5e7eb", borderRadius:7, fontSize:13, outline:"none", textAlign:"center" }}/>
                <span style={{ fontSize:11, color:C.muted }}>grams per item</span>
              </div>

              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:activeCat.color, textTransform:"uppercase", letterSpacing:".07em", marginBottom:9 }}>
                  {activeCat.label} — tap to select
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {activeCat.items.map(item => {
                    const isSel = !!selections[item];
                    return (
                      <button key={item} className="nu-food nu-btn" onClick={() => toggleItem(item)}
                        style={{ padding:"7px 13px", borderRadius:99, border:`2px solid ${isSel?activeCat.color:C.border}`, background:isSel?activeCat.bg:"#fff", color:isSel?activeCat.color:C.muted, fontSize:12, fontWeight:isSel?700:400, cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"all .12s" }}>
                        {isSel && <span style={{ fontSize:10 }}>✓</span>}
                        {item}
                        {isSel && <span style={{ fontSize:10, background:"rgba(0,0,0,.07)", padding:"1px 5px", borderRadius:99 }}>{selections[item]}g</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selCount>0 && (
                <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:9, padding:"10px 13px", marginBottom:12 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"#166534", marginBottom:6 }}>{selCount} item{selCount>1?"s":""} selected:</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {Object.entries(selections).map(([item,grams]) => (
                      <span key={item} style={{ background:"#fff", border:"1px solid #bbf7d0", color:"#166534", fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:99, display:"flex", alignItems:"center", gap:4 }}>
                        {item} · {grams}g
                        <button onClick={() => toggleItem(item)} style={{ background:"none", border:"none", color:"#9ca3af", cursor:"pointer", padding:0, fontSize:14, lineHeight:1 }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formError && <div style={{ padding:"9px 12px", borderRadius:8, marginBottom:11, background:"#fff1f1", color:"#dc2626", fontSize:12, fontWeight:600 }}>{formError}</div>}

              <div style={{ display:"flex", gap:9 }}>
                <button className="nu-btn" onClick={() => {setModal(false);setSelections({});setFormError("");}}
                  style={{ flex:1, padding:"10px", background:"#f4f0e8", border:"none", borderRadius:9, fontSize:12, fontWeight:600, cursor:"pointer", color:C.muted }}>
                  Cancel
                </button>
                <button className="nu-btn" onClick={handleAddAll} disabled={adding||selCount===0}
                  style={{ flex:2, padding:"10px", background:selCount===0||adding?"#a7f3d0":"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff", border:"none", borderRadius:9, fontSize:12, fontWeight:700, cursor:selCount===0||adding?"not-allowed":"pointer" }}>
                  {adding ? "Logging…" : `Log ${selCount} item${selCount>1?"s":""}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}