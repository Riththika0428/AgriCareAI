"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { authAPI } from "@/lib/api";

const FARMER = {
  badge: "🌾 Farmer Portal",
  headline: ["Welcome ", "Back", " to Smarter Farming."],
  accentClass: "text-green-400 italic",
  sub: "Log in to access your dashboard — crop alerts, disease scanner, marketplace, and weather forecasts all in one place.",
  features: [
    { icon: "🔬", title: "AI Disease Detection",  desc: "Upload a photo, get instant diagnosis" },
    { icon: "⛈️", title: "Smart Weather Alerts",   desc: "Crop-specific forecasts for your farm" },
    { icon: "🛒", title: "Direct Marketplace",     desc: "Sell fresh produce without middlemen" },
    { icon: "🌿", title: "Organic Compost Shop",   desc: "Premium compost delivered to your farm" },
  ],
  toggleLabel: "Consumer",
  toggleIcon: "🥗",
};

const CONSUMER = {
  badge: "🥗 Consumer Portal",
  headline: ["Welcome ", "Back", " to Eating Better."],
  accentClass: "text-amber-400 italic",
  sub: "Log in to track your daily nutrition, discover fresh produce from local farmers, and get personalised meal plans.",
  features: [
    { icon: "📊", title: "Nutrition Tracker",          desc: "Log meals and see your daily nutrient gaps" },
    { icon: "🤖", title: "AI Meal Recommendations",    desc: "Personalised next-day vegetable plans" },
    { icon: "🥦", title: "Farm-Fresh Marketplace",     desc: "Buy directly from verified local farmers" },
    { icon: "🚚", title: "Fast Delivery",              desc: "Fresh produce delivered to your door" },
  ],
  toggleLabel: "Farmer",
  toggleIcon: "🌾",
};

export default function LoginPage() {
  const router = useRouter();
  const [panel, setPanel]   = useState<"farmer" | "consumer">("farmer");
  const [email, setEmail]   = useState("");
  const [password, setPass] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRem]  = useState(false);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState("");

  const content = panel === "farmer" ? FARMER : CONSUMER;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !password) {
    setError("Please enter your email and password.");
    return;
  }
  // TODO: connect to backend later
  alert("Login submitted! Connect backend later.");
};

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email || !password) { setError("Please enter your email and password."); return; }
//     setLoad(true); setError("");
//     try {
//       const { data } = await authAPI.login({ email, password });
//       localStorage.setItem("agriai_user",  JSON.stringify(data));
//       localStorage.setItem("agriai_token", data.token);
//       if (data.role === "admin")       router.push("/dashboard/admin");
//       else if (data.role === "farmer") router.push("/dashboard/farmer");
//       else                             router.push("/dashboard/consumer");
//     } catch (err: any) {
//       setError(err?.response?.data?.message || "Invalid email or password.");
//     } finally { setLoad(false); }
//   };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-[46%] flex-col justify-between relative overflow-hidden grid-texture"
        style={{ background: "linear-gradient(160deg, #1a3a1f 0%, #0e2312 100%)" }}
      >
        {/* Blobs */}
        <div className="blob absolute w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "rgba(76,175,80,0.14)", filter: "blur(70px)", top: "-55px", right: "-38px" }} />
        <div className="blob-2 absolute w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "rgba(245,166,35,0.10)", filter: "blur(60px)", bottom: "75px", left: "-28px" }} />

        <div className="relative z-10 p-11">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-11">
            <span className="text-[22px] font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Agri<span className="text-green-400">AI</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-green-400"
              style={{ boxShadow: "0 0 8px #4caf50", animation: "pulseDot 2s ease-in-out infinite" }} />
          </div>

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-[11px] font-bold tracking-wide mb-5">
            {content.badge}
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-1 text-[38px] font-black text-white leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            {content.headline[0]}
            <span className={content.accentClass}>{content.headline[1]}</span>
            <br />{content.headline[2]}
          </h1>

          {/* Sub */}
          <p className="animate-fade-up-2 text-white/50 text-sm leading-relaxed mb-7 max-w-xs">
            {content.sub}
          </p>

          {/* Features */}
          <div className="animate-fade-up-3 flex flex-col gap-2.5">
            {content.features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-white/8 bg-white/5 hover:bg-white/9 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: "rgba(76,175,80,0.18)" }}>{f.icon}</div>
                <div>
                  <div className="text-[12.5px] font-semibold text-white/90">{f.title}</div>
                  <div className="text-[11px] text-white/40">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle at bottom */}
        <div className="relative z-10 p-11 pt-0">
          <button onClick={() => setPanel(p => p === "farmer" ? "consumer" : "farmer")}
            className="flex items-center gap-2 text-[11px] text-white/30 hover:text-white/50 transition-colors cursor-pointer">
            <span>{content.toggleIcon}</span>
            <span>Switch to <span className="underline underline-offset-2 text-white/55">{content.toggleLabel} view</span></span>
          </button>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto" style={{ background: "#f9f5ec" }}>
        <div className="w-full max-w-[390px]">

          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8f5e9] border border-[#c8e6c9] text-[#2d6a35] text-[11px] font-bold tracking-wider mb-5">
            🔑 SECURE LOGIN
          </div>

          <h2 className="animate-fade-up-1 text-[29px] font-black text-[#1a3a1f] leading-tight mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Sign in to your <span className="text-[#2d6a35] italic">Account</span>
          </h2>
          <p className="animate-fade-up-2 text-sm text-gray-400 mb-6 leading-relaxed">
            Enter your credentials to access your personalised dashboard.
          </p>

          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Email */}
            <div className="animate-fade-up-2 flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">✉️</span>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com" className="input-field" />
              </div>
            </div>

            {/* Password */}
            <div className="animate-fade-up-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#2d6a35] hover:text-[#4caf50] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔒</span>
                <input type={showPw ? "text" : "password"} value={password}
                  onChange={e => { setPass(e.target.value); setError(""); }}
                  placeholder="Enter your password" className="input-field" style={{ paddingRight: "42px" }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 text-sm">
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="animate-fade-up-4 flex items-center gap-2.5">
              <input type="checkbox" id="remember" checked={remember} onChange={e => setRem(e.target.checked)}
                className="w-4 h-4 cursor-pointer accent-green-500" />
              <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer select-none">
                Keep me signed in on this device for 30 days
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary animate-fade-up-5">
              {loading ? "⏳ Signing in…" : "Sign In to AgriAI →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            New to AgriAI?{" "}
            <Link href="/register" className="font-semibold text-[#2d6a35] hover:text-[#4caf50] transition-colors">
              Create an account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}