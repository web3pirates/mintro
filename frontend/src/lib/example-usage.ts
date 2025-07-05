// Example usage of the Alchemy transaction monitor
import { 
  startAlchemyMonitor, 
  getInterestingTransactions, 
  getTransactionStats, 
  exportTransactionsToJSON,
  clearTransactionHistory 
} from './alchemy-listener';

// Start monitoring
startAlchemyMonitor();

// Example: Check for interesting transactions every 30 seconds
setInterval(() => {
  const transactions = getInterestingTransactions();
  const stats = getTransactionStats();
  
  if (transactions.length > 0) {
    console.log('\n📊 TRANSACTION SUMMARY:');
    console.log(`Total interesting transactions: ${stats.totalTransactions}`);
    console.log(`Total value processed: $${stats.totalValue.toFixed(2)}`);
    console.log(`Average transaction value: $${stats.averageValue.toFixed(2)}`);
    
    console.log('\n📈 By Type:');
    Object.entries(stats.byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    console.log('\n🏦 By Protocol:');
    Object.entries(stats.byProtocol).forEach(([protocol, count]) => {
      console.log(`  ${protocol}: ${count}`);
    });
    
    // Show the latest transaction
    const latest = transactions[transactions.length - 1];
    console.log('\n🆕 Latest Transaction:');
    console.log(`  Type: ${latest.type}`);
    console.log(`  Description: ${latest.description}`);
    console.log(`  Value: $${latest.usdValue.toFixed(2)}`);
    console.log(`  Protocol: ${latest.protocol}`);
    console.log(`  Hash: ${latest.hash}`);
  }
}, 30000);

// Example: Export data to file (you can call this manually)
function exportData() {
  const jsonData = exportTransactionsToJSON();
  console.log('💾 Exporting transaction data...');
  console.log(jsonData);
  // You could save this to a file or send to a database
}

// Example: Find specific types of transactions
function findSwaps() {
  const transactions = getInterestingTransactions();
  const swaps = transactions.filter(tx => 
    tx.type?.toLowerCase().includes('swap') || 
    tx.description?.toLowerCase().includes('swap')
  );
  
  console.log(`\n🔄 Found ${swaps.length} swap transactions:`);
  swaps.forEach(swap => {
    console.log(`  ${swap.timestamp}: ${swap.description} ($${swap.usdValue.toFixed(2)})`);
  });
}

// Example: Find high-value transactions
function findHighValueTransactions(minValue: number = 1000) {
  const transactions = getInterestingTransactions();
  const highValue = transactions.filter(tx => (tx.usdValue || 0) >= minValue);
  
  console.log(`\n💰 Found ${highValue.length} transactions >= $${minValue}:`);
  highValue.forEach(tx => {
    console.log(`  $${tx.usdValue.toFixed(2)}: ${tx.description} (${tx.protocol})`);
  });
}

// Example: Monitor specific addresses
function monitorAddress(address: string) {
  const transactions = getInterestingTransactions();
  const addressTxs = transactions.filter(tx => 
    tx.sender?.toLowerCase() === address.toLowerCase()
  );
  
  console.log(`\n👤 Found ${addressTxs.length} transactions from ${address}:`);
  addressTxs.forEach(tx => {
    console.log(`  ${tx.timestamp}: ${tx.description} ($${tx.usdValue.toFixed(2)})`);
  });
}

// Export these functions for use
export {
  exportData,
  findSwaps,
  findHighValueTransactions,
  monitorAddress
}; 