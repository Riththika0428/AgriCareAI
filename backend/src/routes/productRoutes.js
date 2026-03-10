import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
  adminGetAllProducts,
} from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────────
// PUBLIC ROUTES  (no token needed)
// ─────────────────────────────────────────────

// GET /api/products              → all active products (with filters)
// GET /api/products/:id          → single product detail
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// ─────────────────────────────────────────────
// FARMER ROUTES  (need token + role = farmer)
// ─────────────────────────────────────────────

// POST   /api/products           → create a new product
// GET    /api/products/my/list   → my own products
// PUT    /api/products/:id       → update my product
// DELETE /api/products/:id       → delete my product
router.post("/", protect, authorizeRoles("farmer"), createProduct);
router.get("/my/list", protect, authorizeRoles("farmer"), getMyProducts);
router.put("/:id", protect, authorizeRoles("farmer", "admin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("farmer", "admin"), deleteProduct);

// ─────────────────────────────────────────────
// ADMIN ROUTES  (need token + role = admin)
// ─────────────────────────────────────────────

// GET /api/products/admin/all    → all products with full farmer details
router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  adminGetAllProducts
);

export default router;