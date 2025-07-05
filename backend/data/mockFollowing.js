const mongoose = require('mongoose');

const mockFollowing = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439031'),
    followerId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439014'), // hodler123
    traderId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439021'), // cryptowhale trader
    copyAmount: 1000,
    copyPercentage: 25,
    isActive: true,
    startDate: new Date('2024-01-15'),
    totalCopied: 2500,
    totalPnL: 125.75
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439032'),
    followerId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439014'), // hodler123
    traderId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'), // defimaster trader
    copyAmount: 2000,
    copyPercentage: 50,
    isActive: true,
    startDate: new Date('2024-02-01'),
    totalCopied: 5000,
    totalPnL: 890.25
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439033'),
    followerId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439016'), // newbie_trader
    traderId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439021'), // cryptowhale trader
    copyAmount: 500,
    copyPercentage: 100,
    isActive: true,
    startDate: new Date('2024-03-10'),
    totalCopied: 1500,
    totalPnL: 78.50
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439034'),
    followerId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439016'), // newbie_trader
    traderId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439024'), // smartmoney trader
    copyAmount: 300,
    copyPercentage: 30,
    isActive: true,
    startDate: new Date('2024-04-05'),
    totalCopied: 900,
    totalPnL: 45.30
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439035'),
    followerId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'), // defimaster (also follows others)
    traderId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439024'), // smartmoney trader
    copyAmount: 5000,
    copyPercentage: 10,
    isActive: true,
    startDate: new Date('2024-01-20'),
    totalCopied: 8000,
    totalPnL: 520.15
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439036'),
    followerId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439015'), // smartmoney (also follows others)
    traderId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'), // defimaster trader
    copyAmount: 1500,
    copyPercentage: 20,
    isActive: false,
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-02-15'),
    totalCopied: 3000,
    totalPnL: 180.90
  }
];

module.exports = mockFollowing;