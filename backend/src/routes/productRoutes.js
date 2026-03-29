// import express from "express";
// import {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   getMyProducts,
//   updateProduct,
//   deleteProduct,
//   adminGetAllProducts,
// } from "../controllers/productController.js";
// import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // ─────────────────────────────────────────────
// // PUBLIC ROUTES  (no token needed)
// // ─────────────────────────────────────────────

// // GET /api/products              → all active products (with filters)
// // GET /api/products/:id          → single product detail
// router.get("/", getAllProducts);
// router.get("/:id", getProductById);

// // ─────────────────────────────────────────────
// // FARMER ROUTES  (need token + role = farmer)
// // ─────────────────────────────────────────────

// // POST   /api/products           → create a new product
// // GET    /api/products/my/list   → my own products
// // PUT    /api/products/:id       → update my product
// // DELETE /api/products/:id       → delete my product
// router.post("/", protect, authorizeRoles("farmer"), createProduct);
// router.get("/my/list", protect, authorizeRoles("farmer"), getMyProducts);
// router.put("/:id", protect, authorizeRoles("farmer", "admin"), updateProduct);
// router.delete("/:id", protect, authorizeRoles("farmer", "admin"), deleteProduct);
// router.get("/admin/all", protect, adminOnly, adminGetAllProducts);
// router.patch("/admin/:id/status", protect, adminOnly, adminUpdateProductStatus);

// // ─────────────────────────────────────────────
// // ADMIN ROUTES  (need token + role = admin)
// // ─────────────────────────────────────────────

// // GET /api/products/admin/all    → all products with full farmer details
// router.get(
//   "/admin/all",
//   protect,
//   authorizeRoles("admin"),
//   adminGetAllProducts
// );


// export default router;

import express from "express";
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

const router = express.Router();

// ─────────────────────────────────────────────
// PUBLIC ROUTES (no token needed)
// ─────────────────────────────────────────────
router.get("/", getAllProducts);

// ─────────────────────────────────────────────
// ADMIN ROUTES (must be before /:id)
// ─────────────────────────────────────────────
router.get("/admin/all", protect, authorizeRoles("admin"), adminGetAllProducts);
router.patch("/admin/:id/status", protect, authorizeRoles("admin"), adminUpdateProductStatus);

// ─────────────────────────────────────────────
// FARMER ROUTES (need token + role = farmer)
// ─────────────────────────────────────────────
router.post("/", protect, authorizeRoles("farmer"), createProduct);
router.get("/my/list", protect, authorizeRoles("farmer"), getMyProducts);
router.put("/:id", protect, authorizeRoles("farmer", "admin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("farmer", "admin"), deleteProduct);

// ─────────────────────────────────────────────
// PUBLIC ROUTES with param (must be last)
// ─────────────────────────────────────────────
router.get("/:id", getProductById);

export default router;