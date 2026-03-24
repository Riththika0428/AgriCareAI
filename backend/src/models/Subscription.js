import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  farmer:               { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  stripeCustomerId:     { type: String },
  stripeSubscriptionId: { type: String },
  plan:                 { type: String, default: "monthly" },
  status:               { type: String, enum: ["active","inactive","cancelled","past_due","trialing"], default: "inactive" },
  currentPeriodStart:   { type: Date },
  currentPeriodEnd:     { type: Date },
  amount:               { type: Number, default: 999 },
  currency:             { type: String, default: "usd" },
  cancelAtPeriodEnd:    { type: Boolean, default: false },
}, { timestamps: true });

subscriptionSchema.virtual("isActive").get(function() {
  return this.status === "active" || this.status === "trialing";
});

export default mongoose.model("Subscription", subscriptionSchema);