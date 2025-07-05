"use client";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { PrivyProvider } from "./PrivyProvider";

// Temporarily disable ErudaProvider to fix SSR issues
// const ErudaProvider = dynamic(
//   () => import("@/providers/Eruda").then((c) => c.ErudaProvider),
//   { ssr: false }
// );

// Define props for ClientProviders
interface ClientProvidersProps {
  children: ReactNode;
  session: Session | null; // Use the appropriate type for session from next-auth
}

/**
 * ClientProvider wraps the app with essential context providers.
 *
 * - ErudaProvider:
 *     - Should be used only in development.
 *     - Enables an in-browser console for logging and debugging.
 *
 * - MiniKitProvider:
 *     - Required for MiniKit functionality.
 *
 * - PrivyProvider:
 *     - Required for Privy authentication functionality.
 *
 * This component ensures all providers are available to all child components.
 */
export default function ClientProviders({
  children,
  session,
}: ClientProvidersProps) {
  return (
    <div suppressHydrationWarning>
      {/* Temporarily disabled ErudaProvider */}
      {/* <ErudaProvider> */}
      <PrivyProvider>
        <MiniKitProvider
          props={{
            appId: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}`,
          }}
        >
          <SessionProvider session={session}>{children}</SessionProvider>
        </MiniKitProvider>
      </PrivyProvider>
      {/* </ErudaProvider> */}
    </div>
  );
}
