"use client";

import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { Page } from "@/components/PageLayout";
import { WalletBalance } from "@/components/WalletBalance";
import { TopBar } from "@worldcoin/mini-apps-ui-kit-react";

export default function Wallet() {
  const { user, isLoading } = useWorldcoinAuth();

  if (isLoading) {
    return (
      <Page>
        <Page.Main className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </Page.Main>
      </Page>
    );
  }

  return (
    <>
      <Page.Header className="p-0">
        <TopBar title="Wallet" />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16">
        <WalletBalance />
      </Page.Main>
    </>
  );
} 