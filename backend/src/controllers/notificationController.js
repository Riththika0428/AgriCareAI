import Notification from "../models/Notification.js";

// ── GET MY NOTIFICATIONS ──────────────────────────────────
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort("-createdAt")
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id, isRead: false,
    });

    res.json({ unreadCount, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── MARK ONE AS READ ──────────────────────────────────────
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Marked as read." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── MARK ALL AS READ ──────────────────────────────────────
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE ONE NOTIFICATION ───────────────────────────────
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE ALL NOTIFICATIONS ──────────────────────────────
export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: "All notifications cleared." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── CREATE NOTIFICATION (internal helper — also exported for use in other controllers)
export const createNotification = async ({ user, type, title, message, link = "" }) => {
  try {
    await Notification.create({ user, type, title, message, link });
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};