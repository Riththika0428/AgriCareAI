// "use client";

// const FEATURES = [
//   ["🔬","AI Crop Disease Detection","Upload a photo and our model identifies diseases instantly with treatment recommendations — both organic and chemical."],
//   ["⛈️","Crop-Specific Weather Alerts","Get alerts for rain, drought, and wind events — customized for the specific crops you're growing."],
//   ["📋","Crop Tracking & Management","Log your fields, growth stages, and harvests. Track everything from planting to sale in one dashboard."],
// ];

// export default function SmartFarming() {
//   return (
//     <section className="section" id="farming">
//       <div className="section-inner">
//         <div className="farming-grid">

//           {/* Left — text + features */}
//           <div>
//             <div className="section-tag">Smart Farming Module</div>
//             <h2 className="section-h2">AI That Protects Your Harvest</h2>
//             <p className="section-p">
//               Upload a photo of your crop and get instant disease diagnosis,
//               treatment options, and real-time weather alerts tailored to
//               your location.
//             </p>
//             <div className="feature-list">
//               {FEATURES.map(([icon, title, desc]) => (
//                 <div className="feature-item" key={title}>
//                   <div className="feature-item-icon">{icon}</div>
//                   <div>
//                     <div className="feature-item-title">{title}</div>
//                     <div className="feature-item-desc">{desc}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right — disease UI card */}
//           <div className="disease-ui">
//             <div className="disease-ui-header">
//               <div className="live-dot" />
//               AI Analysis Running
//             </div>
//             <div className="upload-zone">
//               <div className="upload-icon">📸</div>
//               <div className="upload-title">Upload Crop Photo</div>
//               <div className="upload-sub">
//                 Drag & drop or tap to browse · JPG, PNG supported
//               </div>
//             </div>
//             <div className="result-card">
//               <div className="result-header">
//                 <span className="result-status">Analysis Complete</span>
//                 <span className="result-badge">⚠ Disease Found</span>
//               </div>
//               <div className="result-name">Powdery Mildew</div>
//               <div className="result-sub">
//                 Detected on: Chili Pepper leaves · Severity: Moderate
//               </div>
//               <div className="ai-conf">
//                 <span>AI Confidence</span>
//                 <span>88%</span>
//               </div>
//               <div className="conf-bar">
//                 <div className="conf-fill" />
//               </div>
//               <div className="treatment-btns">
//                 <button className="treat-btn organic">
//                   🌿 Organic Treatment
//                 </button>
//                 <button className="treat-btn chemical">
//                   🧪 Chemical Options
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

const FEATURES = [
  ["🔬","AI Crop Disease Detection","Upload a photo and our model identifies diseases instantly with treatment recommendations — both organic and chemical."],
  ["⛈️","Crop-Specific Weather Alerts","Get alerts for rain, drought, and wind events — customized for the specific crops you're growing."],
  ["📋","Crop Tracking & Management","Log your fields, growth stages, and harvests. Track everything from planting to sale in one dashboard."],
];

export default function SmartFarming() {
  return (
    <section className="section" id="farming">
      <div className="section-inner">
        <div className="farming-grid">

          {/* Left — text + features */}
          <div>
            <div className="section-tag">Smart Farming Module</div>
            <h2 className="section-h2">AI That Protects Your Harvest</h2>
            <p className="section-p">
              Upload a photo of your crop and get instant disease diagnosis,
              treatment options, and real-time weather alerts tailored to
              your location.
            </p>
            <div className="feature-list">
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

          {/* Right — disease UI card */}
          <div className="disease-ui">
            <div className="disease-ui-header">
              <div className="live-dot" />
              AI Analysis Running
            </div>
            <div className="upload-zone">
              <div className="upload-icon">📸</div>
              <div className="upload-title">Upload Crop Photo</div>
              <div className="upload-sub">
                Drag & drop or tap to browse · JPG, PNG supported
              </div>
            </div>
            <div className="result-card">
              <div className="result-header">
                <span className="result-status">Analysis Complete</span>
                <span className="result-badge">⚠ Disease Found</span>
              </div>
              <div className="result-name">Powdery Mildew</div>
              <div className="result-sub">
                Detected on: Chili Pepper leaves · Severity: Moderate
              </div>
              <div className="ai-conf">
                <span>AI Confidence</span>
                <span>88%</span>
              </div>
              <div className="conf-bar">
                <div className="conf-fill" />
              </div>
              <div className="treatment-btns">
                <button className="treat-btn organic">
                  🌿 Organic Treatment
                </button>
                <button className="treat-btn chemical">
                  🧪 Chemical Options
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}