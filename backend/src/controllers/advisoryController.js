import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client lazily
let _genAI = null;
const getGeminiClient = () => {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set in .env");
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
};

/**
 * @desc    Generate an actionable advisory using Gemini AI
 * @route   POST /api/advisory
 * @access  Private or Public depending on requirements
 */
export const generateAdvisory = async (req, res) => {
  try {
    const {
      crop_type,
      growth_stage,
      district,
      symptoms_description = "None",
      vision_analysis_results = "None",
      nitrogen_level = "Unknown",
      phosphorus_level = "Unknown",
      potassium_level = "Unknown",
      soil_ph = "Unknown",
      soil_observations = "None",
      temperature = "Unknown",
      rainfall = "Unknown",
      humidity = "Unknown",
      wind_speed = "Unknown",
      weather_alerts = "None",
      forecast = "None"
    } = req.body;

    // Build the prompt based on the user's template
    const prompt = `
Your task is to analyze crop disease, nutrient levels, and district weather alerts, then provide actionable advice for a Sri Lankan farmer.

Based on the following information, provide a comprehensive advisory:

CROP INFORMATION:
- Crop Type: ${crop_type}
- Growth Stage: ${growth_stage}
- District: ${district} (Sri Lanka)

DISEASE ANALYSIS:
- Observed Symptoms: ${symptoms_description}
- Image Analysis Results: ${vision_analysis_results}

NUTRIENT LEVELS:
- Nitrogen: ${nitrogen_level} ppm
- Phosphorus: ${phosphorus_level} ppm
- Potassium: ${potassium_level} ppm
- Soil pH: ${soil_ph}
- Additional Observations: ${soil_observations}

WEATHER ALERT (for their district):
- Current Temperature: ${temperature}°C
- Rainfall: ${rainfall} mm
- Humidity: ${humidity}%
- Wind Speed: ${wind_speed} km/h
- Weather Warnings: ${weather_alerts}
- 3-Day Forecast: ${forecast}

Please provide a structured response with:

1. DISEASE DIAGNOSIS & TREATMENT
   - Identify the most likely disease(s) based on symptoms
   - Immediate actions required (next 24-48 hours)
   - Organic treatment options suitable for Sri Lanka
   - Chemical treatment options (if necessary, with safety precautions)

2. NUTRIENT RECOMMENDATIONS
   - Assess current nutrient status (deficient/optimal/excess)
   - Recommended fertilizer type and quantity (per acre/per hectare)
   - Application method and timing
   - Organic alternatives (compost, green manure, etc.)

3. WEATHER IMPACT & ADVISORY
   - How current/pending weather affects this crop at this growth stage
   - Protective measures needed (if adverse weather expected)
   - Irrigation recommendations based on rainfall forecast
   - Best times for spraying, fertilizing, or harvesting in next 3 days

4. PRIORITY ACTION PLAN
   - List 3-5 specific actions the farmer should take today/tomorrow
   - Rank by urgency (High/Medium/Low)

5. LOCAL RESOURCES
   - Suggest where to find help (Agricultural Instructor, Agrarian Services Centre)
   - Recommend relevant Sri Lankan agricultural extension contacts

Keep advice practical, affordable, and specific to Sri Lankan tropical conditions. Use Sinhala or Tamil terms in parentheses where helpful. Assume farmer has basic resources.
`;

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const advisoryText = response.text();

    return res.status(200).json({
      success: true,
      data: advisoryText,
    });
  } catch (error) {
    console.error("Error generating advisory from Gemini AI:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while generating the advisory. Please check your API key and try again.",
      error: error.message,
    });
  }
};

