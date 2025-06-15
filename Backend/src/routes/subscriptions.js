import express from 'express';
import Subscription from '../models/Subscription.js';

const router = express.Router();

// Add Subscription
router.post('/', async (req, res) => {
  try {
    const sub = new Subscription(req.body);
    await sub.save();
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All for a User
router.get('/:userId', async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.params.userId });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
