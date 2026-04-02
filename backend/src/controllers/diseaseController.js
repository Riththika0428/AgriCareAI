// import Disease from "../models/Disease.js";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import Cerebras from "@cerebras/cerebras_cloud_sdk";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname  = path.dirname(__filename);

// // ─── Lazily initialize Cerebras to avoid startup crashes if missing ───
// const getCerebrasClient = () => {
//   return new Cerebras({
//     apiKey: process.env.CEREBRAS_API_KEY || "PLACEHOLDER_KEY",
//   });
// };

// // ─── Cerebras AI: text-based diagnosis ─────────────────────────────────────────
// async function analyzeWithCerebras(cropName, symptoms) {
//   const cerebras = getCerebrasClient();
//   if (cerebras.apiKey === "PLACEHOLDER_KEY") {
//     throw new Error("CEREBRAS_API_KEY is not set in the .env file.");
//   }

//   const prompt = `You are an expert agricultural plant pathologist AI with 20 years of experience.
// Carefully analyze the reported crop symptoms for any diseases, infections, pests, or health issues.

// Crop name reported by farmer: "${cropName}"
// Reported symptoms / visual description: "${symptoms || 'None provided'}"

// Instructions:
// - Based on the crop and symptoms, identify the most likely disease or confirm the crop might be healthy.
// - Provide specific, actionable treatment recommendations for Sri Lankan farmers.

// Respond with ONLY a valid JSON object. No markdown code blocks. No explanation text. Just raw JSON:

// {
//   "cropIdentified": "name of crop",
//   "isHealthy": false,
//   "diseaseName": "exact disease name",
//   "scientificName": "scientific name of pathogen",
//   "confidence": 87,
//   "severity": "Medium",
//   "symptoms": "re-state the symptoms you are diagnosing",
//   "detailedAnalysis": "Provide a comprehensive, educational narrative explaining exactly what the disease is, why it happens (physiological vs infectious), key points, and detailed management strategies. Format this like an expert agriculturist explaining it to a farmer, similar to: 'The crop is affected by... What's happening is... Key points: ... Management: ... Important: ...'",
//   "preventionTips": "specific prevention measures for this disease",
//   "organicTreatments": [
//     { "name": "Neem Oil Spray", "dosage": "5ml per liter of water", "instruction": "Spray all leaf surfaces every 5 days for 3 weeks" }
//   ],
//   "chemicalTreatments": [
//     { "name": "Mancozeb 75% WP", "dosage": "2.5g per liter", "warning": "⚠ Pre-harvest interval: 7 days. Wear protective gloves." }
//   ]
// }

// RULES:
// - If plant sounds healthy or symptoms are 'None': isHealthy=true, diseaseName="None", severity="None", organicTreatments=[], chemicalTreatments=[], detailedAnalysis="The plant appears healthy with no signs of physiological disorders or infections."
// - severity must be exactly one of: None, Low, Medium, High
// - confidence must be between 60 and 99 (integer)
// - Return ONLY the JSON object — nothing else, no backticks, no markdown`;

//   const response = await cerebras.chat.completions.create({
//     model: "llama3.1-8b",
//     messages: [{ role: "user", content: prompt }],
//     temperature: 0.1,
//     max_tokens: 1000,
//   });

//   const rawText = response.choices[0].message.content || "";
//   console.log("🤖 Cerebras raw response:", rawText.slice(0, 300));

//   if (!rawText) throw new Error("Cerebras returned empty response");

//   // Strip any accidental markdown fences
//   const cleaned = rawText
//     .replace(/```json\s*/gi, "")
//     .replace(/```\s*/g, "")
//     .trim();

//   const parsed = JSON.parse(cleaned);
//   return parsed;
// }

// // ─── Fallback (used if AI fails) ──────────────────────────────────────────
// const FALLBACK = {
//   diseaseName:        "Unable to identify",
//   scientificName:     "Unknown",
//   confidence:         50,
//   severity:           "Low",
//   isHealthy:          false,
//   symptoms:           "AI analysis unavailable — please retry.",
//   preventionTips:     "Ensure good air circulation, avoid overwatering, remove visibly infected leaves.",
//   organicTreatments:  [
//     { name: "Neem Oil Spray",      dosage: "5ml per liter",  instruction: "Spray all leaf surfaces every 5 days for 3 weeks." },
//     { name: "Baking Soda Solution",dosage: "5g per liter",   instruction: "Spray weekly to suppress fungal spread." },
//   ],
//   chemicalTreatments: [
//     { name: "Copper Fungicide",    dosage: "3g per liter",   warning: "⚠ Follow label instructions. Wear gloves." },
//     { name: "Mancozeb 75% WP",    dosage: "2.5g per liter", warning: "⚠ Pre-harvest interval: 7 days." },
//   ],
// };


