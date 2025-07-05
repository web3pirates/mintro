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
const RATE_LIMIT_DELAY = 1000; // 10 seconds between batches
let lastProcessedBlock = 0;

// Data collection for interesting transactions
let interestingTransactions: any[] = [];
const MAX_STORED_TRANSACTIONS = 1000; // Keep last 1000 transactions

// Filter transactions to reduce API calls
function shouldProcessTransaction(tx: any): boolean {
  // Only process transactions with data (contract interactions)
  if (!tx.transaction) {
    return false;
  }
  
  // Skip transactions with very low gas (likely simple transfers)
  // But allow higher gas transactions that might be DeFi interactions
  if (tx.transaction.gas && parseInt(tx.transaction.gas) < 50000) {
    return false;
  }
  
  // Skip transactions to known simple transfer contracts
  const simpleTransferContracts = [
    '0xa0b86a33e6441b8c4c8c8c8c8c8c8c8c8c8c8c8c', // Example: skip if needed
  ];
  
  if (simpleTransferContracts.includes(tx.transaction.to?.toLowerCase())) {
    return false;
  }
  
  // Prioritize transactions with data (contract calls)
  if (tx.transaction.data && tx.transaction.data !== '0x') {
    return true;
  }
  
  // Also process high-value transfers
  if (tx.transaction.value && parseInt(tx.transaction.value) > 1000000000000000000) { // > 1 ETH
    return true;
  }
  
  return false;
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
            
            // Extract data from Noves response
            const classificationData = decoded.classificationData;
            const rawData = decoded.rawTransactionData;
            
            if (!classificationData) return;
            
            // Check for various interesting transaction types
            const txType = classificationData.type;
            const description = classificationData.description;
            const protocol = classificationData.protocol?.name;
            const senderAddress = classificationData.senderAddress;
            const usdValue = decoded.usd_value || 0;
            
            // Define interesting transaction types
            const interestingTypes = [
              'swap',
              'composite'
            ];
            
            const isInteresting = interestingTypes.some(type => 
              txType?.toLowerCase().includes(type) || 
              description?.toLowerCase().includes(type)
            );

            console.log({isInteresting})
            
            if (!isInteresting) return;
            
            // Extract token information if available
            const sent = classificationData.sent || [];
            const received = classificationData.received || [];
            
            const tokens = [
              ...sent.map((s: any) => s.token?.symbol).filter(Boolean),
              ...received.map((r: any) => r.token?.symbol).filter(Boolean)
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
            
            // Store interesting transaction data
            const transactionData = {
              timestamp: new Date().toISOString(),
              hash: txHash,
              type: txType,
              description,
              sender: senderAddress || rawData?.fromAddress,
              usdValue,
              protocol: protocol || 'Unknown',
              tokens,
              gasUsed: rawData?.gasUsed,
              transactionFee: rawData?.transactionFee,
              blockNumber: rawData?.blockNumber,
              rawData: decoded
            };

            console.log(transactionData.rawData.classificationData)
            
            interestingTransactions.push(transactionData);
            
            // Keep only the last MAX_STORED_TRANSACTIONS
            if (interestingTransactions.length > MAX_STORED_TRANSACTIONS) {
              interestingTransactions = interestingTransactions.slice(-MAX_STORED_TRANSACTIONS);
            }
            
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

// Export functions to access collected data
export function getInterestingTransactions() {
  return interestingTransactions;
}

export function getTransactionStats() {
  const stats = {
    totalTransactions: interestingTransactions.length,
    byType: {} as Record<string, number>,
    byProtocol: {} as Record<string, number>,
    totalValue: 0,
    averageValue: 0
  };
  
  interestingTransactions.forEach(tx => {
    // Count by type
    const type = tx.type || 'Unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    
    // Count by protocol
    const protocol = tx.protocol || 'Unknown';
    stats.byProtocol[protocol] = (stats.byProtocol[protocol] || 0) + 1;
    
    // Sum values
    stats.totalValue += tx.usdValue || 0;
  });
  
  stats.averageValue = stats.totalTransactions > 0 ? stats.totalValue / stats.totalTransactions : 0;
  
  return stats;
}

export function exportTransactionsToJSON() {
  return JSON.stringify(interestingTransactions, null, 2);
}

export function clearTransactionHistory() {
  interestingTransactions = [];
  console.log('🗑️ Transaction history cleared');
}
