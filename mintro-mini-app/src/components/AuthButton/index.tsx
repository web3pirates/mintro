"use client";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";
import { useLoginWithSiwe } from "@privy-io/react-auth";
import { useCallback, useState } from "react";

/**
 * This component integrates Privy SIWE with Worldcoin Mini App authentication
 * Following the guide: https://docs.privy.io/recipes/react/worldcoin-siwe-guide
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { isInstalled } = useMiniKit();
  const { generateSiweNonce, loginWithSiwe } = useLoginWithSiwe();

  // Debug logging
  console.log("AuthButton Debug Info:", {
    isInstalled,
    isPending,
    hasGenerateSiweNonce: !!generateSiweNonce,
    hasLoginWithSiwe: !!loginWithSiwe,
    envVars: {
      WLD_CLIENT_ID: process.env.NEXT_PUBLIC_WLD_CLIENT_ID,
      PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
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

    console.log("Starting authentication process...");
    setIsPending(true);
    try {
      // Step 1: Get the nonce from Privy
      console.log("Step 1: Generating Privy nonce...");
      const privyNonce = await generateSiweNonce();
      console.log("Privy nonce generated:", privyNonce);

      // Step 2: Pass the nonce to Worldcoin walletAuth
      console.log("Step 2: Calling Worldcoin walletAuth...");
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: privyNonce,
      });

      console.log("finalPayload structure:", finalPayload);

      // Step 3: Send the signed message and signature to Privy
      console.log("Step 3: Calling Privy loginWithSiwe...");
      const user = await loginWithSiwe({
        message: (finalPayload as Record<string, unknown>)
          .siweMessage as string,
        signature: (finalPayload as Record<string, unknown>)
          .siweSignature as string,
      });

      console.log("Successfully authenticated with Privy:", user);
    } catch (error) {
      console.error("Privy SIWE authentication error", error);
    } finally {
      setIsPending(false);
    }
  }, [isInstalled, isPending, generateSiweNonce, loginWithSiwe]);

  return (
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
        disabled={isPending}
        size="lg"
        variant="primary"
      >
        Login with Privy + World App
        {!isInstalled && " (World App not installed)"}
        {isPending && " (Processing...)"}
      </Button>
    </LiveFeedback>
  );
};
