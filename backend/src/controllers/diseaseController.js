import Disease          from "../models/Disease.js";
import path             from "path";
import fs               from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Fallback (used if AI fails) ────────────────────────────
const FALLBACK = {
  diseaseName:        "Unable to identify",
  scientificName:     "Unknown",
  confidence:         50,
  severity:           "Low",
  isHealthy:          false,
  symptoms:           "",
  preventionTips:     "",
  organicTreatments:  [{ name:"Neem Oil Spray",  dosage:"5ml per liter", instruction:"General preventive spray. Apply weekly." }],
  chemicalTreatments: [{ name:"Copper Fungicide", dosage:"3g per liter",  warning:"⚠ Follow label instructions." }],
};

// ── OpenRouter Vision API ──────────────────────────────────
// Uses google/gemini-2.0-flash-exp:free via OpenRouter (no quota issues)
async function analyzeWithOpenRouter(imageBuffer, mimeType, cropName) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const base64Image        = imageBuffer.toString("base64");
  const dataUrl            = `data:${mimeType};base64,${base64Image}`;

  const prompt = `You are an expert agricultural plant pathologist AI. Analyze this crop image very carefully.

Crop name provided by farmer: "${cropName}"

Look at the image and identify any diseases, infections, or health issues visible on the plant.

Respond with ONLY a valid JSON object. No markdown. No explanation. Just raw JSON:

{
  "cropIdentified": "the crop you see in the image",
  "isHealthy": false,
  "diseaseName": "exact name of the disease you identified",
  "scientificName": "scientific name of the pathogen causing the disease",
  "confidence": 87,
  "severity": "Medium",
  "symptoms": "describe exactly what you see: colors, spots, patterns, lesions, texture changes",
  "organicTreatments": [
    { "name": "Neem Oil Spray", "dosage": "5ml per liter of water", "instruction": "Spray on all leaf surfaces every 5 days for 3 weeks" },
    { "name": "Baking Soda Solution", "dosage": "5g per liter", "instruction": "Spray weekly to prevent further fungal spread" }
  ],
  "chemicalTreatments": [
    { "name": "Mancozeb 75% WP", "dosage": "2.5g per liter", "warning": "⚠ Pre-harvest interval: 7 days. Wear protective gloves." },
    { "name": "Chlorothalonil", "dosage": "2g per liter", "warning": "⚠ Do not apply within 5 days of harvest." }
  ],
  "preventionTips": "Remove infected leaves immediately, improve air circulation, avoid overhead watering"
}

IMPORTANT RULES:
- If the plant looks healthy: set isHealthy=true, diseaseName="None", severity="None"
- severity must be exactly one of: None, Low, Medium, High
- confidence must be between 60 and 99
- Provide exactly 2 organic treatments and 2 chemical treatments when disease is found
- Return ONLY the JSON object, absolutely nothing else`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method:  "POST",
    headers: {
      "Authorization":  `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type":   "application/json",
      "HTTP-Referer":   "http://localhost:3000",
      "X-Title":        "AgriAI Crop Doctor",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-lite:free",
      messages: [{
        role:    "user",
        content: [
          { type: "text",      text: prompt },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      }],
      max_tokens:   1500,
      temperature:  0.1,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter HTTP ${response.status}: ${errText}`);
  }

  const result  = await response.json();

  // Check for API-level errors
  if (result.error) {
    throw new Error(`OpenRouter error: ${result.error.message}`);
  }

  const text    = result.choices?.[0]?.message?.content || "";
  console.log("🤖 Raw AI response:", text.slice(0, 200));

  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  if (!cleaned)  throw new Error("AI returned empty response");

  const parsed  = JSON.parse(cleaned);
  return parsed;
}

