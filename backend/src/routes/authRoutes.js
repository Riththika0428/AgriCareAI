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