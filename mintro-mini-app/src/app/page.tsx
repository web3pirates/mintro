"use client";
import { useState } from "react";
import { DebugInfo } from "../components/DebugInfo";
import { MarketSentimentCard } from "../components/MarketSentimentCard";
import { NotificationCard } from "../components/NotificationCard";
import { PortfolioCard } from "../components/PortfolioCard";
import { MintroBranding } from "@/components/MintroBranding";
import AdjustPortfolioPage from "../components/AdjustPortfolioPage";
import InvestAmountPage from "../components/InvestAmountPage";
import ConfirmPlanPage from "@/components/ConfirmPlanPage";
import PlanSuccessPage from "@/components/PlanSuccessPage";
import { WalletBalance } from "@/components/WalletBalance";
import { Navigation } from "@/components/Navigation";
import { MoveToStables } from "@/components/MoveToStables";

export default function Home() {
  const [screen, setScreen] = useState<"main" | "adjust" | "invest" | "confirm" | "success" | "balance">("main");
  const [allocations, setAllocations] = useState<number[]>([30, 40, 30]);
  const [amount, setAmount] = useState<string>("50");
  const [frequency, setFrequency] = useState<string>("Weekly");
  const [isLoading, setIsLoading] = useState(false);

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

  async function handleConfirm() {
    console.log("Confirming plan", allocations, amount, frequency);
    setIsLoading(true);
    try {
      const res = await fetch("/api/dca", {
        method: "POST",
        body: JSON.stringify({ allocations, amount, frequency }),
      });
      const data = await res.json();
      console.log("DCA response", data);
      
      if (res.ok) {
        // API call successful, show success page
        setScreen("success");
      } else {
        // Handle error case
        console.error("DCA failed:", data);
        // You might want to show an error message here
      }
    } catch (error) {
      console.error("DCA request failed:", error);
      // Handle network error
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancelLoading() {
    setIsLoading(false);
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
        onConfirm={handleConfirm}
        onSuccess={() => setScreen("success")}
        isLoading={isLoading}
        onCancelLoading={handleCancelLoading}
      />
    );
  }

  if (screen === "success") {
    return (
      <PlanSuccessPage
        amount={amount}
        frequency={frequency}
        cardLast4="4242"
        onBackToHome={() => setScreen("main")}
      />
    );
  }

  if (screen === "balance") {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative pb-24">
        <div className="max-w-md w-full mx-auto p-4 flex flex-col gap-4">
          <MoveToStables/>
          <WalletBalance />
        </div>
        <div className="p-2 w-full">
          <Navigation setScreen={setScreen} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative pb-24">
      <div className="max-w-md w-full mx-auto p-4 flex flex-col gap-4">
        <MarketSentimentCard />
        <NotificationCard />
        <PortfolioCard onInvestClick={() => setScreen("adjust")} />
      </div>
      <div className="p-2 w-full">
        <Navigation setScreen={setScreen} />
      </div>
    </div>
  );
}
