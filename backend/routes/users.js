const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-nonce');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ 
      walletAddress: req.params.walletAddress.toLowerCase() 
    }).select('-nonce');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile (protected route)
router.put('/wallet/:walletAddress', auth, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const updates = req.body;
    
    // Check if user is updating their own profile
    if (req.user.walletAddress !== walletAddress.toLowerCase()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    const user = await User.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      updates,
      { new: true, runValidators: true }
    ).select('-nonce');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Delete user account (protected route)
router.delete('/wallet/:walletAddress', auth, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Check if user is deleting their own account
    if (req.user.walletAddress !== walletAddress.toLowerCase()) {
      return res.status(403).json({ message: 'Not authorized to delete this account' });
    }
    
    const user = await User.findOneAndDelete({ 
      walletAddress: walletAddress.toLowerCase() 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;