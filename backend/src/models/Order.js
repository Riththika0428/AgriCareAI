// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     orderNumber: {
//       type: Number,
//       unique: true,
//     },
//     consumer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     farmer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     cropName:   { type: String, required: true },
//     quantity:   { type: Number, required: true, min: 1 },
//     pricePerKg: { type: Number, required: true },
//     totalPrice: { type: Number, required: true },
//     deliveryAddress: {
//       street:   { type: String, required: true },
//       city:     { type: String, required: true },
//       district: { type: String, required: true },
//       phone:    { type: String, required: true },
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["Card", "COD", "Bank Transfer"],
//       default: "COD",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Paid", "Failed"],
//       default: "Pending",
//     },
//     orderStatus: {
//       type: String,
//       enum: ["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"],
//       default: "Placed",
//     },
//     deliverySlot: { type: String, default: "" },
//     notes:        { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// // Auto-generate order number before saving
// orderSchema.pre("save", async function (next) {
//   if (!this.orderNumber) {
//     const last = await this.constructor.findOne().sort("-orderNumber");
//     this.orderNumber = last ? last.orderNumber + 1 : 1001;
//   }
//   next();
// });

// export default mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      unique: true,
      sparse: true,
    },
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cropName:   { type: String, required: true },
    quantity:   { type: Number, required: true, min: 1 },
    pricePerKg: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deliveryAddress: {
      street:   { type: String, required: true },
      city:     { type: String, required: true },
      district: { type: String, required: true },
      phone:    { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "COD", "Bank Transfer"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
    deliverySlot: { type: String, default: "" },
    notes:        { type: String, default: "" },
  },
  { timestamps: true }
);

// ── Auto-generate unique order number ─────────────────────
// Uses timestamp + random suffix to avoid race conditions
// when multiple orders placed simultaneously via Promise.all
orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const ts   = Date.now();
    const rand = Math.floor(Math.random() * 900) + 100; // 100-999
    this.orderNumber = parseInt(String(ts).slice(-6) + String(rand).slice(-2));
  }
});

export default mongoose.model("Order", orderSchema);