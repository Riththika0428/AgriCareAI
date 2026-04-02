import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
  name:        { type: String },
  dosage:      { type: String },
  instruction: { type: String },
  warning:     { type: String },
}, { _id: false });

const diseaseSchema = new mongoose.Schema({
  farmer:             { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cropName:           { type: String, required: true },
  imageUrl:           { type: String, required: true },
  diseaseName:        { type: String, default: "Unknown" },
  scientificName:     { type: String, default: "" },
  confidence:         { type: Number, default: 0 },
  severity:           { type: String, enum: ["None","Low","Medium","High"], default: "Low" },
  isHealthy:          { type: Boolean, default: false },
  symptoms:           { type: String, default: "" },
  preventionTips:     { type: String, default: "" },
  organicTreatments:  { type: [treatmentSchema], default: [] },
  chemicalTreatments: { type: [treatmentSchema], default: [] },
  status:             { type: String, enum: ["Pending","Treated","Monitoring","Resolved"], default: "Pending" },
  notes:              { type: String, default: "" },
  detailedAnalysis:   { type: String, default: "" },
  
}, { timestamps: true });



export default mongoose.model("Disease", diseaseSchema);