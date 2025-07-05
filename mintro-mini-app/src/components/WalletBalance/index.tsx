"use client";

import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { useEffect, useState } from "react";
import { createPublicClient, http, formatEther } from "viem";
import { worldchain } from "viem/chains";

interface TokenBalance {
  symbol: string;
  balance: string;
  formattedBalance: string;
}

export const WalletBalance = () => {
  const { user, isLoading, isAuthenticated } = useWorldcoinAuth();
  const { isInstalled } = useMiniKit();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create viem client for blockchain interactions
  const client = createPublicClient({
    chain: worldchain,
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  });

  useEffect(() => {
    const fetchBalances = async () => {
      if (!isAuthenticated || !user?.address || !isInstalled) {
        return;
      }

      setIsLoadingBalances(true);
      setError(null);

      try {
        const address = user.address as `0x${string}`;

        // Get native token balance (WLD)
        const nativeBalance = await client.getBalance({ address });

        setBalances([
          {
            symbol: "WLD",
            balance: nativeBalance.toString(),
            formattedBalance: formatEther(nativeBalance),
          },
        ]);
      } catch (err) {
        console.error("Error fetching balances:", err);
        setError("Failed to fetch wallet balances");
      } finally {
        setIsLoadingBalances(false);
      }
    };

    fetchBalances();
  }, [isAuthenticated, user?.address, isInstalled, client]);

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Loading wallet information...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">
          Please connect your wallet to see your balance
        </p>
      </div>
    );
  }

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    return num.toFixed(4);
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Wallet Balance</h3>

      {isLoadingBalances && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading balances...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!isLoadingBalances && !error && balances.length > 0 && (
        <div className="space-y-3">
          {balances.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {token.symbol}
                  </span>
                </div>
                <span className="font-medium">{token.symbol}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatBalance(token.formattedBalance)}
                </div>
                <div className="text-xs text-gray-500">{token.symbol}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoadingBalances && !error && balances.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-600">No balances found</p>
        </div>
      )}
    </div>
  );
};
