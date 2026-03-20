"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { profileAPI } from "@/lib/axios-proxy";

// ── Types ──────────────────────────────────────────────────
interface FarmerForm {
  // Step 1
  phone: string; state: string; district: string; village: string; bio: string;
  // Step 2
  farmName: string; farmSize: string; farmSizeUnit: string;
  farmingType: string; irrigationType: string; soilType: string; experience: string;
  // Step 3
  crops: string[];
}

interface ConsumerForm {
  phone: string; state: string; district: string; village: string; bio: string;
  dietaryPreferences: string[];
  healthGoals: string[];
  deliveryAddress: { street: string; city: string; pincode: string };
}

// ── Static data ────────────────────────────────────────────
const SL_DISTRICTS = [
  "Ampara","Anuradhapura","Badulla","Batticaloa","Colombo",
  "Galle","Gampaha","Hambantota","Jaffna","Kalutara",
  "Kandy","Kegalle","Kilinochchi","Kurunegala","Mannar",
  "Matale","Matara","Monaragala","Mullaitivu","Nuwara Eliya",
  "Polonnaruwa","Puttalam","Ratnapura","Trincomalee","Vavuniya",
];
const SL_PROVINCES = ["Western","Central","Southern","Northern","Eastern","North Western","North Central","Uva","Sabaragamuwa"];
const FARMING_TYPES  = ["Organic","Conventional","Mixed","Hydroponic","Permaculture"];
const IRRIGATION     = ["Drip","Sprinkler","Flood","Rain-fed","Canal","Borewell","River"];
const SOIL_TYPES     = ["Clay","Sandy","Loamy","Silty","Peaty","Chalky","Black Cotton"];
const EXPERIENCE_OPT = ["Less than 1 year","1–3 years","3–5 years","5–10 years","10–20 years","20+ years"];
const CROPS_LIST     = ["Rice","Wheat","Cotton","Sugarcane","Soybean","Maize","Groundnut","Tomato","Onion","Potato","Mango","Banana","Chilli","Brinjal","Spinach","Carrot","Beetroot","Cabbage","Pumpkin","Beans"];
const DIETARY_PREFS  = ["Vegetarian","Vegan","Gluten-free","Dairy-free","Nut-free","Low-carb","High-protein","Diabetic-friendly"];
const HEALTH_GOALS   = ["Weight loss","Muscle gain","Heart health","Diabetes management","Immunity boost","Energy boost","Better digestion","General wellness"];

// ── Shared styles ──────────────────────────────────────────
const S = {
  label: {
    display: "block", fontSize: "13px", fontWeight: 600,
    color: "#374151", marginBottom: "6px",
  } as React.CSSProperties,
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: "10px", fontSize: "14px", fontFamily: "'DM Sans',sans-serif",
    color: "#111827", background: "#fff", outline: "none", boxSizing: "border-box",
    transition: "border-color .2s",
  } as React.CSSProperties,
  select: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: "10px", fontSize: "14px", fontFamily: "'DM Sans',sans-serif",
    color: "#111827", background: "#fff", outline: "none", boxSizing: "border-box",
    appearance: "none" as const, cursor: "pointer",
  } as React.CSSProperties,
};

