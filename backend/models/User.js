const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^0x[a-fA-F0-9]{40}$/
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    match: /^\S+@\S+\.\S+$/
  },
  profileImage: String,
  bio: {
    type: String,
    maxlength: 500
  },
  isTrader: {
    type: Boolean,
    default: false
  },
  isFollower: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  socialLinks: {
    twitter: String,
    telegram: String,
    discord: String
  },
  nonce: {
    type: String,
    default: () => Math.floor(Math.random() * 1000000).toString()
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ walletAddress: 1 });
userSchema.index({ username: 1 });
userSchema.index({ isTrader: 1 });

module.exports = mongoose.model('User', userSchema);