import express from "express";
import {
  getWeatherByDistrict,
  saveWeatherAlert,
  getMyWeatherAlerts,
  deleteWeatherAlert,
  adminGetAllAlerts,
  getDistricts,
} from "../controllers/weatherController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ── Public routes ──────────────────────────────────────
router.get("/districts",          getDistricts);
router.get("/:district",          getWeatherByDistrict);

// ── Protected routes (farmer) ──────────────────────────
router.get("/my/alerts",          protect, authorizeRoles("farmer"), getMyWeatherAlerts);
router.post("/save",              protect, authorizeRoles("farmer"), saveWeatherAlert);
router.delete("/:id",             protect, authorizeRoles("farmer", "admin"), deleteWeatherAlert);

// ── Admin routes ───────────────────────────────────────
router.get("/admin/all",          protect, authorizeRoles("admin"), adminGetAllAlerts);

export default router;