"use client";
import { useState } from "react";
import { DebugInfo } from "../components/DebugInfo";
import { MarketSentimentCard } from "../components/MarketSentimentCard";
import { NotificationCard } from "../components/NotificationCard";
import { PortfolioCard } from "../components/PortfolioCard";
import { Navigation } from "../components/Navigation";
import { MintroBranding } from "@/components/MintroBranding";
import AdjustPortfolioPage from "../components/AdjustPortfolioPage";

export default function Home() {
  const [showAdjustPage, setShowAdjustPage] = useState(false);

  if (showAdjustPage) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-8 px-4">
        <button className="self-start mb-4 absolute left-4 top-4 z-10" onClick={() => setShowAdjustPage(false)}>
          <span className="text-2xl">←</span>
        </button>
        <div className="w-full max-w-md mx-auto">
          <AdjustPortfolioPage hideBackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative pb-24">
      <div className="max-w-md w-full mx-auto p-4 flex flex-col gap-4">
        <MarketSentimentCard />
        <NotificationCard />
        <PortfolioCard onInvestClick={() => setShowAdjustPage(true)} />
      </div>
    </div>
  );
}
