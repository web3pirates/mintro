
import { decodeTxWithNoves } from './noves';
import { transactionAPI } from './api-client';

let interestingTransactions: any[] = [];
const MAX_STORED_TRANSACTIONS = 1000;

async function fetchLatestTransactions() {
  try {
    // Get recent transactions from backend
    const response = await fetch('http://localhost:5001/api/transactions/recent');
    
    if (!response.ok) {
      console.error('Failed to fetch recent transactions from backend');
      return;
    }
    
    const data = await response.json();
    
    if (data.recentTransactions && data.recentTransactions.length > 0) {
      console.log(`📦 Retrieved ${data.recentTransactions.length} recent transactions from backend`);
      
      // Add new transactions to local array (avoid duplicates)
      data.recentTransactions.forEach((tx: any) => {
        const exists = interestingTransactions.find(t => t.hash === tx.hash);
        if (!exists) {
          interestingTransactions.push(tx);
        }
      });
      
      // Keep only the latest transactions
      if (interestingTransactions.length > MAX_STORED_TRANSACTIONS) {
        interestingTransactions = interestingTransactions.slice(-MAX_STORED_TRANSACTIONS);
      }
    } else {
      console.log('📦 No new transactions found');
    }
    
  } catch (e) {
    console.error('Error fetching recent transactions from backend:', e);
  }
}

export function startAlchemyMonitor() {
  console.log('🔌 Starting backend transaction monitor...');

  // Start the backend listener
  fetch('http://localhost:5001/api/transactions/start-listener', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log('🚀 Backend listener status:', data.status);
  })
  .catch(error => {
    console.error('❌ Failed to start backend listener:', error);
  });

  // Fetch initial transactions
  fetchLatestTransactions();
  
  // Poll for new transactions every 10 seconds
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

// Database query functions
export async function getDatabaseStats() {
  return await transactionAPI.getStats();
}

export async function getSwapTransactions(limit: number = 100) {
  return await transactionAPI.getSwapTransactions(limit);
}

export async function getLongPositions(limit: number = 100) {
  return await transactionAPI.getLongPositions(limit);
}

export async function getShortPositions(limit: number = 100) {
  return await transactionAPI.getShortPositions(limit);
}

export async function getTransactionsBySender(sender: string, limit: number = 100) {
  return await transactionAPI.getTransactionsBySender(sender, limit);
}

export async function getHighValueTransactions(minValue: number, limit: number = 100) {
  return await transactionAPI.getHighValueTransactions(minValue, limit);
}

export async function getTransactionsByDateRange(startDate: Date, endDate: Date) {
  return await transactionAPI.getTransactionsByDateRange(startDate, endDate);
}
