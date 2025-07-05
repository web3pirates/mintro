// Example usage of API client for transaction monitoring
import { 
  startAlchemyMonitor,
  getDatabaseStats,
  getSwapTransactions,
  getLongPositions,
  getShortPositions,
  getTransactionsBySender,
  getHighValueTransactions,
  getTransactionsByDateRange
} from './alchemy-listener';
import { TransactionData } from './api-client';

// Start monitoring (this will send transactions to backend via API)
startAlchemyMonitor();

// Example: Get database statistics every minute
setInterval(async () => {
  try {
    const stats = await getDatabaseStats();
    console.log('\n📊 DATABASE STATISTICS:');
    console.log(`Total Transactions: ${stats.totalTransactions}`);
    console.log(`Total Value: $${stats.totalValue.toFixed(2)}`);
    console.log(`Total Swap Value: $${stats.totalSwapValue.toFixed(2)}`);
    console.log(`Total Long Positions: $${stats.totalLongValue.toFixed(2)}`);
    console.log(`Total Short Positions: $${stats.totalShortValue.toFixed(2)}`);
    console.log(`Average Transaction Value: $${stats.avgValue.toFixed(2)}`);
  } catch (error) {
    console.error('❌ Error getting database stats:', error);
  }
}, 60000);

// Example: Get recent swap transactions
async function showRecentSwaps() {
  try {
    const swaps = await getSwapTransactions(10);
    console.log('\n🔄 Recent Swap Transactions:');
    swaps.forEach((swap: TransactionData) => {
      console.log(`  ${swap.timestamp}: ${swap.tokenIn?.symbol} → ${swap.tokenOut?.symbol} ($${swap.swapValue?.toFixed(2)})`);
    });
  } catch (error) {
    console.error('❌ Error getting swap transactions:', error);
  }
}

// Example: Get long positions
async function showLongPositions() {
  try {
    const longPositions = await getLongPositions(10);
    console.log('\n📈 Recent Long Positions:');
    longPositions.forEach((pos: TransactionData) => {
      console.log(`  ${pos.timestamp}: $${pos.longPositionValue?.toFixed(2)} (${pos.description})`);
    });
  } catch (error) {
    console.error('❌ Error getting long positions:', error);
  }
}

// Example: Get short positions
async function showShortPositions() {
  try {
    const shortPositions = await getShortPositions(10);
    console.log('\n📉 Recent Short Positions:');
    shortPositions.forEach((pos: TransactionData) => {
      console.log(`  ${pos.timestamp}: $${pos.shortPositionValue?.toFixed(2)} (${pos.description})`);
    });
  } catch (error) {
    console.error('❌ Error getting short positions:', error);
  }
}

// Example: Monitor specific address
async function monitorAddress(address: string) {
  try {
    const transactions = await getTransactionsBySender(address, 20);
    console.log(`\n👤 Recent transactions for ${address}:`);
    transactions.forEach((tx: TransactionData) => {
      console.log(`  ${tx.timestamp}: ${tx.description} ($${tx.usdValue.toFixed(2)})`);
    });
  } catch (error) {
    console.error('❌ Error getting address transactions:', error);
  }
}

// Example: Get high-value transactions
async function showHighValueTransactions(minValue: number = 1000) {
  try {
    const highValue = await getHighValueTransactions(minValue, 10);
    console.log(`\n💰 Transactions >= $${minValue}:`);
    highValue.forEach((tx: TransactionData) => {
      console.log(`  $${tx.usdValue.toFixed(2)}: ${tx.description} (${tx.protocol})`);
    });
  } catch (error) {
    console.error('❌ Error getting high-value transactions:', error);
  }
}

// Example: Get transactions by date range
async function showTransactionsByDateRange() {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
    
    const transactions = await getTransactionsByDateRange(startDate, endDate);
    console.log(`\n📅 Transactions in last 24 hours: ${transactions.length}`);
    
    // Group by type
    const byType = transactions.reduce((acc: Record<string, number>, tx: TransactionData) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  } catch (error) {
    console.error('❌ Error getting transactions by date range:', error);
  }
}

// Export functions for use
export {
  showRecentSwaps,
  showLongPositions,
  showShortPositions,
  monitorAddress,
  showHighValueTransactions,
  showTransactionsByDateRange
}; 