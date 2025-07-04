"use client";

import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const { logout } = usePrivy();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      size="lg"
      variant="secondary"
      className="w-full"
    >
      Logout
    </Button>
  );
};
