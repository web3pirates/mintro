

import { ImArrowUp } from "react-icons/im";
export const MarketSentimentCard = () => (
  <div className="bg-white rounded-2xl !shadow-lg p-6 mb-6 flex flex-col items-center mt-4">
    <div className="text-2xl !font-extrabold text-neutral-800 mb-2">Market Outlook</div>

    <div className="mb-4">
      <span className="inline-block bg-gray-100 rounded-full p-4 shadow-inner">
        <span role="img" aria-label="rocket" className="text-4xl">🚀</span>
      </span>
    </div>

    <div className="text-3xl font-extrabold text-black mb-1">Bullish</div>

    <p className="flex items-center gap-1">
      <ImArrowUp className="text-green-600 text-lg align-middle -mt-1" />
      <span className="text-black text-sm font-medium align-middle">Sentiment is rising slightly</span>
    </p>
  </div>
);
