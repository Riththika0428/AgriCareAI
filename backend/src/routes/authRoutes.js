import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import User from "../models/User.js"; 
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin only route
// router.get(
//   "/admin",
//   protect,
//   authorizeRoles("admin"),
//   (req, res) => {
//     res.json({ message: "Welcome Admin" });
//   }
// );

// Farmer only route
// router.get(
//   "/farmer",
//   protect,
//   authorizeRoles("farmer"),
//   (req, res) => {
//     res.json({ message: "Welcome Farmer" });
//   }
// );

// GET ALL USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;