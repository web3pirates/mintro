"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { useEffect, useState } from "react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

interface ConsoleError {
  timestamp: string;
  type: "error" | "warn" | "info";
  message: string;
  stack?: string;
}

// Function to mask sensitive data
const maskSensitiveData = (value: string | null | undefined): string => {
  if (!value || value.length <= 4) return value || "";
  return "*".repeat(value.length - 4) + value.slice(-4);
};

export const DebugInfo = () => {
  const { user, authenticated, ready } = usePrivy();
  const { isInstalled } = useMiniKit();
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [consoleErrors, setConsoleErrors] = useState<ConsoleError[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const info = {
      privy: {
        ready,
        authenticated,
        user: user
          ? {
              id: maskSensitiveData(user.id),
              walletAddress: maskSensitiveData(user.wallet?.address),
              linkedAccounts: user.linkedAccounts?.length || 0,
            }
          : null,
      },
      minikit: {
        isInstalled,
      },
      environment: {
        WLD_CLIENT_ID: maskSensitiveData(process.env.NEXT_PUBLIC_WLD_CLIENT_ID),
        PRIVY_APP_ID: maskSensitiveData(process.env.NEXT_PUBLIC_PRIVY_APP_ID),
        NODE_ENV: process.env.NODE_ENV,
      },
      window: {
        userAgent:
          typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
        location: typeof window !== "undefined" ? window.location.href : "SSR",
      },
    };

    setDebugInfo(info);
    console.log("Debug Info:", info);
  }, [ready, authenticated, user, isInstalled]);

  // Capture console errors
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    const addError = (type: "error" | "warn" | "info", ...args: unknown[]) => {
      const message = args
        .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
        .join(" ");

      const error: ConsoleError = {
        timestamp: new Date().toISOString(),
        type,
        message,
        stack: args.find((arg) => arg instanceof Error)?.stack,
      };

      setConsoleErrors((prev) => [...prev, error]);
    };

    console.error = (...args) => {
      addError("error", ...args);
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      addError("warn", ...args);
      originalWarn.apply(console, args);
    };

    console.info = (...args) => {
      addError("info", ...args);
      originalInfo.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
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
            {consoleErrors.length > 0 && (
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
                onClick={clearErrors}
                size="sm"
                variant="secondary"
                className="text-xs text-white"
              >
                Clear Errors
              </Button>
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="secondary"
                className="text-xs text-white"
              >
                Copy All
              </Button>
              {copyStatus && (
                <span className="text-xs text-green-400">{copyStatus}</span>
              )}
            </div>
          </div>

          {/* Console Errors Section */}
          {consoleErrors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-2 text-red-400">
                Console Errors ({consoleErrors.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {consoleErrors.map((error, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-xs ${
                      error.type === "error"
                        ? "bg-red-900 text-red-200"
                        : error.type === "warn"
                        ? "bg-yellow-900 text-yellow-200"
                        : "bg-blue-900 text-blue-200"
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
                        <pre className="text-xs mt-1 text-gray-300 whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug Info Section */}
          <div>
            <h4 className="text-md font-semibold mb-2">System Information</h4>
            <pre className="whitespace-pre-wrap overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
