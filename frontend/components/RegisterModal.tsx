"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function getStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const strColors = ["", "#e05252", "#f5a623", "#2d6a35", "#4caf50"];
const strLabels = ["Enter a password to check strength", "Weak", "Fair", "Good", "Strong"];

interface Props {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ onClose, onSwitchToLogin }: Props) {
  const router = useRouter();

  // Single name field now
  const [name, setName]      = useState("");
  const [email, setEmail]    = useState("");
  const [password, setPass]  = useState("");
  const [showPw, setShow]    = useState(false);
  const [agreed, setAgree]   = useState(false);
  const [loading, setLoad]   = useState(false);
  const [error, setError]    = useState("");
  const [ferrs, setFerrs]    = useState<Record<string, string>>({});

  const pwStr = password.length === 0 ? 0 : getStrength(password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())                                          e.name     = "Name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))        e.email    = "Valid email is required";
    if (!password || password.length < 8)                     e.password = "Minimum 8 characters required";
    if (!agreed)                                              e.terms    = "Please accept the terms";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFerrs(errs); return; }
    setLoad(true); setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email, password, role: "user" }),
        }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed. Please try again."); return; }
      localStorage.setItem("agriai_token", data.token);
      localStorage.setItem("agriai_user",  JSON.stringify(data));
      onClose();
      if (data.role === "farmer") router.push("/dashboard/farmer");
      else                        router.push("/dashboard/consumer");
    } catch {
      setError("Cannot connect to server. Make sure your backend is running.");
    } finally { setLoad(false); }
  };

  const clrErr = (field: string, inp: HTMLInputElement) => {
    inp.classList.remove("error");
    setFerrs(p => ({ ...p, [field]: "" }));
    setError("");
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
            style={{ background: "rgba(76,175,80,0.13)", filter: "blur(68px)", top: "-50px", right: "-35px" }} />
          <div className="blob-2 absolute w-52 h-52 rounded-full pointer-events-none"
            style={{ background: "rgba(245,166,35,0.09)", filter: "blur(58px)", bottom: "55px", left: "-25px" }} />

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
              🌱 Create Your Account
            </div>

            {/* Headline */}
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "30px", color: "#fff", lineHeight: 1.15, marginBottom: "12px" }}>
              Join{" "}
              <span style={{ color: "#f5a623", fontStyle: "italic" }}>12,000+</span>
              <br />Farmers &amp;
              <br />Consumers.
            </h2>

            {/* Sub */}
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: 1.65, marginBottom: "22px", maxWidth: "260px" }}>
              Create your free account and start growing smarter — AI disease detection, weather alerts, and a direct marketplace await.
            </p>

            {/* Features — 2 only (no compost) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { icon: "🌾", title: "For Farmers",   desc: "AI disease scan, crop tracking, sell direct" },
                { icon: "🥦", title: "For Consumers", desc: "Daily nutrition tracking, AI meal plans, fresh produce" },
              ].map((f, i) => (
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

          {/* Bottom */}
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginTop: "20px" }}>
            🔒 256-bit SSL secured · No credit card required
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div
          className="flex-1 flex items-center justify-center overflow-y-auto"
          style={{ background: "#f9f5ec", padding: "36px 30px" }}
        >
          <div className="w-full" style={{ maxWidth: "340px" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", fontWeight: 700, color: "#b0a898", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4caf50", display: "inline-block" }} />
              Takes less than 2 minutes
            </div>

            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "25px", color: "#1a3a1f", lineHeight: 1.2 }}>
              Create your
            </h3>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: "25px", color: "#2d6a35", fontStyle: "italic", lineHeight: 1.2, marginBottom: "20px" }}>
              AgriAI Account
            </h3>

            {error && (
              <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "10px", padding: "10px 12px", color: "#c0392b", fontSize: "12px", marginBottom: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }} noValidate>

              {/* Single Name field */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: "0.07em" }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", pointerEvents: "none" }}>👤</span>
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setFerrs(p => ({ ...p, name: "" })); setError(""); }}
                    placeholder="Nimal Perera"
                    className={`input-field ${ferrs.name ? "error" : ""}`}
                  />
                </div>
                {ferrs.name && <p style={{ fontSize: "11px", color: "#e05252" }}>{ferrs.name}</p>}
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: "0.07em" }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", pointerEvents: "none" }}>✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setFerrs(p => ({ ...p, email: "" })); setError(""); }}
                    placeholder="you@example.com"
                    className={`input-field ${ferrs.email ? "error" : ""}`}
                  />
                </div>
                {ferrs.email && <p style={{ fontSize: "11px", color: "#e05252" }}>{ferrs.email}</p>}
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "10px", fontWeight: 700, color: "#a09a90", textTransform: "uppercase", letterSpacing: "0.07em" }}>Password</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", pointerEvents: "none" }}>🔒</span>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => { setPass(e.target.value); setFerrs(p => ({ ...p, password: "" })); setError(""); }}
                    placeholder="Create a strong password"
                    className={`input-field ${ferrs.password ? "error" : ""}`}
                    style={{ paddingRight: "42px" }}
                  />
                  <button type="button" onClick={() => setShow(v => !v)}
                    style={{ position: "absolute", right: "11px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#b0aa9e" }}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
                {/* Strength bar */}
                <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                  {[1,2,3,4].map(n => (
                    <div key={n} style={{ height: "4px", flex: 1, borderRadius: "4px", background: n <= pwStr ? strColors[pwStr] : "#e0ddd6", transition: "background 0.3s" }} />
                  ))}
                </div>
                <p style={{ fontSize: "11px", fontWeight: 600, color: pwStr > 0 ? strColors[pwStr] : "#c8c4bc" }}>
                  {strLabels[password.length === 0 ? 0 : pwStr]}
                </p>
                {ferrs.password && <p style={{ fontSize: "11px", color: "#e05252" }}>{ferrs.password}</p>}
              </div>

              {/* Terms */}
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                  <input
                    type="checkbox"
                    id="rm-terms"
                    checked={agreed}
                    onChange={e => { setAgree(e.target.checked); setFerrs(p => ({ ...p, terms: "" })); }}
                    style={{ width: "14px", height: "14px", marginTop: "2px", accentColor: "#4caf50", cursor: "pointer", flexShrink: 0 }}
                  />
                  <label htmlFor="rm-terms" style={{ fontSize: "11px", color: "#9a948a", cursor: "pointer", lineHeight: 1.55 }}>
                    I agree to the{" "}
                    <span style={{ color: "#2d6a35", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "2px" }}>Terms of Service</span>
                    {" "}and{" "}
                    <span style={{ color: "#2d6a35", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "2px" }}>Privacy Policy</span>.
                  </label>
                </div>
                {ferrs.terms && <p style={{ fontSize: "11px", color: "#e05252", marginTop: "4px" }}>{ferrs.terms}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "2px" }}>
                {loading ? "⏳ Creating Account…" : "Create My Account 🌱"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "12px", color: "#b0aa9e", marginTop: "16px" }}>
              Already have an account?{" "}
              <button onClick={onSwitchToLogin} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 600, color: "#2d6a35", fontSize: "12px" }}>
                Sign in →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}