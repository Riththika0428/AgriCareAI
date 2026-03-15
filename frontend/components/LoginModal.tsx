"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FARMER = {
  badge: "🌾 Farmer Portal",
  accentColor: "#4caf50",
  headingAccent: "Back",
  headingRest: "to Smarter\nFarming.",
  sub: "Log in to access your dashboard — crop alerts, disease scanner, marketplace, and weather forecasts all in one place.",
  features: [
    { icon: "🔬", title: "AI Disease Detection",  desc: "Upload a photo, get instant diagnosis" },
    { icon: "⛈️", title: "Smart Weather Alerts",   desc: "Crop-specific forecasts for your farm" },
    { icon: "🛒", title: "Direct Marketplace",     desc: "Sell fresh produce without middlemen" },
  ],
  toggleLabel: "Consumer",
  toggleIcon: "🥗",
};

const CONSUMER = {
  badge: "🥗 Consumer Portal",
  accentColor: "#f5a623",
  headingAccent: "Back",
  headingRest: "to Eating\nBetter.",
  sub: "Log in to track your daily nutrition, discover fresh produce from local farmers, and get personalised meal plans.",
  features: [
    { icon: "📊", title: "Nutrition Tracker",        desc: "Log meals and see your daily nutrient gaps" },
    { icon: "🤖", title: "AI Meal Recommendations",  desc: "Personalised next-day vegetable plans" },
    { icon: "🥦", title: "Farm-Fresh Marketplace",   desc: "Buy directly from verified local farmers" },
  ],
  toggleLabel: "Farmer",
  toggleIcon: "🌾",
};

