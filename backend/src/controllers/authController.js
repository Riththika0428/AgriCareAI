import User  from "../models/User.js";
import jwt   from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ── Token generator ───────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// ── REGISTER ──────────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists." });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
// JWT is stateless — logout is handled client-side by deleting the token.
// This endpoint exists so the client has a clean API call to make on logout.
export const logoutUser = async (_req, res) => {
  res.status(200).json({ message: "Logged out successfully." });
};

// ── GET ME ────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// Used by the frontend's validateSession() to confirm the JWT is still valid
// and to get the authoritative user object (including the current role).
// This is the key endpoint that powers the back-button fix.
export const getMe = async (req, res) => {
  // req.user is already populated by the protect middleware
  res.status(200).json({
    _id:   req.user._id,
    name:  req.user.name,
    email: req.user.email,
    role:  req.user.role,
  });
};

// ── GET ALL USERS (admin) ─────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 100 } = req.query;
    const filter = {};
    if (role   && role   !== "all") filter.role   = role;
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken  = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
    });

    await transporter.sendMail({
      to:      user.email,
      subject: "AgriAI – Password Reset",
      text:    `Reset your password here (expires in 15 minutes):\n\n${resetUrl}`,
    });

    res.json({ message: "Reset email sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── RESET PASSWORD ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken:  req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password            = req.body.password;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};