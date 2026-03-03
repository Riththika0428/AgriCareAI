import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin only route
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

// Farmer only route
router.get(
  "/farmer",
  protect,
  authorizeRoles("farmer"),
  (req, res) => {
    res.json({ message: "Welcome Farmer" });
  }
);

export default router;