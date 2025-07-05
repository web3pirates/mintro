const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  traderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trader',
    required: true
  },
  copyAmount: {
    type: Number,
    required: true,
    min: 0
  },
  copyPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  totalCopied: {
    type: Number,
    default: 0
  },
  totalPnL: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate follows
followingSchema.index({ followerId: 1, traderId: 1 }, { unique: true });

module.exports = mongoose.model('Following', followingSchema);