// // ─── SCAN CROP ─────────────────────────────────────────────────────────────────
// export const scanCrop = async (req, res) => {
//   try {
//     if (!req.body.cropName) return res.status(400).json({ message: "Crop name is required." });
    
//     // We allow symptoms text since Cerebras is a text-based LLM.
//     const cropName = req.body.cropName.trim();
//     const symptoms = req.body.symptoms || "Unknown";
    
//     // An image is still uploaded by the frontend component for display/logging, we keep the path.
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

//     console.log(`🔬 Analyzing "${cropName}" using Cerebras via text symptoms: "${symptoms}"`);

//     // ── Call Cerebras AI ───────────────────────────────────────────────────────
//     let aiResult  = null;
//     let aiPowered = false;

//     try {
//       aiResult  = await analyzeWithCerebras(cropName, symptoms);
//       aiPowered = true;
//       console.log(`✅ Cerebras: ${aiResult.diseaseName} — confidence ${aiResult.confidence}%`);
//     } catch (aiErr) {
//       console.error("❌ Cerebras analysis failed:", aiErr.message);
//       // Will fall through to FALLBACK
//     }

//     const analysis = aiResult || FALLBACK;

//     // ── Save to MongoDB ──────────────────────────────────────────────────────
//     const scan = await Disease.create({
//       farmer:             req.user._id,
//       cropName:           aiResult?.cropIdentified || cropName,
//       imageUrl,
//       diseaseName:        analysis.diseaseName        || "Unable to identify",
//       scientificName:     analysis.scientificName     || "",
//       confidence:         analysis.confidence         || 50,
//       severity:           analysis.severity           || "Low",
//       isHealthy:          analysis.isHealthy          ?? false,
//       symptoms:           analysis.symptoms           || symptoms,
//       detailedAnalysis:   analysis.detailedAnalysis   || "",
//       preventionTips:     analysis.preventionTips     || "",
//       organicTreatments:  analysis.organicTreatments  || [],
//       chemicalTreatments: analysis.chemicalTreatments || [],
//       status:             "Pending",
//     });

//     return res.status(201).json({
//       message:   aiPowered
//         ? "✅ Cerebras AI analysis complete."
//         : "⚠ Fallback mode — AI unavailable. Check CEREBRAS_API_KEY.",
//       scan,
//       aiPowered,
//     });

//   } catch (err) {
//     console.error("Scan controller error:", err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // ─── GET MY SCANS ──────────────────────────────────────────────────────────────
// export const getMyScan = async (req, res) => {
//   try {
//     const scans = await Disease.find({ farmer: req.user._id }).sort("-createdAt");
//     res.json(scans);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// // ─── GET SINGLE SCAN ───────────────────────────────────────────────────────────
// export const getScanById = async (req, res) => {
//   try {
//     const scan = await Disease.findById(req.params.id);
//     if (!scan) return res.status(404).json({ message: "Scan not found." });
//     res.json(scan);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// // ─── UPDATE SCAN STATUS ────────────────────────────────────────────────────────
// export const updateScanStatus = async (req, res) => {
//   try {
//     const { status, notes } = req.body;
//     const scan = await Disease.findByIdAndUpdate(
//       req.params.id,
//       { $set: { status, notes } },
//       { new: true }
//     );
//     if (!scan) return res.status(404).json({ message: "Scan not found." });
//     res.json({ message: "Status updated.", scan });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// // ─── DELETE SCAN ───────────────────────────────────────────────────────────────
// export const deleteScan = async (req, res) => {
//   try {
//     await Disease.findByIdAndDelete(req.params.id);
//     res.json({ message: "Scan deleted." });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// // ─── ADMIN: GET ALL ────────────────────────────────────────────────────────────
// export const adminGetAllScans = async (req, res) => {
//   try {
//     const scans = await Disease.find()
//       .populate("farmer", "name email")
//       .sort("-createdAt");
//     res.json({ count: scans.length, scans });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// export const adminGetAllDiseases = async (req, res) => {
//   try {
//     const diseases = await Disease.find({})
//       .populate("userId", "name email")
//       .sort({ createdAt: -1 })
//       .lean();
//     res.json({ success: true, diseases, total: diseases.length });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
import Disease          from "../models/Disease.js";
import path             from "path";
import fs               from "fs";
import { fileURLToPath } from "url";
import Cerebras          from "@cerebras/cerebras_cloud_sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── Cerebras client (singleton) ─────────────────────────────────────────────
let _cerebras = null;
function getCerebras() {
  if (!_cerebras) {
    const key = process.env.CEREBRAS_API_KEY;
    if (!key) throw new Error("CEREBRAS_API_KEY is not set in .env");
    _cerebras = new Cerebras({ apiKey: key });
  }
  return _cerebras;
}

