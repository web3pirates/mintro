"use client";
import { useState } from "react";
import { DebugInfo } from "../components/DebugInfo";
import { MarketSentimentCard } from "../components/MarketSentimentCard";
import { NotificationCard } from "../components/NotificationCard";
import { PortfolioCard } from "../components/PortfolioCard";
import { Navigation } from "../components/Navigation";
import { MintroBranding } from "@/components/MintroBranding";
import AdjustPortfolioPage from "../components/AdjustPortfolioPage";
import InvestAmountPage from "../components/InvestAmountPage";
import ConfirmPlanPage from "@/components/ConfirmPlanPage";

export default function Home() {
  const [screen, setScreen] = useState<"main" | "adjust" | "invest" | "confirm">("main");
  const [allocations, setAllocations] = useState<number[]>([30, 40, 30]);
  const [amount, setAmount] = useState<string>("50");
  const [frequency, setFrequency] = useState<string>("Weekly");

  if (screen === "invest") {
    return (
      <InvestAmountPage 
        onBack={() => setScreen("adjust")} 
        onNext={() => setScreen("confirm")}
        amount={amount}
        frequency={frequency}
        onAmountChange={setAmount}
        onFrequencyChange={setFrequency}
      />
    );
  }

  if (screen === "adjust") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-8 px-4">
        <button className="self-start mb-4 absolute left-4 top-4 z-10" onClick={() => setScreen("main") }>
          <span className="text-2xl">←</span>
        </button>
        <div className="w-full max-w-md mx-auto">
          <AdjustPortfolioPage
            hideBackButton
            onSkip={() => setScreen("invest")}
            onConfirm={() => setScreen("invest")}
            allocations={allocations}
            onAllocationsChange={setAllocations}
          />
        </div>
      </div>
    );
  }

  if (screen === "confirm") {
    return (
      <ConfirmPlanPage 
        onBack={() => setScreen("invest")} 
        allocations={allocations} 
        amount={amount} 
        frequency={frequency} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative pb-24">
      <div className="max-w-md w-full mx-auto p-4 flex flex-col gap-4">
        <MarketSentimentCard />
        <NotificationCard />
        <PortfolioCard onInvestClick={() => setScreen("adjust")} />
      </div>
    </div>
  );
}
