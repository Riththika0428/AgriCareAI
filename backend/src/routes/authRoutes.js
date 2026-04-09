import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,           // ← new: used by validateSession() on the frontend
  getAllUsers,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.post("/register",                 registerUser);
router.post("/login",                    loginUser);
router.post("/logout",                   logoutUser);
router.post("/forgotpassword",           forgotPassword);
router.put("/resetpassword/:token",      resetPassword);

// ── Protected routes ──────────────────────────────────────────────────────────

// GET /api/auth/me
// Called by the frontend's validateSession() on every page load and bfcache
// restore. Returns the live user object so the frontend knows the real role.
// This is the key route that powers the back-button session fix.
router.get("/me",    protect,                             getMe);

// GET /api/auth/users — admin only
router.get("/users", protect, authorizeRoles("admin"),    getAllUsers);

export default router;