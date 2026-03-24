"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios-proxy";

export default function SubscriptionPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const cancelled    = searchParams.get("cancelled");

  const [user,    setUser]    = useState<any>(null);
  const [sub,     setSub]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying,  setPaying]  = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "farmer") { router.push("/"); return; }
    setUser(u);
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const { data } = await api.get("/subscriptions/my");
      setSub(data);
      // If already active, go to dashboard
      if (data.isActive) router.push("/dashboard/farmer");
    } catch {}
    setLoading(false);
  };

  const handleSubscribe = async () => {
    setPaying(true); setError("");
    try {
      const { data } = await api.post("/subscriptions/checkout");
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start checkout.");
      setPaying(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", background:"#f4f0e8",
      fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:12 }}>🌾</div>
        <div style={{ color:"#2d5a3d", fontWeight:600 }}>Checking subscription…</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f4f0e8",
      fontFamily:"'DM Sans',sans-serif", display:"flex",
      alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ width:"100%", maxWidth:"960px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontFamily:"'Playfair Display',serif",
            fontWeight:900, fontSize:28, color:"#1a3a2a", marginBottom:8 }}>
            Agri<span style={{ color:"#6aaa78" }}>AI</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",
            fontSize:36, fontWeight:900, color:"#1c2b22",
            margin:"16px 0 8px" }}>
            Start Growing Smarter
          </h1>
          <p style={{ fontSize:16, color:"#6b8070", maxWidth:480, margin:"0 auto" }}>
            Join thousands of Sri Lankan farmers using AI to protect their crops, manage orders, and grow their income.
          </p>
          {cancelled && (
            <div style={{ marginTop:16, padding:"10px 20px",
              background:"#fff8e6", border:"1px solid #fde68a",
              borderRadius:10, display:"inline-block",
              fontSize:13, color:"#92400e", fontWeight:600 }}>
              ⚠ Payment was cancelled. You can try again anytime.
            </div>
          )}
        </div>

        {/* Pricing cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:32 }}>

          {/* Free trial card */}
          <div style={{ background:"#fff", borderRadius:20, padding:"32px",
            border:"1px solid #e8e4dc",
            boxShadow:"0 4px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#6b8070",
              textTransform:"uppercase", letterSpacing:".08em", marginBottom:12 }}>
              Free Trial
            </div>
            <div style={{ fontSize:42, fontWeight:900, color:"#1c2b22",
              fontFamily:"'Playfair Display',serif", lineHeight:1, marginBottom:4 }}>
              $0
            </div>
            <div style={{ fontSize:13, color:"#6b8070", marginBottom:24 }}>
              7 days — no credit card required
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
              {[
                "AI Crop Disease Detection",
                "Weather Alerts",
                "List up to 5 products",
                "Receive orders from consumers",
              ].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ color:"#6aaa78", fontSize:16, fontWeight:700 }}>✓</span>
                  <span style={{ fontSize:14, color:"#374151" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ padding:"12px 20px", background:"#f4f0e8",
              borderRadius:10, fontSize:13, color:"#6b8070", textAlign:"center" }}>
              Included with your subscription
            </div>
          </div>

          {/* Monthly plan card */}
          <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d5a3d)",
            borderRadius:20, padding:"32px",
            boxShadow:"0 8px 32px rgba(26,58,42,.3)", position:"relative",
            overflow:"hidden" }}>
            {/* Popular badge */}
            <div style={{ position:"absolute", top:20, right:20,
              background:"#d4a853", color:"#fff",
              fontSize:11, fontWeight:700, padding:"4px 12px",
              borderRadius:99, letterSpacing:".06em" }}>
              MOST POPULAR
            </div>

            <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.6)",
              textTransform:"uppercase", letterSpacing:".08em", marginBottom:12 }}>
              Monthly Plan
            </div>
            <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:4 }}>
              <span style={{ fontSize:42, fontWeight:900, color:"#fff",
                fontFamily:"'Playfair Display',serif", lineHeight:1 }}>
                Rs. 2,999
              </span>
              <span style={{ fontSize:14, color:"rgba(255,255,255,.6)" }}>/month</span>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", marginTop:4 }}>≈ Rs. 2,999/month · Your bank converts automatically</div>
            </div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.5)", marginBottom:24 }}>
              Rs. 2,999/month · Billed as ~$9.99 USD via Stripe · Cancel anytime
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
              {[
                "Everything in Free Trial",
                "Unlimited AI crop scans",
                "Unlimited product listings",
                "Order management dashboard",
                "Earnings & payment tracking",
                "Priority support",
              ].map(f => (
                <div key={f} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ color:"#6aaa78", fontSize:16, fontWeight:700 }}>✓</span>
                  <span style={{ fontSize:14, color:"rgba(255,255,255,.85)" }}>{f}</span>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ marginBottom:14, padding:"10px 14px",
                background:"rgba(255,0,0,.15)", borderRadius:8,
                color:"#fca5a5", fontSize:13 }}>
                ⚠ {error}
              </div>
            )}

            <button onClick={handleSubscribe} disabled={paying} style={{
              width:"100%", padding:"15px",
              background: paying ? "rgba(255,255,255,.3)" : "#d4a853",
              color:"#1a3a2a", border:"none", borderRadius:12,
              fontSize:16, fontWeight:800, cursor: paying ? "not-allowed" : "pointer",
              transition:"all .2s", fontFamily:"'DM Sans',sans-serif",
            }}>
              {paying ? "⏳ Redirecting to Stripe…" : "🌾 Start 7-Day Free Trial"}
            </button>
            <div style={{ textAlign:"center", marginTop:12,
              fontSize:12, color:"rgba(255,255,255,.4)" }}>
              Secured by Stripe · Cancel anytime
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div style={{ background:"#fff", borderRadius:20, padding:"28px 32px",
          border:"1px solid #e8e4dc" }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#1c2b22",
            marginBottom:20, textAlign:"center" }}>
            Everything you get with AgriAI
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { icon:"🔬", title:"AI Disease Detection", desc:"Upload a photo and get instant diagnosis with treatment plans" },
              { icon:"⛈️", title:"Weather Alerts",       desc:"Crop-specific alerts for rain, drought, and wind events" },
              { icon:"🛒", title:"Direct Marketplace",   desc:"Sell directly to consumers without middlemen" },
              { icon:"📦", title:"Order Management",     desc:"Track and manage all your orders in one place" },
              { icon:"💰", title:"Earnings Dashboard",   desc:"See your revenue, payments, and payout history" },
              { icon:"📊", title:"Farm Analytics",       desc:"Insights on your best crops, sales trends, and more" },
            ].map(f => (
              <div key={f.title} style={{ display:"flex", gap:14,
                padding:"16px", background:"#f9f7f4", borderRadius:12 }}>
                <div style={{ fontSize:24, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1c2b22",
                    marginBottom:4 }}>{f.title}</div>
                  <div style={{ fontSize:12, color:"#6b8070",
                    lineHeight:1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign out link */}
        <div style={{ textAlign:"center", marginTop:24 }}>
          <button onClick={() => {
            localStorage.removeItem("agriai_token");
            localStorage.removeItem("agriai_user");
            router.push("/");
          }} style={{ background:"none", border:"none",
            color:"#9ca3af", fontSize:13, cursor:"pointer" }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}