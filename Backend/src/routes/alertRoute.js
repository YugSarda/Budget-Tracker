import express from "express";
import { setLimit, getLimits } from "../controllers/alertController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/set-limit", authMiddleware, setLimit);
router.get("/limits", authMiddleware, getLimits);

export default router;
