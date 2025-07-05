const express = require('express');
const router = express.Router();
const Trader = require('../models/Trader');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all traders
router.get('/', async (req, res) => {
  try {
    const { sort = 'followers', order = 'desc', limit = 20 } = req.query;
    
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    const traders = await Trader.find({ isActive: true })
      .populate('userId', 'username profileImage isVerified')
      .sort(sortObj)
      .limit(parseInt(limit));
    
    res.json(traders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trader by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const trader = await Trader.findOne({ 
      walletAddress: req.params.walletAddress.toLowerCase() 
    }).populate('userId', 'username profileImage isVerified socialLinks');
    
    if (!trader) {
      return res.status(404).json({ message: 'Trader not found' });
    }
    
    res.json(trader);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create trader profile (protected route)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user already has a trader profile
    const existingTrader = await Trader.findOne({ 
      walletAddress: req.user.walletAddress 
    });
    
    if (existingTrader) {
      return res.status(400).json({ message: 'Trader profile already exists' });
    }
    
    const traderData = {
      ...req.body,
      userId: req.user._id,
      walletAddress: req.user.walletAddress
    };
    
    const trader = new Trader(traderData);
    await trader.save();
    
    // Update user to mark as trader
    await User.findByIdAndUpdate(req.user._id, { isTrader: true });
    
    res.status(201).json(trader);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update trader profile (protected route)
router.put('/wallet/:walletAddress', auth, async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Check if user is updating their own trader profile
    if (req.user.walletAddress !== walletAddress.toLowerCase()) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    const trader = await Trader.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'username profileImage isVerified');
    
    if (!trader) {
      return res.status(404).json({ message: 'Trader not found' });
    }
    
    res.json(trader);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;