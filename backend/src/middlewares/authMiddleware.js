// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// // Protect route
// export const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization?.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // req.user = await User.findById(decoded.id).select("-password");
//  req.user = await User.findById(decoded.id).select("-password");
//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }
//       next();
//     } catch (error) {
//       // return res.status(401).json({ message: "Not authorized" });
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: "No token" });
//   }
// };

// // Role-based access
// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// };

// import jwt  from "jsonwebtoken";
// import User from "../models/User.js";

// // ── Protect route — must be logged in ─────────────────
// export const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization?.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorised. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");
//     if (!req.user) return res.status(401).json({ message: "User not found." });
//     next();
//   } catch {
//     return res.status(401).json({ message: "Not authorised. Token invalid or expired." });
//   }
// };

// // ── Restrict to specific roles ─────────────────────────
// // NOTE: "consumer" and "user" are treated as the same role
// // because some users registered as "consumer" and others as "user"
// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     const userRole = req.user.role;

//     // ✅ Treat "consumer" and "user" as equivalent
//     const normalizedRole = userRole === "consumer" ? "user" : userRole;
//     const normalizedAllowed = roles.map(r => r === "consumer" ? "user" : r);

//     if (!normalizedAllowed.includes(normalizedRole) && !roles.includes(userRole)) {
//       return res.status(403).json({
//         message: `Role '${userRole}' is not allowed to access this route.`,
//       });
//     }
//     next();
//   };
// };

import jwt  from "jsonwebtoken";
import User from "../models/User.js";

// ── Protect route — must be logged in ─────────────────
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
    if (!req.user) return res.status(401).json({ message: "User not found." });
    next();
  } catch {
    return res.status(401).json({ message: "Not authorised. Token invalid or expired." });
  }
};

// ── Restrict to specific roles ─────────────────────────
// "consumer" and "user" are treated as the same role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const effectiveRole   = userRole === "consumer" ? "user" : userRole;
    const effectiveAllowed = roles.map(r => r === "consumer" ? "user" : r);

    if (!effectiveAllowed.includes(effectiveRole)) {
      return res.status(403).json({
        message: `Role '${userRole}' is not allowed to access this route.`,
      });
    }
    next();
  };
};