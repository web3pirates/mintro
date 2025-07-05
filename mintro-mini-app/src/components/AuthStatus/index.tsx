"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";

export const AuthStatus = () => {
  const { authenticated, user, login, logout } = usePrivy();
  const { isInstalled } = useMiniKit();

  // Debug environment variables
  console.log("Environment Debug:", {
    NEXT_PUBLIC_WLD_CLIENT_ID: process.env.NEXT_PUBLIC_WLD_CLIENT_ID,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    isInstalled,
    authenticated,
  });

  if (authenticated) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ✅ Authenticated with Privy
        </h3>
        <div className="space-y-2 text-sm text-green-700">
          <div>
            <strong>User ID:</strong> {user?.id}
          </div>
          <div>
            <strong>Wallet Address:</strong> {user?.wallet?.address}
          </div>
        </div>
        <Button onClick={logout} size="sm" variant="secondary" className="mt-3">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
        ⚠️ Not Authenticated
      </h3>
      <p className="text-sm text-yellow-700 mb-3">
        Please log in using the button below to access the app.
      </p>
      <Button onClick={login} size="sm" variant="primary">
        Login with Privy
      </Button>
    </div>
  );
};
