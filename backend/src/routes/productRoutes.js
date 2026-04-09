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