// ── SCAN CROP ──────────────────────────────────────────────
export const scanCrop = async (req, res) => {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!req.file)               return res.status(400).json({ message: "Image is required." });
    if (!req.body.cropName)      return res.status(400).json({ message: "Crop name is required." });
    if (!OPENROUTER_API_KEY)     return res.status(500).json({ message: "AI service not configured. Add OPENROUTER_API_KEY to .env" });

    const cropName = req.body.cropName.trim();
    const imageUrl = `/uploads/${req.file.filename}`;
    const mimeType = req.file.mimetype || "image/jpeg";

    // ── Read image buffer ──────────────────────────────────
    let finalBuffer;
    if (req.file.buffer) {
      finalBuffer = req.file.buffer;
      console.log("📦 Using memory buffer");
    } else if (req.file.path) {
      console.log(`📁 Reading from disk: ${req.file.path}`);
      if (!fs.existsSync(req.file.path)) {
        return res.status(500).json({ message: `Image not found at: ${req.file.path}` });
      }
      finalBuffer = fs.readFileSync(req.file.path);
    } else {
      return res.status(500).json({ message: "Could not read uploaded image." });
    }

    console.log(`🔬 Scanning "${cropName}" — ${finalBuffer.length} bytes, ${mimeType}`);

    // ── Call OpenRouter AI ─────────────────────────────────
    let aiResult  = null;
    let aiPowered = false;

    try {
      aiResult  = await analyzeWithOpenRouter(finalBuffer, mimeType, cropName);
      aiPowered = true;
      console.log(`✅ AI Result: ${aiResult.diseaseName} (${aiResult.confidence}% confidence)`);
    } catch (aiErr) {
      console.error("❌ AI analysis failed:", aiErr.message);
      // Falls through to FALLBACK
    }

    const analysis = aiResult || FALLBACK;

    // ── Save to MongoDB ────────────────────────────────────
    const scan = await Disease.create({
      farmer:             req.user._id,
      cropName:           aiResult?.cropIdentified || cropName,
      imageUrl,
      diseaseName:        analysis.diseaseName        || "Unable to identify",
      scientificName:     analysis.scientificName     || "",
      confidence:         analysis.confidence         || 50,
      severity:           analysis.severity           || "Low",
      isHealthy:          analysis.isHealthy          ?? false,
      symptoms:           analysis.symptoms           || "",
      preventionTips:     analysis.preventionTips     || "",
      organicTreatments:  analysis.organicTreatments  || [],
      chemicalTreatments: analysis.chemicalTreatments || [],
      status:             "Pending",
    });

    res.status(201).json({
      message:   aiPowered ? "✅ AI analysis complete." : "⚠ Fallback mode — AI unavailable.",
      scan,
      aiPowered,
    });

  } catch (err) {
    console.error("Scan error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── GET MY SCANS ───────────────────────────────────────────
export const getMyScan = async (req, res) => {
  try {
    const scans = await Disease.find({ farmer: req.user._id }).sort("-createdAt");
    res.json(scans);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── GET SINGLE SCAN ────────────────────────────────────────
export const getScanById = async (req, res) => {
  try {
    const scan = await Disease.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: "Scan not found." });
    res.json(scan);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── UPDATE SCAN STATUS ─────────────────────────────────────
export const updateScanStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const scan = await Disease.findByIdAndUpdate(
      req.params.id,
      { $set: { status, notes } },
      { new: true }
    );
    if (!scan) return res.status(404).json({ message: "Scan not found." });
    res.json({ message: "Status updated.", scan });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── DELETE SCAN ────────────────────────────────────────────
export const deleteScan = async (req, res) => {
  try {
    await Disease.findByIdAndDelete(req.params.id);
    res.json({ message: "Scan deleted." });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ── ADMIN GET ALL ──────────────────────────────────────────
export const adminGetAllScans = async (req, res) => {
  try {
    const scans = await Disease.find()
      .populate("farmer", "name email")
      .sort("-createdAt");
    res.json({ count: scans.length, scans });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

 
export const adminGetAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, diseases, total: diseases.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
 