
import { Alchemy, Network } from 'alchemy-sdk';
import { decodeTxWithNoves } from './noves';

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY!;

const settings = {
  apiKey: ALCHEMY_KEY,
  network: Network.WORLDCHAIN_MAINNET, // World Chain uses Ethereum Mainnet network in Alchemy SDK
};

const alchemy = new Alchemy(settings);

let isProcessing = false;
let processingQueue: string[] = [];
const MAX_CONCURRENT_REQUESTS = 1;

let lastProcessedBlock = 0;

let interestingTransactions: any[] = [];
const MAX_STORED_TRANSACTIONS = 1000;

function shouldProcessTransaction(tx: any): boolean {
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
            const senderAddress = classificationData.senderAddress;
            const usdValue = decoded.usd_value || 0;
            
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
            
            if (interestingTransactions.length > MAX_STORED_TRANSACTIONS) {
              interestingTransactions = interestingTransactions.slice(-MAX_STORED_TRANSACTIONS);
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

async function fetchLatestTransactions() {
  try {
    const latestBlock = await alchemy.core.getBlockNumber();
    
    if (lastProcessedBlock === 0) {
      lastProcessedBlock = latestBlock;
      console.log(`🚀 Starting from block ${latestBlock}`);
      return;
    }
    
    for (let blockNum = lastProcessedBlock + 1; blockNum <= latestBlock; blockNum++) {
      try {
        const block = await alchemy.core.getBlockWithTransactions(blockNum);
        
        if (!block || !block.transactions) continue;
        
        console.log(`📦 Processing block ${blockNum} with ${block.transactions.length} transactions`);
        
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
    
    if (processingQueue.length > 0) {
      processTransactionQueue();
    }
    
  } catch (e) {
    console.error('Error fetching latest transactions:', e);
  }
}

export function startAlchemyMonitor() {
  console.log('🔌 Alchemy polling monitor ON... (every 10 seconds)');

  fetchLatestTransactions();
  
  setInterval(fetchLatestTransactions, 10000);
}

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
    const type = tx.type || 'Unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    
    const protocol = tx.protocol || 'Unknown';
    stats.byProtocol[protocol] = (stats.byProtocol[protocol] || 0) + 1;
    
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
