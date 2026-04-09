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