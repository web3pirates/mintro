"use client";

import { useWorldcoinAuth } from "@/hooks/useWorldcoinAuth";
import { Navigation } from "@/components/Navigation";
import { Page } from "@/components/PageLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useWorldcoinAuth();
  const router = useRouter();

  // If the user is not authenticated and not loading, redirect to the login page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
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

  // Don't render protected content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Page>
      {children}
      <Page.Footer className="px-0 fixed bottom-0 w-full bg-white">
        <Navigation />
      </Page.Footer>
    </Page>
  );
}
