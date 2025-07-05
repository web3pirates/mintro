# Backend Setup Guide

## Quick Setup for Node.js/Express Backend

### 1. Create Backend Directory
```bash
mkdir backend
cd backend
npm init -y
```

### 2. Install Dependencies
```bash
npm install express cors mongodb dotenv
npm install --save-dev nodemon
```

### 3. Create Environment File
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017
PORT=5001
```

### 4. Create Server File
Create `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

// CORS Configuration - FIXES YOUR CORS ERROR
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://172.31.55.206:3000', // Your specific IP
    'http://127.0.0.1:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Apikey']
}));

app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

connectToMongo();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/transactions
app.post('/api/transactions', async (req, res) => {
  try {
    const transactionData = req.body;
    const db = client.db('worldchain_tracker');
    const collection = db.collection('transactions');
    
    // Check for duplicate
    const existing = await collection.findOne({ hash: transactionData.hash });
    if (existing) {
      return res.status(409).json({ error: 'Transaction already exists' });
    }
    
    // Process transaction data
    const processedData = processTransactionData(transactionData);
    
    const result = await collection.insertOne(processedData);
    res.json({ id: result.insertedId, success: true });
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/stats
app.get('/api/transactions/stats', async (req, res) => {
  try {
    const db = client.db('worldchain_tracker');
    const collection = db.collection('transactions');
    
    const stats = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalValue: { $sum: '$usdValue' },
          totalSwapValue: { $sum: '$swapValue' },
          totalLongValue: { $sum: '$longPositionValue' },
          totalShortValue: { $sum: '$shortPositionValue' },
          avgValue: { $avg: '$usdValue' }
        }
      }
    ]).toArray();
    
    res.json(stats[0] || {
      totalTransactions: 0,
      totalValue: 0,
      totalSwapValue: 0,
      totalLongValue: 0,
      totalShortValue: 0,
      avgValue: 0
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/swaps
app.get('/api/transactions/swaps', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const db = client.db('worldchain_tracker');
    const collection = db.collection('transactions');
    
    const swaps = await collection.find({ swapValue: { $exists: true } })
      .limit(limit)
      .sort({ timestamp: -1 })
      .toArray();
    
    res.json(swaps);
  } catch (error) {
    console.error('Error getting swaps:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/long-positions
app.get('/api/transactions/long-positions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const db = client.db('worldchain_tracker');
    const collection = db.collection('transactions');
    
    const longPositions = await collection.find({ positionType: 'long' })
      .limit(limit)
      .sort({ timestamp: -1 })
      .toArray();
    
    res.json(longPositions);
  } catch (error) {
    console.error('Error getting long positions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/short-positions
app.get('/api/transactions/short-positions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const db = client.db('worldchain_tracker');
    const collection = db.collection('transactions');
    
    const shortPositions = await collection.find({ positionType: 'short' })
      .limit(limit)
      .sort({ timestamp: -1 })
      .toArray();
    
    res.json(shortPositions);
  } catch (error) {
    console.error('Error getting short positions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/sender/:sender
app.get('/api/transactions/sender/:sender', async (req, res) => {
  try {
    const sender = req.params.sender.toLowerCase();
    const limit = parseInt(req.query.limit) || 100;
    const db = client.db('worldchain_tracker');
    const collection = db.collection('transactions');
    
    const transactions = await collection.find({ sender })
      .limit(limit)
      .sort({ timestamp: -1 })
      .toArray();
    
    res.json(transactions);
  } catch (error) {
    console.error('Error getting sender transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/high-value
app.get('/api/transactions/high-value', async (req, res) => {
  try {
    const minValue = parseFloat(req.query.minValue) || 1000;
    const limit = parseInt(req.query.limit) || 100;
    const db = client.db('worldchain_tracker');
    const collection = db.collection('transactions');
    
    const transactions = await collection.find({ usdValue: { $gte: minValue } })
      .limit(limit)
      .sort({ timestamp: -1 })
      .toArray();
    
    res.json(transactions);
  } catch (error) {
    console.error('Error getting high-value transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/date-range
app.get('/api/transactions/date-range', async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const db = client.db('worldchain_tracker');
    const collection = db.collection('transactions');
    
    const transactions = await collection.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ timestamp: -1 }).toArray();
    
    res.json(transactions);
  } catch (error) {
    console.error('Error getting date range transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

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

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Backend API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Stats endpoint: http://localhost:${PORT}/api/transactions/stats`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await client.close();
  process.exit(0);
});
```

### 5. Update package.json
Add to `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 6. Start the Server
```bash
npm run dev
```

## Test the Backend

### 1. Test Health Endpoint
```bash
curl http://localhost:5001/api/health
```

### 2. Test Stats Endpoint
```bash
curl http://localhost:5001/api/transactions/stats
```

### 3. Test from Frontend
Now your frontend should work without CORS errors!

## Troubleshooting

### CORS Still Not Working?
1. Make sure your IP is in the CORS origins list
2. Restart the backend server after changes
3. Check browser console for specific CORS errors

### MongoDB Connection Issues?
1. Make sure MongoDB is running
2. Check your MongoDB URI in `.env`
3. Try `mongodb://localhost:27017` for local MongoDB

### Port Already in Use?
Change the port in `.env`:
```env
PORT=5002
```

Then update your frontend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:5002/api
```

## Important Note About Port 5001

**Port 5001 is often used by Apple's AirTunes service on macOS.** If you get 403 Forbidden errors, it's likely because Apple's service is running on that port. The setup above uses port 5001 to avoid this conflict. 