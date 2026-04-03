// "use client";

// const PRODUCTS = [
//   { badge:"Just Harvested", icon:"🥦", bg:"#edf7ee", name:"Organic Broccoli",  farmer:"Nimal Perera",  farm:"Kandy Farm",  stars:5, reviews:48, price:"Rs. 120", unit:"/ 500g" },
//   { badge:"Organic",        icon:"🥕", bg:"#fef9eb", name:"Fresh Carrots",     farmer:"Kumari Silva", farm:"Nuwara Farm", stars:4, reviews:31, price:"Rs. 95",  unit:"/ kg"   },
//   { badge:"Best Seller",    icon:"🍅", bg:"#eef4fb", name:"Vine Tomatoes",     farmer:"Asanka Raj",   farm:"Matale Farm", stars:5, reviews:72, price:"Rs. 140", unit:"/ kg"   },
// ];

// export default function Marketplace() {
//   return (
//     <section className="section marketplace-section" id="marketplace">
//       <div className="section-inner">
//         <div className="market-header">
//           <div className="section-tag">Direct Marketplace</div>
//           <h2 className="section-h2" style={{ textAlign: "center" }}>
//             Farm to Table — No Middlemen
//           </h2>
//           <p className="section-p" style={{ textAlign: "center" }}>
//             Buy fresh vegetables directly from local farmers. Better prices,
//             fresher produce, and direct support for the people who grow your food.
//           </p>
//         </div>

//         <div className="products-grid">
//           {PRODUCTS.map(p => (
//             <div className="product-card" key={p.name}>
//               <div className="product-img" style={{ background: p.bg }}>
//                 <span>{p.icon}</span>
//                 <div className="product-badge">{p.badge}</div>
//               </div>
//               <div className="product-body">
//                 <div className="product-name">{p.name}</div>
//                 <div className="product-farmer">
//                   <div className="farmer-avatar">👤</div>
//                   {p.farmer} · {p.farm}
//                 </div>
//                 <div>
//                   <span className="stars">
//                     {"★".repeat(p.stars)}{"☆".repeat(5 - p.stars)}
//                   </span>
//                   <span style={{ fontSize: 12, color: "var(--text-soft)" }}>
//                     {" "}({p.reviews})
//                   </span>
//                 </div>
//                 <div className="product-footer">
//                   <div className="product-price">
//                     {p.price} <span>{p.unit}</span>
//                   </div>
//                   <button className="add-btn">+</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

const PRODUCTS = [
  { badge:"Just Harvested", icon:"🥦", bg:"#edf7ee", name:"Organic Broccoli",  farmer:"Nimal Perera",  farm:"Kandy Farm",  stars:5, reviews:48, price:"Rs. 120", unit:"/ 500g" },
  { badge:"Organic",        icon:"🥕", bg:"#fef9eb", name:"Fresh Carrots",     farmer:"Kumari Silva", farm:"Nuwara Farm", stars:4, reviews:31, price:"Rs. 95",  unit:"/ kg"   },
  { badge:"Best Seller",    icon:"🍅", bg:"#eef4fb", name:"Vine Tomatoes",     farmer:"Asanka Raj",   farm:"Matale Farm", stars:5, reviews:72, price:"Rs. 140", unit:"/ kg"   },
];

export default function Marketplace() {
  return (
    <section className="section marketplace-section" id="marketplace">
      <div className="section-inner">
        <div className="market-header">
          <div className="section-tag">Direct Marketplace</div>
          <h2 className="section-h2" style={{ textAlign: "center" }}>
            Farm to Table - No Middlemen
          </h2>
          <p className="section-p" style={{ textAlign: "center" }}>
            Buy fresh vegetables directly from local farmers. Better prices,
            fresher produce, and direct support for the people who grow your food.
          </p>
        </div>

        <div className="products-grid">
          {PRODUCTS.map(p => (
            <div className="product-card" key={p.name}>
              <div className="product-img" style={{ background: p.bg }}>
                <span>{p.icon}</span>
                <div className="product-badge">{p.badge}</div>
              </div>
              <div className="product-body">
                <div className="product-name">{p.name}</div>
                <div className="product-farmer">
                  <div className="farmer-avatar">👤</div>
                  {p.farmer} · {p.farm}
                </div>
                <div>
                  <span className="stars">
                    {"★".repeat(p.stars)}{"☆".repeat(5 - p.stars)}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-soft)" }}>
                    {" "}({p.reviews})
                  </span>
                </div>
                <div className="product-footer">
                  <div className="product-price">
                    {p.price} <span>{p.unit}</span>
                  </div>
                  <button className="add-btn">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}