"use client";
import { Page } from "@/components/PageLayout";
import { LogoutButton } from "@/components/LogoutButton";
import { Pay } from "@/components/Pay";
import { Transaction } from "@/components/Transaction";
import { UserInfo } from "@/components/UserInfo";
// import { Verify } from "@/components/Verify";
import { ViewPermissions } from "@/components/ViewPermissions";
// import { WalletBalance } from "@/components/WalletBalance";
import { Marble, TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { useCallback } from "react";

export default function ProtectedHome() {
  const { user } = useWorldcoinAuth();

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
        <button
          onClick={fundWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-2"
        >
          Fund Wallet
        </button>
        <UserInfo />
        {/* <WalletBalance /> */}
        {/* <Verify /> */}
        <Pay />
        <Transaction />
        <ViewPermissions />
        <LogoutButton />
      </Page.Main>
    </>
  );
}
