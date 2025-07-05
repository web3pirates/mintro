const mongoose = require('mongoose');

const mockUsers = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    walletAddress: '0x742d35cc6bf4514c14fe1d7b8b8c8c7b8b8c8c7b',
    username: 'cryptowhale',
    email: 'whale@crypto.com',
    profileImage: 'https://via.placeholder.com/150',
    bio: 'Professional crypto trader with 5+ years experience',
    isTrader: true,
    isFollower: false,
    isVerified: true,
    socialLinks: {
      twitter: 'https://twitter.com/cryptowhale',
      telegram: '@cryptowhale',
      discord: 'cryptowhale#1234'
    },
    nonce: '123456'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    walletAddress: '0x8ba1f109551bd432803012645hac136c4c5c8b8c',
    username: 'defimaster',
    email: 'defi@master.com',
    profileImage: 'https://via.placeholder.com/150',
    bio: 'DeFi specialist focusing on yield farming strategies',
    isTrader: true,
    isFollower: true,
    isVerified: true,
    socialLinks: {
      twitter: 'https://twitter.com/defimaster',
      telegram: '@defimaster'
    },
    nonce: '234567'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
    walletAddress: '0x3cd751e6b0078be393132286c442345e5dc49699',
    username: 'moonshooter',
    email: 'moon@shooter.com',
    profileImage: 'https://via.placeholder.com/150',
    bio: 'High-risk high-reward trader',
    isTrader: true,
    isFollower: false,
    isVerified: false,
    socialLinks: {
      twitter: 'https://twitter.com/moonshooter'
    },
    nonce: '345678'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439014'),
    walletAddress: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
    username: 'hodler123',
    email: 'hodl@forever.com',
    profileImage: 'https://via.placeholder.com/150',
    bio: 'Long-term investor and copy trader',
    isTrader: false,
    isFollower: true,
    isVerified: false,
    socialLinks: {
      telegram: '@hodler123'
    },
    nonce: '456789'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439015'),
    walletAddress: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
    username: 'smartmoney',
    email: 'smart@money.com',
    profileImage: 'https://via.placeholder.com/150',
    bio: 'Algorithmic trading enthusiast',
    isTrader: true,
    isFollower: true,
    isVerified: true,
    socialLinks: {
      twitter: 'https://twitter.com/smartmoney',
      discord: 'smartmoney#5678'
    },
    nonce: '567890'
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439016'),
    walletAddress: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b',
    username: 'newbie_trader',
    email: 'newbie@trader.com',
    profileImage: 'https://via.placeholder.com/150',
    bio: 'Just started my trading journey',
    isTrader: false,
    isFollower: true,
    isVerified: false,
    socialLinks: {},
    nonce: '678901'
  }
];

module.exports = mockUsers;