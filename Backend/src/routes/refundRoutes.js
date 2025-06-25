import express from "express";
import { getPendingRefunds, markRefundClaimed } from "../controllers/refundController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPendingRefunds);
router.put("/:id/claim", authMiddleware, markRefundClaimed);

export default router;
