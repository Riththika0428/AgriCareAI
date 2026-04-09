import Disease          from "../models/Disease.js";
import path             from "path";
import fs               from "fs";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Cerebras          from "@cerebras/cerebras_cloud_sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── Gemini client (singleton) ─────────────────────────────────────────────
let _genAI = null;
function getGemini() {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY missing");
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

// ─── Cerebras client (singleton) ───────────────────────────────────────────
let _cerebras = null;
function getCerebras() {
  if (!_cerebras) {
    const key = process.env.CEREBRAS_API_KEY;
    if (!key) throw new Error("CEREBRAS_API_KEY missing");
    _cerebras = new Cerebras({ apiKey: key });
  }
  return _cerebras;
}

// ─── Fallback result (Absolute Failure) ─────────────────────────────────────
const FALLBACK = {
  cropIdentified:     "Unknown",
  diseaseName:        "Unable to identify (AI Busy)",
  scientificName:     "Unknown",
  confidence:         0,
  severity:           "None",
  isHealthy:          false,
  symptoms:           "AI service temporarily unavailable due to high demand. Please try again in 1-2 minutes.",
  detailedAnalysis:   "Our AI models are currently processing a high volume of requests. We prioritize accuracy and will be ready to analyze your crop shortly.",
  preventionTips:     "General advice: Ensure proper spacing, avoid overhead watering, and monitor for changes.",
  organicTreatments:  [],
  chemicalTreatments: [],
};

/**
 * ─── Gemini 2.0 Vision (Primary) ──────────────────────────────────────────
 */
async function analyzeWithGemini(imageBuffer, mimeType, cropName, symptoms) {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const prompt = `You are an expert plant pathologist. Analyze this image of a ${cropName} plant.
Farmer notes: "${symptoms}"

Identify diseases/pests and return EXACT JSON:
{
  "cropIdentified": "${cropName}",
  "isHealthy": boolean,
  "diseaseName": "string",
  "scientificName": "string",
  "confidence": number,
  "severity": "Low"|"Medium"|"High"|"None",
  "symptoms": "string",
  "detailedAnalysis": "2 paragraphs",
  "preventionTips": "string",
  "organicTreatments": [{"name":"string","dosage":"string","instruction":"string"}],
  "chemicalTreatments": [{"name":"string","dosage":"string","warning":"string"}]
}
Return ONLY RAW JSON. No markdown. Use Sri Lankan context.`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: imageBuffer.toString("base64"), mimeType } },
  ]);

  const resp = await result.response;
  let text = resp.text().replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(text);
}

/**
 * ─── Cerebras Llama 3.1 Reasoning (Secondary Fallback) ───────────────────
 */
async function analyzeWithCerebras(cropName, symptoms) {
  const client = getCerebras();
  const prompt = `You are an expert plant pathologist. A farmer reports:
Crop: ${cropName}
Symptoms: ${symptoms}

Diagnose based on these Sri Lankan symptoms. Return EXACT JSON:
{
  "cropIdentified": "${cropName}",
  "isHealthy": false,
  "diseaseName": "string",
  "scientificName": "string",
  "confidence": 70,
  "severity": "Medium",
  "symptoms": "${symptoms}",
  "detailedAnalysis": "Text-based reasoning: ...",
  "preventionTips": "string",
  "organicTreatments": [{"name":"string","dosage":"string","instruction":"string"}],
  "chemicalTreatments": [{"name":"string","dosage":"string","warning":"string"}]
}
Return ONLY RAW JSON.`;

  const resp = await client.chat.completions.create({
    model: "llama3.1-8b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
  });

  let text = resp.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(text);
}

// ─── SCAN CROP ────────────────────────────────────────────────────────────────
export const scanCrop = async (req, res) => {
  try {
    if (!req.file || !req.body.cropName) return res.status(400).json({ message: "Missing image or crop name" });

    const cropName = req.body.cropName.trim();
    const symptoms = req.body.symptoms || "None provided";
    const imageUrl = `/uploads/${req.file.filename}`;
    const imageBuffer = req.file.buffer || fs.readFileSync(req.file.path);

    let finalResult = null;
    let aiProvider = "none";

    // 1. Try Gemini Vision
    try {
      console.log(`👁 Gemini Vision attempt: ${cropName}`);
      finalResult = await analyzeWithGemini(imageBuffer, req.file.mimetype, cropName, symptoms);
      aiProvider = "gemini-vision";
    } catch (gErr) {
      console.error(`⚠ Gemini failed: ${gErr.message}`);
      
      // 2. Fallback to Cerebras Text-Reasoning
      try {
        console.log(`🧠 Cerebras Fallback attempt: ${cropName}`);
        finalResult = await analyzeWithCerebras(cropName, symptoms);
        aiProvider = "cerebras-text-fallback";
        finalResult.detailedAnalysis = `[Text-only Analysis] ${finalResult.detailedAnalysis}`;
      } catch (cErr) {
        console.error(`❌ Cerebras failed: ${cErr.message}`);
        finalResult = { ...FALLBACK, cropIdentified: cropName };
      }
    }

    const scan = await Disease.create({
      farmer: req.user._id,
      cropName: finalResult.cropIdentified || cropName,
      imageUrl,
      diseaseName: finalResult.diseaseName,
      scientificName: finalResult.scientificName,
      confidence: finalResult.confidence,
      severity: finalResult.severity,
      isHealthy: finalResult.isHealthy,
      symptoms: finalResult.symptoms || symptoms,
      detailedAnalysis: finalResult.detailedAnalysis,
      preventionTips: finalResult.preventionTips,
      organicTreatments: finalResult.organicTreatments,
      chemicalTreatments: finalResult.chemicalTreatments,
      status: "Pending",
    });

    res.status(201).json({
      message: aiProvider === "gemini-vision" 
        ? "✅ Vision-AI analysis complete." 
        : aiProvider === "cerebras-text-fallback"
        ? "⚠ Image analysis busy. Provided result based on symptoms description."
        : "❌ AI services unavailable.",
      scan,
      aiProvider,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyScan = async (req, res) => {
  try {
    const scans = await Disease.find({ farmer: req.user._id }).sort("-createdAt");
    res.json(scans);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getScanById = async (req, res) => {
  try {
    const scan = await Disease.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: "Scan not found." });
    res.json(scan);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

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

export const deleteScan = async (req, res) => {
  try {
    await Disease.findByIdAndDelete(req.params.id);
    res.json({ message: "Scan deleted." });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

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