"use client";

import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const { logout } = useWorldcoinAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      logout();
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
