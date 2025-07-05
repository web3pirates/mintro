const express = require('express');
const router = express.Router();
const Following = require('../models/Following');
const Trader = require('../models/Trader');
const auth = require('../middleware/auth');

// Get user's following list
router.get('/user/:userId', async (req, res) => {
  try {
    const following = await Following.find({ 
      followerId: req.params.userId,
      isActive: true 
    }).populate({
      path: 'traderId',
      populate: {
        path: 'userId',
        select: 'username profileImage'
      }
    });
    
    res.json(following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trader's followers
router.get('/trader/:traderId', async (req, res) => {
  try {
    const followers = await Following.find({ 
      traderId: req.params.traderId,
      isActive: true 
    }).populate('followerId', 'username profileImage walletAddress');
    
    res.json(followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Follow a trader (protected route)
router.post('/follow', auth, async (req, res) => {
  try {
    const { traderId, copyAmount, copyPercentage } = req.body;
    
    // Check if trader exists
    const trader = await Trader.findById(traderId);
    if (!trader) {
      return res.status(404).json({ message: 'Trader not found' });
    }
    
    // Check if user is trying to follow themselves
    if (trader.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }
    
    // Check if already following
    const existingFollow = await Following.findOne({
      followerId: req.user._id,
      traderId: traderId
    });
    
    if (existingFollow) {
      if (existingFollow.isActive) {
        return res.status(400).json({ message: 'Already following this trader' });
      } else {
        // Reactivate following
        existingFollow.isActive = true;
        existingFollow.copyAmount = copyAmount;
        existingFollow.copyPercentage = copyPercentage;
        existingFollow.startDate = new Date();
        await existingFollow.save();
        
        // Update trader followers count
        await Trader.findByIdAndUpdate(traderId, { 
          $inc: { followers: 1 } 
        });
        
        return res.json(existingFollow);
      }
    }
    
    // Create new following relationship
    const following = new Following({
      followerId: req.user._id,
      traderId: traderId,
      copyAmount,
      copyPercentage
    });
    
    await following.save();
    
    // Update trader followers count
    await Trader.findByIdAndUpdate(traderId, { 
      $inc: { followers: 1 } 
    });
    
    res.status(201).json(following);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Unfollow a trader (protected route)
router.post('/unfollow', auth, async (req, res) => {
  try {
    const { traderId } = req.body;
    
    const following = await Following.findOne({
      followerId: req.user._id,
      traderId: traderId,
      isActive: true
    });
    
    if (!following) {
      return res.status(404).json({ message: 'Not following this trader' });
    }
    
    following.isActive = false;
    following.endDate = new Date();
    await following.save();
    
    // Update trader followers count
    await Trader.findByIdAndUpdate(traderId, { 
      $inc: { followers: -1 } 
    });
    
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;