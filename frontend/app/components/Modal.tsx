"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/axios-proxy";

// ── Password strength helpers ──
function getStrength(pw: string): number {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const STRENGTH_COLORS = ["", "#e05252", "#f5a623", "#2d5a3d", "#4caf50"];
const STRENGTH_LABELS = ["Enter a password to check strength","Weak","Fair","Good","Strong"];

// ── Left panel content per role ──
const LEFT_CONTENT = {
  farmer: {
    signinHeading:   <>Welcome <em>Back,</em><br />Farmer.</>,
    registerHeading: <>Join <em>AgriAI</em><br />Today.</>,
    signinSub:   "Log in to access your crop dashboard, disease alerts, and marketplace listings.",
    registerSub: "Start farming smarter with AI disease detection, weather alerts, and direct marketplace access.",
    features: [
      ["🔬","AI Disease Detection","Diagnose crop problems in seconds"],
      ["⛈️","Smart Weather Alerts","Crop-specific forecasts for your farm"],
      ["🛒","Direct Marketplace","Sell fresh produce without middlemen"],
    ],
    testimonial: {
      quote:  "AgriAI helped me detect blight early and save 80% of my tomato harvest. The weather alerts are a game changer.",
      name:   "Nimal Perera",
      role:   "Farmer · Kandy, Sri Lanka",
      avatar: "👨‍🌾",
    },
  },
  consumer: {
    signinHeading:   <>Welcome <em>Back,</em><br />Consumer.</>,
    registerHeading: <>Start Eating <em>Smarter</em><br />Today.</>,
    signinSub:   "Log in to track your nutrition, get AI recommendations, and order fresh produce.",
    registerSub: "Track your nutrition, discover deficiencies, and get AI-powered vegetable plans daily.",
    features: [
      ["🥗","Nutrition Tracker","Log meals and track daily nutrient intake"],
      ["🧠","AI Recommendations","Get personalized vegetable plans daily"],
      ["🛒","Shop Fresh Produce","Order direct from verified local farmers"],
    ],
    testimonial: {
      quote:  "I started tracking my family's vegetables and within a week I knew exactly what nutrients we were missing.",
      name:   "Amaya De Silva",
      role:   "Consumer · Colombo, Sri Lanka",
      avatar: "👩",
    },
  },
};

interface Props {
  role: "farmer" | "consumer";
  onClose: () => void;
}

export default function Modal({ role, onClose }: Props) {
  const router = useRouter();

  const [tab, setTab]       = useState<"signin" | "register">("signin");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPass] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoad]  = useState(false);
  const [success, setSucc]  = useState(false);
  const [agree, setAgree]   = useState(false);
  const [remember, setRem]  = useState(false);
  const [error, setError]   = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const pwStr      = password.length === 0 ? 0 : getStrength(password);
  const c          = LEFT_CONTENT[role];
  const isSignIn   = tab === "signin";

  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const switchTab = (t: "signin" | "register") => {
    setTab(t); setError(""); setSucc(false);
  };

  // ── Helper: save user to localStorage correctly ────────
  // BUG FIX: store token separately from user object,
  // and never store the raw token inside the user object.
  const saveSession = (data: any) => {
    const { token, ...userWithoutToken } = data;
    localStorage.setItem("agriai_token", token);
    localStorage.setItem("agriai_user",  JSON.stringify(userWithoutToken));
  };

  // ── SIGN IN ────────────────────────────────────────────
  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter your email and password."); return;
    }
    setLoad(true); setError("");
    try {
      const { data } = await authAPI.login({ email, password });

      // FIX: save token and user separately
      saveSession(data);
      if (remember) localStorage.setItem("agriai_remember", "true");

      setSucc(true);
      setTimeout(() => {
        onClose();
        if      (data.role === "admin")  router.push("/dashboard/admin");
        else if (data.role === "farmer") router.push("/dashboard/farmer");
        else                             router.push("/dashboard/consumer");
      }, 1000);

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoad(false);
    }
  };

  // ── REGISTER ───────────────────────────────────────────
  const handleRegister = async () => {
    if (!name.trim())        { setError("Please enter your full name.");             return; }
    if (!email.trim())       { setError("Please enter your email address.");         return; }
    if (!password)           { setError("Please create a password.");                return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!agree)              { setError("Please accept the Terms of Service.");      return; }

    setLoad(true); setError("");
    try {
      const { data } = await authAPI.register({
        name:     name.trim(),
        email:    email.trim(),
        password,
        role:     role === "farmer" ? "farmer" : "user",
      });

      // FIX: save token and user separately
      saveSession(data);

      setSucc(true);
      setTimeout(() => {
        onClose();
        // ── Always go to profile setup first after registering ──
        router.push("/profile-setup");
      }, 1000);

    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlay}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* ── LEFT PANEL ── */}
        <div className="modal-left">
          <div>
            <div className="modal-logo">
              Agri<span className="ai-part">AI</span>
              <span className="modal-logo-dot" />
            </div>
            <div className="modal-heading">
              {isSignIn ? c.signinHeading : c.registerHeading}
            </div>
            <p className="modal-sub">
              {isSignIn ? c.signinSub : c.registerSub}
            </p>
            <div className="modal-features">
              {c.features.map(([icon, title, desc]) => (
                <div className="modal-feature" key={title}>
                  <div className="modal-feature-icon">{icon}</div>
                  <div className="modal-feature-text">
                    <strong>{title}</strong>
                    <span>— {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-testimonial">
            <div className="testimonial-text">
              &ldquo;{c.testimonial.quote}&rdquo;
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">{c.testimonial.avatar}</div>
              <div>
                <div className="author-name">{c.testimonial.name}</div>
                <div className="author-role">{c.testimonial.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="modal-right">

          {/* Tab switcher */}
          <div className="tab-row">
            <button className={`tab-btn${tab === "signin" ? " active" : ""}`}
              onClick={() => switchTab("signin")}>Sign In</button>
            <button className={`tab-btn${tab === "register" ? " active" : ""}`}
              onClick={() => switchTab("register")}>Create Account</button>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0",
              borderRadius: "10px", padding: "10px 14px", color: "#c0392b",
              fontSize: "13px", marginBottom: "14px",
              display: "flex", gap: "8px", alignItems: "center" }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── SIGN IN FORM ── */}
          {tab === "signin" && (
            <>
              <label className="field-label">Email Address</label>
              <div className="field-wrap">
                <span className="field-icon">✉️</span>
                <input className="field-input" type="email" placeholder="you@example.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(""); }} />
              </div>

              <label className="field-label">Password</label>
              <div className="field-wrap" style={{ marginBottom: 8 }}>
                <span className="field-icon">🔒</span>
                <input className="field-input" type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password} onChange={e => { setPass(e.target.value); setError(""); }} />
                <button className="toggle-pw" onClick={() => setShowPw(p => !p)}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
                <a href="#" className="forgot">Forgot password?</a>
              </div>

              <div className="remember-row">
                <input type="checkbox" id="rem" checked={remember}
                  onChange={e => setRem(e.target.checked)} />
                <label htmlFor="rem">Keep me signed in on this device</label>
              </div>

              <button className={`btn-submit${success ? " success" : ""}`}
                onClick={handleSignIn} disabled={loading || success}>
                {loading
                  ? <><div className="spinner" />Signing in…</>
                  : success
                  ? <><span className="check-mark">✓</span> Signed In!</>
                  : "Sign In →"
                }
              </button>

              <div className="create-link">
                Don&apos;t have an account?{" "}
                <a onClick={() => switchTab("register")}>Create one free →</a>
              </div>
            </>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === "register" && (
            <>
              <div className="reg-badge">
                <span className="reg-badge-dot" />
                Takes less than 2 minutes
              </div>

              <label className="field-label">Full Name</label>
              <div className="field-wrap">
                <span className="field-icon">👤</span>
                <input className="field-input" type="text" placeholder="Nimal Perera"
                  value={name} onChange={e => { setName(e.target.value); setError(""); }} />
              </div>

              <label className="field-label">Email Address</label>
              <div className="field-wrap">
                <span className="field-icon">✉️</span>
                <input className="field-input" type="email" placeholder="you@example.com"
                  value={email} onChange={e => { setEmail(e.target.value); setError(""); }} />
              </div>

              <label className="field-label">Password</label>
              <div className="field-wrap" style={{ marginBottom: 6 }}>
                <span className="field-icon">🔒</span>
                <input className="field-input" type={showPw ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password} onChange={e => { setPass(e.target.value); setError(""); }} />
                <button className="toggle-pw" onClick={() => setShowPw(p => !p)}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password strength bar */}
              <div className="strength-bar">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="strength-seg"
                    style={{ background: n <= pwStr ? STRENGTH_COLORS[pwStr] : "#e8e4dc" }} />
                ))}
              </div>
              <div className="strength-label" style={{ marginBottom: 16,
                color: pwStr > 0 ? STRENGTH_COLORS[pwStr] : undefined }}>
                {STRENGTH_LABELS[password.length === 0 ? 0 : pwStr]}
              </div>

              <div className="terms-row">
                <input type="checkbox" id="terms" checked={agree}
                  onChange={e => setAgree(e.target.checked)} />
                <label htmlFor="terms">
                  I agree to the <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>.{" "}
                  I consent to receiving crop alerts and updates.
                </label>
              </div>

              <button className={`btn-submit${success ? " success" : ""}`}
                onClick={handleRegister} disabled={loading || success || !agree}>
                {loading
                  ? <><div className="spinner" />Creating account…</>
                  : success
                  ? <><span className="check-mark">✓</span> Account Created!</>
                  : "Create My Account 🌱"
                }
              </button>

              <div className="create-link">
                Already have an account?{" "}
                <a onClick={() => switchTab("signin")}>Sign in →</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}