import React, { useState } from "react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";

const WorldcoinIcon = () => (
  <svg viewBox="0 0 600.10632 600.10632" className="w-8 h-8">
    <g transform="translate(-99.689875,-99.947068)">
      <g transform="matrix(1.2367001,0,0,1.2367001,-668.2998,-668.50879)">
        <g transform="matrix(1.2994699,0,0,1.2994699,725.31494,727.89368)">
          <g transform="translate(131.17999,104.74)">
            <path
              strokeLinecap="round"
              strokeLinejoin="miter"
              fillOpacity="0"
              strokeMiterlimit="10"
              stroke="#000000"
              strokeOpacity="1"
              strokeWidth="35px"
              d="m 119.067,-87.470001 c 0,0 -145.507001,0.230003 -145.507001,0.230003 C -74.620003,-87.239998 -113.68,-48.18 -113.68,0 c 0,48.18 39.059997,87.239998 87.239999,87.239998 0,0 140.120001,0 140.120001,0"
            />
          </g>
        </g>
        <g transform="matrix(1.2994699,0,0,1.2994699,643.73987,841.25928)">
          <g>
            <path
              strokeLinecap="round"
              strokeLinejoin="miter"
              fillOpacity="0"
              strokeMiterlimit="10"
              stroke="#000000"
              strokeOpacity="1"
              strokeWidth="35px"
              d="m 2.309,17.5 c 0,0 336.11101,0 336.11101,0"
            />
          </g>
        </g>
        <g transform="matrix(1.2994699,0,0,1.2994699,620.99915,621.3761)">
          <g transform="translate(186.71001,186.71001)">
            <path
              strokeLinecap="round"
              strokeLinejoin="miter"
              fillOpacity="0"
              strokeMiterlimit="10"
              stroke="#000000"
              strokeOpacity="1"
              strokeWidth="35px"
              d="M 0,-169.21001 C 93.452003,-169.21001 169.21001,-93.452003 169.21001,0 169.21001,93.452003 93.452003,169.21001 0,169.21001 -93.452003,169.21001 -169.21001,93.452003 -169.21001,0 -169.21001,-93.452003 -93.452003,-169.21001 0,-169.21001 Z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const TOKENS = [
  {
    symbol: "WLD",
    name: "Worldcoin",
    icon: <WorldcoinIcon />,
    color: "#000",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: <FaBitcoin className="w-8 h-8" style={{ color: "#F7931A" }} />,
    color: "#F7931A",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: <FaEthereum className="w-8 h-8" style={{ color: "#627EEA" }} />,
    color: "#627EEA",
  },
];

function AllocationSummary({ allocations }: { allocations: number[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6 mb-8 border border-gray-100">
      <div className="flex justify-between text-gray-500 font-medium pb-2">
        <span>Token</span>
        <span>Allocation</span>
      </div>
      {TOKENS.map((token, idx) => (
        <div
          key={token.symbol}
          className="flex items-center justify-between py-3"
        >
          <div className="flex items-center gap-3 min-w-[90px]">
            {token.icon}
            <span className="font-bold text-black text-lg">{token.symbol}</span>
          </div>
          <div className="flex items-center gap-2 min-w-[90px] justify-end">
            <span className="font-semibold text-gray-700">
              {allocations[idx]}%
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="bg-black h-full"
                style={{ width: `${allocations[idx]}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SummaryText({
  amount,
  frequency,
}: {
  amount: string;
  frequency: string;
}) {
  return (
    <div className="text-center text-lg font-medium mt-2 mb-8 !text-black">
      You&apos;re investing{" "}
      <span className="!font-bold !text-purple-700">${amount}</span> on a{" "}
      <span className="!font-bold text-purple-700">
        {frequency.toLowerCase()}
      </span>{" "}
      basis.
    </div>
  );
}

function LoaderPopup({ isVisible, onClose, onBack }: { isVisible: boolean; onClose: () => void; onBack?: () => void }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Processing...</h3>
        <p className="text-gray-600 mb-6">
          We're setting up your investment plan. This will just take a moment.
        </p>
        <button
          onClick={onBack || onClose}
          className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ConfirmPlanPage({
  allocations,
  amount,
  frequency,
  onBack,
  onConfirm,
  onSuccess,
  isLoading = false,
  onCancelLoading,
}: {
  allocations: number[];
  amount: string;
  frequency: string;
  onBack?: () => void;
  onConfirm?: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
  onCancelLoading?: () => void;
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative px-4 pb-8">
      <button className="absolute left-4 top-6 text-2xl z-10" onClick={onBack}>
        ←
      </button>
      <div className="w-full max-w-md mx-auto pt-16 flex flex-col flex-1">
        <div className="text-3xl font-extrabold text-black mb-2 mt-2">
          Confirm your plan
        </div>
        <div className="text-base text-gray-400 font-semibold mb-4">
          We&apos;ll handle your investments and notify you if sentiment shifts
          — so you stay in control.
        </div>
        <AllocationSummary allocations={allocations} />
        <SummaryText amount={amount} frequency={frequency} />
        <button
          className="w-full rounded-xl !bg-purple-600 !text-white font-bold text-xl !py-3 mt-auto !shadow-md hover:bg-purple-800 transition"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Confirm"}
        </button>
      </div>
      <LoaderPopup isVisible={isLoading} onClose={handleCloseSuccess} onBack={onCancelLoading} />
    </div>
  );
}
