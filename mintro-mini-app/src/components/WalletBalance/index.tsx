"use client";

import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { useEffect, useState, useMemo } from "react";
import { createPublicClient, http, formatEther, getAddress, formatUnits } from "viem";
import { worldchain } from "viem/chains";
import { FaDollarSign, FaBitcoin, FaEthereum } from "react-icons/fa";

const SolanaIcon = () => (
  <svg viewBox="0 0 397.7 311.7" className="w-6 h-6">
    <defs>
      <linearGradient id="solGradient1" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
        <stop offset="0" style={{stopColor:"#00FFA3"}}/>
        <stop offset="1" style={{stopColor:"#DC1FFF"}}/>
      </linearGradient>
      <linearGradient id="solGradient2" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.163" y2="-19.1475" gradientTransform="matrix(1 0 0 -1 0 314)">
        <stop offset="0" style={{stopColor:"#00FFA3"}}/>
        <stop offset="1" style={{stopColor:"#DC1FFF"}}/>
      </linearGradient>
      <linearGradient id="solGradient3" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822" y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)">
        <stop offset="0" style={{stopColor:"#00FFA3"}}/>
        <stop offset="1" style={{stopColor:"#DC1FFF"}}/>
      </linearGradient>
    </defs>
    <path fill="url(#solGradient1)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
    <path fill="url(#solGradient2)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
    <path fill="url(#solGradient3)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4 c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
  </svg>
);

const WorldcoinIcon = () => (
  <svg viewBox="0 0 600.10632 600.10632" className="w-6 h-6">
    <g transform="translate(-99.689875,-99.947068)">
      <g transform="matrix(1.2367001,0,0,1.2367001,-668.2998,-668.50879)">
        <g transform="matrix(1.2994699,0,0,1.2994699,725.31494,727.89368)">
          <g transform="translate(131.17999,104.74)">
            <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="35px" d="m 119.067,-87.470001 c 0,0 -145.507001,0.230003 -145.507001,0.230003 C -74.620003,-87.239998 -113.68,-48.18 -113.68,0 c 0,48.18 39.059997,87.239998 87.239999,87.239998 0,0 140.120001,0 140.120001,0"/>
          </g>
        </g>
        <g transform="matrix(1.2994699,0,0,1.2994699,643.73987,841.25928)">
          <g>
            <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="35px" d="m 2.309,17.5 c 0,0 336.11101,0 336.11101,0"/>
          </g>
        </g>
        <g transform="matrix(1.2994699,0,0,1.2994699,620.99915,621.3761)">
          <g transform="translate(186.71001,186.71001)">
            <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="35px" d="M 0,-169.21001 C 93.452003,-169.21001 169.21001,-93.452003 169.21001,0 169.21001,93.452003 93.452003,169.21001 0,169.21001 -93.452003,169.21001 -169.21001,93.452003 -169.21001,0 -169.21001,-93.452003 -93.452003,-169.21001 0,-169.21001 Z"/>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

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

// Token info with icons
const TOKENS = [
  {
    symbol: "USDC",
    address: "0x79a02482a880bce3f13e09da970dc34db4cd24d1",
    decimals: 6,
    icon: <FaDollarSign className="text-2xl text-blue-500" />,
  },
  {
    symbol: "WLD",
    address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    decimals: 18,
    icon: <WorldcoinIcon />,
  },
  {
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    icon: <FaEthereum className="text-2xl text-[#627EEA]" />,
  },
  {
    symbol: "WBTC",
    address: "0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3",
    decimals: 8,
    icon: <FaBitcoin className="text-2xl text-[#F7931A]" />,
  },
];

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

export const WalletBalance = () => {
  const { user, isLoading, isAuthenticated } = useWorldcoinAuth();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [demoBalances, setDemoBalances] = useState<TokenBalance[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [isLoadingDemoBalances, setIsLoadingDemoBalances] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoError, setDemoError] = useState<string | null>(null);

  // Create viem client for blockchain interactions - memoized to prevent re-creation
  const client = useMemo(() => createPublicClient({
    chain: worldchain,
    transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
  }), []);

  // Function to fetch balances for any address
  const fetchBalancesForAddress = async (address: string, isDemo: boolean = false) => {
    const setLoadingState = isDemo ? setIsLoadingDemoBalances : setIsLoadingBalances;
    const setBalanceState = isDemo ? setDemoBalances : setBalances;
    const setErrorState = isDemo ? setDemoError : setError;

    setLoadingState(true);
    setErrorState(null);

    try {
      const formattedAddress = getAddress(address);

      const results = await Promise.all(
        TOKENS.map(async (token) => {
          const rawBalance = await client.readContract({
            address: token.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "balanceOf",
            args: [formattedAddress],
          });

          const formatted = formatUnits(rawBalance, token.decimals);
          return {
            symbol: token.symbol,
            balance: rawBalance.toString(),
            formattedBalance: formatted,
          };
        })
      );

      setBalanceState(results);
    } catch (err) {
      console.error("Error fetching balances:", err);
      if (err instanceof Error) {
        setErrorState(`Failed to fetch balances: ${err.message}`);
      } else {
        setErrorState("Failed to fetch wallet balances");
      }
    } finally {
      setLoadingState(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.address) {
      fetchBalancesForAddress(user.address, false);
    }
  }, [isAuthenticated, user?.address]);

  // Fetch smart wallet balances on component mount
  useEffect(() => {
    fetchBalancesForAddress("0xbc18B625622b5B7f5E8D9cdE48fb6522BC992e2D", true);
  }, []);

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    return num.toFixed(4);
  };

  // Component to render a single wallet balance box
  const WalletBalanceBox = ({ 
    title, 
    balances, 
    isLoading, 
    error, 
    address 
  }: { 
    title: string; 
    balances: TokenBalance[]; 
    isLoading: boolean; 
    error: string | null; 
    address?: string;
  }) => (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {address && (
          <span className="text-xs text-gray-500 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!isLoading && !error && balances.length > 0 && (
        <div className="space-y-3">
          {balances.map((token) => {
            const tokenInfo = TOKENS.find(t => t.symbol === token.symbol);
            const icon = tokenInfo?.icon || <FaDollarSign className="text-2xl text-blue-500" />;
            
            return (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center">
                    {icon}
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
            );
          })}
        </div>
      )}

      {!isLoading && !error && balances.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-600">No balances found</p>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600">
            Please connect your wallet to see your balance
          </p>
        </div>
        <WalletBalanceBox
          title="Smart Wallet"
          balances={demoBalances}
          isLoading={isLoadingDemoBalances}
          error={demoError}
          address="0xbc18B625622b5B7f5E8D9cdE48fb6522BC992e2D"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WalletBalanceBox
        title="Your Wallet"
        balances={balances}
        isLoading={isLoadingBalances}
        error={error}
        address={user?.address}
      />
      <WalletBalanceBox
        title="Smart Wallet"
        balances={demoBalances}
        isLoading={isLoadingDemoBalances}
        error={demoError}
        address="0xbc18B625622b5B7f5E8D9cdE48fb6522BC992e2D"
      />
    </div>
  );
};