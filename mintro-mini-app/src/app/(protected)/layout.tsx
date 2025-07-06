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

  // Debug logging
  console.log('Protected Layout Debug:', { isAuthenticated, isLoading, pathname: typeof window !== 'undefined' ? window.location.pathname : 'SSR' });

  // If the user is not authenticated and not loading, redirect to the login page
  useEffect(() => {
    console.log('Protected Layout useEffect:', { isAuthenticated, isLoading });
    
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    console.log('Protected Layout: Showing loading state');
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
    console.log('Protected Layout: Not authenticated, returning null');
    return null;
  }

  console.log('Protected Layout: Rendering protected content');
  return (
    <Page>
      {children}
      <Page.Footer className="px-0 fixed bottom-0 w-full bg-white">
        <Navigation />
      </Page.Footer>
    </Page>
  );
}
