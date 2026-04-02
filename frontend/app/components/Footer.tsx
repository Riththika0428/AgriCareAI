// "use client";

// interface Props {
//   onFarmer: () => void;
//   onConsumer: () => void;
// }

// export default function Footer({ onFarmer, onConsumer }: Props) {
//   return (
//     <>
//       {/* ── CTA Section ── */}
//       <section className="cta-section">
//         <h2 className="cta-h2">
//           Ready to Transform<br />
//           <em>Your Farm &amp; Diet?</em>
//         </h2>
//         <p className="cta-p">
//           Join thousands of farmers and health-conscious consumers already
//           using AgriAI to grow smarter and eat better.
//         </p>
//         <div className="cta-btns">
//           <button className="btn-cta-white" onClick={onFarmer}>
//             🌾 Start as a Farmer
//           </button>
//           <button className="btn-cta-outline" onClick={onConsumer}>
//             🥗 Start as a Consumer
//           </button>
//         </div>
//       </section>

//       {/* ── Footer ── */}
//       <footer>
//         <div className="footer-links">
//           <a href="#">AgriAI Platform</a>
//           <span>·</span>
//           <a href="#farming">Smart Farming</a>
//           <span>·</span>
//           <a href="#nutrition">Nutrition Tracking</a>
//           <span>·</span>
//           <a href="#marketplace">Direct Marketplace</a>
//         </div>
//         <div className="footer-copy">
//           © 2026 AgriAI · Empowering Farmers, Nourishing Communities
//         </div>
//       </footer>
//     </>
//   );
// }

"use client";

interface Props {
  onFarmer: () => void;
  onConsumer: () => void;
}

export default function Footer({ onFarmer, onConsumer }: Props) {
  return (
    <>
      {/* ── CTA Section ── */}
      <section className="cta-section">
        <h2 className="cta-h2">
          Ready to Transform<br />
          <em>Your Farm &amp; Diet?</em>
        </h2>
        <p className="cta-p">
          Join thousands of farmers and health-conscious consumers already
          using AgriAI to grow smarter and eat better.
        </p>
        <div className="cta-btns">
          <button className="btn-cta-white" onClick={onFarmer}>
            🌾 Start as a Farmer
          </button>
          <button className="btn-cta-outline" onClick={onConsumer}>
            🥗 Start as a Consumer
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="footer-links">
          <a href="#">AgriAI Platform</a>
          <span>·</span>
          <a href="#farming">Smart Farming</a>
          <span>·</span>
          <a href="#nutrition">Nutrition Tracking</a>
          <span>·</span>
          <a href="#marketplace">Direct Marketplace</a>
        </div>
        <div className="footer-copy">
          © 2026 AgriAI · Empowering Farmers, Nourishing Communities
        </div>
      </footer>
    </>
  );
}