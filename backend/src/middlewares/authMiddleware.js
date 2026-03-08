import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect route
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
};

// Role-based access
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// // ─── Protect Route ────────────────────────────────────────────────────────────
// export const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization?.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

      
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password -refreshToken");

//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }
// };

// // ─── Role-Based Access ────────────────────────────────────────────────────────
// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     next();
//   };
// };