// ── Chip selector ──────────────────────────────────────────
function ChipSelect({
  options, selected, onToggle, color = "#1a3a2a",
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button key={opt} onClick={() => onToggle(opt)} type="button" style={{
            padding: "7px 16px", borderRadius: "100px", fontSize: "13px",
            fontWeight: active ? 600 : 400, fontFamily: "'DM Sans',sans-serif",
            border: `1.5px solid ${active ? color : "#e5e7eb"}`,
            background: active ? color : "#fff",
            color: active ? "#fff" : "#374151",
            cursor: "pointer", transition: "all .18s",
          }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── Select wrapper with chevron ────────────────────────────
function SelectField({ label, value, onChange, options, placeholder }: {
  label?: string; value: string;
  onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <div>
      {label && <label style={S.label}>{label}</label>}
      <div style={{ position: "relative" }}>
        <select value={value} onChange={e => onChange(e.target.value)} style={S.select}>
          <option value="">{placeholder || "Select"}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{ position: "absolute", right: "14px", top: "50%",
          transform: "translateY(-50%)", pointerEvents: "none", fontSize: "12px", color: "#9ca3af" }}>▼</span>
      </div>
    </div>
  );
}

// ── Progress stepper ───────────────────────────────────────
function Stepper({ step, total, labels }: { step: number; total: number; labels: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      gap: 0, marginBottom: "32px" }}>
      {Array.from({ length: total }).map((_, i) => {
        const done    = i < step - 1;
        const current = i === step - 1;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "14px",
                fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
                background: done ? "#1a3a2a" : current ? "#1a3a2a" : "#f3f4f6",
                color: done || current ? "#fff" : "#9ca3af",
                border: `2px solid ${done || current ? "#1a3a2a" : "#e5e7eb"}`,
                transition: "all .3s",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: "11px", fontWeight: current ? 700 : 400,
                color: current ? "#1a3a2a" : done ? "#6b7280" : "#9ca3af",
                whiteSpace: "nowrap" }}>
                {labels[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div style={{ width: "80px", height: "2px", margin: "0 4px", marginBottom: "18px",
                background: done ? "#1a3a2a" : "#e5e7eb", transition: "background .3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  FARMER STEPS
// ══════════════════════════════════════════════════════════

function FarmerStep1({ form, set }: { form: FarmerForm; set: (k: keyof FarmerForm, v: any) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

      {/* Full name — pre-filled, read-only hint */}
      <div>
        <label style={{ ...S.label, display: "flex", alignItems: "center", gap: "6px" }}>
          <span>📋</span> Phone Number
        </label>
        <input style={S.input} type="tel" placeholder="+94 77 123 4567"
          value={form.phone} onChange={e => set("phone", e.target.value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <SelectField label="📍 State / Province" value={form.state}
          onChange={v => set("state", v)} options={SL_PROVINCES} placeholder="Select province" />
        <div>
          <label style={S.label}>District</label>
          <div style={{ position: "relative" }}>
            <select value={form.district} onChange={e => set("district", e.target.value)} style={S.select}>
              <option value="">Your district</option>
              {SL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span style={{ position: "absolute", right: "14px", top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none", fontSize: "12px", color: "#9ca3af" }}>▼</span>
          </div>
        </div>
      </div>

      <div>
        <label style={S.label}>🏘️ Village / Town</label>
        <input style={S.input} type="text" placeholder="Your village or town"
          value={form.village} onChange={e => set("village", e.target.value)} />
      </div>

      <div>
        <label style={S.label}>📝 Short Bio</label>
        <textarea style={{ ...S.input, resize: "vertical", minHeight: "90px" } as React.CSSProperties}
          placeholder="Tell us a bit about yourself and your farming journey..."
          value={form.bio} onChange={e => set("bio", e.target.value)} />
      </div>
    </div>
  );
}

function FarmerStep2({ form, set }: { form: FarmerForm; set: (k: keyof FarmerForm, v: any) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <label style={{ ...S.label, display: "flex", alignItems: "center", gap: "6px" }}>
          <span>🏛️</span> Farm Name
        </label>
        <input style={S.input} type="text" placeholder="e.g. Green Valley Farm"
          value={form.farmName} onChange={e => set("farmName", e.target.value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={{ ...S.label, display: "flex", alignItems: "center", gap: "6px" }}>
            <span>🏷️</span> Farm Size
          </label>
          <input style={S.input} type="number" placeholder="e.g. 5" min="0"
            value={form.farmSize} onChange={e => set("farmSize", e.target.value)} />
        </div>
        <SelectField label="Unit" value={form.farmSizeUnit}
          onChange={v => set("farmSizeUnit", v)}
          options={["acres","hectares","sq ft"]} placeholder="Unit" />
      </div>

      <SelectField label="🌱 Farming Type" value={form.farmingType}
        onChange={v => set("farmingType", v)}
        options={FARMING_TYPES} placeholder="Select type" />

      <SelectField label="💧 Irrigation Type" value={form.irrigationType}
        onChange={v => set("irrigationType", v)}
        options={IRRIGATION} placeholder="Select irrigation" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <SelectField label="🪨 Soil Type" value={form.soilType}
          onChange={v => set("soilType", v)}
          options={SOIL_TYPES} placeholder="Select soil" />
        <SelectField label="📅 Years of Experience" value={form.experience}
          onChange={v => set("experience", v)}
          options={EXPERIENCE_OPT} placeholder="Experience" />
      </div>
    </div>
  );
}

function FarmerStep3({ form, set }: { form: FarmerForm; set: (k: keyof FarmerForm, v: any) => void }) {
  const [customCrop, setCustomCrop] = useState("");

  const toggleCrop = (c: string) => {
    set("crops", form.crops.includes(c)
      ? form.crops.filter(x => x !== c)
      : [...form.crops, c]);
  };

  const addCustom = () => {
    const trimmed = customCrop.trim();
    if (trimmed && !form.crops.includes(trimmed)) {
      set("crops", [...form.crops, trimmed]);
      setCustomCrop("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "20px" }}>🌿</span>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>What do you grow?</span>
        </div>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "14px" }}>
          Select all crops you currently cultivate
        </p>
        <ChipSelect options={CROPS_LIST} selected={form.crops} onToggle={toggleCrop} />

        {/* Custom crop input */}
        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          <input style={{ ...S.input, flex: 1 }} type="text"
            placeholder="Add custom crop..."
            value={customCrop} onChange={e => setCustomCrop(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addCustom()} />
          <button onClick={addCustom} type="button" style={{
            width: "42px", height: "42px", borderRadius: "10px",
            background: "#1a3a2a", color: "#fff", border: "none",
            fontSize: "20px", cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>+</button>
        </div>

        {/* Selected chips display */}
        {form.crops.length > 0 && (
          <div style={{ marginTop: "12px", padding: "12px 14px", background: "#f0fdf4",
            borderRadius: "10px", border: "1px solid #bbf7d0" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#166534" }}>
              ✓ Selected: {form.crops.join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  CONSUMER STEPS
// ══════════════════════════════════════════════════════════

function ConsumerStep1({ form, set }: { form: ConsumerForm; set: (k: keyof ConsumerForm, v: any) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <label style={S.label}>📱 Phone Number</label>
        <input style={S.input} type="tel" placeholder="+94 77 123 4567"
          value={form.phone} onChange={e => set("phone", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <SelectField label="📍 Province" value={form.state}
          onChange={v => set("state", v)} options={SL_PROVINCES} placeholder="Select province" />
        <div>
          <label style={S.label}>District</label>
          <div style={{ position: "relative" }}>
            <select value={form.district} onChange={e => set("district", e.target.value)} style={S.select}>
              <option value="">Your district</option>
              {SL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span style={{ position: "absolute", right: "14px", top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none", fontSize: "12px", color: "#9ca3af" }}>▼</span>
          </div>
        </div>
      </div>
      <div>
        <label style={S.label}>🏘️ Village / Town</label>
        <input style={S.input} type="text" placeholder="Your village or town"
          value={form.village} onChange={e => set("village", e.target.value)} />
      </div>
      <div>
        <label style={S.label}>📝 Short Bio</label>
        <textarea style={{ ...S.input, resize: "vertical", minHeight: "80px" } as React.CSSProperties}
          placeholder="Tell us about yourself..."
          value={form.bio} onChange={e => set("bio", e.target.value)} />
      </div>
    </div>
  );
}

function ConsumerStep2({ form, set }: { form: ConsumerForm; set: (k: keyof ConsumerForm, v: any) => void }) {
  const togglePref = (v: string) => {
    set("dietaryPreferences", form.dietaryPreferences.includes(v)
      ? form.dietaryPreferences.filter(x => x !== v)
      : [...form.dietaryPreferences, v]);
  };
  const toggleGoal = (v: string) => {
    set("healthGoals", form.healthGoals.includes(v)
      ? form.healthGoals.filter(x => x !== v)
      : [...form.healthGoals, v]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>
          🥗 Dietary Preferences
        </div>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>Select all that apply</p>
        <ChipSelect options={DIETARY_PREFS} selected={form.dietaryPreferences} onToggle={togglePref} />
      </div>
      <div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>
          🎯 Health Goals
        </div>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>What are you working towards?</p>
        <ChipSelect options={HEALTH_GOALS} selected={form.healthGoals} onToggle={toggleGoal} />
      </div>
    </div>
  );
}

function ConsumerStep3({ form, set }: { form: ConsumerForm; set: (k: keyof ConsumerForm, v: any) => void }) {
  const setAddr = (k: string, v: string) =>
    set("deliveryAddress", { ...form.deliveryAddress, [k]: v });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "4px" }}>
          🚚 Delivery Address
        </div>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>
          For receiving fresh produce orders
        </p>
      </div>
      <div>
        <label style={S.label}>Street Address</label>
        <input style={S.input} type="text" placeholder="123 Main Street"
          value={form.deliveryAddress.street} onChange={e => setAddr("street", e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div>
          <label style={S.label}>City</label>
          <input style={S.input} type="text" placeholder="Colombo"
            value={form.deliveryAddress.city} onChange={e => setAddr("city", e.target.value)} />
        </div>
        <div>
          <label style={S.label}>Postal Code</label>
          <input style={S.input} type="text" placeholder="10250"
            value={form.deliveryAddress.pincode} onChange={e => setAddr("pincode", e.target.value)} />
        </div>
      </div>
      <div style={{ background: "#fffbeb", borderRadius: "10px", padding: "14px 16px",
        border: "1px solid #fde68a" }}>
        <div style={{ fontSize: "13px", color: "#92400e", fontWeight: 500 }}>
          💡 You can update your delivery address anytime from Settings.
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════
export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep]     = useState(1);
  const [role, setRole]     = useState<"farmer" | "consumer">("farmer");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [userName, setUserName] = useState("");

  // ── Farmer form state ────────────────────────────────
  const [ff, setFf] = useState<FarmerForm>({
    phone: "", state: "", district: "", village: "", bio: "",
    farmName: "", farmSize: "", farmSizeUnit: "acres",
    farmingType: "", irrigationType: "", soilType: "", experience: "",
    crops: [],
  });

  // ── Consumer form state ──────────────────────────────
  const [cf, setCf] = useState<ConsumerForm>({
    phone: "", state: "", district: "", village: "", bio: "",
    dietaryPreferences: [], healthGoals: [],
    deliveryAddress: { street: "", city: "", pincode: "" },
  });

  const setF = (k: keyof FarmerForm, v: any) => setFf(prev => ({ ...prev, [k]: v }));
  const setC = (k: keyof ConsumerForm, v: any) => setCf(prev => ({ ...prev, [k]: v }));

  // ── Auth guard + load user ───────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("agriai_user");
    const token  = localStorage.getItem("agriai_token");
    if (!stored || !token) { router.push("/"); return; }
    const u = JSON.parse(stored);
    setRole(u.role === "farmer" ? "farmer" : "consumer");
    setUserName(u.name || "");
  }, []);

  const FARMER_STEPS   = ["Personal Info", "Farm Details", "Crops"];
  const CONSUMER_STEPS = ["Personal Info", "Preferences", "Delivery"];
  const steps          = role === "farmer" ? FARMER_STEPS : CONSUMER_STEPS;
  const totalSteps     = 3;

  // ── Save current step to backend ────────────────────
  const saveStep = async (isLast = false) => {
    setSaving(true); setError("");
    try {
      const payload: any = isLast ? { isComplete: true } : {};

      if (role === "farmer") {
        if (step === 1) Object.assign(payload, {
          phone: ff.phone, state: ff.state, district: ff.district,
          village: ff.village, bio: ff.bio,
        });
        if (step === 2) Object.assign(payload, {
          farmName: ff.farmName,
          farmSize: ff.farmSize ? Number(ff.farmSize) : undefined,
          farmSizeUnit: ff.farmSizeUnit, farmingType: ff.farmingType,
          irrigationType: ff.irrigationType, soilType: ff.soilType,
          experience: ff.experience ? Number(ff.experience.split("–")[0]) : undefined,
        });
        if (step === 3) Object.assign(payload, { crops: ff.crops });
      } else {
        if (step === 1) Object.assign(payload, {
          phone: cf.phone, state: cf.state, district: cf.district,
          village: cf.village, bio: cf.bio,
        });
        if (step === 2) Object.assign(payload, {
          dietaryPreferences: cf.dietaryPreferences, healthGoals: cf.healthGoals,
        });
        if (step === 3) Object.assign(payload, { deliveryAddress: cf.deliveryAddress });
      }

      await profileAPI.save(payload);

      if (isLast) {
        // Redirect to dashboard
        router.push(role === "farmer" ? "/dashboard/farmer" : "/dashboard/consumer");
      } else {
        setStep(s => s + 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleNext     = () => step < totalSteps ? saveStep(false) : saveStep(true);
  const handleBack     = () => step > 1 && setStep(s => s - 1);
  const handleSkip     = () => step < totalSteps ? setStep(s => s + 1) : router.push(role === "farmer" ? "/dashboard/farmer" : "/dashboard/consumer");

  return (
    <div style={{
      minHeight: "100vh", background: "#f9fafb",
      fontFamily: "'DM Sans',sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px 60px",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: "28px", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "14px",
          background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", margin: "0 auto 12px" }}>🌿</div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#111827",
          fontFamily: "'Playfair Display',serif", margin: 0 }}>
          Set Up Your {role === "farmer" ? "Farm" : ""} Profile
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "6px" }}>
          {userName ? `Welcome, ${userName}! ` : ""}Tell us about yourself{role === "farmer" ? " and your farm" : ""} to get started
        </p>
      </div>

      {/* Stepper */}
      <Stepper step={step} total={totalSteps} labels={steps} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "640px",
        background: "#fff", borderRadius: "18px",
        padding: "32px 36px", boxShadow: "0 4px 24px rgba(0,0,0,.07)",
        border: "1px solid #f3f4f6",
      }}>

        {/* Error */}
        {error && (
          <div style={{ background: "#fff1f1", border: "1px solid #fcd0d0", borderRadius: "10px",
            padding: "10px 14px", color: "#c0392b", fontSize: "13px", marginBottom: "20px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Step content */}
        {role === "farmer" ? (
          <>
            {step === 1 && <FarmerStep1 form={ff} set={setF} />}
            {step === 2 && <FarmerStep2 form={ff} set={setF} />}
            {step === 3 && <FarmerStep3 form={ff} set={setF} />}
          </>
        ) : (
          <>
            {step === 1 && <ConsumerStep1 form={cf} set={setC} />}
            {step === 2 && <ConsumerStep2 form={cf} set={setC} />}
            {step === 3 && <ConsumerStep3 form={cf} set={setC} />}
          </>
        )}

        {/* Divider */}
        <div style={{ height: "1px", background: "#f3f4f6", margin: "28px 0" }} />

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={handleBack} disabled={step === 1} style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "11px 20px", borderRadius: "10px",
            border: "1.5px solid #e5e7eb", background: "#fff",
            color: step === 1 ? "#d1d5db" : "#374151",
            fontSize: "14px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif",
            cursor: step === 1 ? "not-allowed" : "pointer",
          }}>
            ← Back
          </button>

          <button onClick={handleSkip} style={{
            padding: "11px 16px", background: "none", border: "none",
            color: "#9ca3af", fontSize: "13px", cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            textDecoration: "underline",
          }}>
            Skip for now
          </button>

          <button onClick={handleNext} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "11px 24px", borderRadius: "10px", border: "none",
            background: saving ? "#6b7280" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)",
            color: "#fff", fontSize: "14px", fontWeight: 700,
            fontFamily: "'DM Sans',sans-serif",
            cursor: saving ? "not-allowed" : "pointer",
            transition: "opacity .2s",
          }}>
            {saving
              ? "Saving…"
              : step === totalSteps
              ? <><span>✓</span> Complete Setup</>
              : <>Next →</>
            }
          </button>
        </div>
      </div>

      {/* Footer note */}
      <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "20px" }}>
        You can always update your profile later from settings
      </p>
    </div>
  );
}