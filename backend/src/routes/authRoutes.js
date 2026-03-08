import express from "express";
import {
  registerUser,
  loginUser,
logoutUser,
forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import User from "../models/User.js"; 
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);




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

// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   refreshToken,
//   forgotPassword,
//   resetPassword,
//   getMe,
//   googleAuth,
// } from "../controllers/authController.js";
// import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
// import User from "../models/User.js";

// const router = express.Router();

// // ─── Public Routes ────────────────────────────────────────────────────────────
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/refresh-token", refreshToken);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);
// router.post("/google", googleAuth);

// // ─── Protected Routes ─────────────────────────────────────────────────────────
// router.post("/logout", protect, logoutUser);
// router.get("/me", protect, getMe);

// // ─── Get All Users (Admin only) ───────────────────────────────────────────────
// router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const users = await User.find().select("-password -refreshToken");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // ─── Role-Based Example Routes ────────────────────────────────────────────────
// router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

// router.get("/farmer", protect, authorizeRoles("farmer"), (req, res) => {
//   res.json({ message: "Welcome Farmer" });
// });

// export default router;