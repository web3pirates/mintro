const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate nonce for wallet signature
router.post('/nonce', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address required' });
    }

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        username: `user_${Date.now()}`, // Temporary username
        nonce: Math.floor(Math.random() * 1000000).toString()
      });
      await user.save();
    }

    res.json({ nonce: user.nonce });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify signature and login
router.post('/verify', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For now, we'll skip signature verification and just return token
    // You can add ethers.js signature verification later
    
    // Generate new nonce for next login
    user.nonce = Math.floor(Math.random() * 1000000).toString();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        isTrader: user.isTrader
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;