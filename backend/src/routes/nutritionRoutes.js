// import express from "express";
// import { getTodayLog, getWeeklyLogs, addEntry, removeEntry, getVeggieList } from "../controllers/nutritionController.js";
// import { protect } from "../middlewares/authMiddleware.js";
// const router = express.Router();
// router.get("/vegetables",        protect, getVeggieList);
// router.get("/today",             protect, getTodayLog);
// router.get("/weekly",            protect, getWeeklyLogs);
// router.post("/entry",            protect, addEntry);
// router.delete("/entry/:entryId", protect, removeEntry);
// export default router;
// import express from "express";
// import {
//   getVeggieList,
//   getTodayLog,
//   getWeeklyLogs,
//   addEntry,
//   removeEntry,
//   getAiAdvice,          // ← NEW Gemini AI route
// } from "../controllers/nutritionController.js";
// import { protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // All routes are protected (require JWT)
// router.use(protect);

// router.get("/veggies",    getVeggieList);   // GET  /api/nutrition/veggies
// router.get("/today",      getTodayLog);     // GET  /api/nutrition/today
// router.get("/weekly",     getWeeklyLogs);   // GET  /api/nutrition/weekly
// router.post("/add",       addEntry);        // POST /api/nutrition/add
// router.delete("/:entryId",removeEntry);     // DELETE /api/nutrition/:entryId

// // ── Gemini AI route ──────────────────────────────────────────────────────────
// router.get("/ai-advice",  getAiAdvice);     // GET  /api/nutrition/ai-advice

// export default router;

import express from "express";
import {
  getVeggieList,
  getTodayLog,
  getWeeklyLogs,
  addEntry,
  removeEntry,
  getAiAdvice,
} from "../controllers/nutritionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All nutrition routes require a valid JWT
router.use(protect);

router.get("/veggies",   getVeggieList);   // GET    /api/nutrition/veggies
router.get("/today",     getTodayLog);     // GET    /api/nutrition/today
router.get("/weekly",    getWeeklyLogs);   // GET    /api/nutrition/weekly
router.post("/add",      addEntry);        // POST   /api/nutrition/add
router.delete("/:entryId", removeEntry);  // DELETE /api/nutrition/:entryId

// ── Cerebras AI advice ────────────────────────────────────────────────────────
router.get("/ai-advice", getAiAdvice);    // GET    /api/nutrition/ai-advice

export default router;