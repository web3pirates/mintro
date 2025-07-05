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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Load package versions
  useEffect(() => {
    setPackageVersions(getPackageVersions());
  }, []);

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
    console.log("Debug Info:", info);
  }, [isLoading, isAuthenticated, user, isInstalled, packageVersions]);

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

      // Use setTimeout to defer state update and avoid render phase issues
      setTimeout(() => {
        if (isMountedRef.current) {
          setConsoleErrors((prev) => [...prev, error]);
        }
      }, 0);
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
                className="text-xs"
              >
                {copyStatus || "Copy Debug Info"}
              </Button>
              {consoleErrors.length > 0 && (
                <Button
                  onClick={clearErrors}
                  size="sm"
                  variant="secondary"
                  className="text-xs"
                >
                  Clear Errors ({consoleErrors.length})
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

          {/* Console Errors */}
          {consoleErrors.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Console Errors:</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {consoleErrors.map((error, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-xs ${
                      error.type === "error"
                        ? "bg-red-900 text-red-100"
                        : error.type === "warn"
                        ? "bg-yellow-900 text-yellow-100"
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
        </div>
      )}
    </div>
  );
};
