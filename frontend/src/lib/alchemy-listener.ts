// lib/alchemyListener.ts
import { Alchemy, Network } from 'alchemy-sdk';
import { decodeTxWithNoves } from './noves';

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY!;

const settings = {
  apiKey: ALCHEMY_KEY,
  network: Network.WORLDCHAIN_MAINNET, // World Chain uses Ethereum Mainnet network in Alchemy SDK
};

const alchemy = new Alchemy(settings);

// Rate limiting and filtering
let isProcessing = false;
let processingQueue: string[] = [];
const MAX_CONCURRENT_REQUESTS = 1;
const RATE_LIMIT_DELAY = 10000; // 10 seconds between batches
let lastProcessedBlock = 0;

// Filter transactions to reduce API calls
function shouldProcessTransaction(tx: any): boolean {
  // Only process transactions with data (contract interactions)
  if (!tx.transaction) {
    return false;
  }
  
  // Skip transactions with very low gas (likely simple transfers)
  if (tx.transaction.gas && parseInt(tx.transaction.gas) < 21000) {
    return false;
  }
  
  // Skip transactions to known simple transfer contracts
  const simpleTransferContracts = [
    '0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c', // Example: skip if needed
  ];
  
  if (simpleTransferContracts.includes(tx.transaction.to?.toLowerCase())) {
    return false;
  }
  
  return true;
}

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
            
            const actions = decoded.actions || [];
            const isTrade = actions.some((a: any) => a.type === 'TRADE');
            
            if (!isTrade) return;
            
            const usdValue = decoded.usd_value || 0;
            const from = decoded.from_address;
            
            const protocols = actions
              .filter((a: any) => a.type === 'TRADE')
              .map((a: any) => a.protocol)
              .filter(Boolean);
            
            const tokens = actions
              .filter((a: any) => a.type === 'TRADE')
              .map((a: any) => `${a.token_in?.symbol} → ${a.token_out?.symbol}`);
            
            console.log(`📈 TRADE detected!`);
            console.log(`↳ Trader: ${from}`);
            console.log(`↳ Value: $${usdValue.toFixed(2)}`);
            console.log(`↳ Token: ${tokens.join(', ')}`);
            console.log(`↳ Protocol: ${protocols.join(', ')}\n`);
          } catch (e) {
            console.error(`Error processing transaction ${txHash}:`, e);
          }
        })
      );
      
      // Rate limiting delay
      if (processingQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    } catch (e) {
      console.error('Error processing transaction batch:', e);
    }
  }
  
  isProcessing = false;
}

async function fetchLatestTransactions() {
  try {
    // Get the latest block number
    const latestBlock = await alchemy.core.getBlockNumber();
    
    if (lastProcessedBlock === 0) {
      // First run - start from current block
      lastProcessedBlock = latestBlock;
      console.log(`🚀 Starting from block ${latestBlock}`);
      return;
    }
    
    // Fetch transactions from blocks we haven't processed yet
    for (let blockNum = lastProcessedBlock + 1; blockNum <= latestBlock; blockNum++) {
      try {
        const block = await alchemy.core.getBlockWithTransactions(blockNum);
        
        if (!block || !block.transactions) continue;
        
        console.log(`📦 Processing block ${blockNum} with ${block.transactions.length} transactions`);
        
        // Filter and queue transactions
        block.transactions.forEach((tx) => {
          if (shouldProcessTransaction({ transaction: tx })) {
            const txHash = tx.hash;
            console.log(`🧾 New tx queued: ${txHash}`);
            processingQueue.push(txHash);
          }
        });
        
        lastProcessedBlock = blockNum;
      } catch (e) {
        console.error(`Error fetching block ${blockNum}:`, e);
      }
    }
    
    // Start processing if we have transactions
    if (processingQueue.length > 0) {
      processTransactionQueue();
    }
    
  } catch (e) {
    console.error('Error fetching latest transactions:', e);
  }
}

export function startAlchemyMonitor() {
  console.log('🔌 Alchemy polling monitor ON... (every 10 seconds)');

  // Initial fetch
  fetchLatestTransactions();
  
  // Set up polling every 10 seconds
  setInterval(fetchLatestTransactions, 10000);
}
