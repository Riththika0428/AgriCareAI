import NutritionLog from "../models/NutritionLog.js";
import Cerebras     from "@cerebras/cerebras_cloud_sdk";

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

// ─── Nutrient database (% of daily value per 100g) ───────────────────────────
const VEGGIE_DB = {
  "Spinach":      { emoji:"🥬", cal:23,  n:{ vitaminA:188, vitaminC:28,  iron:36, calcium:10, fiber:22, protein:12 }},
  "Carrot":       { emoji:"🥕", cal:41,  n:{ vitaminA:334, vitaminC:10,  iron:3,  calcium:3,  fiber:28, protein:4  }},
  "Broccoli":     { emoji:"🥦", cal:34,  n:{ vitaminA:12,  vitaminC:149, iron:5,  calcium:5,  fiber:21, protein:14 }},
  "Bell Pepper":  { emoji:"🫑", cal:31,  n:{ vitaminA:6,   vitaminC:213, iron:3,  calcium:1,  fiber:10, protein:6  }},
  "Tomato":       { emoji:"🍅", cal:18,  n:{ vitaminA:17,  vitaminC:28,  iron:3,  calcium:1,  fiber:12, protein:4  }},
  "Kale":         { emoji:"🥬", cal:49,  n:{ vitaminA:206, vitaminC:200, iron:9,  calcium:15, fiber:27, protein:17 }},
  "Sweet Potato": { emoji:"🍠", cal:86,  n:{ vitaminA:284, vitaminC:4,   iron:4,  calcium:3,  fiber:13, protein:4  }},
  "Cucumber":     { emoji:"🥒", cal:16,  n:{ vitaminA:2,   vitaminC:5,   iron:2,  calcium:2,  fiber:5,  protein:3  }},
  "Onion":        { emoji:"🧅", cal:40,  n:{ vitaminA:0,   vitaminC:12,  iron:2,  calcium:2,  fiber:7,  protein:5  }},
  "Potato":       { emoji:"🥔", cal:77,  n:{ vitaminA:0,   vitaminC:32,  iron:7,  calcium:1,  fiber:9,  protein:8  }},
  "Corn":         { emoji:"🌽", cal:86,  n:{ vitaminA:1,   vitaminC:9,   iron:4,  calcium:1,  fiber:7,  protein:11 }},
  "Beans":        { emoji:"🫘", cal:31,  n:{ vitaminA:2,   vitaminC:12,  iron:11, calcium:4,  fiber:25, protein:18 }},
  "Cabbage":      { emoji:"🥬", cal:25,  n:{ vitaminA:2,   vitaminC:61,  iron:4,  calcium:4,  fiber:10, protein:6  }},
  "Beetroot":     { emoji:"🫚", cal:43,  n:{ vitaminA:0,   vitaminC:7,   iron:5,  calcium:2,  fiber:8,  protein:5  }},
  "Bitter Gourd": { emoji:"🥒", cal:17,  n:{ vitaminA:6,   vitaminC:84,  iron:4,  calcium:2,  fiber:11, protein:5  }},
  "Drumstick":    { emoji:"🌿", cal:37,  n:{ vitaminA:4,   vitaminC:51,  iron:16, calcium:19, fiber:13, protein:19 }},
  // Fruits
  "Mango":        { emoji:"🥭", cal:60,  n:{ vitaminA:54,  vitaminC:44,  iron:1,  calcium:1,  fiber:6,  protein:3  }},
  "Banana":       { emoji:"🍌", cal:89,  n:{ vitaminA:1,   vitaminC:15,  iron:2,  calcium:1,  fiber:7,  protein:4  }},
  "Orange":       { emoji:"🍊", cal:47,  n:{ vitaminA:4,   vitaminC:89,  iron:1,  calcium:4,  fiber:10, protein:2  }},
  "Papaya":       { emoji:"🍈", cal:43,  n:{ vitaminA:47,  vitaminC:102, iron:1,  calcium:2,  fiber:7,  protein:2  }},
  // Seafood
  "Tuna":         { emoji:"🐟", cal:144, n:{ vitaminA:2,   vitaminC:0,   iron:12, calcium:1,  fiber:0,  protein:63 }},
  "Salmon":       { emoji:"🐟", cal:208, n:{ vitaminA:3,   vitaminC:0,   iron:5,  calcium:1,  fiber:0,  protein:58 }},
  "Sardines":     { emoji:"🐟", cal:208, n:{ vitaminA:2,   vitaminC:0,   iron:14, calcium:38, fiber:0,  protein:61 }},
  "Prawns":       { emoji:"🦐", cal:99,  n:{ vitaminA:2,   vitaminC:0,   iron:14, calcium:7,  fiber:0,  protein:48 }},
  // Eggs & Dairy
  "Chicken Egg":  { emoji:"🥚", cal:155, n:{ vitaminA:10,  vitaminC:0,   iron:10, calcium:5,  fiber:0,  protein:25 }},
  "Milk":         { emoji:"🥛", cal:42,  n:{ vitaminA:5,   vitaminC:1,   iron:0,  calcium:28, fiber:0,  protein:7  }},
  "Yogurt":       { emoji:"🥛", cal:59,  n:{ vitaminA:3,   vitaminC:1,   iron:0,  calcium:18, fiber:0,  protein:10 }},
  // Others
  "Rice":         { emoji:"🍚", cal:130, n:{ vitaminA:0,   vitaminC:0,   iron:2,  calcium:1,  fiber:2,  protein:5  }},
  "Lentils":      { emoji:"🫘", cal:116, n:{ vitaminA:0,   vitaminC:4,   iron:19, calcium:2,  fiber:31, protein:25 }},
  "Chickpeas":    { emoji:"🫘", cal:164, n:{ vitaminA:0,   vitaminC:4,   iron:26, calcium:5,  fiber:28, protein:29 }},
  "Almonds":      { emoji:"🌰", cal:579, n:{ vitaminA:0,   vitaminC:0,   iron:22, calcium:26, fiber:44, protein:42 }},
  "Tofu":         { emoji:"🍱", cal:76,  n:{ vitaminA:0,   vitaminC:0,   iron:30, calcium:35, fiber:2,  protein:17 }},
};

