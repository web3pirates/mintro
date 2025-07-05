const mongoose = require("mongoose");

const traderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    strategy: {
      type: String,
      maxlength: 1000,
    },
    totalPnL: {
      type: Number,
      default: 0,
    },
    totalVolume: {
      type: Number,
      default: 0,
    },
    winRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    followers: {
      type: Number,
      default: 0,
    },
    followingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    minCopyAmount: {
      type: Number,
      default: 10,
    },
    maxCopyAmount: {
      type: Number,
      default: 10000,
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tradingPairs: [
      {
        type: String,
      },
    ],
    performance: {
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      yearly: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Additional indexes (walletAddress already indexed by unique: true)
traderSchema.index({ followers: -1 });
traderSchema.index({ totalPnL: -1 });
traderSchema.index({ winRate: -1 });

module.exports = mongoose.model("Trader", traderSchema);
