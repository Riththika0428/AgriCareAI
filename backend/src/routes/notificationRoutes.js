import express from "express";
import {
  getMyNotifications, markAsRead, markAllAsRead,
  deleteNotification, deleteAllNotifications,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",            protect, getMyNotifications);
router.put("/:id/read",    protect, markAsRead);
router.put("/read/all",    protect, markAllAsRead);
router.delete("/:id",      protect, deleteNotification);
router.delete("/clear/all",protect, deleteAllNotifications);

export default router;