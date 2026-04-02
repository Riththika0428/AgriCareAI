import Cerebras from "@cerebras/cerebras_cloud_sdk";
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
  const cerebras = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });
  const prompt = `You are an expert agricultural plant pathologist AI with 20 years of experience.
Carefully analyze the reported crop symptoms for any diseases, infections, pests, or health issues.

Crop name reported by farmer: "Tomato"
Reported symptoms / visual description: "dark sunken leathery lesions on the bottom of the fruit"

Instructions:
- Based on the crop and symptoms, identify the most likely disease or confirm the crop might be healthy.
- Provide specific, actionable treatment recommendations for Sri Lankan farmers.

Respond with ONLY a valid JSON object. No markdown code blocks. No explanation text. Just raw JSON:

{
  "cropIdentified": "name of crop",
  "isHealthy": false,
  "diseaseName": "exact disease name",
  "scientificName": "scientific name of pathogen",
  "confidence": 87,
  "severity": "Medium",
  "symptoms": "re-state the symptoms you are diagnosing",
  "detailedAnalysis": "Provide a comprehensive, educational narrative explaining exactly what the disease is, why it happens (physiological vs infectious), key points, and detailed management strategies. Format this like an expert agriculturist explaining it to a farmer.",
  "preventionTips": "specific prevention measures for this disease",
  "organicTreatments": [
    { "name": "Neem Oil Spray", "dosage": "5ml per liter of water", "instruction": "Spray all leaf surfaces every 5 days for 3 weeks" }
  ],
  "chemicalTreatments": [
    { "name": "Mancozeb 75% WP", "dosage": "2.5g per liter", "warning": "⚠ Pre-harvest interval: 7 days. Wear protective gloves." }
  ]
}

RULES:
- severity must be exactly one of: None, Low, Medium, High
- Return ONLY the JSON object — nothing else, no backticks, no markdown`;

  const response = await cerebras.chat.completions.create({
    model: "llama3.1-8b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 1000,
  });
  
  const rawText = response.choices[0].message.content || "";
  console.log("Raw LLM Output:\n", rawText);
  try {
     const cleaned = rawText.replace(/\`\`\`json\s*/gi, "").replace(/\`\`\`\s*/g, "").trim();
     JSON.parse(cleaned);
     console.log("JSON parse successful!");
  } catch(e) {
     console.log("JSON parse FAILED:", e.message);
  }
};
test();
