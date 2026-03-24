import NutritionLog from "../models/NutritionLog.js";

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
};

function calcScore(totals) {
  const keys = ["vitaminA","vitaminC","iron","calcium","fiber","protein"];
  return Math.round(keys.reduce((s,k) => s + Math.min(totals[k]||0, 100), 0) / keys.length);
}

export const getVeggieList = async (req, res) => {
  res.json(Object.entries(VEGGIE_DB).map(([name,v]) => ({ name, emoji:v.emoji, cal:v.cal })));
};

export const getTodayLog = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0,10);
    const log = await NutritionLog.findOne({ consumer: req.user._id, date: today });
    res.json(log || { entries:[], totalCalories:0, nutrientScore:0, date:today });
  } catch(e) { res.status(500).json({ message: e.message }); }
};

export const getWeeklyLogs = async (req, res) => {
  try {
    const days = Array.from({length:7},(_,i) => {
      const d=new Date(); d.setDate(d.getDate()-6+i);
      return d.toISOString().slice(0,10);
    });
    const logs = await NutritionLog.find({ consumer: req.user._id, date:{ $in:days } });
    res.json(days.map(date => {
      const l = logs.find(x => x.date===date);
      return { date, nutrientScore: l?.nutrientScore||0, totalCalories: l?.totalCalories||0 };
    }));
  } catch(e) { res.status(500).json({ message: e.message }); }
};

export const addEntry = async (req, res) => {
  try {
    const { vegetable, grams } = req.body;
    if (!vegetable || !grams) return res.status(400).json({ message:"vegetable and grams required" });
    const today = new Date().toISOString().slice(0,10);
    const info  = VEGGIE_DB[vegetable] || { emoji:"🥬", cal:30, n:{} };
    const ratio = grams/100;
    const entry = {
      vegetable, emoji:info.emoji, grams,
      calories: Math.round(info.cal*ratio),
      nutrients: new Map(Object.entries(info.n).map(([k,v])=>[k,Math.round(v*ratio)])),
    };
    let log = await NutritionLog.findOne({ consumer:req.user._id, date:today });
    if (!log) log = new NutritionLog({ consumer:req.user._id, date:today, entries:[] });
    log.entries.push(entry);
    const totals = {};
    let cal = 0;
    log.entries.forEach(e => { cal+=e.calories; e.nutrients.forEach((v,k)=>{ totals[k]=(totals[k]||0)+v; }); });
    log.totalCalories = cal;
    log.nutrientScore = calcScore(totals);
    await log.save();
    res.status(201).json({ message:"Added", log });
  } catch(e) { res.status(500).json({ message:e.message }); }
};

export const removeEntry = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0,10);
    const log = await NutritionLog.findOne({ consumer:req.user._id, date:today });
    if (!log) return res.status(404).json({ message:"Not found" });
    log.entries = log.entries.filter(e => e._id.toString()!==req.params.entryId);
    const totals = {};
    let cal = 0;
    log.entries.forEach(e => { cal+=e.calories; e.nutrients.forEach((v,k)=>{ totals[k]=(totals[k]||0)+v; }); });
    log.totalCalories = cal;
    log.nutrientScore = calcScore(totals);
    await log.save();
    res.json({ message:"Removed", log });
  } catch(e) { res.status(500).json({ message:e.message }); }
};