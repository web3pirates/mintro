'use client';

import { useState, useEffect } from 'react';
import { 
  startAlchemyMonitor,
  getDatabaseStats,
  getSwapTransactions,
  getLongPositions,
  getShortPositions,
  getTransactionsBySender,
  getHighValueTransactions,
  getTransactionsByDateRange
} from '../../lib/alchemy-listener';
import { TransactionData } from '../../lib/api-client';

export default function TestPage() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test API connection
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await getDatabaseStats();
      setStats(stats);
      console.log('✅ API connection successful');
    } catch (err) {
      setError('Failed to connect to API. Make sure your backend is running on http://localhost:5001');
      console.error('❌ API connection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start monitoring
  const startMonitoring = () => {
    try {
      startAlchemyMonitor();
      setIsMonitoring(true);
      console.log('✅ Monitoring started');
    } catch (err) {
      setError('Failed to start monitoring');
      console.error('❌ Failed to start monitoring:', err);
    }
  };

  // Get recent transactions
  const getRecentTransactions = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 60 * 60 * 1000); // Last hour
      const transactions = await getTransactionsByDateRange(startDate, endDate);
      setRecentTransactions(transactions.slice(0, 10));
    } catch (err) {
      setError('Failed to get recent transactions');
      console.error('❌ Failed to get recent transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get swap transactions
  const getSwaps = async () => {
    setLoading(true);
    try {
      const swaps = await getSwapTransactions(10);
      setRecentTransactions(swaps);
    } catch (err) {
      setError('Failed to get swap transactions');
      console.error('❌ Failed to get swap transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get long positions
  const getLongs = async () => {
    setLoading(true);
    try {
      const longs = await getLongPositions(10);
      setRecentTransactions(longs);
    } catch (err) {
      setError('Failed to get long positions');
      console.error('❌ Failed to get long positions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get short positions
  const getShorts = async () => {
    setLoading(true);
    try {
      const shorts = await getShortPositions(10);
      setRecentTransactions(shorts);
    } catch (err) {
      setError('Failed to get short positions');
      console.error('❌ Failed to get short positions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh stats
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isMonitoring) {
        try {
          const newStats = await getDatabaseStats();
          setStats(newStats);
        } catch (err) {
          console.error('Failed to refresh stats:', err);
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isMonitoring]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Transaction Monitor Test</h1>
        
        {/* Connection Test */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded mr-4"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded">
              {error}
            </div>
          )}
          
          {stats && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-sm text-gray-400">Total Transactions</div>
                <div className="text-2xl font-bold">{stats.totalTransactions}</div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-sm text-gray-400">Total Value</div>
                <div className="text-2xl font-bold">${stats.totalValue?.toFixed(2)}</div>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <div className="text-sm text-gray-400">Swap Value</div>
                <div className="text-2xl font-bold">${stats.totalSwapValue?.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Monitoring Controls */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Monitoring Controls</h2>
          <button
            onClick={startMonitoring}
            disabled={isMonitoring}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded mr-4"
          >
            {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
          </button>
          
          {isMonitoring && (
            <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded">
              ✅ Transaction monitoring is active. Watching for new transactions every 10 seconds.
            </div>
          )}
        </div>

        {/* Query Controls */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Query Transactions</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={getRecentTransactions}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              Recent (1h)
            </button>
            <button
              onClick={getSwaps}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              Swaps
            </button>
            <button
              onClick={getLongs}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              Long Positions
            </button>
            <button
              onClick={getShorts}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              Short Positions
            </button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((tx, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{tx.description}</div>
                      <div className="text-sm text-gray-400">
                        {tx.timestamp} • {tx.sender.slice(0, 8)}...{tx.sender.slice(-6)}
                      </div>
                      {tx.tokenIn && tx.tokenOut && (
                        <div className="text-sm text-blue-400">
                          {tx.tokenIn.symbol} → {tx.tokenOut.symbol}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${tx.usdValue.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">{tx.type}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No transactions found. Try querying for different types or start monitoring.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 