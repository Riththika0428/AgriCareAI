import Order   from "../models/Order.js";
import Product from "../models/Product.js";

// ── CREATE ORDER (consumer) ────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const {
      productId, quantity, deliveryAddress,
      paymentMethod, deliverySlot, notes,
    } = req.body;

    if (!productId || !quantity || !deliveryAddress) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found." });
    if (product.stock < quantity)
      return res.status(400).json({ message: `Only ${product.stock} kg available in stock.` });

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      consumer:    req.user._id,
      farmer:      product.farmer,
      product:     productId,
      cropName:    product.cropName,
      quantity,
      pricePerKg:  product.price,
      totalPrice,
      deliveryAddress,
      paymentMethod: paymentMethod || "COD",
      deliverySlot:  deliverySlot  || "",
      notes:         notes         || "",
    });

    // Reduce stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET MY ORDERS (consumer) ───────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer: req.user._id })
      .populate("product", "cropName category")
      .populate("farmer",  "name email")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET FARMER ORDERS (farmer sees orders for their products)
export const getFarmerOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { farmer: req.user._id };
    if (status && status !== "All") filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate("consumer", "name email")
      .populate("product",  "cropName category")
      .sort("-createdAt");

    // Count by status
    const all       = await Order.countDocuments({ farmer: req.user._id });
    const pending   = await Order.countDocuments({ farmer: req.user._id, orderStatus: "Placed" });
    const confirmed = await Order.countDocuments({ farmer: req.user._id, orderStatus: "Confirmed" });
    const shipped   = await Order.countDocuments({ farmer: req.user._id, orderStatus: "Shipped" });
    const delivered = await Order.countDocuments({ farmer: req.user._id, orderStatus: "Delivered" });

    res.json({ orders, counts: { all, pending, confirmed, shipped, delivered } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET SINGLE ORDER ───────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("consumer", "name email")
      .populate("farmer",   "name email")
      .populate("product",  "cropName category price");
    if (!order) return res.status(404).json({ message: "Order not found." });

    const isFarmer   = order.farmer._id.toString()   === req.user._id.toString();
    const isConsumer = order.consumer._id.toString() === req.user._id.toString();
    const isAdmin    = req.user.role === "admin";

    if (!isFarmer && !isConsumer && !isAdmin)
      return res.status(403).json({ message: "Not authorised." });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── UPDATE ORDER STATUS (farmer) ───────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, notes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    const isFarmer = order.farmer.toString() === req.user._id.toString();
    const isAdmin  = req.user.role === "admin";
    if (!isFarmer && !isAdmin)
      return res.status(403).json({ message: "Not authorised." });

    if (orderStatus) order.orderStatus = orderStatus;
    if (notes)       order.notes       = notes;
    await order.save();

    res.json({ message: "Order status updated.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── CANCEL ORDER (consumer) ────────────────────────────────
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.consumer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorised." });

    if (["Shipped","Delivered"].includes(order.orderStatus))
      return res.status(400).json({ message: "Cannot cancel a shipped or delivered order." });

    // Restore stock
    const product = await Product.findById(order.product);
    if (product) { product.stock += order.quantity; await product.save(); }

    order.orderStatus = "Cancelled";
    await order.save();
    res.json({ message: "Order cancelled.", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── ADMIN — GET ALL ORDERS ─────────────────────────────────
export const adminGetAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 100 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
 
    const orders = await Order.find(filter)
      .populate("consumerId", "name email")
      .populate("farmerId", "name email")
      .populate("items.productId", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
 
    const total = await Order.countDocuments(filter);
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
 
 
// export const adminGetAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate("consumer", "name email")
//       .populate("farmer",   "name email")
//       .populate("product",  "cropName")
//       .sort("-createdAt");
//     res.json({ count: orders.length, orders });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };