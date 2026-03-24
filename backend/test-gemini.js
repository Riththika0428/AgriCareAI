// ── Run this in your BACKEND folder ──────────────────────
// node test-gemini.js
//
// This will tell you EXACTLY what Gemini returns

import dotenv from "dotenv";
import path   from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Load your .env
dotenv.config({ path: path.join(__dirname, ".env") });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("API Key:", GEMINI_API_KEY ? `✅ Found: ${GEMINI_API_KEY.slice(0,10)}...` : "❌ NOT FOUND");

// Test models in order
const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-pro",
];

async function testModel(model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  try {
    const res  = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Identify this disease: powdery white spots on leaves. Reply in one word." }] }],
      }),
    });
    const data = await res.json();
    if (res.ok && data.candidates) {
      console.log(`✅ ${model} WORKS — response: "${data.candidates[0].content.parts[0].text.trim()}"`);
      return true;
    } else {
      console.log(`❌ ${model} FAILED — ${data.error?.message || JSON.stringify(data)}`);
      return false;
    }
  } catch (e) {
    console.log(`❌ ${model} ERROR — ${e.message}`);
    return false;
  }
}

console.log("\n🔍 Testing Gemini models...\n");
for (const model of MODELS) {
  const worked = await testModel(model);
  if (worked) {
    console.log(`\n✅ USE THIS MODEL: ${model}`);
    console.log(`Replace in diseaseController.js:\nconst GEMINI_URL = \`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=\${GEMINI_API_KEY}\`;`);
    break;
  }
}