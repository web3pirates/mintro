"use client";

import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";

export const LogoutButton = () => {
  const { logout } = useWorldcoinAuth();

  const handleLogout = async () => {
    try {
      logout();
      window.location.reload(); // Soft reload, resets all state
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
