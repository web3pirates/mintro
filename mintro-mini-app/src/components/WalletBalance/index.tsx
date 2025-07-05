"use client";

import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { useEffect, useState, useMemo } from "react";
import { createPublicClient, http, formatEther, getAddress } from "viem";
import { worldchain } from "viem/chains";

interface TokenBalance {
  symbol: string;
  balance: string;
  formattedBalance: string;
}

// WLD token contract address on Worldcoin chain
const WLD_TOKEN_ADDRESS = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003";

// ERC-20 ABI for balance and decimals
const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const WalletBalance = () => {
  const { user, isLoading, isAuthenticated } = useWorldcoinAuth();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create viem client for blockchain interactions - memoized to prevent re-creation
  const client = useMemo(() => createPublicClient({
    chain: worldchain,
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  }), []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!isAuthenticated || !user?.address) {
        return;
      }

      setIsLoadingBalances(true);
      setError(null);

      try {
        // Ensure the address is properly checksummed
        const address = getAddress(user.address);

        console.log("Fetching WLD balance for address:", address);

        // Read WLD token balance using contract call
        const [balance, decimals] = await Promise.all([
          client.readContract({
            address: WLD_TOKEN_ADDRESS as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address],
          }),
          client.readContract({
            address: WLD_TOKEN_ADDRESS as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'decimals',
            args: [],
          }),
        ]);

        console.log("WLD balance (raw):", balance.toString());
        console.log("WLD decimals:", decimals);

        // Format the balance using the correct decimals
        const formattedBalance = formatEther(balance);

        console.log("WLD balance (formatted):", formattedBalance);

        setBalances([
          {
            symbol: "WLD",
            balance: Number(balance).toString(),
            formattedBalance: formattedBalance,
          },
        ]);
      } catch (err) {
        console.error("Error fetching WLD balance:", err);
        if (err instanceof Error) {
          setError(`Failed to fetch WLD balance: ${err.message}`);
        } else {
          setError("Failed to fetch wallet balances");
        }
      } finally {
        setIsLoadingBalances(false);
      }
    };

    fetchBalances();
  }, [isAuthenticated, user?.address]); // Removed client from dependencies

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
