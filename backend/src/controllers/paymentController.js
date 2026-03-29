import Payment      from "../models/Payment.js";
import Order        from "../models/Order.js";
import Notification from "../models/Notification.js";

// ── CREATE PAYMENT (consumer pays for order) ──────────────
export const createPayment = async (req, res) => {
  try {
    const { orderId, method, transactionId, notes } = req.body;

    if (!orderId || !method)
      return res.status(400).json({ message: "Order ID and payment method are required." });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.consumer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorised." });

    // Check already paid
    const existing = await Payment.findOne({ order: orderId, status: "Completed" });
    if (existing)
      return res.status(400).json({ message: "This order has already been paid." });

    const payment = await Payment.create({
      order:         orderId,
      consumer:      req.user._id,
      farmer:        order.farmer,
      amount:        order.totalPrice,
      method,
      status:        "Completed",
      transactionId: transactionId || `TXN-${Date.now()}`,
      paidAt:        new Date(),
      notes:         notes || "",
    });

    // Update order payment status
    order.paymentStatus = "Paid";
    await order.save();

    // Notify farmer
    await Notification.create({
      user:    order.farmer,
      type:    "Payment",
      title:   "Payment Received 💰",
      message: `Rs. ${order.totalPrice.toLocaleString()} received for order #${order.orderNumber}.`,
      link:    `/dashboard/farmer/orders`,
    });

    // Notify consumer
    await Notification.create({
      user:    req.user._id,
      type:    "Payment",
      title:   "Payment Successful ✅",
      message: `Your payment of Rs. ${order.totalPrice.toLocaleString()} for order #${order.orderNumber} was confirmed.`,
      link:    `/dashboard/consumer/orders`,
    });

    res.status(201).json({ message: "Payment recorded successfully.", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET MY PAYMENTS (consumer) ────────────────────────────
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ consumer: req.user._id })
      .populate("order", "orderNumber cropName quantity")
      .sort("-createdAt");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET FARMER EARNINGS ───────────────────────────────────
export const getFarmerEarnings = async (req, res) => {
  try {
    const payments = await Payment.find({ farmer: req.user._id, status: "Completed" })
      .populate("order", "orderNumber cropName quantity")
      .populate("consumer", "name")
      .sort("-createdAt");

    const total       = payments.reduce((s, p) => s + p.amount, 0);
    const thisMonth   = payments.filter(p => {
      const d = new Date(p.paidAt);
      const n = new Date();
      return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    }).reduce((s, p) => s + p.amount, 0);

    res.json({ total, thisMonth, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── REFUND PAYMENT (admin only) ───────────────────────────
export const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found." });

    payment.status = "Refunded";
    await payment.save();

    // Notify consumer
    await Notification.create({
      user:    payment.consumer,
      type:    "Payment",
      title:   "Refund Processed 🔄",
      message: `Your refund of Rs. ${payment.amount.toLocaleString()} has been processed.`,
      link:    `/dashboard/consumer/orders`,
    });

    res.json({ message: "Payment refunded.", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── ADMIN — ALL PAYMENTS ──────────────────────────────────
export const adminGetAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("consumer", "name email")
      .populate("farmer",   "name email")
      .populate("order",    "orderNumber cropName")
      .sort("-createdAt");

    const total = payments.filter(p => p.status === "Completed")
      .reduce((s, p) => s + p.amount, 0);

    res.json({ total, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};