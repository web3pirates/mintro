"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { useEffect, useState } from "react";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";

export const DebugInfo = () => {
  const { user, authenticated, ready } = usePrivy();
  const { isInstalled } = useMiniKit();
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
  const [copyStatus, setCopyStatus] = useState<string>("");

  const copyToClipboard = async () => {
    try {
      const debugText = JSON.stringify(debugInfo, null, 2);
      await navigator.clipboard.writeText(debugText);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
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

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg font-mono text-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Debug Information</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={copyToClipboard}
            size="sm"
            variant="secondary"
            className="text-xs"
          >
            Copy All
          </Button>
          {copyStatus && (
            <span className="text-xs text-green-400">{copyStatus}</span>
          )}
        </div>
      </div>
      <pre className="whitespace-pre-wrap overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};
