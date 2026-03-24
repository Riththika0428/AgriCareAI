"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { nutritionAPI } from "@/lib/axios-proxy";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function NutritionPage() {
  const router = useRouter();
  const [todayLog, setToday]    = useState<any>(null);
  const [weekly,   setWeekly]   = useState<any[]>([]);
  const [veggies,  setVeggies]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showModal, setModal]   = useState(false);
  const [selVeg,   setSelVeg]   = useState("");
  const [grams,    setGrams]    = useState("100");
  const [adding,   setAdding]   = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [todayRes, weeklyRes, veggieRes] = await Promise.all([
        nutritionAPI.getToday(),
        nutritionAPI.getWeekly(),
        nutritionAPI.getVeggies(),
      ]);
      setToday(todayRes.data);
      setWeekly(weeklyRes.data);
      setVeggies(veggieRes.data);
    } catch {}
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!selVeg || !grams) { setError("Select a vegetable and enter grams."); return; }
    setAdding(true); setError("");
    try {
      const { data } = await nutritionAPI.addEntry(selVeg, Number(grams));
      setToday(data.log);
      setModal(false); setSelVeg(""); setGrams("100");
    } catch (e:any) {
      setError(e.response?.data?.message || "Failed to add entry.");
    } finally { setAdding(false); }
  };

  const handleRemove = async (entryId: string) => {
    try {
      const { data } = await nutritionAPI.removeEntry(entryId);
      setToday(data.log);
    } catch {}
  };

  const entries  = todayLog?.entries || [];
  const score    = todayLog?.nutrientScore || 0;
  const calories = todayLog?.totalCalories || 0;
  const streak   = 4;

  // Nutrient totals
  const totals: Record<string,number> = {};
  entries.forEach((e:any) => {
    if (e.nutrients) Object.entries(e.nutrients).forEach(([k,v]) => {
      totals[k] = (totals[k]||0) + (v as number);
    });
  });

  const NUTRIENTS = [
    { key:"vitaminA", label:"Vitamin A" },
    { key:"vitaminC", label:"Vitamin C" },
    { key:"iron",     label:"Iron" },
    { key:"calcium",  label:"Calcium" },
    { key:"fiber",    label:"Fiber" },
    { key:"protein",  label:"Protein" },
  ];

  const getBarColor = (v:number) => v>=70?"#22c55e":v>=40?"#f59e0b":"#ef4444";

  if (loading) return (
    <ConsumerLayout>
      <div style={{ textAlign:"center", padding:"80px", color:"#6b7280" }}>
        <div style={{ fontSize:36, marginBottom:12 }}>🥗</div>
        <div style={{ fontWeight:600 }}>Loading nutrition data…</div>
      </div>
    </ConsumerLayout>
  );

  return (
    <ConsumerLayout>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, color:"#111827", margin:0,
            display:"flex", alignItems:"center", gap:10 }}>
            🍅 Nutrition Tracker
          </h1>
          <p style={{ fontSize:13, color:"#6b7280", marginTop:4 }}>
            Log your daily intake and get AI-powered suggestions
          </p>
        </div>
        <button onClick={() => setModal(true)} style={{
          background:"linear-gradient(135deg,#1a3a2a,#22c55e)", color:"#fff",
          border:"none", borderRadius:10, padding:"10px 20px",
          fontSize:14, fontWeight:700, cursor:"pointer",
        }}>+ Log Food</button>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
        {[
          { icon:"🔥", num:calories, label:"Calories Today" },
          { icon:"🎯", num:`${score}%`, label:"Nutrient Score" },
          { icon:"📈", num:`${streak} days`, label:"Current Streak" },
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

      {/* Today's Intake + Nutrient Breakdown */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>

        {/* Today's Intake */}
        <div style={{ background:"#fff", borderRadius:16, padding:"22px",
          border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:14 }}>Today's Intake</div>
          {entries.length === 0 ? (
            <div style={{ textAlign:"center", padding:"30px", color:"#9ca3af" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🥬</div>
              <div>No entries yet. Log your first vegetable!</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {entries.map((e:any, i:number) => (
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"10px 12px", background:"#f8faf8", borderRadius:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:22 }}>{e.emoji}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{e.vegetable}</div>
                      <div style={{ fontSize:11, color:"#6b7280" }}>{e.grams}g · {e.calories} kcal</div>
                    </div>
                  </div>
                  <button onClick={() => handleRemove(e._id)}
                    style={{ background:"none", border:"none", color:"#9ca3af",
                    cursor:"pointer", fontSize:16, padding:"4px" }}>×</button>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setModal(true)} style={{
            width:"100%", marginTop:14, padding:"10px",
            border:"2px dashed #22c55e", borderRadius:10,
            background:"transparent", color:"#22c55e",
            fontSize:13, fontWeight:600, cursor:"pointer",
          }}>+ Add Food</button>
        </div>

        {/* Nutrient Breakdown */}
        <div style={{ background:"#fff", borderRadius:16, padding:"22px",
          border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:14 }}>Nutrient Breakdown</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {NUTRIENTS.map(n => {
              const val = Math.min(totals[n.key]||0, 100);
              return (
                <div key={n.key}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:500, color:"#374151" }}>{n.label}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:getBarColor(val) }}>{val}%</span>
                      {val < 40 && (
                        <span style={{ background:"#fee2e2", color:"#dc2626",
                          fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:99 }}>Low</span>
                      )}
                    </div>
                  </div>
                  <div style={{ background:"#f0f4f0", borderRadius:4, height:8, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${val}%`,
                      background:getBarColor(val), borderRadius:4, transition:"width .4s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Score */}
      <div style={{ background:"#fff", borderRadius:16, padding:"22px",
        border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
        <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:16 }}>
          Weekly Nutrition Score
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10 }}>
          {(weekly.length > 0 ? weekly : DAYS.map(d=>({date:d,nutrientScore:0}))).map((w:any,i:number) => {
            const val = w.nutrientScore||0;
            const day = w.date ? new Date(w.date).toLocaleDateString("en-US",{weekday:"short"}) : DAYS[i];
            return (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, color:"#6b7280", marginBottom:6 }}>{day}</div>
                <div style={{ height:80, background:"#f0f4f0", borderRadius:8,
                  position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0,
                    height:`${val}%`, background:getBarColor(val),
                    borderRadius:"6px 6px 0 0", transition:"height .4s" }} />
                </div>
                <div style={{ fontSize:11, fontWeight:600, marginTop:4,
                  color: val>0?getBarColor(val):"#9ca3af" }}>
                  {val > 0 ? `${val}%` : "–"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:200,
          display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
          onClick={e => { if(e.target===e.currentTarget) setModal(false); }}>
          <div style={{ background:"#fff", borderRadius:18, padding:"28px 32px",
            width:"100%", maxWidth:"440px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:0 }}>Log Food</h2>
              <button onClick={() => setModal(false)}
                style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#6b7280" }}>✕</button>
            </div>

            {error && (
              <div style={{ background:"#fff1f1", border:"1px solid #fcd0d0", borderRadius:8,
                padding:"8px 12px", color:"#dc2626", fontSize:13, marginBottom:14 }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
                textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
                Vegetable
              </label>
              <select value={selVeg} onChange={e => setSelVeg(e.target.value)} style={{
                width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb",
                borderRadius:10, fontSize:14, fontFamily:"'DM Sans',sans-serif",
                color:"#111827", background:"#fff", outline:"none",
              }}>
                <option value="">Select vegetable…</option>
                {veggies.map((v:any) => (
                  <option key={v.name} value={v.name}>{v.emoji} {v.name} ({v.cal} kcal/100g)</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom:22 }}>
              <label style={{ fontSize:11, fontWeight:700, color:"#6b7280",
                textTransform:"uppercase", letterSpacing:".06em", display:"block", marginBottom:6 }}>
                Amount (grams)
              </label>
              <input type="number" value={grams} onChange={e => setGrams(e.target.value)}
                placeholder="100" min="1" max="1000" style={{
                  width:"100%", padding:"10px 14px", border:"1.5px solid #e5e7eb",
                  borderRadius:10, fontSize:14, fontFamily:"'DM Sans',sans-serif",
                  color:"#111827", outline:"none", boxSizing:"border-box" as const,
                }} />
            </div>

            <button onClick={handleAdd} disabled={adding} style={{
              width:"100%", padding:"12px",
              background: adding?"#a7f3d0":"linear-gradient(135deg,#1a3a2a,#22c55e)",
              color:"#fff", border:"none", borderRadius:10,
              fontSize:14, fontWeight:700, cursor:"pointer",
            }}>
              {adding ? "Adding…" : "✓ Log Entry"}
            </button>
          </div>
        </div>
      )}
    </ConsumerLayout>
  );
}