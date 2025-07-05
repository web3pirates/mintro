"use client";

import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
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
