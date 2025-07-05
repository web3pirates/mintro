import { DebugInfo } from "../components/DebugInfo";
import { MarketSentimentCard } from "../components/MarketSentimentCard";
import { NotificationCard } from "../components/NotificationCard";
import { PortfolioCard } from "../components/PortfolioCard";
import { Navigation } from "../components/Navigation";
import { MintroBranding } from "@/components/MintroBranding";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center relative pb-24">
      <div className="max-w-md w-full mx-auto p-4 flex flex-col gap-4">

        <MarketSentimentCard />
        <NotificationCard />
        <PortfolioCard />
      </div>
      <Navigation />
      <div className="w-full max-w-md mx-auto mt-8">
        <DebugInfo />
      </div>
    </div>
  );
}
