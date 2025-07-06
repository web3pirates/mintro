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

export const MarketSentimentCard = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const { classification, trendDescription, trendDetails } = sentimentData;
  const emoji = getSentimentEmoji(classification);
  const colorClass = getSentimentColor(classification);

  return (
    <div className="bg-white rounded-2xl !shadow-lg p-6 mb-6 flex flex-col items-center mt-4">
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
    </div>
  );
};
