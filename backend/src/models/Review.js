import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    order:    { type: mongoose.Schema.Types.ObjectId, ref: "Order",   required: true },
    product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    farmer:   { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
    consumer: { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, default: "" },
  },
  { timestamps: true }
);

// One review per order only
reviewSchema.index({ order: 1 }, { unique: true });

// After saving — update product trustScore automatically
reviewSchema.post("save", async function () {
  const Product = (await import("./Product.js")).default;
  const reviews = await this.constructor.find({ product: this.product });
  const avg     = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(this.product, { trustScore: Math.round(avg * 20) });
});

export default mongoose.model("Review", reviewSchema);