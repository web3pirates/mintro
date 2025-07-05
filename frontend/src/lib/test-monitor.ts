// Test script for transaction monitoring system
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
import { transactionAPI } from './api-client';

// Test configuration
const TEST_CONFIG = {
  enableMonitoring: true,
  enableStats: true,
  enableQueries: true,
  statsInterval: 30000, // 30 seconds
  queryInterval: 60000, // 1 minute
};

// Test functions
async function testAPIConnection() {
  console.log('🔌 Testing API connection...');
  try {
    const stats = await transactionAPI.getStats();
    console.log('✅ API connection successful');
    console.log('📊 Current stats:', stats);
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    console.log('💡 Make sure your backend is running on http://localhost:5001');
    return false;
  }
}

async function testTransactionQueries() {
  console.log('\n🔍 Testing transaction queries...');
  
  try {
    // Test swap transactions
    const swaps = await getSwapTransactions(5);
    console.log(`✅ Found ${swaps.length} swap transactions`);
    
    // Test long positions
    const longPositions = await getLongPositions(5);
    console.log(`✅ Found ${longPositions.length} long positions`);
    
    // Test short positions
    const shortPositions = await getShortPositions(5);
    console.log(`✅ Found ${shortPositions.length} short positions`);
    
    // Test high value transactions
    const highValue = await getHighValueTransactions(100, 5);
    console.log(`✅ Found ${highValue.length} high-value transactions`);
    
    return true;
  } catch (error) {
    console.error('❌ Query tests failed:', error);
    return false;
  }
}

async function showLiveStats() {
  try {
    const stats = await getDatabaseStats();
    console.log('\n📊 LIVE STATISTICS:');
    console.log(`Total Transactions: ${stats.totalTransactions}`);
    console.log(`Total Value: $${stats.totalValue.toFixed(2)}`);
    console.log(`Total Swap Value: $${stats.totalSwapValue.toFixed(2)}`);
    console.log(`Total Long Positions: $${stats.totalLongValue.toFixed(2)}`);
    console.log(`Total Short Positions: $${stats.totalShortValue.toFixed(2)}`);
    console.log(`Average Transaction Value: $${stats.avgValue.toFixed(2)}`);
  } catch (error) {
    console.error('❌ Error getting live stats:', error);
  }
}

async function showRecentActivity() {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 10 * 60 * 1000); // Last 10 minutes
    
    const transactions = await getTransactionsByDateRange(startDate, endDate);
    console.log(`\n🕒 Recent Activity (last 10 minutes): ${transactions.length} transactions`);
    
    if (transactions.length > 0) {
      transactions.slice(0, 3).forEach((tx: any) => {
        console.log(`  ${tx.timestamp}: ${tx.description} ($${tx.usdValue.toFixed(2)})`);
      });
    }
  } catch (error) {
    console.error('❌ Error getting recent activity:', error);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting transaction monitoring tests...\n');
  
  // Test 1: API Connection
  const apiConnected = await testAPIConnection();
  if (!apiConnected) {
    console.log('\n❌ Cannot proceed without API connection');
    console.log('💡 Please start your backend server first');
    return;
  }
  
  // Test 2: Transaction Queries
  await testTransactionQueries();
  
  // Test 3: Start monitoring if enabled
  if (TEST_CONFIG.enableMonitoring) {
    console.log('\n🔌 Starting transaction monitoring...');
    startAlchemyMonitor();
    console.log('✅ Monitoring started - watching for new transactions');
  }
  
  // Test 4: Periodic stats and queries
  if (TEST_CONFIG.enableStats) {
    console.log(`\n📊 Will show stats every ${TEST_CONFIG.statsInterval / 1000} seconds`);
    setInterval(showLiveStats, TEST_CONFIG.statsInterval);
  }
  
  if (TEST_CONFIG.enableQueries) {
    console.log(`\n🔍 Will show recent activity every ${TEST_CONFIG.queryInterval / 1000} seconds`);
    setInterval(showRecentActivity, TEST_CONFIG.queryInterval);
  }
  
  console.log('\n✅ Test setup complete!');
  console.log('📝 The system will now:');
  console.log('  - Monitor World Chain transactions every 10 seconds');
  console.log('  - Send interesting transactions to your backend API');
  console.log('  - Show statistics and recent activity periodically');
  console.log('\n💡 Press Ctrl+C to stop the monitoring');
}

// Export for use
export { runTests, showLiveStats, showRecentActivity };

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
} 