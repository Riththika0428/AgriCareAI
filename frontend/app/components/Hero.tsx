"use client";

interface Props {
  onFarmer: () => void;
  onConsumer: () => void;
}

export default function Hero({ onFarmer, onConsumer }: Props) {
  return (
    <section className="hero">
      <div className="hero-inner">
        {/* Left content */}
        <div>
          <div className="hero-tag fade-up">
            <span className="hero-tag-dot" />
            AI-Powered Agriculture
          </div>
          <h1 className="hero-h1 fade-up-1">
            Grow <em>Smarter.</em><br />
            Eat <em>Better.</em>
          </h1>
          <p className="hero-p fade-up-2">
            AgriAI connects farmers with AI crop disease detection, smart
            weather alerts, and a direct marketplace — while helping consumers
            track nutrition and eat healthier every day.
          </p>
          <div className="hero-btns fade-up-3">
            <button className="btn-primary" onClick={onFarmer}>
              🌾 I&apos;m a Farmer
            </button>
            <button className="btn-secondary" onClick={onConsumer}>
              🥗 I&apos;m a Consumer
            </button>
          </div>
        </div>

        {/* Right cards */}
        <div className="hero-cards float-card fade-up-2">
          <div className="disease-card">
            <div className="disease-card-header">
              <div className="live-dot" />
              Disease Detection — Live
            </div>
            <div className="disease-result">
              <div className="disease-icon">🍅</div>
              <div>
                <div className="disease-name">Late Blight Detected</div>
                <div className="disease-sub">
                  Phytophthora infestans — Tomato
                </div>
              </div>
            </div>
            <div className="confidence-row">
              <span>Confidence</span>
              <span>94%</span>
            </div>
            <div className="confidence-bar">
              <div className="confidence-fill" />
            </div>
          </div>

          <div className="mini-cards">
            <div className="mini-card">
              <div className="mini-card-icon">⛈️</div>
              <div className="mini-card-title">Weather Alert</div>
              <div className="mini-card-sub">
                Heavy rain expected – protect your crops
              </div>
              <div className="weather-temps">
                {[["☀️","32°","Today"],["🌧️","26°","Tmrw"],["🌤️","29°","Thu"]].map(
                  ([icon, temp, day]) => (
                    <div className="temp-item" key={day}>
                      <div>{icon}</div>
                      <div className="deg">{temp}</div>
                      <div className="day">{day}</div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="mini-card">
              <div className="mini-card-icon">🥗</div>
              <div className="mini-card-title">Nutrition Score</div>
              <div className="mini-card-sub">
                Your Vitamin C intake is low today
              </div>
              <div className="nutrition-bar">
                <div className="nutrition-fill" />
              </div>
              <div className="nutrition-pct">42% of daily goal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}