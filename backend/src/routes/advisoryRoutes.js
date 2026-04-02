import express from "express";
import { generateAdvisory } from "../controllers/advisoryController.js";

const router = express.Router();

// Route to generate AI advisory
router.post("/", generateAdvisory);

export default router;
