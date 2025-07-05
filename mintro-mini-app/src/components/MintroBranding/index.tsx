"use client";

import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

interface SwapNotification {
  id: string;
  timestamp: string;
  type: "swap" | "liquidity" | "yield";
  title: string;
  description: string;
  amount: string;
  token: string;
  status: "completed" | "pending" | "failed";
  formattedDate?: string;
  formattedTime?: string;
}

const mockSwapNotifications: SwapNotification[] = [
  // {
  //   id: "1",
  //   timestamp: "2024-01-15T10:30:00Z",
  //   type: "swap",
  //   title: "ETH → USDC Swap",
  //   description: "Swapped 0.5 ETH for 1,250 USDC",
  //   amount: "0.5 ETH",
  //   token: "USDC",
  //   status: "completed",
  // },
  // {
  //   id: "2",
  //   timestamp: "2024-01-14T15:45:00Z",
  //   type: "liquidity",
  //   title: "Added Liquidity",
  //   description: "Added 1000 USDC + 0.4 ETH to Uniswap V3",
  //   amount: "1000 USDC",
  //   token: "ETH",
  //   status: "completed",
  // },
  // {
  //   id: "3",
  //   timestamp: "2024-01-13T09:20:00Z",
  //   type: "yield",
  //   title: "Yield Farming",
  //   description: "Started farming with 500 USDC on Compound",
  //   amount: "500 USDC",
  //   token: "COMP",
  //   status: "pending",
  // },
  // {
  //   id: "4",
  //   timestamp: "2024-01-12T14:15:00Z",
  //   type: "swap",
  //   title: "USDC → DAI Swap",
  //   description: "Swapped 500 USDC for 500 DAI",
  //   amount: "500 USDC",
  //   token: "DAI",
  //   status: "completed",
  // },
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

const WLD_CONTRACT = "0x163f8C2467924be0ae7B5347228C0F3Fc0cC008e"; // WLD token contract on World Chain
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export const MintroBranding = () => {
  const { isLoading, isAuthenticated, user } = useWorldcoinAuth();
  const [formattedNotifications, setFormattedNotifications] = useState<
    SwapNotification[]
  >([]);
  const [isClient, setIsClient] = useState(false);
  const [wldBalance, setWldBalance] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
    // Format dates on client side to prevent hydration mismatch
    const formatted = mockSwapNotifications.map((notification) => ({
      ...notification,
      formattedDate: new Date(notification.timestamp).toLocaleDateString(),
      formattedTime: new Date(notification.timestamp).toLocaleTimeString(),
    }));
    setFormattedNotifications(formatted);
  }, []);

  useEffect(() => {
    async function fetchWldBalance() {
      if (!user?.address) {
        setDebugLogs((prev) => [...prev, "No user address available"]);
        return;
      }

      try {
        setDebugLogs((prev) => [
          ...prev,
          `Fetching WLD balance for address: ${user.address}`,
        ]);

        // Check if RPC URL is available
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
        if (!rpcUrl) {
          throw new Error(
            "NEXT_PUBLIC_RPC_URL environment variable is not set"
          );
        }

        setDebugLogs((prev) => [...prev, `Using RPC URL: ${rpcUrl}`]);
        setDebugLogs((prev) => [
          ...prev,
          `Network: World Chain (Worldcoin's blockchain)`,
        ]);

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const contract = new ethers.Contract(WLD_CONTRACT, ERC20_ABI, provider);

        setDebugLogs((prev) => [...prev, `Contract address: ${WLD_CONTRACT}`]);

        const [rawBalance, decimals] = await Promise.all([
          contract.balanceOf(user.address),
          contract.decimals(),
        ]);

        setDebugLogs((prev) => [
          ...prev,
          `Raw balance: ${rawBalance.toString()}`,
        ]);
        setDebugLogs((prev) => [...prev, `Decimals: ${decimals}`]);

        const formattedBalance = ethers.formatUnits(rawBalance, decimals);
        setDebugLogs((prev) => [
          ...prev,
          `Formatted balance: ${formattedBalance}`,
        ]);

        setWldBalance(formattedBalance);
        setBalanceError(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setDebugLogs((prev) => [
          ...prev,
          `Error fetching WLD balance: ${errorMessage}`,
        ]);
        setBalanceError(errorMessage);
        setWldBalance(null);
      }
    }

    fetchWldBalance();
  }, [user?.address]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mintro
          </h1>
          <h3 className="text-lg font-semibold">
            Your intelligent DeFi companion v0.11
          </h3>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          {formattedNotifications.map((notification) => (
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
                    {isClient ? (
                      <>
                        {notification.formattedDate} •{" "}
                        {notification.formattedTime}
                      </>
                    ) : (
                      <span className="animate-pulse bg-gray-200 h-4 w-24 rounded"></span>
                    )}
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
        {isLoading ? (
          <div className="space-y-4">
            <p className="text-white">Loading...</p>
          </div>
        ) : isAuthenticated ? (
          <div className="space-y-4">
            {wldBalance !== null && (
              <div className="text-white">
                <strong>WLD Balance:</strong> {wldBalance}
              </div>
            )}
            {balanceError && (
              <div className="text-red-400 text-sm">
                <strong>Error fetching balance:</strong> {balanceError}
              </div>
            )}
            <div className="text-white text-sm">
              <strong>User Address:</strong> {user?.address}
            </div>

            {/* Debug Info Section */}
            {debugLogs.length > 0 && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Debug Info:</h3>
                <div className="space-y-1">
                  {debugLogs.map((log, index) => (
                    <div
                      key={index}
                      className="text-green-400 text-xs font-mono"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Button size="lg" variant="primary" className="px-8">
              Login with World App Wallet
            </Button>
            <p className="text-white">
              Connect your World App wallet to start tracking your DeFi
              portfolio
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
