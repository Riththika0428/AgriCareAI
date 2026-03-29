import express from "express";
import {
  createCheckoutSession,
  getMySubscription,
  cancelSubscription,
  handleWebhook,
  adminGetAll,
} from "../controllers/subscriptionController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ── Stripe webhook — must use raw body, no auth ────────────
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

// ── Farmer routes ──────────────────────────────────────────
router.post("/checkout", protect, authorizeRoles("farmer"), createCheckoutSession);
router.get("/my",        protect, authorizeRoles("farmer"), getMySubscription);
router.put("/cancel",    protect, authorizeRoles("farmer"), cancelSubscription);

// ── Admin routes ───────────────────────────────────────────
router.get("/admin/all", protect, authorizeRoles("admin"), adminGetAll);

export default router;