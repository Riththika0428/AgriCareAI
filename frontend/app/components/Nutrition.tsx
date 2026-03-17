"use client";

const VEGS = [
  ["🥕", "Carrot",   "200g · Vitamin A ✓", "#f59e0b", "75%"],
  ["🥦", "Broccoli", "150g · Vitamin C ✓", "#22c55e", "55%"],
  ["🌿", "Spinach",  "80g · Iron ✓",       "#16a34a", "40%"],
];

const NUTRIENTS = [
  ["88%", "Vitamin A", false],
  ["42%", "Vitamin C", true],
  ["76%", "Iron",      false],
  ["31%", "Calcium",   true],
];

const FEATURES = [
  ["✏️","Daily Vegetable Logging","Quickly log your meals and vegetable intake. Simple, fast, and visual."],
  ["🧠","AI Nutrient Gap Analysis","Our AI maps your intake to essential nutrients and highlights what you're missing each day."],
  ["📅","Personalized Next-Day Plan","Receive a smart vegetable plan to fill gaps and build healthier long-term habits."],
];

export default function Nutrition() {
  return (
    <section className="section nutrition-section" id="nutrition">
      <div className="section-inner">
        <div className="nutrition-grid">

          {/* Left — tracker card */}
          <div className="tracker-card">
            <div className="tracker-header">
              <div className="tracker-title">🥗 Daily Nutrition Tracker</div>
              <div className="tracker-date">Mar 16, 2026</div>
            </div>

            {VEGS.map(([icon, name, sub, color, width]) => (
              <div className="veg-row" key={name}>
                <div className="veg-icon">{icon}</div>
                <div className="veg-info">
                  <div className="veg-name">{name}</div>
                  <div className="veg-sub">{sub}</div>
                </div>
                <div className="veg-bar" style={{ maxWidth: 120 }}>
                  <div
                    className="veg-fill"
                    style={{ width, background: color }}
                  />
                </div>
              </div>
            ))}

            <div className="nutrient-scores">
              {NUTRIENTS.map(([pct, label, low]) => (
                <div
                  className={`nutrient-score${low ? " low" : ""}`}
                  key={label as string}
                >
                  <div className={`score-pct${low ? " low" : ""}`}>{pct}</div>
                  <div className="score-label">{label}</div>
                </div>
              ))}
            </div>

            <div className="ai-rec">
              <div className="ai-rec-title">
                🤖 AI Recommends for Tomorrow
              </div>
              <div className="rec-chips">
                {["🍊 Orange","🥛 Milk","🫑 Bell Pepper","🌰 Almonds"].map(c => (
                  <div className="rec-chip" key={c}>{c}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — text + features */}
          <div>
            <div className="section-tag">Smart Nutrition Module</div>
            <h2 className="section-h2">Know What Your Body Is Missing</h2>
            <p className="section-p">
              Log what you eat and let AI identify your nutrient gaps. Get a
              personalized vegetable plan every day to build a genuinely
              balanced, healthy diet.
            </p>
            <div className="feature-list" style={{ marginTop: 28 }}>
              {FEATURES.map(([icon, title, desc]) => (
                <div className="feature-item" key={title}>
                  <div className="feature-item-icon">{icon}</div>
                  <div>
                    <div className="feature-item-title">{title}</div>
                    <div className="feature-item-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}