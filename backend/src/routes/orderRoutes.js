// import express from "express";
// import {
//   createOrder,
//   getMyOrders,
//   getFarmerOrders,
//   getOrderById,
//   updateOrderStatus,
//   cancelOrder,
//   adminGetAllOrders,
// } from "../controllers/orderController.js";
// import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/",            protect, authorizeRoles("user","consumer","farmer","admin"), createOrder);
// router.get("/my",           protect, getMyOrders);
// router.get("/farmer",       protect, authorizeRoles("farmer","admin"),        getFarmerOrders);
// router.get("/admin/all",    protect, authorizeRoles("admin"),                 adminGetAllOrders);
// router.get("/:id",          protect, getOrderById);
// router.put("/:id/status",   protect, authorizeRoles("farmer","admin"),        updateOrderStatus);
// router.put("/:id/cancel",   protect, cancelOrder);

// export default router;

import express from "express";
import {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  adminGetAllOrders,
} from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",          protect, authorizeRoles("user","consumer","farmer","admin"), createOrder);
router.get("/my",         protect, getMyOrders);
router.get("/farmer",     protect, authorizeRoles("farmer","admin"),                   getFarmerOrders);
router.get("/admin/all",  protect, authorizeRoles("admin"),                            adminGetAllOrders);
router.get("/:id",        protect, getOrderById);
router.put("/:id/status", protect, authorizeRoles("farmer","admin"),                   updateOrderStatus);
router.put("/:id/cancel", protect, cancelOrder);

export default router;