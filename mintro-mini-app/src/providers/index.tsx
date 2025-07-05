"use client";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import type { ReactNode } from "react";

// Temporarily disable ErudaProvider to fix SSR issues
// const ErudaProvider = dynamic(
//   () => import("@/providers/Eruda").then((c) => c.ErudaProvider),
//   { ssr: false }
// );

// Define props for ClientProviders
interface ClientProvidersProps {
  children: ReactNode;
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
 * This component ensures all providers are available to all child components.
 */
export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <div suppressHydrationWarning>
      {/* Temporarily disabled ErudaProvider */}
      {/* <ErudaProvider> */}
      <MiniKitProvider
        props={{
          appId: process.env.NEXT_PUBLIC_WLD_CLIENT_ID as `app_${string}`,
        }}
      >
        {children}
      </MiniKitProvider>
      {/* </ErudaProvider> */}
    </div>
  );
}
