// // import express from "express";
// // import {
// //   createProduct,
// //   getAllProducts,
// //   getProductById,
// //   getMyProducts,
// //   updateProduct,
// //   deleteProduct,
// //   adminGetAllProducts,
// // } from "../controllers/productController.js";
// // import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

// // const router = express.Router();

// // // ─────────────────────────────────────────────
// // // PUBLIC ROUTES  (no token needed)
// // // ─────────────────────────────────────────────

// // // GET /api/products              → all active products (with filters)
// // // GET /api/products/:id          → single product detail
// // router.get("/", getAllProducts);
// // router.get("/:id", getProductById);

// // // ─────────────────────────────────────────────
// // // FARMER ROUTES  (need token + role = farmer)
// // // ─────────────────────────────────────────────

// // // POST   /api/products           → create a new product
// // // GET    /api/products/my/list   → my own products
// // // PUT    /api/products/:id       → update my product
// // // DELETE /api/products/:id       → delete my product
// // router.post("/", protect, authorizeRoles("farmer"), createProduct);
// // router.get("/my/list", protect, authorizeRoles("farmer"), getMyProducts);
// // router.put("/:id", protect, authorizeRoles("farmer", "admin"), updateProduct);
// // router.delete("/:id", protect, authorizeRoles("farmer", "admin"), deleteProduct);
// // router.get("/admin/all", protect, adminOnly, adminGetAllProducts);
// // router.patch("/admin/:id/status", protect, adminOnly, adminUpdateProductStatus);

// // // ─────────────────────────────────────────────
// // // ADMIN ROUTES  (need token + role = admin)
// // // ─────────────────────────────────────────────

// // // GET /api/products/admin/all    → all products with full farmer details
// // router.get(
// //   "/admin/all",
// //   protect,
// //   authorizeRoles("admin"),
// //   adminGetAllProducts
// // );


// // export default router;

// import express from "express";
// import {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   getMyProducts,
//   updateProduct,
//   deleteProduct,
//   adminGetAllProducts,
//   adminUpdateProductStatus,
// } from "../controllers/productController.js";
// import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
// import multer         from "multer";
// import path           from "path";
// import fs             from "fs";
// import { fileURLToPath } from "url";

// const router = express.Router();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname  = path.dirname(__filename);

// // ── Ensure upload directory exists ─────────────────────────
// const UPLOAD_DIR = path.join(__dirname, "../../public/uploads/products");
// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// // ── Multer config ──────────────────────────────────────────
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, UPLOAD_DIR),
//   filename:    (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, "product-" + unique + path.extname(file.originalname));
//   },
// });
 
// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
//   allowed.includes(file.mimetype)
//     ? cb(null, true)
//     : cb(new Error("Only JPG, PNG and WebP images are allowed."), false);
// };
 
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });
// // ─────────────────────────────────────────────
// // PUBLIC ROUTES (no token needed)
// // ─────────────────────────────────────────────
// router.get("/", getAllProducts);

// // ─────────────────────────────────────────────
// // ADMIN ROUTES (must be before /:id)
// // ─────────────────────────────────────────────
// router.get("/admin/all", protect, authorizeRoles("admin"), adminGetAllProducts);
// router.patch("/admin/:id/status", protect, authorizeRoles("admin"), adminUpdateProductStatus);

// // ─────────────────────────────────────────────
// // FARMER ROUTES (need token + role = farmer)
// // ─────────────────────────────────────────────
// router.post("/", protect, authorizeRoles("farmer"), createProduct);
// router.get("/my/list", protect, authorizeRoles("farmer"), getMyProducts);
// router.put("/:id", protect, authorizeRoles("farmer", "admin"), updateProduct);
// router.delete("/:id", protect, authorizeRoles("farmer", "admin"), deleteProduct);

// // ─────────────────────────────────────────────
// // PUBLIC ROUTES with param (must be last)
// // ─────────────────────────────────────────────
// router.get("/:id", getProductById);
// // ✅ CORRECT order — multer BEFORE controller
// router.post("/", protect, authorizeRoles("farmer"), upload.single("image"), createProduct);
// export default router;

import express           from "express";
import multer            from "multer";
import path              from "path";
import fs                from "fs";
import { fileURLToPath } from "url";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
  adminGetAllProducts,
  adminUpdateProductStatus,
} from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router     = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Ensure upload directory exists ─────────────────────────
const UPLOAD_DIR = path.join(__dirname, "../../public/uploads/products");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── Multer config ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only JPG, PNG and WebP images are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── PUBLIC ROUTES ──────────────────────────────────────────
router.get("/", getAllProducts);

// ── ADMIN ROUTES (before /:id) ─────────────────────────────
router.get("/admin/all",          protect, authorizeRoles("admin"), adminGetAllProducts);
router.patch("/admin/:id/status", protect, authorizeRoles("admin"), adminUpdateProductStatus);

// ── FARMER ROUTES ──────────────────────────────────────────
// FIX: upload.single("image") added — only ONE POST route
router.post("/",       protect, authorizeRoles("farmer"),         upload.single("image"), createProduct);
router.get("/my/list", protect, authorizeRoles("farmer"),         getMyProducts);
router.put("/:id",     protect, authorizeRoles("farmer","admin"), upload.single("image"), updateProduct);
router.delete("/:id",  protect, authorizeRoles("farmer","admin"), deleteProduct);

// ── PUBLIC PARAM ROUTE (must be last) ─────────────────────
router.get("/:id", getProductById);

export default router;