// ─── Score calculator ─────────────────────────────────────────────────────────
function calcScore(totals) {
  const keys = ["vitaminA","vitaminC","iron","calcium","fiber","protein"];
  return Math.round(keys.reduce((s, k) => s + Math.min(totals[k] || 0, 100), 0) / keys.length);
}

// ─── Cerebras Nutrition Advice ────────────────────────────────────────────────
async function getCerebrasNutritionAdvice(entries, nutrientTotals, score) {
  const client = getCerebras();

  // Build a readable summary of what's been eaten
  const loggedItems = entries.length > 0
    ? entries.map(e => `${e.vegetable} (${e.grams}g, ${e.calories} kcal)`).join(", ")
    : "Nothing logged yet today";

  // Identify deficient nutrients (below 40% daily value)
  const deficientNutrients = Object.entries(nutrientTotals)
    .filter(([, v]) => v < 40)
    .map(([k, v]) => `${k} (${Math.round(v)}% of daily need)`)
    .join(", ") || "none — great balance!";

  // Identify adequate nutrients
  const adequateNutrients = Object.entries(nutrientTotals)
    .filter(([, v]) => v >= 70)
    .map(([k]) => k)
    .join(", ") || "none yet";

  const systemPrompt = `You are a professional clinical nutritionist and registered dietitian with expertise in Sri Lankan dietary habits, local foods, and tropical nutritional needs. You provide personalized, practical nutrition advice that considers:
- Locally available Sri Lankan foods (rice, dhal, coconut milk, gotu kola, karapincha, jak fruit, etc.)
- Affordable, accessible meal options for everyday Sri Lankan families
- Cultural food preferences and cooking traditions
- Tropical climate nutritional requirements

Always be warm, encouraging, and specific. Never be generic.`;

  const userPrompt = `A consumer in Sri Lanka is using our nutrition tracking app. Here is their nutrition data for today:

TODAY'S FOOD LOG: ${loggedItems}
CURRENT NUTRIENT SCORE: ${score}% of daily goal
DEFICIENT NUTRIENTS (below 40%): ${deficientNutrients}
ADEQUATE NUTRIENTS (above 70%): ${adequateNutrients}
TOTAL CALORIES TODAY: ${entries.reduce((s, e) => s + (e.calories || 0), 0)} kcal

Analyze their nutrition and provide personalized advice. Respond with ONLY a valid JSON object — no markdown, no code fences, no extra text:

{
  "summary": "A warm, personalized 2-sentence summary of their nutrition today. Be specific about what they ate and how it's helping them.",
  "deficiencyAlert": "A clear, specific warning about the most critical nutrient gap with health consequences. Be direct. Set to null if no deficiencies.",
  "recommendations": [
    "Specific, actionable recommendation 1 — mention exact local Sri Lankan food and portion size",
    "Specific, actionable recommendation 2 — mention exact local Sri Lankan food and portion size",
    "Specific, actionable recommendation 3 — mention exact local Sri Lankan food and portion size"
  ],
  "tomorrowPlan": [
    {
      "meal": "Breakfast",
      "suggestion": "Specific Sri Lankan breakfast meal with ingredients and rough quantities",
      "benefit": "Which exact nutrients this provides and why the body needs them"
    },
    {
      "meal": "Lunch",
      "suggestion": "Specific Sri Lankan lunch with ingredients",
      "benefit": "Nutritional benefit targeting their specific deficiencies"
    },
    {
      "meal": "Dinner",
      "suggestion": "Specific Sri Lankan dinner with ingredients",
      "benefit": "Nutritional benefit and how it completes the day's goals"
    }
  ],
  "tipOfDay": "One practical, motivating, specific tip tailored to what they actually logged today. Not generic advice."
}

RULES:
- Every recommendation must mention a specific Sri Lankan food (e.g., 'a bowl of dhal curry with mukunuwenna', 'gotu kola sambol', 'jak fruit curry')
- tomorrowPlan suggestions must be complete meal descriptions, not just ingredient lists
- If nothing was logged, focus on encouraging them to start tracking and suggest easy first foods
- Keep each field under 100 words
- Return ONLY the JSON object`;

  const response = await client.chat.completions.create({
    model:       "llama3.1-8b",
    messages:    [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt   },
    ],
    max_completion_tokens: 1000,
    temperature:           0.3,   // Slightly more creative for meal planning
  });

  const rawText = response.choices?.[0]?.message?.content || "";
  console.log("🧠 Cerebras nutrition raw:", rawText.slice(0, 400));

  if (!rawText) throw new Error("Cerebras returned empty response");

  const cleaned   = rawText.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd   = cleaned.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON in Cerebras response");

  return JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
}

