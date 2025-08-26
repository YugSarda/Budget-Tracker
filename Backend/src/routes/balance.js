import express from 'express';
import User from '../models/User.js';

const router = express.Router();


router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('balances.user', 'name email');
    
   
    const result = user.balances.map(balance => ({
      user: balance.user,
      amount: Math.abs(balance.amount),
      status: balance.amount > 0 ? 'owes you' : 'you owe'
    }));
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/:userId/settle', async (req, res) => {
  try {
    const { fromUserId, toUserId, amount } = req.body;
    
    // Validate
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }
    
    if (fromUserId === toUserId) {
      return res.status(400).json({ error: 'Cannot settle with yourself' });
    }
    
    // Update balances
    await updateUserBalance(fromUserId, toUserId, amount);
    await updateUserBalance(toUserId, fromUserId, -amount);
    
    res.json({ message: 'Settlement recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to update balance between two users
async function updateUserBalance(user1, user2, amount) {
  const user = await User.findById(user1);
  
  // Find existing balance record
  const balanceIndex = user.balances.findIndex(b => b.user.equals(user2));
  
  if (balanceIndex >= 0) {
    // Update existing balance
    user.balances[balanceIndex].amount += amount;
    
    // Remove if balance is now zero
    if (user.balances[balanceIndex].amount === 0) {
      user.balances.splice(balanceIndex, 1);
    }
  } else {
    // Create new balance record
    user.balances.push({ user: user2, amount });
  }
  
  await user.save();
}

export default router;