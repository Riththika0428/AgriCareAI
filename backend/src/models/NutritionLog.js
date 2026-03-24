import mongoose from "mongoose";

const nutritionLogSchema = new mongoose.Schema({
  consumer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date:     { type: String, required: true },
  entries: [{
    vegetable: { type: String, required: true },
    emoji:     { type: String, default: "🥬" },
    grams:     { type: Number, required: true },
    calories:  { type: Number, default: 0 },
    nutrients: { type: Map, of: Number, default: {} },
  }],
  totalCalories: { type: Number, default: 0 },
  nutrientScore: { type: Number, default: 0 },
}, { timestamps: true });

nutritionLogSchema.index({ consumer: 1, date: 1 }, { unique: true });
export default mongoose.model("NutritionLog", nutritionLogSchema);