interface Props {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

// ── Forgot Password View ──────────────────────────────────
function ForgotPasswordView({ onBack }: { onBack: () => void }) {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/forgotpassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Something went wrong."); return; }
      setSent(true);
    } catch {
      setError("Cannot connect to server. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full" style={{ maxWidth: "340px" }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#2d6a35", fontSize: "13px", fontWeight: 600, padding: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}
      >
        ← Back to Sign In
      </button>

      {/* Icon */}
      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "16px" }}>
        🔑
      </div>

      <h3
        className="font-black text-[#1a3a1f] leading-tight mb-1"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px" }}
      >
        Forgot your
      </h3>
      <h3
        className="font-black leading-tight mb-2"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#2d6a35", fontStyle: "italic" }}
      >
        Password?
      </h3>
      <p style={{ fontSize: "13px", color: "#b0aa9e", lineHeight: "1.6", marginBottom: "22px" }}>
        Enter your registered email and we will send you a link to reset your password.
      </p>

      {/* Success state */}
      {sent ? (
        <div style={{ background: "#e8f5e9", border: "1px solid #c8e6c9", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>📬</div>
          <p style={{ fontWeight: 700, color: "#2d6a35", fontSize: "14px", marginBottom: "4px" }}>Reset link sent!</p>
          <p style={{ fontSize: "12px", color: "#5a8a60" }}>Check your email inbox and follow the instructions to reset your password.</p>
          <button
            onClick={onBack}
            style={{ marginTop: "14px", background: "linear-gradient(135deg,#1a3a1f,#2d6a35)", color: "#fff", border: "none", borderRadius: "9px", padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "10px", padding: "10px 12px", color: "#c0392b", fontSize: "12px", marginBottom: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
              ⚠️ {error}
            </div>
          )}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "10px", fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: "6px" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", pointerEvents: "none" }}>✉️</span>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "⏳ Sending…" : "Send Reset Link →"}
          </button>
        </form>
      )}
    </div>
  );
}

// ── Main Login Modal ──────────────────────────────────────
export default function LoginModal({ onClose, onSwitchToRegister }: Props) {
  const router = useRouter();
  const [panel, setPanel]     = useState<"farmer" | "consumer">("farmer");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [remember, setRem]    = useState(false);
  const [loading, setLoad]    = useState(false);
  const [error, setError]     = useState("");
  const [showForgot, setForgot] = useState(false);

  const content = panel === "farmer" ? FARMER : CONSUMER;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoad(true); setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Invalid email or password."); return; }
      localStorage.setItem("agriai_token", data.token);
      localStorage.setItem("agriai_user", JSON.stringify(data));
      onClose();
      if (data.role === "admin")       router.push("/dashboard/admin");
      else if (data.role === "farmer") router.push("/dashboard/farmer");
      else                             router.push("/dashboard/consumer");
    } catch {
      setError("Cannot connect to server. Make sure your backend is running.");
    } finally { setLoad(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative flex w-full overflow-hidden"
        style={{ maxWidth: "820px", maxHeight: "92vh", borderRadius: "20px", boxShadow: "0 24px 60px rgba(0,0,0,0.3)", background: "#fff" }}
      >
        {/* ✕ Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "14px", right: "14px", zIndex: 20,
            width: "32px", height: "32px", borderRadius: "50%",
            background: "rgba(0,0,0,0.15)", border: "none", cursor: "pointer",
            color: "#fff", fontSize: "14px", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>

        {/* ── LEFT PANEL ── */}
        <div
          className="hidden md:flex md:w-[43%] flex-col justify-between relative overflow-hidden flex-shrink-0 grid-texture"
          style={{ background: "linear-gradient(160deg,#1a3a1f 0%,#0e2312 100%)", padding: "34px" }}
        >
          <div className="blob absolute w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "rgba(76,175,80,0.14)", filter: "blur(65px)", top: "-50px", right: "-35px" }} />
          <div className="blob-2 absolute w-52 h-52 rounded-full pointer-events-none"
            style={{ background: "rgba(245,166,35,0.1)", filter: "blur(55px)", bottom: "60px", left: "-25px" }} />

          <div className="relative z-10">
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "20px", color: "#fff" }}>
                Agri<span style={{ color: "#4caf50" }}>AI</span>
              </span>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4caf50", boxShadow: "0 0 8px #4caf50", display: "inline-block" }} />
            </div>

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 13px", borderRadius: "99px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "16px" }}>
              {content.badge}
            </div>

            {/* Headline */}
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "30px", color: "#fff", lineHeight: 1.15, marginBottom: "12px" }}>
              Welcome{" "}
              <span style={{ color: content.accentColor, fontStyle: "italic" }}>{content.headingAccent}</span>
              <br />
              {content.headingRest.split("\n").map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>

            {/* Sub */}
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: 1.65, marginBottom: "22px", maxWidth: "260px" }}>
              {content.sub}
            </p>

            {/* Features — 3 only (no compost) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {content.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 11px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(76,175,80,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{f.title}</div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setPanel(p => p === "farmer" ? "consumer" : "farmer")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "20px", padding: 0 }}
          >
            <span>{content.toggleIcon}</span>
            <span>Switch to <span style={{ textDecoration: "underline", color: "rgba(255,255,255,0.55)" }}>{content.toggleLabel} view</span></span>
          </button>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="flex-1 flex items-center justify-center overflow-y-auto"
          style={{ background: "#f9f5ec", padding: "36px 30px" }}
        >
          {showForgot ? (
            <ForgotPasswordView onBack={() => setForgot(false)} />
          ) : (
            <div className="w-full" style={{ maxWidth: "340px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "6px 14px", borderRadius: "99px", background: "#e8f5e9", border: "1px solid #c8e6c9", color: "#2d6a35", fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em", marginBottom: "16px" }}>
                🔑 SECURE LOGIN
              </div>

              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "25px", color: "#1a3a1f", lineHeight: 1.2, marginBottom: "4px" }}>
                Sign in to your <span style={{ color: "#2d6a35", fontStyle: "italic" }}>Account</span>
              </h3>
              <p style={{ fontSize: "12px", color: "#b0aa9e", lineHeight: 1.6, marginBottom: "20px" }}>
                Enter your credentials to access your personalised dashboard.
              </p>

              {error && (
                <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "10px", padding: "10px 12px", color: "#c0392b", fontSize: "12px", marginBottom: "14px", display: "flex", gap: "8px", alignItems: "center" }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "13px" }} noValidate>
                {/* Email */}
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: "0.07em" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", pointerEvents: "none" }}>✉️</span>
                    <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" className="input-field" />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "10px", fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: "0.07em" }}>Password</label>
                    <button
                      type="button"
                      onClick={() => setForgot(true)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 600, color: "#2d6a35", padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", pointerEvents: "none" }}>🔒</span>
                    <input type={showPw ? "text" : "password"} value={password} onChange={e => { setPass(e.target.value); setError(""); }} placeholder="Enter your password" className="input-field" style={{ paddingRight: "42px" }} />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#b0aa9e" }}>
                      {showPw ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input type="checkbox" id="lm-rem" checked={remember} onChange={e => setRem(e.target.checked)} style={{ width: "14px", height: "14px", accentColor: "#4caf50", cursor: "pointer" }} />
                  <label htmlFor="lm-rem" style={{ fontSize: "12px", color: "#9a948a", cursor: "pointer" }}>Keep me signed in for 30 days</label>
                </div>

                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "⏳ Signing in…" : "Sign In to AgriAI →"}
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: "12px", color: "#b0aa9e", marginTop: "18px" }}>
                New to AgriAI?{" "}
                <button onClick={onSwitchToRegister} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 600, color: "#2d6a35", fontSize: "12px" }}>
                  Create an account →
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
