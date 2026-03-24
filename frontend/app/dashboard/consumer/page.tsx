"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConsumerLayout from "@/app/components/ConsumerLayout";
import { nutritionAPI, orderAPI, productAPI } from "@/lib/axios-proxy";

// ── Static mock for AI recommendations ───────────────────
const AI_RECS = ["Corn","Orange","Dairy","Bell Pepper","Almonds"];
const DAYS    = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function ConsumerOverview() {
  const router = useRouter();

  const [todayLog,   setTodayLog]   = useState<any>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<any[]>([]);
  const [recentOrders, setOrders]   = useState<any[]>([]);
  const [nearbyProducts, setProducts] = useState<any[]>([]);
  const [nutrients, setNutrients]   = useState<Record<string,number>>({});
  const [loading, setLoading]       = useState(true);
  const [streak, setStreak]         = useState(12);

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    if (!stored) { router.push("/"); return; }
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [todayRes, weeklyRes, ordersRes, productsRes] = await Promise.allSettled([
        nutritionAPI.getToday(),
        nutritionAPI.getWeekly(),
        orderAPI.getMyOrders(),
        productAPI.getAll(),
      ]);
      if (todayRes.status   === "fulfilled") setTodayLog(todayRes.value.data);
      if (weeklyRes.status  === "fulfilled") setWeeklyLogs(weeklyRes.value.data);
      if (ordersRes.status  === "fulfilled") setOrders((ordersRes.value.data).slice(0,4));
      if (productsRes.status=== "fulfilled") setProducts((productsRes.value.data).slice(0,4));

      // compute nutrient totals from today
      if (todayRes.status === "fulfilled") {
        const entries = todayRes.value.data?.entries || [];
        const t: Record<string,number> = {};
        entries.forEach((e: any) => {
          if (e.nutrients) Object.entries(e.nutrients).forEach(([k,v]) => {
            t[k] = (t[k]||0) + (v as number);
          });
        });
        setNutrients(t);
      }
    } catch {}
    setLoading(false);
  };

  const score      = todayLog?.nutrientScore || 0;
  const calories   = todayLog?.totalCalories || 0;
  const entries    = todayLog?.entries || [];
  const veggiesLogged = entries.length;

  const NUTRIENT_STATUS = [
    { key:"vitaminA", label:"Vitamin A", val: Math.min(nutrients.vitaminA||0,100) },
    { key:"vitaminC", label:"Vitamin C", val: Math.min(nutrients.vitaminC||0,100) },
    { key:"iron",     label:"Iron",      val: Math.min(nutrients.iron||0,100) },
    { key:"calcium",  label:"Calcium",   val: Math.min(nutrients.calcium||0,100) },
    { key:"vitaminD", label:"Vitamin D", val: 55 },
    { key:"fiber",    label:"Fibre",     val: Math.min(nutrients.fiber||0,100) },
  ];

  const getStatusColor = (v: number) => v >= 70 ? "#16a34a" : v >= 40 ? "#d97706" : "#dc2626";
  const getStatusLabel = (v: number) => v >= 70 ? "On track" : v >= 40 ? "Moderate" : "Low";
  const getStatusBg    = (v: number) => v >= 70 ? "#f0fdf4" : v >= 40 ? "#fffbeb" : "#fff1f1";

  const getBarColor = (v: number) => v >= 70 ? "#22c55e" : v >= 40 ? "#f59e0b" : "#ef4444";

  if (loading) return (
    <ConsumerLayout>
      <div style={{ textAlign:"center", padding:"80px", color:"#6b7280" }}>
        <div style={{ fontSize:36, marginBottom:12 }}>🌿</div>
        <div style={{ fontWeight:600 }}>Loading your health dashboard…</div>
      </div>
    </ConsumerLayout>
  );

  return (
    <ConsumerLayout>

      {/* ── Daily Score Banner ── */}
      <div style={{ background:"linear-gradient(135deg,#1a3a2a 0%,#2d5a3d 100%)",
        borderRadius:16, padding:"24px 28px", marginBottom:22, color:"#fff",
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.5)",
            textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>
            TODAY'S NUTRITION SCORE
          </div>
          <div style={{ fontSize:28, fontWeight:800, fontFamily:"'Playfair Display',serif",
            lineHeight:1.2, marginBottom:8 }}>
            You're {score}% toward your daily goal
          </div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.7)", lineHeight:1.6, maxWidth:480 }}>
            {entries.length > 0
              ? `You've logged ${entries.map((e:any)=>e.vegetable).join(" and ")} today. Add Bell Pepper and Broccoli to hit 70% — AI recommends these to fill your Vitamin C and Calcium gaps.`
              : "Start logging your vegetables today to track your nutrition and reach your health goals."
            }
          </div>
        </div>
        {/* Score ring */}
        <div style={{ width:90, height:90, flexShrink:0, position:"relative",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="8"/>
            <circle cx="45" cy="45" r="38" fill="none" stroke="#22c55e" strokeWidth="8"
              strokeDasharray={`${2*Math.PI*38*score/100} ${2*Math.PI*38}`}
              strokeLinecap="round" transform="rotate(-90 45 45)"/>
          </svg>
          <div style={{ position:"absolute", textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>{score}%</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,.6)" }}>daily goal</div>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        {[
          { icon:"🥗", num:`${veggiesLogged}/5`, label:"Veggies Logged Today", sub:"↑ Good", subC:"#16a34a" },
          { icon:"🔥", num:streak,                label:"Day Tracking Streak",  sub:`+3 days`,  subC:"#16a34a" },
          { icon:"📦", num:recentOrders.length || 7, label:"Total Orders Placed", sub:"2 active", subC:"#6b7280" },
          { icon:"💊", num:74,                    label:"Health Score / 100",   sub:"2 low nutrients", subC:"#dc2626" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:14, padding:"18px 20px",
            border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:"#111827",
              fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.num}</div>
            <div style={{ fontSize:11, color:"#6b7280", margin:"4px 0" }}>{s.label}</div>
            <div style={{ fontSize:11, color:s.subC, fontWeight:600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Middle row: Today's Log + Nutrient Status ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>

        {/* Today's Log */}
        <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
          border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#111827" }}>Today's Nutrition Log</div>
            <button onClick={() => router.push("/dashboard/consumer/nutrition")}
              style={{ background:"none", border:"none", fontSize:12, color:"#22c55e",
              fontWeight:600, cursor:"pointer" }}>View Full Log →</button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {entries.slice(0,2).map((e:any, i:number) => (
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"8px 12px", background:"#f8faf8", borderRadius:9 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>{e.emoji}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#111827" }}>
                      {e.vegetable} · {e.grams}g
                    </div>
                    <div style={{ fontSize:11, color:"#6b7280" }}>{e.calories} kcal</div>
                  </div>
                </div>
                <span style={{ fontSize:11, fontWeight:600, color:"#16a34a" }}>Vit. A ✓</span>
              </div>
            ))}
            {["Broccoli","Bell Pepper"].map(v => (
              <div key={v} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"8px 12px", background:"#f9f9f9", borderRadius:9,
                border:"1px dashed #e5e7eb" }}>
                <span style={{ fontSize:13, color:"#9ca3af" }}>{v} — not yet logged</span>
                <span style={{ fontSize:11, fontWeight:700, color:"#dc2626",
                  background:"#fff1f1", padding:"2px 8px", borderRadius:99 }}>Missing</span>
              </div>
            ))}
          </div>

          <button onClick={() => router.push("/dashboard/consumer/nutrition")} style={{
            width:"100%", marginTop:14, padding:"10px",
            border:"2px dashed #22c55e", borderRadius:10,
            background:"transparent", color:"#22c55e",
            fontSize:13, fontWeight:600, cursor:"pointer",
          }}>+ Log a Vegetable</button>

          {/* AI Recommends */}
          <div style={{ marginTop:14, padding:"12px 14px", background:"#f0fdf4",
            borderRadius:10, border:"1px solid #bbf7d0" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#166534", marginBottom:8,
              display:"flex", alignItems:"center", gap:6 }}>
              🤖 AI Recommends for Tomorrow
              <span style={{ background:"#22c55e", color:"#fff", fontSize:10,
                fontWeight:700, padding:"2px 6px", borderRadius:99 }}>AI</span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {AI_RECS.map(r => (
                <span key={r} style={{ background:"#fff", border:"1px solid #bbf7d0",
                  color:"#166534", fontSize:11, fontWeight:600,
                  padding:"4px 10px", borderRadius:99 }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Nutrient Status */}
        <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
          border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"#111827" }}>Nutrient Status</div>
            <button style={{ background:"none", border:"none", fontSize:12,
              color:"#22c55e", fontWeight:600, cursor:"pointer" }}>Details →</button>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
            {NUTRIENT_STATUS.map(n => (
              <div key={n.key} style={{ background:getStatusBg(n.val), borderRadius:10,
                padding:"12px 10px", textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:800, color:getStatusColor(n.val) }}>{n.val}%</div>
                <div style={{ fontSize:11, fontWeight:600, color:"#374151", marginTop:2 }}>{n.label}</div>
                <div style={{ fontSize:10, color:getStatusColor(n.val), marginTop:2 }}>
                  {n.val>=70?"✓":n.val>=40?"△":"✗"} {getStatusLabel(n.val)}
                </div>
              </div>
            ))}
          </div>

          {/* Logging streak */}
          <div style={{ borderTop:"1px solid #f0f4f0", paddingTop:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>Logging Streak</div>
              <span style={{ fontSize:12, color:"#f59e0b", fontWeight:700 }}>🔥 {streak} days →</span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {DAYS.map((d,i) => (
                <div key={d} style={{ flex:1, textAlign:"center" }}>
                  <div style={{ width:"100%", aspectRatio:"1", borderRadius:"50%",
                    background: i < 4 ? "#22c55e" : "#e5e7eb",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:12, color: i < 4 ? "#fff" : "#9ca3af",
                    marginBottom:4 }}>
                    {i < 4 ? "✓" : ""}
                  </div>
                  <div style={{ fontSize:10, color:"#9ca3af" }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:10, background:"#fffbeb", borderRadius:8,
              padding:"8px 12px", border:"1px solid #fde68a" }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#92400e" }}>
                🔥 {streak}-Day Streak! Keep logging to maintain your health goal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row: Fresh Nearby + My Orders + Weekly Trend ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:18 }}>

        {/* Fresh Nearby */}
        <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
          border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>Fresh Nearby</div>
            <button onClick={() => router.push("/dashboard/consumer/marketplace")}
              style={{ background:"none", border:"none", fontSize:12,
              color:"#22c55e", fontWeight:600, cursor:"pointer" }}>Browse All →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {(nearbyProducts.length > 0 ? nearbyProducts : [
              { cropName:"Broccoli", price:120, farmer:{name:"Nimal"}, emoji:"🥦", district:"Kandy" },
              { cropName:"Carrot",   price:95,  farmer:{name:"Kumari"}, emoji:"🥕", district:"Nuwara" },
              { cropName:"Tomatoes", price:140, farmer:{name:"Asanka"}, emoji:"🍅", district:"Matale" },
              { cropName:"Bell Pepper",price:160, farmer:{name:"Priya"}, emoji:"🫑", district:"Kurunegala" },
            ]).slice(0,4).map((p:any,i:number) => (
              <div key={i} style={{ background:"#f8faf8", borderRadius:10, padding:"10px",
                border:"1px solid #e8ede8" }}>
                <div style={{ fontSize:28, textAlign:"center", marginBottom:6 }}>{p.emoji||"🥬"}</div>
                <div style={{ fontSize:12, fontWeight:700, color:"#111827" }}>{p.cropName}</div>
                <div style={{ fontSize:10, color:"#6b7280", marginBottom:6 }}>
                  🌾 {p.farmer?.name} · {p.district||"Local"}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, fontWeight:700, color:"#111827" }}>Rs. {p.price}</span>
                  <button onClick={() => router.push("/dashboard/consumer/marketplace")}
                    style={{ background:"#1a3a2a", color:"#fff", border:"none",
                    borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                    +Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Orders */}
        <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
          border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>My Orders</div>
            <button onClick={() => router.push("/dashboard/consumer/orders")}
              style={{ background:"none", border:"none", fontSize:12,
              color:"#22c55e", fontWeight:600, cursor:"pointer" }}>View All →</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {(recentOrders.length > 0 ? recentOrders : [
              { cropName:"Broccoli 500g", orderStatus:"Shipped",   farmer:{name:"Nimal Perera"} },
              { cropName:"Tomatoes 1kg",  orderStatus:"Shipped",   farmer:{name:"Asanka Raj"} },
              { cropName:"Carrot 1kg",    orderStatus:"Delivered", farmer:{name:"Kumari Silva"} },
              { cropName:"Fresh Chili 200g", orderStatus:"Delivered", farmer:{name:"Kamal Bandara"} },
            ]).slice(0,4).map((o:any,i:number) => {
              const statusColor = o.orderStatus==="Delivered" ? "#16a34a" : o.orderStatus==="Shipped" ? "#d97706" : "#6b7280";
              return (
                <div key={i} style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"8px 0",
                  borderBottom: i < 3 ? "1px solid #f0f4f0" : "none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:18 }}>🌾</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:"#111827" }}>{o.cropName}</div>
                      <div style={{ fontSize:11, color:"#6b7280" }}>{o.farmer?.name}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color:statusColor }}>
                    {o.orderStatus}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Nutrition Trend */}
        <div style={{ background:"#fff", borderRadius:16, padding:"20px 22px",
          border:"1px solid #e8ede8", boxShadow:"0 2px 8px rgba(0,0,0,.04)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#111827" }}>Weekly Nutrition Trend</div>
            <button style={{ background:"none", border:"none", fontSize:12,
              color:"#22c55e", fontWeight:600, cursor:"pointer" }}>Full Report →</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
            {(weeklyLogs.length > 0 ? weeklyLogs : [
              {date:"Mon",nutrientScore:88},{date:"Tue",nutrientScore:72},
              {date:"Wed",nutrientScore:95},{date:"Thu",nutrientScore:42},
            ]).slice(-4).map((w:any,i:number) => {
              const day = w.date?.slice(-2) || DAYS[i];
              const val = w.nutrientScore||0;
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, fontSize:12, color:"#6b7280" }}>{day}</div>
                  <div style={{ flex:1, background:"#f0f4f0", borderRadius:4, height:8, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${val}%`,
                      background: val>=70?"#22c55e":val>=40?"#f59e0b":"#ef4444",
                      borderRadius:4, transition:"width .4s" }} />
                  </div>
                  <div style={{ width:36, fontSize:12, fontWeight:600,
                    color: val>=70?"#16a34a":val>=40?"#d97706":"#dc2626",
                    textAlign:"right" }}>{val}%</div>
                </div>
              );
            })}
          </div>
          <div style={{ background:"#fffbeb", borderRadius:10, padding:"12px",
            border:"1px solid #fde68a" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#92400e", marginBottom:4 }}>
              🤖 AI Weekly Insight
            </div>
            <div style={{ fontSize:11, color:"#78350f", lineHeight:1.5 }}>
              Your Vitamin C has been consistently low this week. Adding 1 orange or a serving of bell pepper daily will significantly improve your score.
            </div>
          </div>
        </div>
      </div>
    </ConsumerLayout>
  );
}