const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');

// Helper function to process transaction data
function processTransactionData(transactionData) {
  const processed = { ...transactionData };
  
  // Extract swap information if available
  const classificationData = transactionData.rawData?.classificationData;
  if (classificationData) {
    const sent = classificationData.sent || [];
    const received = classificationData.received || [];
    
    // Determine if this is a swap
    if (sent.length > 0 && received.length > 0) {
      processed.swapValue = transactionData.usdValue;
      
      // Extract token in/out information
      if (sent.length > 0) {
        const tokenIn = sent[0];
        processed.tokenIn = {
          symbol: tokenIn.token?.symbol || 'Unknown',
          address: tokenIn.token?.address || '',
          amount: tokenIn.amount || '0',
          usdValue: 0
        };
      }
      
      if (received.length > 0) {
        const tokenOut = received[0];
        processed.tokenOut = {
          symbol: tokenOut.token?.symbol || 'Unknown',
          address: tokenOut.token?.address || '',
          amount: tokenOut.amount || '0',
          usdValue: 0
        };
      }
      
      // Randomly assign position type for now
      processed.positionType = Math.random() > 0.5 ? 'long' : 'short';
      processed.positionSize = transactionData.usdValue;
      processed.leverage = 1;
      
      // Assign long/short values based on position type
      if (processed.positionType === 'long') {
        processed.longPositionValue = transactionData.usdValue;
        processed.shortPositionValue = 0;
      } else {
        processed.shortPositionValue = transactionData.usdValue;
        processed.longPositionValue = 0;
      }
    }
  }
  
  return processed;
}

// POST /api/transactions - Save a new transaction
router.post('/', async (req, res) => {
  try {
    const transactionData = req.body;
    
    // Process transaction data
    const processedData = processTransactionData(transactionData);
    processedData.id = Date.now().toString(); // Simple ID generation
    
    // Save to MongoDB
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    
    // Check for duplicate
    const existing = await collection.findOne({ hash: transactionData.hash });
    if (existing) {
      return res.status(409).json({ error: 'Transaction already exists' });
    }
    
    await collection.insertOne(processedData);
    
    console.log(`💾 Saved transaction ${transactionData.hash} to MongoDB`);
    res.json({ id: processedData.id, success: true });
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions - Fetch all saved transactions (limit 100, most recent first)
router.get('/', async (req, res) => {
  try {
    const db = require('mongoose').connection;
    const collection = db.collection('transactions');
    const limit = parseInt(req.query.limit) || 100;
    // Sort by blockNumber descending (most recent first)
    const txs = await collection.find({})
      .sort({ blockNumber: -1 })
      .limit(limit)
      .toArray();
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/stats - Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    
    // Get all transactions from MongoDB
    const allTransactions = await collection.find({}).toArray();
    
    const stats = {
      totalTransactions: allTransactions.length,
      totalValue: allTransactions.reduce((sum, tx) => sum + (tx.usdValue || 0), 0),
      totalSwapValue: allTransactions.reduce((sum, tx) => sum + (tx.swapValue || 0), 0),
      totalLongValue: allTransactions.reduce((sum, tx) => sum + (tx.longPositionValue || 0), 0),
      totalShortValue: allTransactions.reduce((sum, tx) => sum + (tx.shortPositionValue || 0), 0),
      avgValue: allTransactions.length > 0 ? allTransactions.reduce((sum, tx) => sum + (tx.usdValue || 0), 0) / allTransactions.length : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/swaps - Get swap transactions
router.get('/swaps', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    const limit = parseInt(req.query.limit) || 100;
    
    const swaps = await collection.find({ swapValue: { $exists: true } })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    res.json(swaps);
  } catch (error) {
    console.error('Error getting swaps:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/long-positions - Get long position transactions
router.get('/long-positions', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    const limit = parseInt(req.query.limit) || 100;
    
    const longPositions = await collection.find({ positionType: 'long' })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    res.json(longPositions);
  } catch (error) {
    console.error('Error getting long positions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/short-positions - Get short position transactions
router.get('/short-positions', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    const limit = parseInt(req.query.limit) || 100;
    
    const shortPositions = await collection.find({ positionType: 'short' })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    res.json(shortPositions);
  } catch (error) {
    console.error('Error getting short positions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/sender/:sender - Get transactions by sender
router.get('/sender/:sender', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    const sender = req.params.sender.toLowerCase();
    const limit = parseInt(req.query.limit) || 100;
    
    const senderTransactions = await collection.find({ 
      sender: { $regex: sender, $options: 'i' } 
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    res.json(senderTransactions);
  } catch (error) {
    console.error('Error getting sender transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/high-value - Get high value transactions
router.get('/high-value', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    const minValue = parseFloat(req.query.minValue) || 1000;
    const limit = parseInt(req.query.limit) || 100;
    
    const highValueTransactions = await collection.find({ 
      usdValue: { $gte: minValue } 
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    res.json(highValueTransactions);
  } catch (error) {
    console.error('Error getting high-value transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/date-range - Get transactions by date range
router.get('/date-range', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    
    const dateRangeTransactions = await collection.find({
      timestamp: {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString()
      }
    })
      .sort({ timestamp: -1 })
      .toArray();
    
    res.json(dateRangeTransactions);
  } catch (error) {
    console.error('Error getting date range transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/recent - Get recent transactions from MongoDB
router.get('/recent', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    const limit = parseInt(req.query.limit) || 50;
    
    // Get recent transactions sorted by timestamp descending
    const recentTransactions = await collection.find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
    
    res.json({ 
      recentTransactions,
      count: recentTransactions.length 
    });
  } catch (err) {
    console.error('Error fetching recent transactions:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/transactions/start-listener - Start the transaction monitoring
router.post('/start-listener', async (req, res) => {
  try {
    // Import and start the listener
    const { startAlchemyMonitor } = require('../listeners/alchemy-listener');
    
    // Check if listener is already running
    if (global.listenerStarted) {
      return res.json({ status: 'Listener already running' });
    }
    
    // Start the listener
    startAlchemyMonitor();
    global.listenerStarted = true;
    
    console.log('🚀 Transaction listener started');
    res.json({ status: 'Listener started successfully' });
  } catch (err) {
    console.error('Error starting listener:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 