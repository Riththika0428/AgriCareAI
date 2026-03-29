import Review       from "../models/Review.js";
import Order        from "../models/Order.js";
import Notification from "../models/Notification.js";

// ── CREATE REVIEW (consumer, after delivery) ──────────────
export const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating)
      return res.status(400).json({ message: "Order ID and rating are required." });

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found." });

    if (order.consumer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorised." });

    if (order.orderStatus !== "Delivered")
      return res.status(400).json({ message: "You can only review delivered orders." });

    // Check already reviewed
    const existing = await Review.findOne({ order: orderId });
    if (existing)
      return res.status(400).json({ message: "You have already reviewed this order." });

    const review = await Review.create({
      order:    orderId,
      product:  order.product,
      farmer:   order.farmer,
      consumer: req.user._id,
      rating,
      comment:  comment || "",
    });

    // Notify farmer
    await Notification.create({
      user:    order.farmer,
      type:    "Review",
      title:   "New Review Received ⭐",
      message: `${req.user.name} rated your product ${rating}/5 stars.`,
      link:    `/dashboard/farmer/products`,
    });

    res.status(201).json({ message: "Review submitted successfully.", review });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "You have already reviewed this order." });
    res.status(500).json({ message: error.message });
  }
};

// ── GET REVIEWS FOR A PRODUCT (public) ───────────────────
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("consumer", "name")
      .sort("-createdAt");

    const avg = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

    res.json({ count: reviews.length, average: avg.toFixed(1), reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET MY REVIEWS (consumer) ─────────────────────────────
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ consumer: req.user._id })
      .populate("product", "cropName")
      .populate("farmer",  "name")
      .sort("-createdAt");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET FARMER REVIEWS (farmer sees all reviews for their products)
export const getFarmerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ farmer: req.user._id })
      .populate("consumer", "name")
      .populate("product",  "cropName")
      .sort("-createdAt");

    const avg = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

    res.json({ count: reviews.length, average: avg.toFixed(1), reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE REVIEW (consumer or admin) ────────────────────
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found." });

    const isOwner = review.consumer.toString() === req.user._id.toString();
    const isAdmin  = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Not authorised." });

    await review.deleteOne();
    res.json({ message: "Review deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};