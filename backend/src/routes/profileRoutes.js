import express from "express";
import {
  getMyProfile,
  upsertProfile,
  checkProfileComplete,
  adminGetAllProfiles,
} from "../controllers/profileController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(  "/me",        protect, getMyProfile);
router.put(  "/me",        protect, upsertProfile);
router.get(  "/me/status", protect, checkProfileComplete);
router.get(  "/admin/all", protect, authorizeRoles("admin"), adminGetAllProfiles);

export default router;