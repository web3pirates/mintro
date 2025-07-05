"use client";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * This component uses Worldcoin Mini App native wallet authentication
 * This is the proper approach for Worldcoin mini apps
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { isInstalled } = useMiniKit();
  const router = useRouter();

  // Debug logging
  console.log("AuthButton Debug Info:", {
    isInstalled,
    isPending,
    envVars: {
      WLD_CLIENT_ID: process.env.NEXT_PUBLIC_WLD_CLIENT_ID,
    },
  });

  const onClick = useCallback(async () => {
    console.log("Button clicked! Checking conditions...");
    console.log("isInstalled:", isInstalled);
    console.log("isPending:", isPending);

    if (!isInstalled || isPending) {
      console.log(
        "Button click blocked - isInstalled:",
        isInstalled,
        "isPending:",
        isPending
      );
      return;
    }

    console.log("Starting Worldcoin wallet authentication...");
    setIsPending(true);
    try {
      // Use the native Worldcoin wallet authentication directly
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
        statement: `Authenticate with Mintro DeFi App (${crypto
          .randomUUID()
          .replace(/-/g, "")}).`,
      });

      console.log("Wallet auth result:", result);

      if (!result) {
        throw new Error("No response from wallet auth");
      }

      if (result.finalPayload.status !== "success") {
        console.error(
          "Wallet authentication failed",
          result.finalPayload.error_code
        );
        throw new Error(
          `Authentication failed: ${result.finalPayload.error_code}`
        );
      }

      console.log("Successfully authenticated with Worldcoin wallet");
      console.log("Final payload:", result.finalPayload);

      // Store the authentication data in localStorage for session management
      localStorage.setItem(
        "worldcoin_auth",
        JSON.stringify({
          address: result.finalPayload.address,
          timestamp: Date.now(),
          payload: result.finalPayload,
        })
      );

      // Redirect to protected home page
      router.push("/protected/home");
    } catch (error) {
      console.error("Worldcoin wallet authentication error", error);
    } finally {
      setIsPending(false);
    }
  }, [isInstalled, isPending, router]);

  return (
    <div className="space-y-4">
      <LiveFeedback
        label={{
          failed: "Failed to login",
          pending: "Logging in",
          success: "Logged in",
        }}
        state={isPending ? "pending" : undefined}
      >
        <Button
          onClick={onClick}
          disabled={isPending || isInstalled === false}
          size="lg"
          variant="primary"
        >
          Login with World App Wallet
          {isInstalled === false && " (World App not installed)"}
          {isInstalled === undefined && " (Checking World App...)"}
          {isPending && " (Processing...)"}
        </Button>
      </LiveFeedback>

      {isInstalled === false && (
        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ World App is not detected. Make sure you are running this app
            within the World App environment.
          </p>
        </div>
      )}

      {isInstalled === undefined && (
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            🔍 Detecting World App environment...
          </p>
        </div>
      )}
    </div>
  );
};
