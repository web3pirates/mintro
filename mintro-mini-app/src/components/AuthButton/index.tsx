"use client";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { MiniKit } from "@worldcoin/minikit-js";
import { useLoginWithSiwe } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";

/**
 * This component integrates Privy SIWE with Worldcoin Mini App authentication
 * Following the guide: https://docs.privy.io/recipes/react/worldcoin-siwe-guide
 */
export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { isInstalled } = useMiniKit();
  const { generateSiweNonce, loginWithSiwe } = useLoginWithSiwe();

  const onClick = useCallback(async () => {
    if (!isInstalled || isPending) {
      return;
    }
    setIsPending(true);
    try {
      // Step 1: Get the nonce from Privy
      const privyNonce = await generateSiweNonce();

      // Step 2: Pass the nonce to Worldcoin walletAuth
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: privyNonce,
      });

      console.log("finalPayload structure:", finalPayload);

      // Step 3: Send the signed message and signature to Privy
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

  useEffect(() => {
    const authenticate = async () => {
      if (isInstalled && !isPending) {
        setIsPending(true);
        try {
          // Step 1: Get the nonce from Privy
          const privyNonce = await generateSiweNonce();

          // Step 2: Pass the nonce to Worldcoin walletAuth
          const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
            nonce: privyNonce,
          });

          console.log("finalPayload structure:", finalPayload);

          // Step 3: Send the signed message and signature to Privy
          const user = await loginWithSiwe({
            message: (finalPayload as Record<string, unknown>)
              .siweMessage as string,
            signature: (finalPayload as Record<string, unknown>)
              .siweSignature as string,
          });

          console.log("Successfully authenticated with Privy:", user);
        } catch (error) {
          console.error("Auto Privy SIWE authentication error", error);
        } finally {
          setIsPending(false);
        }
      }
    };

    authenticate();
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
      </Button>
    </LiveFeedback>
  );
};
