"use client";

import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { Page } from "@/components/PageLayout";
import { LogoutButton } from "@/components/LogoutButton";
import { Pay } from "@/components/Pay";
import { Transaction } from "@/components/Transaction";
import { UserInfo } from "@/components/UserInfo";
import { Verify } from "@/components/Verify";
import { ViewPermissions } from "@/components/ViewPermissions";
import { WalletBalance } from "@/components/WalletBalance";
import { Marble, TopBar } from "@worldcoin/mini-apps-ui-kit-react";

export default function Home() {
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
        <TopBar
          title="Home"
          endAdornment={
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold capitalize">
                {user?.username || "User"}
              </p>
              <Marble src={user?.profilePictureUrl} className="w-12" />
            </div>
          }
        />
      </Page.Header>
      <Page.Main className="flex flex-col items-center justify-start gap-4 mb-16">
        <UserInfo />
        dewfewfwe
        <WalletBalance />
        dqwdwqdwq
        <Verify />
        dwqdqw
        <Pay />
        <Transaction />
        <ViewPermissions />
        <LogoutButton />
      </Page.Main>
    </>
  );
}