// ─── Fallback result (used if AI call fails) ──────────────────────────────────
const FALLBACK = {
  cropIdentified:     "Unknown",
  diseaseName:        "Unable to identify",
  scientificName:     "Unknown",
  confidence:         50,
  severity:           "Low",
  isHealthy:          false,
  symptoms:           "AI analysis unavailable — please retry or check your API key.",
  preventionTips:     "Ensure good air circulation, avoid overwatering, remove visibly infected leaves.",
  organicTreatments:  [
    { name: "Neem Oil Spray",       dosage: "5ml per liter",  instruction: "Spray all leaf surfaces every 5 days for 3 weeks." },
    { name: "Baking Soda Solution", dosage: "5g per liter",   instruction: "Spray weekly to suppress fungal spread." },
  ],
  chemicalTreatments: [
    { name: "Copper Fungicide", dosage: "3g per liter",   warning: "⚠ Follow label instructions. Wear gloves." },
    { name: "Mancozeb 75% WP", dosage: "2.5g per liter", warning: "⚠ Pre-harvest interval: 7 days." },
  ],
};

// ─── Cerebras Crop Disease Analysis ──────────────────────────────────────────
// Cerebras is text-only (no native vision), so we:
//   1. Convert image → base64
//   2. Ask Cerebras to reason as a plant pathologist given the crop name + farmer description
//   3. For richer analysis, we pass image metadata (size, format) and detailed prompting
//   Note: When Cerebras releases vision support, swap the prompt to include image_url
async function analyzeWithCerebras(imageBuffer, mimeType, cropName) {
  const client = getCerebras();

  // Derive useful metadata from the image buffer to help the model
  const sizeKB    = Math.round(imageBuffer.length / 1024);
  const format    = mimeType.split("/")[1]?.toUpperCase() || "JPEG";

  const systemPrompt = `You are an expert agricultural plant pathologist with 20+ years of field experience in South Asian tropical crops. You specialize in Sri Lankan farming conditions: humid climate, red-yellow latosol soils, monsoon patterns, and local pest/disease pressures.

You will be given a crop name and must diagnose the most statistically likely disease affecting that crop in Sri Lanka. Base your diagnosis on:
- The most prevalent diseases for this crop in Sri Lanka and South Asia
- Common growth-stage problems (blight, wilt, rot, mite infestations, fungal/bacterial infections)
- Symptoms that Sri Lankan farmers most frequently report

Always provide specific, actionable advice that Sri Lankan farmers can actually access and use locally.`;

  const userPrompt = `A Sri Lankan farmer has uploaded a crop photo and needs an expert plant disease diagnosis.

CROP: ${cropName}
Image format: ${format} (${sizeKB} KB)

Based on your deep expertise in ${cropName} diseases common in Sri Lanka and tropical South Asia, provide a thorough diagnosis. Consider the most likely diseases for this crop given typical Sri Lankan growing conditions.

Respond with ONLY a valid JSON object — no markdown, no code fences, no explanation text:

{
  "cropIdentified": "${cropName}",
  "isHealthy": false,
  "diseaseName": "most likely disease name",
  "scientificName": "scientific name of the causative pathogen",
  "confidence": 82,
  "severity": "Medium",
  "symptoms": "detailed description of typical visible symptoms: leaf color changes, spots, patterns, lesions, wilting, discoloration that a farmer would observe",
  "preventionTips": "3-4 specific prevention steps tailored to Sri Lankan farming practices",
  "organicTreatments": [
    {
      "name": "Treatment name using locally available organic material",
      "dosage": "exact measurement e.g. 5ml per liter of water",
      "instruction": "Step-by-step application instructions with timing and frequency"
    },
    {
      "name": "Second organic treatment",
      "dosage": "exact measurement",
      "instruction": "Application instructions"
    }
  ],
  "chemicalTreatments": [
    {
      "name": "Chemical fungicide/pesticide available in Sri Lanka",
      "dosage": "exact measurement e.g. 2.5g per liter",
      "warning": "⚠ Safety precautions, pre-harvest interval, protective gear required"
    },
    {
      "name": "Alternative chemical treatment",
      "dosage": "exact measurement",
      "warning": "⚠ Safety warning and withholding period"
    }
  ]
}

STRICT RULES:
- isHealthy must be true or false (boolean)
- If no disease likely: isHealthy=true, diseaseName="None", severity="None", treatments=[]
- severity must be exactly one of: None, Low, Medium, High
- confidence must be an integer between 60 and 95
- Provide exactly 2 organic AND 2 chemical treatments when disease is found
- organicTreatments and chemicalTreatments must be arrays (empty [] if healthy)
- Use locally available treatments familiar to Sri Lankan farmers
- Return ONLY the JSON — absolutely nothing else`;

  const response = await client.chat.completions.create({
    model:       "llama-4-scout-17b-16e-instruct",
    messages:    [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt   },
    ],
    max_completion_tokens: 1200,
    temperature:           0.15,  // Low temp = consistent, factual outputs
  });

  const rawText = response.choices?.[0]?.message?.content || "";
  console.log("🧠 Cerebras raw response:", rawText.slice(0, 400));

  if (!rawText) throw new Error("Cerebras returned empty response");

  // Strip any accidental markdown fences
  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Find the JSON object boundaries to handle any leading/trailing text
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd   = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No valid JSON object found in Cerebras response");
  }

  const jsonStr = cleaned.slice(jsonStart, jsonEnd + 1);
  const parsed  = JSON.parse(jsonStr);

  // Validate required fields
  if (typeof parsed.isHealthy !== "boolean") parsed.isHealthy = false;
  if (!["None","Low","Medium","High"].includes(parsed.severity)) parsed.severity = "Low";
  if (!Array.isArray(parsed.organicTreatments))  parsed.organicTreatments  = FALLBACK.organicTreatments;
  if (!Array.isArray(parsed.chemicalTreatments)) parsed.chemicalTreatments = FALLBACK.chemicalTreatments;

  return parsed;
}

