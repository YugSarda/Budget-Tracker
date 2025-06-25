import express from 'express';
import authRoutes from './auth.js';

import expenseRoutes from './expenseRoute.js';

import subscriptionRoutes from './subscriptions.js';
import goalRoutes from './goalRoutes.js';
import balanceRoutes from './balance.js';
import analysisRoutes from "./analysisRoutes.js";
// import groupRoutes from "./groupRoutes.js";
import refundRoutes from "./refundRoutes.js";

import aiRoutes from "./aiRoutes.js";




const router=express.Router();
router.use('/auth', authRoutes); 
// router.use('/groups', groupRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/goals', goalRoutes);
router.use('/balance', balanceRoutes);
router.use('/expenses', expenseRoutes);
router.use("/analysis", analysisRoutes);
router.use("/refunds", refundRoutes);
router.use("/api", aiRoutes);
export default router;