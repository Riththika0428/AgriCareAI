import mongoose from "mongoose";

const weatherAlertSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Location
    district: {
      type: String,
      required: [true, "District is required"],
      enum: [
        "Colombo","Gampaha","Kalutara","Kandy","Matale",
        "Nuwara Eliya","Galle","Matara","Hambantota","Jaffna",
        "Kilinochchi","Mannar","Vavuniya","Mullaitivu","Batticaloa",
        "Ampara","Trincomalee","Kurunegala","Puttalam","Anuradhapura",
        "Polonnaruwa","Badulla","Moneragala","Ratnapura","Kegalle",
      ],
    },

    // Current weather
    temperature: { type: Number },
    humidity:    { type: Number },
    rainfall:    { type: Number },
    windSpeed:   { type: Number },
    condition:   { type: String },
    description: { type: String },

    // Alert level
    alertLevel: {
      type: String,
      enum: ["Normal", "Watch", "Warning", "Danger"],
      default: "Normal",
    },

    // Crop advice
    cropAdvice: { type: String, default: "" },

    // 3-day forecast
    forecast: [
      {
        date:      String,
        condition: String,
        tempMin:   Number,
        tempMax:   Number,
        rainfall:  Number,
        humidity:  Number,
      },
    ],

    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("WeatherAlert", weatherAlertSchema);