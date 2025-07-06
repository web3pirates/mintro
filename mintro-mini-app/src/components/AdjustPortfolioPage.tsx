import React, { useState } from "react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";

// Inline SVGs for WLD and SOL (reuse from PortfolioCard)
const WorldcoinIcon = () => (
  <svg viewBox="0 0 600.10632 600.10632" className="w-8 h-8">
    <g transform="translate(-99.689875,-99.947068)">
      <g transform="matrix(1.2367001,0,0,1.2367001,-668.2998,-668.50879)">
        <g transform="matrix(1.2994699,0,0,1.2994699,725.31494,727.89368)">
          <g transform="translate(131.17999,104.74)">
            <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="35px" d="m 119.067,-87.470001 c 0,0 -145.507001,0.230003 -145.507001,0.230003 C -74.620003,-87.239998 -113.68,-48.18 -113.68,0 c 0,48.18 39.059997,87.239998 87.239999,87.239998 0,0 140.120001,0 140.120001,0"/>
          </g>
        </g>
        <g transform="matrix(1.2994699,0,0,1.2994699,643.73987,841.25928)">
          <g>
            <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="35px" d="m 2.309,17.5 c 0,0 336.11101,0 336.11101,0"/>
          </g>
        </g>
        <g transform="matrix(1.2994699,0,0,1.2994699,620.99915,621.3761)">
          <g transform="translate(186.71001,186.71001)">
            <path strokeLinecap="round" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="35px" d="M 0,-169.21001 C 93.452003,-169.21001 169.21001,-93.452003 169.21001,0 169.21001,93.452003 93.452003,169.21001 0,169.21001 -93.452003,169.21001 -169.21001,93.452003 -169.21001,0 -169.21001,-93.452003 -93.452003,-169.21001 0,-169.21001 Z"/>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

const tokens = [
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

function TokenSlider({ icon, symbol, value, onChange, color }: any) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3 min-w-[90px]">
        <span>{icon}</span>
        <span className="font-bold text-black text-lg">{symbol}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={onChange}
        className="mx-4 flex-1 accent-purple-500"
        style={{ background: `linear-gradient(90deg, ${color} 0%, #c4b5fd 100%)` }}
      />
      <span className="font-semibold text-gray-700 w-12 text-right">{value}%</span>
    </div>
  );
}

function PortfolioSliderCard({ allocations, setAllocations }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
      {tokens.map((token, idx) => (
        <TokenSlider
          key={token.symbol}
          icon={token.icon}
          symbol={token.symbol}
          value={allocations[idx]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newAlloc = [...allocations];
            newAlloc[idx] = Number(e.target.value);
            setAllocations(newAlloc);
          }}
          color={token.color}
        />
      ))}
    </div>
  );
}

function ErrorMessage({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="text-center text-red-500 font-semibold mt-3">
      Total must equal 100%
    </div>
  );
}

function FooterButtons({ onSkip, onConfirm, disabled }: any) {
  return (
    <div className="fixed bottom-0 left-0 w-full max-w-md mx-auto flex justify-between gap-4 px-4 pb-6 bg-white z-20">
      <button
        className="flex-1 border border-gray-300 text-gray-500 font-bold py-3 rounded-xl bg-white hover:bg-gray-100 transition"
        onClick={onSkip}
      >
        Skip
      </button>
      <button
        className="flex-1 !bg-purple-600 !text-white font-bold !py-3 rounded-xl !shadow-md hover:bg-purple-800 transition disabled:opacity-50"
        onClick={onConfirm}
        disabled={disabled}
      >
        Confirm Allocation
      </button>
    </div>
  );
}

export default function AdjustPortfolioPage({ 
  hideBackButton, 
  onSkip, 
  onConfirm, 
  allocations, 
  onAllocationsChange 
}: { 
  hideBackButton?: boolean, 
  onSkip?: () => void, 
  onConfirm?: () => void,
  allocations: number[],
  onAllocationsChange: (allocations: number[]) => void
}) {
  const total = allocations.reduce((a, b) => a + b, 0);
  const hasError = total !== 100;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-4 pb-32">
      {!hideBackButton && (
        <button className="self-start mb-4" onClick={() => window.history.back()}>
          <span className="text-2xl">←</span>
        </button>
      )}
      <div className="w-full max-w-md mx-auto">
        <div className="text-2xl font-extrabold text-black">Adjust your portfolio</div>
        <div className="text-xl font-bold text-gray-400 mb-6">(Optional)</div>
        <PortfolioSliderCard allocations={allocations} setAllocations={onAllocationsChange} />
        <ErrorMessage show={hasError} />
      </div>
      <FooterButtons onSkip={onSkip} onConfirm={onConfirm} disabled={hasError} />
    </div>
  );
} 