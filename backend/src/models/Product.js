import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cropName: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Leafy Green", "Root", "Fruit", "Grain", "Herb", "Other"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["Organic", "Conventional"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least Rs. 1"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
    },
    harvestDate: {
      type: Date,
      required: [true, "Harvest date is required"],
    },
    organicTreatmentHistory: {
      type: String,
      default: "",
    },
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "Active", "Out of Stock", "Inactive", "active"],
      default: "pending",
    },
    image: {
      type: String,
      default: "",
    },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-set status based on stock before every save
productSchema.pre("save", function () {
  if (this.stock === 0) {
    this.status = "Out of Stock";
  } else if (this.status === "Out of Stock" && this.stock > 0) {
    this.status = "Active";
  }
});

const Product = mongoose.model("Product", productSchema);


export default Product;