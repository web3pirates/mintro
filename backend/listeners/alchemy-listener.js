const { Alchemy, Network } = require('alchemy-sdk');
const mongoose = require('mongoose');
const axios = require('axios');

// Environment variables with better fallbacks and error handling
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const NOVES_API_KEY = process.env.NOVES_API_KEY;

// Check if required environment variables are set
if (!ALCHEMY_KEY) {
  console.error('❌ ALCHEMY_API_KEY is not set. Please set it in your .env file.');
  process.exit(1);
}

if (!NOVES_API_KEY) {
  console.warn('⚠️  NOVES_API_KEY is not set. Transaction decoding will be limited.');
  console.warn('   Set NOVES_API_KEY in your .env file or environment variables.');
}

const settings = {
  apiKey: ALCHEMY_KEY,
  network: Network.WORLDCHAIN_MAINNET, // World Chain uses Ethereum Mainnet network in Alchemy SDK
};

const alchemy = new Alchemy(settings);

console.log('🔧 Alchemy SDK initialized with API key');
console.log('🔧 Noves API Key:', NOVES_API_KEY ? 'Set' : 'Not set');

let isProcessing = false;
let processingQueue = [];
const MAX_CONCURRENT_REQUESTS = 1;
let lastProcessedBlock = 0;

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
      },
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

// Process transaction queue
async function processTransactionQueue() {
  if (isProcessing || processingQueue.length === 0) {
    return;
  }
  
  isProcessing = true;
  
  while (processingQueue.length > 0) {
    const batch = processingQueue.splice(0, MAX_CONCURRENT_REQUESTS);
    
    try {
      await Promise.allSettled(
        batch.map(async (txHash) => {
          try {
            console.log(`🧾 Processing tx: ${txHash}`);
            
            const decoded = await decodeTxWithNoves(txHash);
            
            if (!decoded) return;
            
            const classificationData = decoded.classificationData;
            const rawData = decoded.rawTransactionData;
            
            if (!classificationData) return;
            
            const txType = classificationData.type;
            const description = classificationData.description;
            const protocol = classificationData.protocol?.name;
            const senderAddress = decoded.accountAddress;
            const usdValue = decoded.usd_value || 0;
            
            const interestingTypes = [
              'swap',
              'composite'
            ];
            
            const isInteresting = interestingTypes.some(type => 
              txType?.toLowerCase().includes(type) || 
              description?.toLowerCase().includes(type)
            );
            
            console.log({isInteresting});
            
            if (!isInteresting) return;
            
            const sent = classificationData.sent || [];
            const received = classificationData.received || [];
            
            const tokens = [
              ...sent.map((s) => s.token?.symbol).filter(Boolean),
              ...received.map((r) => r.token?.symbol).filter(Boolean)
            ];
            
            console.log(`📈 INTERESTING TRANSACTION detected!`);
            console.log(`↳ Type: ${txType}`);
            console.log(`↳ Description: ${description}`);
            console.log(`↳ Sender: ${senderAddress || rawData?.fromAddress}`);
            console.log(`↳ Value: $${usdValue.toFixed(2)}`);
            console.log(`↳ Protocol: ${protocol || 'Unknown'}`);
            console.log(`↳ Tokens: ${tokens.join(', ')}`);
            console.log(`↳ Gas Used: ${rawData?.gasUsed || 'Unknown'}`);
            console.log(`↳ Transaction Fee: ${rawData?.transactionFee?.amount || 'Unknown'} ${rawData?.transactionFee?.token?.symbol || ''}`);
            console.log(`↳ Hash: ${txHash}\n`);
            
            const transactionData = {
              timestamp: rawData.timestamp,
              hash: txHash,
              type: txType,
              description,
              sender: senderAddress,
              usdValue,
              protocol: protocol || 'Unknown',
              tokens,
              gasUsed: rawData?.gasUsed,
              transactionFee: rawData?.transactionFee,
              blockNumber: rawData?.blockNumber,
              rawData: decoded
            };
            
            console.log(transactionData.rawData.classificationData);
            
            // Save to MongoDB
            try {
              const db = mongoose.connection;
              const collection = db.collection('transactions');
              
              // Check for duplicate
              const existing = await collection.findOne({ hash: txHash });
              if (!existing) {
                await collection.insertOne(transactionData);
                console.log(`💾 Saved transaction ${txHash} to MongoDB`);
              }
            } catch (error) {
              console.error('❌ Failed to save transaction to MongoDB:', error);
            }
            
          } catch (e) {
            console.error(`Error processing transaction ${txHash}:`, e);
          }
        })
      );
      
    } catch (e) {
      console.error('Error processing transaction batch:', e);
    }
  }
  
  isProcessing = false;
}

// Fetch latest transactions from Alchemy
async function fetchLatestTransactions() {
  console.log("fetching latest transactions")
  try {
    const latestBlock = 16194378;
    const lastProcessedBlock = latestBlock;
    console.log(lastProcessedBlock)
    
    for (let blockNum = lastProcessedBlock + 1; blockNum <= latestBlock; blockNum++) {
      try {
        console.log(blockNum)
        const block = await alchemy.core.getBlockWithTransactions(blockNum);

      
        console.log(block);
        console.log(block.transactions);
        
        if (!block || !block.transactions) continue;
        
        console.log(`📦 Processing block ${blockNum} with ${block.transactions.length} transactions`);
        
        block.transactions.forEach((tx) => {
          // if (shouldProcessTransaction({ transaction: tx })) {
            const txHash = tx.hash;
            console.log(`🧾 New tx queued: ${txHash}`);
            processingQueue.push(txHash);
          // }
        });
        
        lastProcessedBlock = blockNum;
      } catch (e) {
        console.error(`Error fetching block ${blockNum}:`, e);
      }
    }
    
    if (processingQueue.length > 0) {
      processTransactionQueue();
    }
    
  } catch (e) {
    console.error('Error fetching latest transactions:', e);
  }
}

// Start the Alchemy monitor
function startAlchemyMonitor() {
  console.log('🔌 Alchemy polling monitor ON... (every 1 second)');
  
  fetchLatestTransactions();
  
  setInterval(fetchLatestTransactions, 1000);
}

module.exports = {
  startAlchemyMonitor
}; 