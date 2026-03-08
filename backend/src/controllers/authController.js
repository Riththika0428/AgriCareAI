import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Generate JWT
const generateToken = () => {
  return jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

   
      const token = generateToken(); 

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// logout
export const logoutUser = async (req, res) => {
  res.status(200).json({
    message: "User logged out successfully"
  });
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      text: `Reset your password here: ${resetUrl}`
    });

    res.json({
      message: "Reset email sent"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
// import { OAuth2Client } from "google-auth-library";

// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // ─── Generate Access Token ────────────────────────────────────────────────────
// const generateAccessToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE || "15m",
//   });
// };

// // ─── Generate Refresh Token ───────────────────────────────────────────────────
// const generateRefreshToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
//   });
// };

// // ─── Send Email Helper ────────────────────────────────────────────────────────
// const sendEmail = async ({ to, subject, html }) => {
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
//   await transporter.sendMail({
//     from: `"AgriCare AI" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };

// // ─── REGISTER ─────────────────────────────────────────────────────────────────
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const user = await User.create({ name, email, password, role });
//     const token = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);
//     user.refreshToken = refreshToken;
//     await user.save();
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token,
//       refreshToken,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── LOGIN ────────────────────────────────────────────────────────────────────
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !user.password) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }
//     const token = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);
//     user.refreshToken = refreshToken;
//     await user.save();
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token,
//       refreshToken,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── LOGOUT ───────────────────────────────────────────────────────────────────
// export const logoutUser = async (req, res) => {
//   try {
//     await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
//     res.json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
// export const refreshToken = async (req, res) => {
//   try {
//     const { refreshToken: token } = req.body;
//     if (!token) {
//       return res.status(401).json({ message: "Refresh token required" });
//     }
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//     } catch {
//       return res.status(401).json({ message: "Invalid or expired refresh token" });
//     }
//     const user = await User.findById(decoded.id);
//     if (!user || user.refreshToken !== token) {
//       return res.status(401).json({ message: "Refresh token revoked or mismatched" });
//     }
//     const newToken = generateAccessToken(user._id);
//     const newRefreshToken = generateRefreshToken(user._id);
//     user.refreshToken = newRefreshToken;
//     await user.save();
//     res.json({ token: newToken, refreshToken: newRefreshToken });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Please provide your email" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.json({ message: "If that email exists, a reset link has been sent" });
//     }
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//     user.resetPasswordToken = hashedToken;
//     user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
//     await user.save();
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//     const html = `
//       <h2>AgriCare AI — Password Reset</h2>
//       <p>Click the button below to reset your password:</p>
//       <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#2d6a4f;color:white;border-radius:5px;text-decoration:none;">Reset Password</a>
//       <p>This link expires in <strong>15 minutes</strong>.</p>
//       <p>If you did not request this, ignore this email.</p>
//     `;
//     await sendEmail({ to: user.email, subject: "AgriCare AI — Password Reset", html });
//     res.json({ message: "Password reset link sent to your email" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── RESET PASSWORD ───────────────────────────────────────────────────────────
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;
//     if (!password || password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired reset token" });
//     }
//     user.password = password;
//     user.resetPasswordToken = null;
//     user.resetPasswordExpire = null;
//     user.refreshToken = null;
//     await user.save();
//     res.json({ message: "Password reset successful. Please log in." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── GET ME ───────────────────────────────────────────────────────────────────
// export const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select(
//       "-password -refreshToken -resetPasswordToken -resetPasswordExpire"
//     );
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ─── GOOGLE AUTH ──────────────────────────────────────────────────────────────
// export const googleAuth = async (req, res) => {
//   try {
//     const { idToken } = req.body;
//     if (!idToken) {
//       return res.status(400).json({ message: "Google ID token is required" });
//     }
//     const ticket = await googleClient.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const { sub: googleId, name, email, picture } = ticket.getPayload();
//     let user = await User.findOne({ email });
//     if (user) {
//       if (!user.googleId) {
//         user.googleId = googleId;
//         user.avatar = picture;
//         await user.save();
//       }
//     } else {
//       user = await User.create({ name, email, googleId, avatar: picture, isVerified: true });
//     }
//     const token = generateAccessToken(user._id);
//     const refreshToken = generateRefreshToken(user._id);
//     user.refreshToken = refreshToken;
//     await user.save();
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar,
//       role: user.role,
//       token,
//       refreshToken,
//     });
//   } catch (error) {
//     res.status(401).json({ message: "Google authentication failed: " + error.message });
//   }
// };
