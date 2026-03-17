"use client";

import { useState, useEffect } from "react";

interface Props {
  onGetStarted: () => void;
}

export default function Navbar({ onGetStarted }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <a className="logo" href="#">Agri<span>AI</span></a>
        <ul className="nav-links">
          <li><a href="#farming">Smart Farming</a></li>
          <li><a href="#nutrition">Nutrition</a></li>
          <li><a href="#marketplace">Marketplace</a></li>
        </ul>
        <button className="btn-cta" onClick={onGetStarted}>
          Get Started
        </button>
      </div>
    </nav>
  );
}