import jwt  from "jsonwebtoken";
import User from "../models/User.js";

// ── protect ───────────────────────────────────────────────────────────────────
// Verifies the Bearer JWT on every protected request.
// Attaches the full user document to req.user for downstream handlers.
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorised. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found." });
    }
    next();
  } catch {
    // Covers TokenExpiredError, JsonWebTokenError, etc.
    return res.status(401).json({ message: "Not authorised. Token invalid or expired." });
  }
};

// ── authorizeRoles ────────────────────────────────────────────────────────────
// Restricts a route to specific roles.
// "consumer" and "user" are treated as the same role (legacy normalisation).
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole       = req.user.role;
    // Normalise both sides so "consumer" === "user"
    const effectiveRole    = userRole === "consumer" ? "user" : userRole;
    const effectiveAllowed = roles.map((r) => (r === "consumer" ? "user" : r));

    if (!effectiveAllowed.includes(effectiveRole)) {
      return res.status(403).json({
        message: `Role '${userRole}' is not allowed to access this route.`,
      });
    }
    next();
  };
};

// ── adminOnly ─────────────────────────────────────────────────────────────────
// Shorthand for routes that only admins may access.
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  next();
};