import express from "express";
import { getCategoryAnalysis, getWeeklyAnalysis, getExpenseForecast} from "../controllers/analysisController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();



router.get("/categories", authMiddleware, getCategoryAnalysis);
router.get("/weekly", authMiddleware, getWeeklyAnalysis);
router.get("/forecast", authMiddleware, getExpenseForecast);


export default router;
