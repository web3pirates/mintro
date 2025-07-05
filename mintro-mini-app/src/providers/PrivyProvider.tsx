"use client";

import { PrivyProvider as PrivyProviderBase } from "@privy-io/react-auth";
import { ReactNode } from "react";

interface PrivyProviderProps {
  children: ReactNode;
}

export const PrivyProvider = ({ children }: PrivyProviderProps) => {
  // Define login methods - currently only wallet is enabled
  const loginMethods = ["wallet"];

  // Check if other login methods (email, sms, social) are enabled
  const hasOtherLoginMethods = loginMethods.some(
    (method) =>
      method !== "wallet" &&
      ["email", "sms", "google", "twitter", "discord", "github"].includes(
        method
      )
  );

  // showWalletLoginFirst should be false only when other login methods are enabled
  const showWalletLoginFirst = !hasOtherLoginMethods;

  return (
    <PrivyProviderBase
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods,
        showWalletLoginFirst,
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
      }}
    >
      {children}
    </PrivyProviderBase>
  );
};
