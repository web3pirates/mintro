"use client";

import { PrivyProvider as PrivyProviderBase } from "@privy-io/react-auth";
import { ReactNode } from "react";

interface PrivyProviderProps {
  children: ReactNode;
}

export const PrivyProvider = ({ children }: PrivyProviderProps) => {
  // Only enable wallet login
  const loginMethods: ["wallet"] = ["wallet"];

  return (
    <PrivyProviderBase
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods,
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
