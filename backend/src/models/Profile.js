import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  role: { type: String, enum: ["farmer", "user"], required: true },

  // ── Step 1: Personal Info ──
  phone:   { type: String, default: "" },
  state:   { type: String, default: "" },
  district:{ type: String, default: "" },
  village: { type: String, default: "" },
  bio:     { type: String, default: "" },

  // ── Step 2: Farm Details (farmer only) ──
  farmName:     { type: String, default: "" },
  farmSize:     { type: Number, default: 0 },
  farmSizeUnit: { type: String, enum: ["acres", "hectares", "sq ft"], default: "acres" },
  farmingType:  { type: String, enum: ["Organic", "Conventional", "Mixed", "Hydroponic", "Permaculture", ""], default: "" },
  irrigationType: { type: String, default: "" },
  soilType:     { type: String, default: "" },
  experience:   { type: Number, default: 0 },

  // ── Step 3: Crops (farmer only) ──
  crops:     { type: [String], default: [] },

  // ── Consumer fields ──
  dietaryPreferences: { type: [String], default: [] },
  healthGoals:        { type: [String], default: [] },
  deliveryAddress: {
    street:   { type: String, default: "" },
    city:     { type: String, default: "" },
    pincode:  { type: String, default: "" },
  },

  isComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);