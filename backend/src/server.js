// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import productRoutes from "./routes/productRoutes.js"; 
// import profileRoutes     from "./routes/profileRoutes.js"; 
// import diseaseRoutes from "./routes/diseaseRoutes.js";  
// import weatherRoutes from "./routes/weatherRoutes.js"; 
// import cookieParser from "cookie-parser";
// import path         from "path";
// import { fileURLToPath } from "url";
// import subscriptionRoutes from "./routes/subscriptionRoutes.js"; 
// import nutritionRoutes   from "./routes/nutritionRoutes.js"; 
// import reviewRoutes      from "./routes/reviewRoutes.js";   
// import paymentRoutes     from "./routes/paymentRoutes.js";     
// import notificationRoutes from "./routes/notificationRoutes.js";
// import orderRoutes   from "./routes/orderRoutes.js"; 

// const __filename = fileURLToPath(import.meta.url);     
// const __dirname  = path.dirname(__filename);        

// // dotenv.config();
// // dotenv.config({ path: "../.env" });
// // dotenv.config({ path: path.join(__dirname, "../../.env") });
// // dotenv.config({ path: "../../.env" });
// dotenv.config({ path: path.join(__dirname, "../.env") });
// connectDB();

// const app = express();

// // ── IMPORTANT: Stripe webhook needs raw body ───────────────
// // Must be registered BEFORE express.json()

// // ✅ Make sure this exists in server.js
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/api/subscriptions/webhook", express.raw({ type: "application/json" }));
 
// app.use(cors({ origin:["http://localhost:3000"], credentials:true }));
// app.use(cookieParser());
// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
//  app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// // ── CORS — allow frontend at localhost:3000 ──
// app.use(cors({
//   origin: ["http://localhost:3000"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(cookieParser());
// // app.use(cors());
// app.use(express.json());

// // Serve uploaded images statically
// app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders",   orderRoutes);  
// app.use("/api/weather",  weatherRoutes);   
// app.use("/api/profile",       profileRoutes); 
// app.use("/api/diseases", diseaseRoutes); 
// app.use("/api/subscriptions", subscriptionRoutes); 
// app.use("/api/nutrition", nutritionRoutes);
// app.use("/api/reviews",       reviewRoutes);      
// app.use("/api/payments",      paymentRoutes);   
// app.use("/api/notifications", notificationRoutes);  


// app.get("/", (req, res) => {
//   res.send(" Agri API Running...");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );

import express            from "express";
import dotenv             from "dotenv";
import cors               from "cors";
import cookieParser       from "cookie-parser";
import path               from "path";
import { fileURLToPath }  from "url";
import connectDB          from "./config/db.js";
import authRoutes         from "./routes/authRoutes.js";
import productRoutes      from "./routes/productRoutes.js";
import profileRoutes      from "./routes/profileRoutes.js";
import diseaseRoutes      from "./routes/diseaseRoutes.js";
import weatherRoutes      from "./routes/weatherRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import nutritionRoutes    from "./routes/nutritionRoutes.js";
import reviewRoutes       from "./routes/reviewRoutes.js";
import paymentRoutes      from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import orderRoutes        from "./routes/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
connectDB();

const app = express();

// ── CORS ── (registered ONCE, before everything) ───────────
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Stripe webhook — MUST be before express.json() ─────────
app.use(
  "/api/subscriptions/webhook",
  express.raw({ type: "application/json" })
);

// ── Body parsers (registered ONCE each) ────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Static files ────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/products",      productRoutes);
app.use("/api/orders",        orderRoutes);
app.use("/api/weather",       weatherRoutes);
app.use("/api/profile",       profileRoutes);
app.use("/api/diseases",      diseaseRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/nutrition",     nutritionRoutes);
app.use("/api/reviews",       reviewRoutes);
app.use("/api/payments",      paymentRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => res.send("Agri API Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));