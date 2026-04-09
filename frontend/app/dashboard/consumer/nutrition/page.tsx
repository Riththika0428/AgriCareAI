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