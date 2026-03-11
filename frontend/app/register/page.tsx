"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm]    = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPw, setShow]  = useState(false);
  const [agreed, setAgree] = useState(false);
  const [loading, setLoad] = useState(false);
  const [error, setError]  = useState("");
  const [ferrs, setFerrs]  = useState<Record<string, string>>({});

  const pwStr = form.password.length === 0 ? 0 : getStrength(form.password);

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFerrs(prev => ({ ...prev, [e.target.name]: "" }));
    setError("");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.password || form.password.length < 8) e.password = "Minimum 8 characters required";
    if (!agreed) e.terms = "Please accept the terms";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields first
    const errs = validate();
    if (Object.keys(errs).length) {
      setFerrs(errs);
      return;
    }

    setLoad(true);
    setError("");

    try {
      // Call your backend API directly
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            password: form.password,
            role: "user",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Backend returned an error (e.g. email already exists)
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      // Save token and user to localStorage
      localStorage.setItem("agriai_token", data.token);
      localStorage.setItem("agriai_user",  JSON.stringify(data));

      // Redirect based on role
      if (data.role === "farmer") router.push("/dashboard/farmer");
      else                        router.push("/dashboard/consumer");

    } catch (err) {
      // Network error — backend is probably not running
      setError("Cannot connect to server. Make sure your backend is running.");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-[46%] flex-col justify-between relative overflow-hidden grid-texture"
        style={{ background: "linear-gradient(160deg, #1a3a1f 0%, #0e2312 100%)" }}
      >
        {/* Blobs */}
        <div className="blob absolute w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "rgba(76,175,80,0.13)", filter: "blur(78px)", top: "-65px", right: "-45px" }} />
        <div className="blob-2 absolute w-60 h-60 rounded-full pointer-events-none"
          style={{ background: "rgba(245,166,35,0.09)", filter: "blur(64px)", bottom: "55px", left: "-38px" }} />

        <div className="relative z-10 p-11">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-11">
            <span
              className="text-[22px] font-black text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Agri<span style={{ color: "#4caf50" }}>AI</span>
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#4caf50", boxShadow: "0 0 8px #4caf50", animation: "pulseDot 2s ease-in-out infinite" }}
            />
          </div>

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-[11px] font-bold tracking-wide mb-5">
            🌱 Create Your Account
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up-1 text-[38px] font-black text-white leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join{" "}
            <span style={{ color: "#f5a623", fontStyle: "italic" }}>12,000+</span>
            <br />Farmers &amp;
            <br />Consumers.
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up-2 text-white/50 text-sm leading-relaxed mb-7 max-w-xs">
            Create your free account and start growing smarter — AI disease
            detection, weather alerts, and a direct marketplace await.
          </p>

          {/* Features */}
          <div className="animate-fade-up-3 flex flex-col gap-2.5">
            {[
              { icon: "🌾", title: "For Farmers",     desc: "AI disease scan, crop tracking, sell direct" },
              { icon: "🥦", title: "For Consumers",   desc: "Daily nutrition tracking, AI meal plans, fresh produce" },
              { icon: "🌿", title: "Organic Compost", desc: "Lab-certified compost delivered farm-side" },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-white/10 bg-white/5"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: "rgba(76,175,80,0.18)" }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-white/90">{f.title}</div>
                  <div className="text-[11px] text-white/40">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 p-11 pt-0">
          <div className="text-[11px] text-white/20 flex items-center gap-2">
            🔒 256-bit SSL secured · No credit card required
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto"
        style={{ background: "#f9f5ec" }}
      >
        <div className="w-full max-w-[390px]">

          {/* Top label */}
          <div className="animate-fade-up flex items-center gap-2 text-[10.5px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#4caf50" }} />
            Takes less than 2 minutes · No credit card required
          </div>

          {/* Heading */}
          <h2
            className="animate-fade-up-1 text-[29px] font-black text-[#1a3a1f] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Create your
          </h2>
          <h2
            className="animate-fade-up-1 text-[29px] font-black leading-tight mb-5"
            style={{ fontFamily: "'Playfair Display', serif", color: "#2d6a35", fontStyle: "italic" }}
          >
            AgriAI Account
          </h2>

          {/* Error banner */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{ background: "#fff1f1", border: "1px solid #fcd0d0", color: "#c0392b" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>

            {/* First + Last name */}
            <div className="animate-fade-up-2 flex gap-3">
              {(["firstName", "lastName"] as const).map((field, i) => (
                <div key={field} className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                    {i === 0 ? "First Name" : "Last Name"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">👤</span>
                    <input
                      type="text"
                      name={field}
                      value={form[field]}
                      onChange={change}
                      placeholder={i === 0 ? "Nimal" : "Perera"}
                      className={`input-field ${ferrs[field] ? "error" : ""}`}
                    />
                  </div>
                  {ferrs[field] && (
                    <p className="text-[11px]" style={{ color: "#e05252" }}>{ferrs[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="animate-fade-up-3 flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={change}
                  placeholder="you@example.com"
                  className={`input-field ${ferrs.email ? "error" : ""}`}
                />
              </div>
              {ferrs.email && (
                <p className="text-[11px]" style={{ color: "#e05252" }}>{ferrs.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="animate-fade-up-4 flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔒</span>
                <input
                  type={showPw ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={change}
                  placeholder="Create a strong password"
                  className={`input-field ${ferrs.password ? "error" : ""}`}
                  style={{ paddingRight: "42px" }}
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-sm"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#b0aa9e" }}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Strength bar */}
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map(n => (
                  <div
                    key={n}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      background: n <= pwStr ? strColors[pwStr] : "#e0ddd6",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
              <p
                className="text-[11px] font-semibold"
                style={{ color: pwStr > 0 ? strColors[pwStr] : "#c8c4bc" }}
              >
                {strLabels[form.password.length === 0 ? 0 : pwStr]}
              </p>

              {ferrs.password && (
                <p className="text-[11px]" style={{ color: "#e05252" }}>{ferrs.password}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="animate-fade-up-4">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={e => {
                    setAgree(e.target.checked);
                    setFerrs(p => ({ ...p, terms: "" }));
                  }}
                  className="mt-0.5 w-4 h-4 cursor-pointer flex-shrink-0"
                  style={{ accentColor: "#4caf50" }}
                />
                <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="font-semibold underline underline-offset-2"
                    style={{ color: "#2d6a35" }}>
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold underline underline-offset-2"
                    style={{ color: "#2d6a35" }}>
                    Privacy Policy
                  </Link>.
                  {" "}I consent to receive crop alerts and nutrition updates.
                </label>
              </div>
              {ferrs.terms && (
                <p className="text-[11px] mt-1" style={{ color: "#e05252" }}>{ferrs.terms}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary animate-fade-up-5 mt-1"
            >
              {loading ? "⏳ Creating Account…" : "Create My Account 🌱"}
            </button>
          </form>

          {/* Switch to login */}
          <p className="text-center text-sm mt-5" style={{ color: "#b0aa9e" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold"
              style={{ color: "#2d6a35" }}
            >
              Sign in →
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}