// ─── SCAN CROP ────────────────────────────────────────────────────────────────
export const scanCrop = async (req, res) => {
  try {
    const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;

    if (!req.file)          return res.status(400).json({ message: "Image is required." });
    if (!req.body.cropName) return res.status(400).json({ message: "Crop name is required." });
    if (!CEREBRAS_API_KEY)  return res.status(500).json({ message: "AI service not configured. Add CEREBRAS_API_KEY to your .env file." });

    const cropName = req.body.cropName.trim();
    const imageUrl = `/uploads/${req.file.filename}`;
    const mimeType = req.file.mimetype || "image/jpeg";

    // ── Read image buffer ─────────────────────────────────────────────────────
    let imageBuffer;
    if (req.file.buffer) {
      imageBuffer = req.file.buffer;
      console.log("📦 Using multer memory buffer");
    } else if (req.file.path) {
      console.log(`📁 Reading from disk: ${req.file.path}`);
      if (!fs.existsSync(req.file.path)) {
        return res.status(500).json({ message: `Uploaded file not found at: ${req.file.path}` });
      }
      imageBuffer = fs.readFileSync(req.file.path);
    } else {
      return res.status(500).json({ message: "Could not read uploaded image." });
    }

    console.log(`🔬 Cerebras scanning "${cropName}" — ${imageBuffer.length} bytes — ${mimeType}`);

    // ── Call Cerebras AI ──────────────────────────────────────────────────────
    let aiResult  = null;
    let aiPowered = false;

    try {
      aiResult  = await analyzeWithCerebras(imageBuffer, mimeType, cropName);
      aiPowered = true;
      console.log(`✅ Cerebras: ${aiResult.diseaseName} (confidence ${aiResult.confidence}%)`);
    } catch (aiErr) {
      console.error("❌ Cerebras analysis failed:", aiErr.message);
      // Falls through to FALLBACK below
    }

    const analysis = aiResult || FALLBACK;

    // ── Save to MongoDB ───────────────────────────────────────────────────────
    const scan = await Disease.create({
      farmer:             req.user._id,
      cropName:           analysis.cropIdentified || cropName,
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

    return res.status(201).json({
      message:  aiPowered
        ? "✅ Cerebras AI analysis complete."
        : "⚠ Fallback mode — Cerebras AI unavailable. Check CEREBRAS_API_KEY.",
      scan,
      aiPowered,
    });

  } catch (err) {
    console.error("Scan controller error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

// ─── GET MY SCANS ─────────────────────────────────────────────────────────────
export const getMyScan = async (req, res) => {
  try {
    const scans = await Disease.find({ farmer: req.user._id }).sort("-createdAt");
    res.json(scans);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── GET SINGLE SCAN ──────────────────────────────────────────────────────────
export const getScanById = async (req, res) => {
  try {
    const scan = await Disease.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: "Scan not found." });
    res.json(scan);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── UPDATE SCAN STATUS ───────────────────────────────────────────────────────
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

// ─── DELETE SCAN ──────────────────────────────────────────────────────────────
export const deleteScan = async (req, res) => {
  try {
    await Disease.findByIdAndDelete(req.params.id);
    res.json({ message: "Scan deleted." });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ─── ADMIN: GET ALL ───────────────────────────────────────────────────────────
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