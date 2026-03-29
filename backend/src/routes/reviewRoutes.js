import express from "express";
import {
  createReview, getProductReviews, getMyReviews,
  getFarmerReviews, deleteReview,
} from "../controllers/reviewController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",                    protect, authorizeRoles("user","farmer"), createReview);
router.get("/my",                   protect, getMyReviews);
router.get("/farmer",               protect, authorizeRoles("farmer"),        getFarmerReviews);
router.get("/product/:productId",   getProductReviews);
router.delete("/:id",               protect, deleteReview);

export default router;