import express from "express";

import { getCategoryAnalysis, getWeeklyAnalysis, getExpenseForecast,getEmotionAnalysis,detectMoneyLeaks } from "../controllers/analysisController.js";



import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
// routes/analysisRoutes.js

router.get("/emotion", getEmotionAnalysis); // ✅

router.get("/categories", authMiddleware, getCategoryAnalysis);
router.get("/weekly", authMiddleware, getWeeklyAnalysis);
router.get("/forecast", authMiddleware, getExpenseForecast);

router.get("/leaks", authMiddleware, detectMoneyLeaks); // ✅ add this line

export default router;
