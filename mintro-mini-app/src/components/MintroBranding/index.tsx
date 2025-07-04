"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

interface SwapNotification {
  id: string;
  timestamp: string;
  type: "swap" | "liquidity" | "yield";
  title: string;
  description: string;
  amount: string;
  token: string;
  status: "completed" | "pending" | "failed";
}

const mockSwapNotifications: SwapNotification[] = [
  {
    id: "1",
    timestamp: "2024-01-15T10:30:00Z",
    type: "swap",
    title: "ETH → USDC Swap",
    description: "Swapped 0.5 ETH for 1,250 USDC",
    amount: "0.5 ETH",
    token: "USDC",
    status: "completed",
  },
  {
    id: "2",
    timestamp: "2024-01-14T15:45:00Z",
    type: "liquidity",
    title: "Added Liquidity",
    description: "Added 1000 USDC + 0.4 ETH to Uniswap V3",
    amount: "1000 USDC",
    token: "ETH",
    status: "completed",
  },
  {
    id: "3",
    timestamp: "2024-01-13T09:20:00Z",
    type: "yield",
    title: "Yield Farming",
    description: "Started farming with 500 USDC on Compound",
    amount: "500 USDC",
    token: "COMP",
    status: "pending",
  },
  {
    id: "4",
    timestamp: "2024-01-12T14:15:00Z",
    type: "swap",
    title: "USDC → DAI Swap",
    description: "Swapped 500 USDC for 500 DAI",
    amount: "500 USDC",
    token: "DAI",
    status: "completed",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-600 bg-green-100";
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "failed":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "swap":
      return "🔄";
    case "liquidity":
      return "💧";
    case "yield":
      return "🌾";
    default:
      return "📊";
  }
};

export const MintroBranding = () => {
  const { authenticated } = usePrivy();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mintro
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Your intelligent DeFi companion. Discover, track, and optimize your
            crypto investments with AI-powered insights.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Real-time Portfolio Tracking
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            AI-Powered Yield Optimization
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Cross-Chain Analytics
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">Portfolio Analytics</h3>
          <p className="text-gray-600">
            Get comprehensive insights into your DeFi positions across multiple
            protocols and chains.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
          <p className="text-gray-600">
            Receive personalized suggestions for yield farming, liquidity
            provision, and risk management.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold mb-2">Instant Notifications</h3>
          <p className="text-gray-600">
            Stay updated with real-time alerts on your transactions, yields, and
            market opportunities.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Recent Activity
          </h2>
          <p className="text-gray-600">
            Your latest DeFi transactions and activities
          </p>
        </div>

        <div className="space-y-4">
          {mockSwapNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  {getTypeIcon(notification.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      notification.status
                    )}`}
                  >
                    {notification.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {notification.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {new Date(notification.timestamp).toLocaleDateString()} •{" "}
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-medium">
                    {notification.amount} → {notification.token}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center pt-8">
        {authenticated ? (
          <div className="space-y-4">
            <Button size="lg" variant="primary" className="px-8">
              🚀 Start Trading
            </Button>
            <p className="text-sm text-gray-600">
              Ready to optimize your DeFi strategy?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Connect your wallet to start tracking your DeFi portfolio
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
