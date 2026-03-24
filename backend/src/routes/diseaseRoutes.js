import express           from "express";
import multer            from "multer";
import path              from "path";
import { fileURLToPath } from "url";
import {
  scanCrop, getMyScan, getScanById,
  updateScanStatus, deleteScan, adminGetAllScans,
} from "../controllers/diseaseController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router     = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ✅ Absolute path to uploads — works from any working directory
const UPLOAD_DIR = path.join(__dirname, "../../public/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "crop-" + unique + path.extname(file.originalname));
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

// ── Routes ──
router.post("/scan",        protect, authorizeRoles("farmer"),         upload.single("image"), scanCrop);
router.get("/my",           protect, authorizeRoles("farmer"),         getMyScan);
router.get("/admin/all",    protect, authorizeRoles("admin"),          adminGetAllScans);
router.get("/:id",          protect,                                   getScanById);
router.put("/:id/status",   protect, authorizeRoles("farmer"),         updateScanStatus);
router.delete("/:id",       protect, authorizeRoles("farmer","admin"),  deleteScan);

export default router;