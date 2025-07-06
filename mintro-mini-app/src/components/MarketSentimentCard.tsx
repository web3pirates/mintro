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

interface CriticalNewsData {
  // Add interface based on the actual API response
  // This is a placeholder - you may need to adjust based on actual response
  [key: string]: unknown;
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
  const [criticalNewsData, setCriticalNewsData] =
    useState<CriticalNewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [criticalNewsLoading, setCriticalNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [criticalNewsError, setCriticalNewsError] = useState<string | null>(
    null
  );
  const [isCriticalNewsExpanded, setIsCriticalNewsExpanded] = useState(false);

  const fetchCriticalNewsData = async () => {
    try {
      setCriticalNewsLoading(true);
      setCriticalNewsError(null);

      const response = await fetch(
        "https://mintro-sentiment-api-4cb124bf95b2.herokuapp.com/api/tragic-news/market-impact?from=2025-06-24&to=2026-07-31"
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch critical news data: ${response.status}`
        );
      }

      const data: CriticalNewsData = await response.json();
      setCriticalNewsData(data);
      console.log("Critical news data:", data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setCriticalNewsError(errorMessage);
      console.error("Error fetching critical news data:", err);
    } finally {
      setCriticalNewsLoading(false);
    }
  };

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
    // Also fetch critical news data on component mount
    fetchCriticalNewsData();
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

  // Function to extract news items from the API response
  const getNewsItems = (data: CriticalNewsData): string[] => {
    // Try to find articles in the API response
    if (data.articles && Array.isArray(data.articles)) {
      return data.articles.map((article: unknown) => {
        if (typeof article === "string") return article;
        const articleObj = article as Record<string, unknown>;
        return (
          (articleObj?.title as string) ||
          (articleObj?.headline as string) ||
          "Untitled Article"
        );
      });
    } else if (data.news && Array.isArray(data.news)) {
      return data.news.map((item: unknown) => {
        if (typeof item === "string") return item;
        const itemObj = item as Record<string, unknown>;
        return (
          (itemObj?.title as string) ||
          (itemObj?.headline as string) ||
          "Untitled News"
        );
      });
    } else if (data.items && Array.isArray(data.items)) {
      return data.items.map((item: unknown) => {
        if (typeof item === "string") return item;
        const itemObj = item as Record<string, unknown>;
        return (
          (itemObj?.title as string) ||
          (itemObj?.headline as string) ||
          "Untitled Item"
        );
      });
    } else if (data.headlines && Array.isArray(data.headlines)) {
      return data.headlines.map((headline: unknown) => {
        if (typeof headline === "string") return headline;
        const headlineObj = headline as Record<string, unknown>;
        return (
          (headlineObj?.title as string) ||
          (headlineObj?.text as string) ||
          "Untitled Headline"
        );
      });
    } else if (Array.isArray(data)) {
      // If it's a direct array, assume it contains articles
      return data.map((item: unknown) => {
        if (typeof item === "string") return item;
        const itemObj = item as Record<string, unknown>;
        return (
          (itemObj?.title as string) ||
          (itemObj?.headline as string) ||
          (itemObj?.text as string) ||
          "Untitled Article"
        );
      });
    } else {
      // If it's an object, look for common article-related keys
      const articleKeys = ["title", "headline", "text", "content", "name"];
      const articles: string[] = [];

      Object.entries(data).forEach(([, value]) => {
        if (typeof value === "string" && value.length > 10) {
          // If it's a long string, it might be an article title
          articles.push(value);
        } else if (typeof value === "object" && value !== null) {
          // Look for title/headline in nested objects
          const valueObj = value as Record<string, unknown>;
          const title = articleKeys.find((k) => valueObj[k]);
          if (title && typeof valueObj[title] === "string") {
            articles.push(valueObj[title] as string);
          }
        }
      });

      return articles.length > 0 ? articles : ["No articles found in data"];
    }
  };

  const newsItems = criticalNewsData ? getNewsItems(criticalNewsData) : [];

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

      {/* Critical News Dropdown Section */}
      <div className="w-full mt-4">
        <button
          onClick={() => setIsCriticalNewsExpanded(!isCriticalNewsExpanded)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl hover:from-red-100 hover:to-orange-100 transition-all duration-200 border border-red-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">⚠️</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-gray-800">
                Critical News Market Impact
              </span>
              <div className="flex items-center gap-2 mt-1">
                {criticalNewsLoading && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    Loading...
                  </span>
                )}
                {criticalNewsError && (
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    Error
                  </span>
                )}
                {criticalNewsData && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {newsItems.length} News Items
                  </span>
                )}
              </div>
            </div>
          </div>
          <span
            className={`text-gray-500 transition-transform duration-200 ${
              isCriticalNewsExpanded ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {isCriticalNewsExpanded && (
          <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            {criticalNewsLoading ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-3"></div>
                <div className="text-sm text-gray-600">
                  Loading critical news data...
                </div>
              </div>
            ) : criticalNewsError ? (
              <div className="text-center py-4">
                <div className="text-red-500 mb-3">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="text-sm text-red-600 mb-3">
                  Error: {criticalNewsError}
                </div>
              </div>
            ) : newsItems.length > 0 ? (
              <div>
                {/* TV News Style Scrolling Strip */}
                <div className="relative overflow-hidden bg-gray-900 rounded-lg p-3">
                  <div className="flex animate-scroll-left">
                    {newsItems.map((title, index) => (
                      <div key={index} className="flex-shrink-0 mx-4">
                        <span className="text-white text-sm font-medium">
                          {title}
                        </span>
                        <span className="text-red-400 mx-3">•</span>
                      </div>
                    ))}
                    {/* Duplicate items for seamless loop */}
                    {newsItems.map((title, index) => (
                      <div
                        key={`duplicate-${index}`}
                        className="flex-shrink-0 mx-4"
                      >
                        <span className="text-white text-sm font-medium">
                          {title}
                        </span>
                        <span className="text-red-400 mx-3">•</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-gray-400 mb-2">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-sm text-gray-500">
                  No critical news data available
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="flex items-center gap-1 mb-2">
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
