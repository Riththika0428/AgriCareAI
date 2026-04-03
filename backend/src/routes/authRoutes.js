// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   forgotPassword,
//   resetPassword
// } from "../controllers/authController.js";
// import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
// import User from "../models/User.js"; 
// import { getAllUsers } from "../controllers/authController.js";
// import { protect, adminOnly } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.post("/forgotpassword", forgotPassword);
// router.put("/resetpassword/:token", resetPassword);
// router.get("/users", protect, adminOnly, getAllUsers);
 



// // Admin only route
// // router.get(
// //   "/admin",
// //   protect,
// //   authorizeRoles("admin"),
// //   (req, res) => {
// //     res.json({ message: "Welcome Admin" });
// //   }
// // );

// // // Farmer only route
// // router.get(
// //   "/farmer",
// //   protect,
// //   authorizeRoles("farmer"),
// //   (req, res) => {
// //     res.json({ message: "Welcome Farmer" });
// //   }
// // );

// // GET ALL USERS
// // router.get("/users", async (req, res) => {
// //   try {
// //     const users = await User.find().select("-password"); 
// //     res.json(users);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // });
// // export default router;
// router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;

// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   forgotPassword,
//   resetPassword,
//   getAllUsers,
// } from "../controllers/authController.js";
// import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.post("/forgotpassword", forgotPassword);
// router.put("/resetpassword/:token", resetPassword);

// // GET ALL USERS — admin only
// // router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
// router.get("/admin/all", protect, authorizeRoles("admin"), adminGetAllProducts);

// export default router;

// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   logoutUser,
//   forgotPassword,
//   resetPassword,
//   getAllUsers,
// } from "../controllers/authController.js";
// import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.post("/forgotpassword", forgotPassword);
// router.put("/resetpassword/:token", resetPassword);

// // GET ALL USERS — admin only
// router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// export default router;

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