"use client";

import { useEffect, useState, useRef } from "react";

interface Props {
  onFarmer: () => void;
  onConsumer: () => void;
}

export default function Hero({ onFarmer, onConsumer }: Props) {
  const [showDisease, setShowDisease] = useState(false);
  const [showMiniCards, setShowMiniCards] = useState(false);
  const [showWeatherTemps, setShowWeatherTemps] = useState(false);
  const [livePulse, setLivePulse] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShowDisease(true), 400);
    const t2 = setTimeout(() => setLivePulse(true), 800);
    const t4 = setTimeout(() => setShowMiniCards(true), 1200);
    const t5 = setTimeout(() => setShowWeatherTemps(true), 1600);

    return () => {
      [t1, t2, t4, t5].forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-inner">
        {/* Left content */}
        <div>
          <div className="hero-tag fade-up">
            <span className="hero-tag-dot" />
            AI-Powered Agriculture
          </div>
          <h1 className="hero-h1 fade-up-1">
            Grow <em>Smarter.</em>
            <br />
            Eat <em>Better.</em>
          </h1>
          <p className="hero-p fade-up-2">
            AgriAI connects farmers with AI crop disease detection, smart
            weather alerts, and a direct marketplace — while helping consumers
            track nutrition and eat healthier every day.
          </p>
          <div className="hero-btns fade-up-3">
            <button className="btn-primary hero-btn-anim" onClick={onFarmer}>
              🌾 I&apos;m a Farmer
            </button>
            <button
              className="btn-secondary hero-btn-anim"
              onClick={onConsumer}
            >
              🥗 I&apos;m a Consumer
            </button>
          </div>
        </div>

        {/* Right cards (Bento Grid) */}
        <div className="hero-bento">
          <div className="bento-col">
            {/* Top Left Card: Smart Farm */}
            <div
              className={`bento-card fade-up ${showDisease ? "revealed" : ""}`}
              style={{ backgroundImage: "url('/images/smart_farm.png')" }}
            >
              <div className="bento-overlay">
              </div>
            </div>

            {/* Bottom Left Card: Marketplace */}
            <div
              className={`bento-card fade-up ${showMiniCards ? "revealed" : ""}`}
              style={{ backgroundImage: "url('/images/marketplace.png')", animationDelay: "200ms" }}
            >
              <div className="bento-overlay">
              </div>
            </div>
          </div>

          <div className="bento-col tall">
            {/* Right Card: Nutritional Balance */}
            <div
              className={`bento-card tall-card fade-up ${showWeatherTemps ? "revealed" : ""}`}
              style={{ backgroundImage: "url('/images/nutritional_balance.png')", animationDelay: "400ms" }}
            >
              <div className="bento-overlay">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}