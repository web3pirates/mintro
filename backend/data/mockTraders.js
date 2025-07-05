const mongoose = require('mongoose');

const mockTraders = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439021'),
    userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // cryptowhale
    walletAddress: '0x742d35cc6bf4514c14fe1d7b8b8c8c7b8b8c8c7b',
    displayName: 'Crypto Whale Pro',
    strategy: 'Conservative long-term positions with focus on major cryptocurrencies. Risk management is key.',
    totalPnL: 15750.25,
    totalVolume: 2500000,
    winRate: 78.5,
    followers: 1250,
    followingFee: 2.5,
    minCopyAmount: 100,
    maxCopyAmount: 50000,
    riskLevel: 'medium',
    tradingPairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT'],
    performance: {
      daily: 1.2,
      weekly: 8.5,
      monthly: 12.3,
      yearly: 89.7
    },
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439022'),
    userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'), // defimaster
    walletAddress: '0x8ba1f109551bd432803012645hac136c4c5c8b8c',
    displayName: 'DeFi Master',
    strategy: 'Yield farming and liquidity provision strategies across multiple DeFi protocols.',
    totalPnL: 23400.80,
    totalVolume: 1800000,
    winRate: 85.2,
    followers: 890,
    followingFee: 3.0,
    minCopyAmount: 200,
    maxCopyAmount: 25000,
    riskLevel: 'low',
    tradingPairs: ['USDC/USDT', 'DAI/USDC', 'WETH/USDC'],
    performance: {
      daily: 0.8,
      weekly: 5.2,
      monthly: 18.7,
      yearly: 156.3
    },
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439023'),
    userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'), // moonshooter
    walletAddress: '0x3cd751e6b0078be393132286c442345e5dc49699',
    displayName: 'Moon Shooter',
    strategy: 'High-risk altcoin trading with 10x leverage. Not for the faint of heart!',
    totalPnL: -2340.15,
    totalVolume: 5600000,
    winRate: 45.8,
    followers: 2100,
    followingFee: 5.0,
    minCopyAmount: 50,
    maxCopyAmount: 10000,
    riskLevel: 'high',
    tradingPairs: ['DOGE/USDT', 'SHIB/USDT', 'PEPE/USDT', 'FLOKI/USDT'],
    performance: {
      daily: -0.5,
      weekly: -12.3,
      monthly: -8.9,
      yearly: -15.2
    },
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439024'),
    userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439015'), // smartmoney
    walletAddress: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
    displayName: 'Smart Money Algorithm',
    strategy: 'Algorithmic trading based on technical indicators and market sentiment analysis.',
    totalPnL: 8920.45,
    totalVolume: 3200000,
    winRate: 92.1,
    followers: 567,
    followingFee: 1.5,
    minCopyAmount: 500,
    maxCopyAmount: 100000,
    riskLevel: 'medium',
    tradingPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT'],
    performance: {
      daily: 0.3,
      weekly: 2.1,
      monthly: 9.8,
      yearly: 67.4
    },
    isActive: true
  }
];

module.exports = mockTraders;