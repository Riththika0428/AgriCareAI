// "use client";

// const STATS = [
//   ["12,400+", "Active Farmers"],
//   ["94%",     "Disease Detection Accuracy"],
//   ["38,000+", "Consumers Tracked"],
//   ["2,200+",  "Products Listed"],
// ];

// export default function Stats() {
//   return (
//     <div className="stats">
//       <div className="stats-inner">
//         {STATS.map(([num, label]) => (
//           <div className="stat-item" key={label}>
//             <div className="stat-num">{num}</div>
//             <div className="stat-label">{label}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

const STATS = [
  ["12,400+", "Active Farmers"],
  ["94%",     "Disease Detection Accuracy"],
  ["38,000+", "Consumers Tracked"],
  ["2,200+",  "Products Listed"],
];

export default function Stats() {
  return (
    <div className="stats">
      <div className="stats-inner">
        {STATS.map(([num, label]) => (
          <div className="stat-item" key={label}>
            <div className="stat-num">{num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}