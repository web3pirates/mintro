"use client";

import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { useEffect, useState, useRef } from "react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

// Function to get package versions - simplified to avoid fetch issues
const getPackageVersions = () => {
  return {
    minikitJs: "unknown",
    minikitReact: "unknown",
  };
};

interface ConsoleError {
  timestamp: string;
  type: "error" | "warn" | "info" | "log";
  message: string;
  stack?: string;
}

// Function to mask sensitive data
const maskSensitiveData = (value: string | null | undefined): string => {
  if (!value || value.length <= 4) return value || "";
  return "*".repeat(value.length - 4) + value.slice(-4);
};

// Helper function to safely serialize objects that might contain BigInt
const safeStringify = (obj: any): string => {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
};

export const DebugInfo = () => {
  const { user, isLoading, isAuthenticated } = useWorldcoinAuth();
  const { isInstalled } = useMiniKit();
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [consoleErrors, setConsoleErrors] = useState<ConsoleError[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [packageVersions, setPackageVersions] = useState<{
    minikitJs: string;
    minikitReact: string;
  }>({ minikitJs: "loading...", minikitReact: "loading..." });
  const [wldBalance, setWldBalance] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [balanceLogs, setBalanceLogs] = useState<string[]>([]);
  const isMountedRef = useRef(false);

  const copyToClipboard = async () => {
    try {
      const debugText = JSON.stringify({ debugInfo, consoleErrors }, null, 2);
      await navigator.clipboard.writeText(debugText);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const clearErrors = () => {
    setConsoleErrors([]);
  };

  const clearBalanceLogs = () => {
    setBalanceLogs([]);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Load package versions
  useEffect(() => {
    setPackageVersions(getPackageVersions());
  }, []);

  // Fetch WLD balance
  useEffect(() => {
    async function fetchWldBalance() {
      if (!user?.address) return;

      try {
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
        if (!rpcUrl) {
          setBalanceError(
            "NEXT_PUBLIC_RPC_URL environment variable is not set"
          );
          return;
        }

        setBalanceLogs(prev => [...prev, "Starting WLD balance fetch..."]);
        setBalanceLogs(prev => [...prev, `User address: ${user.address}`]);

        const { ethers } = await import("ethers");
        
        const WLD_CONTRACT = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003";
        const ERC20_ABI = [
          "function balanceOf(address owner) view returns (uint256)",
          "function decimals() view returns (uint8)",
        ];

        setBalanceLogs(prev => [...prev, `WLD Contract: ${WLD_CONTRACT}`]);

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const checksummedAddress = ethers.getAddress(WLD_CONTRACT);
        setBalanceLogs(prev => [...prev, `Checksummed address: ${checksummedAddress}`]);
        
        const contract = new ethers.Contract(
          checksummedAddress,
          ERC20_ABI,
          provider
        );

        setBalanceLogs(prev => [...prev, "Calling contract.balanceOf() and contract.decimals()..."]);
        
        const [rawBalance, decimals] = await Promise.all([
          contract.balanceOf(user.address),
          contract.decimals(),
        ]);

        setBalanceLogs(prev => [...prev, `Raw balance: ${rawBalance.toString()}`]);
        setBalanceLogs(prev => [...prev, `Decimals: ${decimals}`]);

        const formattedBalance = ethers.formatUnits(rawBalance, decimals);
        setBalanceLogs(prev => [...prev, `Formatted balance: ${formattedBalance}`]);

        console.log(formattedBalance);
        
        setWldBalance(formattedBalance);
        setBalanceError(null);
        setBalanceLogs(prev => [...prev, "Balance fetch completed successfully"]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setBalanceLogs(prev => [...prev, `Error: ${errorMessage}`]);
        setBalanceError(errorMessage);
        setWldBalance(null);
      }
    }

    fetchWldBalance();
  }, [user?.address]);

  // Set mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const info = {
      worldcoinAuth: {
        isLoading,
        isAuthenticated,
        user: user
          ? {
              username: user.username,
              walletAddress: maskSensitiveData(user.address),
            }
          : null,
      },
      minikit: {
        isInstalled,
        versions: packageVersions,
      },
      wldBalance: {
        balance: wldBalance,
        error: balanceError,
        contractAddress: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
        network: "World Chain",
        rpcUrl: maskSensitiveData(process.env.NEXT_PUBLIC_RPC_URL),
        logs: balanceLogs,
      },
      environment: {
        WLD_CLIENT_ID: maskSensitiveData(process.env.NEXT_PUBLIC_WLD_CLIENT_ID),
        NODE_ENV: process.env.NODE_ENV,
      },
      window: {
        userAgent:
          typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
        location: typeof window !== "undefined" ? window.location.href : "SSR",
      },
    };

    setDebugInfo(info);
    console.log("Debug Info:", safeStringify(info));
  }, [
    isLoading,
    isAuthenticated,
    user,
    isInstalled,
    packageVersions,
    wldBalance,
    balanceError,
    balanceLogs,
  ]);

  // Capture console logs
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    const originalLog = console.log;

    const addLog = (
      type: "error" | "warn" | "info" | "log",
      ...args: unknown[]
    ) => {
      const message = args
        .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
        .join(" ");

      const logEntry: ConsoleError = {
        timestamp: new Date().toISOString(),
        type,
        message,
        stack: args.find((arg) => arg instanceof Error)?.stack,
      };

      // Use setTimeout to defer state update and avoid render phase issues
      setTimeout(() => {
        if (isMountedRef.current) {
          setConsoleErrors((prev) => [...prev, logEntry]);
        }
      }, 0);
    };

    console.error = (...args) => {
      addLog("error", ...args);
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      addLog("warn", ...args);
      originalWarn.apply(console, args);
    };

    console.info = (...args) => {
      addLog("info", ...args);
      originalInfo.apply(console, args);
    };

    console.log = (...args) => {
      addLog("log", ...args);
      originalLog.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      console.log = originalLog;
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white rounded-lg font-mono text-xs">
      {/* Header with toggle button */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-800 transition-colors rounded-t-lg"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Debug Information</h3>
            {consoleErrors.length > 0 && isExpanded && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {consoleErrors.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {isExpanded ? "Hide" : "Show"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4 pt-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="secondary"
                className="text-xs text-white"
              >
                {copyStatus || "Copy Debug Info"}
              </Button>
              {consoleErrors.length > 0 && (
                <Button
                  onClick={clearErrors}
                  size="sm"
                  variant="secondary"
                  className="text-xs text-white"
                >
                  Clear Logs ({consoleErrors.length})
                </Button>
              )}
              {balanceLogs.length > 0 && (
                <Button
                  onClick={clearBalanceLogs}
                  size="sm"
                  variant="secondary"
                  className="text-xs text-white"
                >
                  Clear Balance Logs ({balanceLogs.length})
                </Button>
              )}
            </div>
          </div>

          {/* Debug Info */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Debug Info:</h4>
            <pre className="bg-gray-800 p-3 rounded text-xs overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          {/* Console Logs */}
          {consoleErrors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Console Logs:</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {consoleErrors.map((error, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-xs ${
                      error.type === "error"
                        ? "bg-red-900 text-red-100"
                        : error.type === "warn"
                        ? "bg-yellow-900 text-yellow-100"
                        : error.type === "log"
                        ? "bg-green-900 text-green-100"
                        : "bg-blue-900 text-blue-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        {error.type.toUpperCase()}
                      </span>
                      <span className="text-gray-400">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="font-mono">{error.message}</div>
                    {error.stack && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-gray-400">
                          Stack trace
                        </summary>
                        <pre className="mt-1 text-xs text-gray-300 whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Balance Logs */}
          {balanceLogs.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Balance Fetch Logs:</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {balanceLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-2 rounded text-xs bg-blue-900 text-blue-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">BALANCE</span>
                      <span className="text-gray-400">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="font-mono">{log}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
