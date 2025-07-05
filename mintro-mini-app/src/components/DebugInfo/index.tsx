"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { useEffect, useState } from "react";

export const DebugInfo = () => {
  const { user, authenticated, ready } = usePrivy();
  const { isInstalled } = useMiniKit();
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});

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
      <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
      <pre className="whitespace-pre-wrap overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};
