const { Alchemy, Network } = require('alchemy-sdk');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Environment variables
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const NOVES_API_KEY = process.env.NOVES_API_KEY;

if (!ALCHEMY_KEY) {
  console.error('❌ ALCHEMY_API_KEY is not set. Please set it in your .env file.');
  process.exit(1);
}

const settings = {
  apiKey: ALCHEMY_KEY,
  network: Network.WORLDCHAIN_MAINNET,
};

const alchemy = new Alchemy(settings);

// Helper function to decode transaction with Noves API
async function decodeTxWithNoves(txHash) {
  try {
    if (!NOVES_API_KEY) {
      console.warn(`⚠️  Skipping Noves decoding for ${txHash} - NOVES_API_KEY not set`);
      return null;
    }
    
    const response = await axios.get(`https://translate.noves.fi/evm/worldchain/tx/${txHash}`, {
      headers: {
        Apikey: `${NOVES_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error decoding transaction ${txHash}:`, error.message);
    return null;
  }
}

// Helper function to determine if transaction should be processed
function shouldProcessTransaction(tx) {
  if (!tx.transaction) {
    return false;
  }
  
  if (tx.transaction.gas && parseInt(tx.transaction.gas) < 50000) {
    return false;
  }
  
  const simpleTransferContracts = [
    '0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c',
  ];
  
  if (simpleTransferContracts.includes(tx.transaction.to?.toLowerCase())) {
    return false;
  }
  
  if (tx.transaction.data && tx.transaction.data !== '0x') {
    return true;
  }
  
  if (tx.transaction.value && parseInt(tx.transaction.value) > 1000000000000000000) {
    return true;
  }
  
  return false;
}

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

async function fetchAndSaveTransactions() {
  try {
    console.log('🚀 Starting to fetch transactions from last 5 hours...');
    
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://robertadag02:<db_password>@cluster0.ossvqxu.mongodb.net/mintro";
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection;
    const collection = db.collection('transactions');
    
    // Get current block number
    const latestBlock = await alchemy.core.getBlockNumber();
    console.log(`📦 Latest block: ${latestBlock}`);
    
    // Estimate blocks from 5 hours ago (assuming ~12 second block time)
    const blocksPerHour = 300; // 3600 seconds / 12 seconds per block
    const blocksToFetch = blocksPerHour * 7; // 7 hours
    const startBlock = Math.max(0, latestBlock - blocksToFetch);
    
    console.log(`📦 Fetching blocks from ${startBlock} to ${latestBlock} (${latestBlock - startBlock} blocks)`);
    
    let totalProcessed = 0;
    let totalSaved = 0;
    const TARGET_CONTRACT = "0xde605a918c466e74a2a12865efe616d51391312a";
    
    // Process blocks in batches to avoid overwhelming the API
    const batchSize = 10;
    for (let blockNum = startBlock; blockNum <= latestBlock; blockNum += batchSize) {
      const endBlock = Math.min(blockNum + batchSize - 1, latestBlock);
      console.log(`📦 Processing blocks ${blockNum} to ${endBlock}...`);
      
      const blockPromises = [];
      for (let b = blockNum; b <= endBlock; b++) {
        blockPromises.push(
          alchemy.core.getBlockWithTransactions(b).catch(err => {
            console.error(`Error fetching block ${b}:`, err.message);
            return null;
          })
        );
      }
      
      const blocks = await Promise.all(blockPromises);
   

      
      for (const block of blocks) {
        if (!block || !block.transactions) continue;
        
        totalProcessed += block.transactions.length;
        
        
        // Process transactions in parallel
        const txPromises = block.transactions  .filter(tx => tx.to?.toLowerCase() === TARGET_CONTRACT).map(async (tx) => {
          if (!shouldProcessTransaction({ transaction: tx })) return null;
          
          try {
            const decoded = await decodeTxWithNoves(tx.hash);
            if (!decoded) return null;
            
            const classificationData = decoded.classificationData;
            const rawData = decoded.rawTransactionData;
            
            if (!classificationData) return null;
            
            const txType = classificationData.type;
            const description = classificationData.description;
            const usdValue = decoded.usd_value || 0;
            
            const interestingTypes = ['swap', 'composite'];
            const isInteresting = interestingTypes.some(type => 
              txType?.toLowerCase().includes(type) || 
              description?.toLowerCase().includes(type)
            );
            
            if (!isInteresting) return null;
            
            const transactionData = {
              timestamp: new Date().toISOString(),
              hash: tx.hash,
              type: txType,
              description,
              sender: classificationData.senderAddress || rawData?.fromAddress,
              usdValue,
              protocol: classificationData.protocol?.name || 'Unknown',
              tokens: [
                ...(classificationData.sent || []).map((s) => s.token?.symbol).filter(Boolean),
                ...(classificationData.received || []).map((r) => r.token?.symbol).filter(Boolean)
              ],
              gasUsed: rawData?.gasUsed,
              transactionFee: rawData?.transactionFee,
              blockNumber: rawData?.blockNumber,
              rawData: decoded
            };
            
            const processedData = processTransactionData(transactionData);
            
            // Check for duplicate and save
            const existing = await collection.findOne({ hash: tx.hash });
            if (!existing) {
              await collection.insertOne(processedData);
              return processedData;
            }
            
            return null;
          } catch (error) {
            console.error(`Error processing transaction ${tx.hash}:`, error.message);
            return null;
          }
        });
        
        const results = await Promise.all(txPromises);
        const saved = results.filter(r => r !== null);
        totalSaved += saved.length;
        
        if (saved.length > 0) {
          console.log(`💾 Saved ${saved.length} new transactions from block ${block.number}`);
        }
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Fetch complete!`);
    console.log(`📊 Total transactions processed: ${totalProcessed}`);
    console.log(`💾 Total transactions saved: ${totalSaved}`);
    
    // Get final stats
    const totalInDB = await collection.countDocuments();
    console.log(`📊 Total transactions in database: ${totalInDB}`);
    
  } catch (error) {
    console.error('❌ Error in fetchAndSaveTransactions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
fetchAndSaveTransactions(); 