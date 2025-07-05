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

export const DebugInfo = () => {
  const { user, authenticated, ready } = usePrivy();
  const { isInstalled } = useMiniKit();
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [consoleErrors, setConsoleErrors] = useState<ConsoleError[]>([]);

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

  useEffect(() => {
    const info = {
      privy: {
        ready,
        authenticated,
        user: user
          ? {
              id: user.id,
              walletAddress: user.wallet?.address,
              linkedAccounts: user.linkedAccounts?.length || 0,
            }
          : null,
      },
      minikit: {
        isInstalled,
      },
      environment: {
        WLD_CLIENT_ID: process.env.NEXT_PUBLIC_WLD_CLIENT_ID,
        PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
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
    <div className="p-4 bg-gray-900 text-white rounded-lg font-mono text-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Debug Information</h3>
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
  );
};
