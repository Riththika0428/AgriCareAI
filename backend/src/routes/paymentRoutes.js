import express from "express";
import {
  createPayment, getMyPayments, getFarmerEarnings,
  refundPayment, adminGetAllPayments,
} from "../controllers/paymentController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",           protect, authorizeRoles("user","farmer"), createPayment);
router.get("/my",          protect, getMyPayments);
router.get("/earnings",    protect, authorizeRoles("farmer"), getFarmerEarnings);
router.put("/:id/refund",  protect, authorizeRoles("admin"),  refundPayment);
router.get("/admin/all",   protect, authorizeRoles("admin"),   adminGetAllPayments);

export default router;