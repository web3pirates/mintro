import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { useEffect, useState } from "react";

interface SentimentData {
  timestamp: string;
  value: number;
  classification: string;
  trend: number;
  trendDescription: string;
  label: string;
  trendDetails: {
    currentValue: number;
    lastWeekAverage: number;
    change: number;
    percentageChange: number;
  };
}

const getSentimentEmoji = (classification: string) => {
  switch (classification.toLowerCase()) {
    case "extreme fear":
      return "😱";
    case "fear":
      return "😨";
    case "neutral":
      return "😐";
    case "greed":
      return "😏";
    case "extreme greed":
      return "🤑";
    default:
      return "📊";
  }
};

const getSentimentColor = (classification: string) => {
  switch (classification.toLowerCase()) {
    case "extreme fear":
      return "text-red-600";
    case "fear":
      return "text-orange-600";
    case "neutral":
      return "text-yellow-600";
    case "greed":
      return "text-blue-600";
    case "extreme greed":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export const MoveToStables = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://mintro-sentiment-api-4cb124bf95b2.herokuapp.com/api/fear-greed/latest"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch sentiment data");
        }

        const data: SentimentData = await response.json();
        setSentimentData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl !shadow-lg p-6 mb-6 flex flex-col items-center mt-4">
        <div className="text-2xl !font-extrabold text-neutral-800 mb-2">
          Market Outlook
        </div>
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-full p-4 w-16 h-16 mb-4"></div>
          <div className="bg-gray-200 h-8 w-24 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 w-32 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !sentimentData) {
    return (
      <div className="bg-white rounded-2xl !shadow-lg p-6 mb-6 flex flex-col items-center mt-4">
        <div className="text-2xl !font-extrabold text-neutral-800 mb-2">
          Market Outlook
        </div>
        <div className="text-red-500 text-center">
          <span role="img" aria-label="error" className="text-4xl">
            ⚠️
          </span>
          <p className="mt-2 text-sm">Unable to load sentiment data</p>
        </div>
      </div>
    );
  }

  if (showSuccessScreen) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className="bg-green-500 rounded-full p-6 mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#22C55E" />
              <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-3xl font-extrabold text-neutral-800 text-center mb-2">
            You've moved to stables
          </div>
          <div className="text-gray-500 text-center mb-6">
            Phew. Your funds are now in USDC.<br />Time to relax!
          </div>

          {/* APY Card */}
          <div className="bg-white rounded-xl p-6 mb-4 flex flex-col items-center shadow-md w-full max-w-xs">
            <span role="img" aria-label="money bag" className="text-3xl mb-2">💰</span>
            <div className="font-bold text-lg mb-1">Earning Yield</div>
            <div className="text-black text-base text-center">
              Now earning <span className="font-bold">20.64% APY</span> on<br />Uniswap V3 (WLD/USDC pool)
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center gap-2">
            <span role="img" aria-label="bell" className="text-2xl">🔔</span>
            <span className="text-gray-700 text-sm">We'll notify you when sentiment improves so you can redeploy.</span>
          </div>
          <button
            className="mt-4 bg-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-purple-800 transition"
            onClick={() => window.location.href = "/"}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleMoveToStables = async () => {
    console.log("Moving to stables plan");
    const res = await fetch("/api/emergency-sell", {
      method: "POST",
    });
    const data = await res.json();

    if (data) {
      const liquidityProvidingRes = await fetch("/api/liquidity-providing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userAddress: "0xe5C7EcB768BAD679d6392F42c40693F11d8C1e56" }),
      });
      const liquidityProvidingData = await liquidityProvidingRes.json();
      console.log("Liquidity providing response", liquidityProvidingData);
      // If no error, show success screen
      if (!liquidityProvidingData.error) {
        setShowSuccessScreen(true);
      }
    } else {
      console.log("Emergency sell failed");
    }
  };

  const { classification, trendDescription, trendDetails } = sentimentData;
  const emoji = getSentimentEmoji(classification);
  const colorClass = getSentimentColor(classification);

  return (
    <div className="bg-white rounded-2xl !shadow-lg p-6 mb-6 flex flex-col items-center mt-4 gap-2">
      <div className="text-2xl !font-extrabold text-neutral-800 mb-2">
        Market Outlook
      </div>

      <div className="mb-4">
        <span className="inline-block bg-gray-100 rounded-full p-4 shadow-inner">
          <span role="img" aria-label="sentiment" className="text-4xl">
            {emoji}
          </span>
        </span>
      </div>

      <div className={`text-3xl font-extrabold mb-1 ${colorClass}`}>
        {classification}
      </div>

      <p className="flex items-center gap-1">
        {trendDetails.change > 0 ? (
          <ImArrowUp className="text-green-600 text-lg align-middle -mt-1" />
        ) : trendDetails.change < 0 ? (
          <ImArrowDown className="text-red-600 text-lg align-middle -mt-1" />
        ) : (
          <span className="text-gray-600 text-lg align-middle -mt-1">—</span>
        )}
        <span className="text-black text-sm font-medium align-middle">
          {trendDescription}
        </span>
      </p>

      <div className="mt-2 text-xs text-gray-500">
        {trendDetails.change > 0 ? "+" : ""}
        {trendDetails.percentageChange}% from last week
      </div>

      <button className="!bg-purple-700 !text-white px-4 py-2 rounded-md" onClick={() => handleMoveToStables()}>
        Move to Stables
      </button>
    </div>
  );
};
