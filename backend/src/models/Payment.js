import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order:           { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  consumer:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  farmer:          { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount:          { type: Number, required: true },
  currency:        { type: String, default: "LKR" },
  method:          { type: String, enum: ["COD","stripe","bank_transfer"], default: "COD" },
  status:          { type: String, enum: ["pending","completed","failed","refunded"], default: "pending" },
  stripePaymentId: { type: String },
  paidAt:          { type: Date },
  notes:           { type: String },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);