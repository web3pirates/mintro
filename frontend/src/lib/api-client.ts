// API client for communicating with backend
import axios from 'axios';

// Explicitly set the API base URL (using port 5001 to avoid Apple AirTunes conflict)
const API_BASE_URL = 'http://localhost:5001/api';

// Debug: Log the base URL being used
console.log('🔧 API Base URL:', API_BASE_URL);

// Transaction interface for API calls
export interface TransactionData {
  hash: string;
  blockNumber: number;
  timestamp: string;
  type: string;
  description: string;
  sender: string;
  usdValue: number;
  swapValue?: number;
  longPositionValue?: number;
  shortPositionValue?: number;
  tokens: string[];
  tokenIn?: {
    symbol: string;
    address: string;
    amount: string;
    usdValue: number;
  };
  tokenOut?: {
    symbol: string;
    address: string;
    amount: string;
    usdValue: number;
  };
  protocol: string;
  gasUsed: number;
  gasPrice: number;
  transactionFee: {
    amount: string;
    token: string;
    usdValue: number;
  };
  positionType?: 'long' | 'short' | 'neutral';
  positionSize?: number;
  leverage?: number;
  rawData: any;
}

// API client class
export class TransactionAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    console.log('🔧 TransactionAPI initialized with base URL:', this.baseURL);
  }

  // Save transaction to backend
  async saveTransaction(transactionData: any): Promise<string> {
    try {
      const url = `${this.baseURL}/transactions`;
      console.log('🔧 Saving transaction to:', url);
      const response = await axios.post(url, transactionData);
      console.log(`💾 Saved transaction ${transactionData.hash} via API`);
      return response.data.id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        // Conflict - transaction already exists
        console.log(`⚠️ Transaction ${transactionData.hash} already exists`);
        return transactionData.hash;
      }
      console.error('❌ Error saving transaction via API:', error);
      throw error;
    }
  }

  // Get database statistics
  async getStats() {
    try {
      const url = `${this.baseURL}/transactions/stats`;
      console.log('🔧 Getting stats from:', url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting stats via API:', error);
      throw error;
    }
  }

  // Get transactions by type
  async getTransactionsByType(type: string, limit: number = 100) {
    try {
      const url = `${this.baseURL}/transactions/type/${type}?limit=${limit}`;
      console.log('🔧 Getting transactions by type from:', url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting transactions by type via API:', error);
      throw error;
    }
  }

  // Get transactions by sender
  async getTransactionsBySender(sender: string, limit: number = 100) {
    try {
      const url = `${this.baseURL}/transactions/sender/${sender}?limit=${limit}`;
      console.log('🔧 Getting transactions by sender from:', url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting transactions by sender via API:', error);
      throw error;
    }
  }

  // Get high value transactions
  async getHighValueTransactions(minValue: number, limit: number = 100) {
    try {
      const url = `${this.baseURL}/transactions/high-value?minValue=${minValue}&limit=${limit}`;
      console.log('🔧 Getting high value transactions from:', url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting high value transactions via API:', error);
      throw error;
    }
  }

  // Get swap transactions
  async getSwapTransactions(limit: number = 100) {
    try {
      const url = `${this.baseURL}/transactions/swaps?limit=${limit}`;
      console.log('🔧 Getting swap transactions from:', url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting swap transactions via API:', error);
      throw error;
    }
  }

  // Get long positions
  async getLongPositions(limit: number = 100) {
    try {
      const url = `${this.baseURL}/transactions/long-positions?limit=${limit}`;
      console.log('🔧 Getting long positions from:', url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting long positions via API:', error);
      throw error;
    }
  }

  // Get short positions
  async getShortPositions(limit: number = 100) {
    try {
      const url = `${this.baseURL}/transactions/short-positions?limit=${limit}`;
      console.log('🔧 Getting short positions from:', url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting short positions via API:', error);
      throw error;
    }
  }

  // Get transactions by date range
  async getTransactionsByDateRange(startDate: Date, endDate: Date) {
    try {
      const url = `${this.baseURL}/transactions/date-range`;
      console.log('🔧 Getting transactions by date range from:', url);
      const response = await axios.get(url, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error getting transactions by date range via API:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const transactionAPI = new TransactionAPI(); 