// ─── GET VEGGIE LIST ──────────────────────────────────────────────────────────
export const getVeggieList = async (req, res) => {
  res.json(Object.entries(VEGGIE_DB).map(([name, v]) => ({
    name, emoji: v.emoji, cal: v.cal,
  })));
};

// ─── GET TODAY'S LOG ──────────────────────────────────────────────────────────
export const getTodayLog = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const log   = await NutritionLog.findOne({ consumer: req.user._id, date: today });
    res.json(log || { entries: [], totalCalories: 0, nutrientScore: 0, date: today });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ─── GET WEEKLY LOGS ──────────────────────────────────────────────────────────
export const getWeeklyLogs = async (req, res) => {
  try {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - 6 + i);
      return d.toISOString().slice(0, 10);
    });
    const logs = await NutritionLog.find({ consumer: req.user._id, date: { $in: days } });
    res.json(days.map(date => {
      const l = logs.find(x => x.date === date);
      return { date, nutrientScore: l?.nutrientScore || 0, totalCalories: l?.totalCalories || 0 };
    }));
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ─── ADD ENTRY ────────────────────────────────────────────────────────────────
export const addEntry = async (req, res) => {
  try {
    const { vegetable, grams } = req.body;
    if (!vegetable || !grams) return res.status(400).json({ message: "vegetable and grams required" });

    const today = new Date().toISOString().slice(0, 10);
    const info  = VEGGIE_DB[vegetable] || { emoji: "🍽️", cal: 50, n: {} };
    const ratio = grams / 100;

    const entry = {
      vegetable, emoji: info.emoji, grams,
      calories:  Math.round(info.cal * ratio),
      nutrients: new Map(Object.entries(info.n).map(([k, v]) => [k, Math.round(v * ratio)])),
    };

    let log = await NutritionLog.findOne({ consumer: req.user._id, date: today });
    if (!log) log = new NutritionLog({ consumer: req.user._id, date: today, entries: [] });

    log.entries.push(entry);

    const totals = {};
    let cal = 0;
    log.entries.forEach(e => {
      cal += e.calories;
      e.nutrients.forEach((v, k) => { totals[k] = (totals[k] || 0) + v; });
    });
    log.totalCalories = cal;
    log.nutrientScore = calcScore(totals);

    await log.save();
    res.status(201).json({ message: "Added", log });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ─── REMOVE ENTRY ─────────────────────────────────────────────────────────────
export const removeEntry = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const log   = await NutritionLog.findOne({ consumer: req.user._id, date: today });
    if (!log) return res.status(404).json({ message: "No log found for today" });

    log.entries = log.entries.filter(e => e._id.toString() !== req.params.entryId);

    const totals = {};
    let cal = 0;
    log.entries.forEach(e => {
      cal += e.calories;
      e.nutrients.forEach((v, k) => { totals[k] = (totals[k] || 0) + v; });
    });
    log.totalCalories = cal;
    log.nutrientScore = calcScore(totals);

    await log.save();
    res.json({ message: "Removed", log });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ─── GET AI NUTRITION ADVICE (Cerebras) ───────────────────────────────────────
// GET /api/nutrition/ai-advice
export const getAiAdvice = async (req, res) => {
  try {
    const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY;
    if (!CEREBRAS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "CEREBRAS_API_KEY not configured in .env",
      });
    }

    const today   = new Date().toISOString().slice(0, 10);
    const log     = await NutritionLog.findOne({ consumer: req.user._id, date: today });
    const entries = log?.entries || [];
    const score   = log?.nutrientScore || 0;

    const totals = {};
    entries.forEach(e => {
      e.nutrients.forEach((v, k) => { totals[k] = (totals[k] || 0) + v; });
    });

    console.log(`🧠 Cerebras nutrition advice — score ${score}%, ${entries.length} entries`);

    const advice = await getCerebrasNutritionAdvice(entries, totals, score);
    return res.json({ success: true, advice, model: "cerebras/llama3.1-8b" });

  } catch (err) {
    console.error("❌ Cerebras nutrition advice error:", err.message);

    // Graceful fallback — never crash the consumer's page
    return res.json({
      success: false,
      advice: {
        summary:         "Track your meals daily to unlock personalised AI nutrition insights from Cerebras.",
        deficiencyAlert: null,
        recommendations: [
          "Add a cup of kale or mukunuwenna to your next meal for a powerful iron and Vitamin A boost.",
          "Have a glass of fresh orange juice or a serving of bell peppers to meet your Vitamin C needs.",
          "Include half a cup of lentil (dhal) curry at lunch — one of Sri Lanka's best protein and iron sources.",
        ],
        tomorrowPlan: [
          { meal: "Breakfast", suggestion: "Oat porridge with sliced banana and a boiled egg",    benefit: "Provides fiber, potassium, and complete protein to start the day" },
          { meal: "Lunch",     suggestion: "Red dhal curry with mukunuwenna and steamed rice",    benefit: "High in iron, Vitamin A, fiber, and plant protein — targets common deficiencies" },
          { meal: "Dinner",    suggestion: "Stir-fried vegetables (carrot, broccoli, bell pepper) with tofu", benefit: "Covers Vitamin A, C, calcium, and plant protein in one meal" },
        ],
        tipOfDay: "Sri Lanka has some of the world's best superfoods — drumstick leaves (murunga), gotu kola, and jackfruit. Try adding at least one to your daily diet!",
      },
    });
  }
};