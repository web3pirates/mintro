"use client";
import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { Page } from "@/components/PageLayout";
import { LogoutButton } from "@/components/LogoutButton";
// import { Pay } from "@/components/Pay";
// import { Transaction } from "@/components/Transaction";
import { UserInfo } from "@/components/UserInfo";
// import { Verify } from "@/components/Verify";
// import { ViewPermissions } from "@/components/ViewPermissions";
// import { WalletBalance } from "@/components/WalletBalance";
import { Marble, TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { AuthButton } from "@/components/AuthButton";
import { useCallback } from "react";

export default function Home() {
  const { user, isLoading, isAuthenticated } = useWorldcoinAuth();

  const fundWallet = useCallback(async () => {
    if (!user?.address) return;
    try {
      const response = await fetch("/api/onramp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: user.address,
          amountUsd: "100", // Optional: you can make this configurable
        }),
      });
      const { url } = await response.json();
      window.open(url, "_blank");
    } catch (e) {
      console.error(e);
    }
  }, [user]);

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

  if (!isAuthenticated) {
    return (
      <Page>
        <Page.Main className="flex flex-col gap-8 py-8">
          <div className="max-w-2xl mx-auto w-full space-y-6">
            <div className="flex justify-center">
              <AuthButton />
            </div>
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
        <button
          onClick={fundWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
        >
          Fund Wallet
        </button>

        {/* <UserInfo /> */}
        {/* <WalletBalance /> */}
        {/* <Verify /> */}
        {/* <Pay /> */}
        {/* <Transaction />
        <ViewPermissions />  */}
        <LogoutButton />
      </Page.Main>
    </>
  );
}
