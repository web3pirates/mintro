"use client";

import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";

export const AuthStatus = () => {
  const { user, isLoading, isAuthenticated, logout } = useWorldcoinAuth();
  const { isInstalled } = useMiniKit();

  // Debug environment variables
  console.log("Environment Debug:", {
    NEXT_PUBLIC_WLD_CLIENT_ID: process.env.NEXT_PUBLIC_WLD_CLIENT_ID,
    isInstalled,
    isLoading,
    isAuthenticated,
    hasUser: !!user,
  });

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          🔍 Loading...
        </h3>
        <p className="text-sm text-blue-700">
          Checking authentication status...
        </p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ✅ Authenticated with World App Wallet
        </h3>
        <div className="space-y-2 text-sm text-green-700">
          <div>
            <strong>Username:</strong> {user.username || "Not set"}
          </div>
          <div>
            <strong>Wallet Address:</strong> {user.address}
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
        Please log in using the World App wallet to access the app.
      </p>
    </div>
  );
};
